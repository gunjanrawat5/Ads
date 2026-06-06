"use client";

import type { DailyCall } from "@daily-co/daily-js";
import { useEffect, useRef, useState } from "react";
import {
  attachParticipantMedia,
  describeParticipantTracks,
  destroyDailyCall,
  getDailyCall,
  getReplicaParticipant,
} from "../../lib/dailyCallSingleton";
import { tavusError, tavusLog, tavusWarn } from "../../lib/tavusDebug";
import { isMockTavusUrl, RAVEN_SIGNAL_MAP } from "../../lib/tavus";

const VIEWER_NAME = "Viewer";

type TavusAgentPanelProps = {
  conversationUrl: string;
  meetingToken?: string;
  provider: "tavus" | "mock";
  fallbackScript: string;
  productName: string;
  triggerMoment: string;
  onPerceptionSignal?: (buttonSignal: string) => void;
  onConversationEnd?: () => void;
  /** Fired when the viewer says stop/skip (browser speech recognition). */
  onStopRequested?: () => void;
};

type AgentStatus =
  | "connecting"
  | "waiting_for_replica"
  | "replica_joined_no_media"
  | "live"
  | "error";

function parsePerceptionSignal(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const toolName =
    (typeof record.tool_name === "string" ? record.tool_name : null) ??
    (typeof record.name === "string" ? record.name : null) ??
    (record.function &&
    typeof record.function === "object" &&
    typeof (record.function as { name?: string }).name === "string"
      ? (record.function as { name: string }).name
      : null);

  if (!toolName) {
    return null;
  }

  return RAVEN_SIGNAL_MAP[toolName] ?? null;
}

export function TavusAgentPanel({
  conversationUrl,
  meetingToken,
  provider,
  fallbackScript,
  productName,
  triggerMoment,
  onPerceptionSignal,
  onConversationEnd,
  onStopRequested,
}: TavusAgentPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const onPerceptionRef = useRef(onPerceptionSignal);
  const onConversationEndRef = useRef(onConversationEnd);
  const onStopRequestedRef = useRef(onStopRequested);
  const stopTriggeredRef = useRef(false);
  const callRef = useRef<DailyCall | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("connecting");
  const [statusHint, setStatusHint] = useState<string>(
    "Connecting to Tavus…",
  );
  const [joinError, setJoinError] = useState<string | null>(null);

  const useLiveEmbed = provider === "tavus" && !isMockTavusUrl(conversationUrl);

  useEffect(() => {
    onPerceptionRef.current = onPerceptionSignal;
  }, [onPerceptionSignal]);

  useEffect(() => {
    onConversationEndRef.current = onConversationEnd;
  }, [onConversationEnd]);

  useEffect(() => {
    onStopRequestedRef.current = onStopRequested;
  }, [onStopRequested]);

  useEffect(() => {
    if (!useLiveEmbed) {
      return;
    }

    stopTriggeredRef.current = false;

    type SpeechRecognitionInstance = {
      continuous: boolean;
      interimResults: boolean;
      lang: string;
      onresult: ((event: { results: Iterable<{ 0: { transcript: string } }> }) => void) | null;
      onerror: ((event: { error?: string }) => void) | null;
      start: () => void;
      stop: () => void;
    };

    const SpeechRecognitionCtor =
      typeof window !== "undefined"
        ? (window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionInstance;
            webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
          }).SpeechRecognition ??
          (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance })
            .webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionCtor) {
      tavusLog("SpeechRecognition unavailable — use Skip button or say stop to Tavus directly");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (const result of event.results) {
        transcript += `${result[0].transcript} `;
      }

      if (
        !stopTriggeredRef.current &&
        /\b(stop|skip|enough|quit)\b/i.test(transcript)
      ) {
        stopTriggeredRef.current = true;
        tavusLog("voice stop keyword detected", { transcript: transcript.trim() });
        onStopRequestedRef.current?.();
      }
    };

    recognition.onerror = (event) => {
      tavusWarn("SpeechRecognition error", event);
    };

    try {
      recognition.start();
      tavusLog("listening for stop/skip keywords during ad");
    } catch (err) {
      tavusWarn("SpeechRecognition start failed", err);
    }

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, [useLiveEmbed]);

  useEffect(() => {
    if (!useLiveEmbed) {
      tavusLog("mock/fallback agent panel — no live Daily join", { provider });
      return;
    }

    let cancelled = false;

    async function connect() {
      setAgentStatus("connecting");
      setStatusHint("Connecting to Tavus…");
      setJoinError(null);

      tavusLog("starting live join", {
        conversationUrl,
        hasMeetingToken: Boolean(meetingToken),
      });

      await destroyDailyCall();
      if (cancelled) {
        return;
      }

      const call = getDailyCall();
      callRef.current = call;

      const logParticipants = (label: string) => {
        const all = call.participants();
        tavusLog(label, {
          count: Object.keys(all).length,
          participants: Object.entries(all).map(([id, p]) => ({
            id,
            local: p.local,
            ...describeParticipantTracks(p),
          })),
        });
      };

      const syncReplicaMedia = (source: string) => {
        const replica = getReplicaParticipant(call.participants());
        if (!replica) {
          tavusLog(`${source}: no replica yet — agent may still be buffering`);
          setAgentStatus("waiting_for_replica");
          setStatusHint(
            "Waiting for Tavus replica to join (often 5–15s)… Try saying “Hi” once mic is allowed.",
          );
          return;
        }

        tavusLog(`${source}: replica present`, describeParticipantTracks(replica));
        const attached = attachParticipantMedia(
          replica,
          videoRef.current,
          audioRef.current,
        );

        if (attached) {
          setAgentStatus("live");
          setStatusHint(
            "Agent live. If silent, say “Hi” — Tavus often waits for you to speak first.",
          );
        } else {
          setAgentStatus("replica_joined_no_media");
          setStatusHint(
            "Replica joined but A/V still loading… say “Hi” if you have mic access.",
          );
        }
      };

      call.on("loading", () => tavusLog("Daily event: loading"));
      call.on("loaded", () => tavusLog("Daily event: loaded"));
      call.on("joining-meeting", () => tavusLog("Daily event: joining-meeting"));
      call.on("joined-meeting", () => {
        tavusLog("Daily event: joined-meeting — you are in the room");
        logParticipants("after joined-meeting");
        syncReplicaMedia("joined-meeting");
      });
      call.on("participant-joined", (event) => {
        tavusLog("Daily event: participant-joined", event?.participant
          ? {
              local: event.participant.local,
              ...describeParticipantTracks(event.participant),
            }
          : { participant: null });
        syncReplicaMedia("participant-joined");
      });
      call.on("participant-updated", (event) => {
        if (event?.participant && !event.participant.local) {
          tavusLog("Daily event: replica participant-updated", {
            ...describeParticipantTracks(event.participant),
          });
          syncReplicaMedia("participant-updated");
        }
      });
      call.on("track-started", (event) => {
        tavusLog("Daily event: track-started", {
          kind: event?.track?.kind,
          local: event?.participant?.local,
          state: event?.participant?.local
            ? call.localAudio()
            : event?.participant?.tracks?.audio?.state,
        });
        syncReplicaMedia("track-started");
      });
      call.on("app-message", (event) => {
        tavusLog("Daily app-message (Tavus system/perception)", event?.data);
        const data = event?.data as Record<string, unknown> | undefined;
        if (data?.event_type === "system.replica_joined") {
          tavusLog("Tavus replica_joined — agent should start speaking soon");
          setStatusHint("Replica ready. Say “Hi” if the agent stays silent.");
        }
        const signal = parsePerceptionSignal(event?.data);
        if (signal) {
          tavusLog("Raven perception mapped to feedback", { signal });
          onPerceptionRef.current?.(signal);
        }
      });
      call.on("error", (event) => {
        tavusError("Daily error event", event);
      });
      call.on("camera-error", (event) => {
        tavusWarn("Daily camera-error (mic/cam permission?)", event);
        setStatusHint(
          "Mic/camera issue — allow microphone in the browser bar, then say “Hi”.",
        );
      });
      call.on("left-meeting", () => {
        tavusLog("Daily event: left-meeting — conversation ended");
        onConversationEndRef.current?.();
      });
      call.on("participant-left", (event) => {
        tavusLog("Daily event: participant-left", {
          local: event?.participant?.local,
          userName: event?.participant?.user_name,
        });
        if (event?.participant && !event.participant.local) {
          onConversationEndRef.current?.();
        }
      });

      try {
        tavusLog("calling Daily join()", {
          userName: VIEWER_NAME,
          startVideoOff: true,
          startAudioOff: false,
        });

        await call.join({
          url: conversationUrl,
          ...(meetingToken ? { token: meetingToken } : {}),
          userName: VIEWER_NAME,
          startVideoOff: true,
          startAudioOff: false,
        });

        const localAudio = call.localAudio();
        const localVideo = call.localVideo();
        tavusLog("join() resolved", {
          localAudio,
          localVideo,
          meetingState: call.meetingState(),
        });

        if (!localAudio) {
          tavusWarn(
            "local mic is OFF after join — agent may wait forever. User may need to allow mic or say hi.",
          );
          setStatusHint(
            "Microphone off — allow mic in the browser, then say “Hi” to start the agent.",
          );
        }

        logParticipants("after join()");
        syncReplicaMedia("post-join");
      } catch (error) {
        tavusError("Daily join() failed", error);
        if (!cancelled) {
          setAgentStatus("error");
          setJoinError(
            error instanceof Error ? error.message : "Failed to join Tavus call",
          );
        }
      }
    }

    void connect();

    return () => {
      cancelled = true;
      callRef.current = null;
      tavusLog("TavusAgentPanel unmount — tearing down call");
      void destroyDailyCall();
    };
  }, [conversationUrl, meetingToken, useLiveEmbed]);

  if (useLiveEmbed) {
    return (
      <div className="flex h-full min-h-[14rem] flex-col">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="text-[#7bdff6]">{productName}</span>
          <span className="text-[#86efac]">
            {agentStatus === "live"
              ? "Tavus live"
              : agentStatus === "error"
                ? "Connection error"
                : "Connecting…"}
          </span>
        </div>
        <p className="mb-2 line-clamp-2 text-xs leading-relaxed text-[#fff8d6]/80">
          {triggerMoment}
        </p>
        <p className="mb-2 text-[10px] leading-relaxed text-[#fff8d6]/60 sm:text-xs">
          {statusHint} Open DevTools → filter console by{" "}
          <span className="text-[#7bdff6]">TavusAd</span>.
        </p>
        <div className="relative min-h-[12rem] flex-1 overflow-hidden bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-full min-h-[12rem] w-full object-cover"
          />
          <audio ref={audioRef} autoPlay playsInline className="hidden" />
          {agentStatus !== "live" && agentStatus !== "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 p-3 text-center text-sm text-[#fff8d6]">
              {statusHint}
            </div>
          )}
          {agentStatus === "error" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 p-3 text-center text-xs text-[#ff7a7a]">
              {joinError ?? "Could not join Tavus call."}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center justify-between gap-2 text-xs sm:text-sm">
        <span className="text-[#7bdff6]">{productName}</span>
        <span className="text-[#ff7a7a]">Demo fallback active</span>
      </div>
      <p className="mb-2 text-xs leading-relaxed text-[#fff8d6]/80">
        {triggerMoment}
      </p>
      <div className="mb-3 min-h-[8rem] flex-1 overflow-y-auto rounded border border-[#f3e8a6]/30 bg-black/50 p-2 text-sm leading-relaxed">
        {fallbackScript}
      </div>
      {provider === "mock" && (
        <p className="text-xs text-[#fff8d6]/60">
          Set TAVUS_API_KEY, TAVUS_PERSONA_ID, TAVUS_REPLICA_ID, and
          NEXT_PUBLIC_TAVUS_ENABLED=true to load the live Tavus agent.
        </p>
      )}
    </div>
  );
}
