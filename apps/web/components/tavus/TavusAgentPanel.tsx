"use client";

import type { DailyCall } from "@daily-co/daily-js";
import { useEffect, useRef, useState } from "react";
import {
  attachParticipantMedia,
  describeParticipantTracks,
  destroyDailyCall,
  getDailyCall,
  getReplicaParticipant,
  isConversationEndSuppressed,
} from "../../lib/dailyCallSingleton";
import { tavusError, tavusLog, tavusWarn } from "../../lib/tavusDebug";
import {
  CLOSING_LINE_PATTERN,
  isMockTavusUrl,
  RAVEN_SIGNAL_MAP,
  STOP_UTTERANCE_PATTERN,
} from "../../lib/tavus";

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
  /** Fired when the replica is live — parent can start the full-ad countdown. */
  onAgentLive?: () => void;
  /** Fired when the viewer says stop/skip (browser speech recognition). */
  onStopRequested?: () => void;
  /** Parent signaled stop (e.g. Skip button) — wait for closing line then dismiss. */
  stopPending?: boolean;
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

function utteranceSpeech(data: Record<string, unknown>): {
  role: string;
  speech: string;
  isFinal: boolean;
} | null {
  const eventType =
    typeof data.event_type === "string" ? data.event_type : "";
  if (!eventType.includes("utterance")) {
    return null;
  }

  const props = data.properties;
  if (!props || typeof props !== "object") {
    return null;
  }

  const record = props as Record<string, unknown>;
  const role = typeof record.role === "string" ? record.role : "";
  const speech = typeof record.speech === "string" ? record.speech.trim() : "";
  if (!role || !speech) {
    return null;
  }

  const isFinal =
    eventType === "conversation.utterance" ||
    (eventType === "conversation.utterance.streaming" && record.final === true);

  return { role, speech, isFinal };
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
  onAgentLive,
  onStopRequested,
  stopPending = false,
}: TavusAgentPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const onPerceptionRef = useRef(onPerceptionSignal);
  const onConversationEndRef = useRef(onConversationEnd);
  const onAgentLiveRef = useRef(onAgentLive);
  const onStopRequestedRef = useRef(onStopRequested);
  const stopTriggeredRef = useRef(false);
  const stopPendingRef = useRef(false);
  const closingLinePendingRef = useRef(false);
  const closingLineHeardRef = useRef(false);
  const closingDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const conversationIdRef = useRef<string | null>(null);
  const agentLiveNotifiedRef = useRef(false);
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
    onAgentLiveRef.current = onAgentLive;
  }, [onAgentLive]);

  useEffect(() => {
    onStopRequestedRef.current = onStopRequested;
  }, [onStopRequested]);

  useEffect(() => {
    stopPendingRef.current = stopPending;
    if (stopPending) {
      stopTriggeredRef.current = true;
      closingLinePendingRef.current = true;
      if (callRef.current && conversationIdRef.current) {
        callRef.current.sendAppMessage(
          {
            message_type: "conversation",
            event_type: "conversation.interrupt",
            conversation_id: conversationIdRef.current,
          },
          "*",
        );
        tavusLog("sending conversation.interrupt (skip/stop requested)");
      }
    }
  }, [stopPending]);

  const dismissAfterClosingLine = () => {
    if (closingDismissTimerRef.current) {
      return;
    }

    tavusLog("scheduling auto-dismiss after agent speech");
    closingDismissTimerRef.current = setTimeout(() => {
      closingDismissTimerRef.current = null;
      closingLinePendingRef.current = false;
      onConversationEndRef.current?.();
    }, 600);
  };

  const interruptReplica = (call: DailyCall) => {
    const conversationId = conversationIdRef.current;
    if (!conversationId) {
      tavusWarn("cannot interrupt — conversation_id not seen yet");
      return;
    }

    tavusLog("sending conversation.interrupt to stop replica speech");
    call.sendAppMessage(
      {
        message_type: "conversation",
        event_type: "conversation.interrupt",
        conversation_id: conversationId,
      },
      "*",
    );
  };

  useEffect(() => {
    if (!useLiveEmbed) {
      return;
    }

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
        STOP_UTTERANCE_PATTERN.test(transcript)
      ) {
        stopTriggeredRef.current = true;
        closingLinePendingRef.current = true;
        tavusLog("voice stop keyword detected", { transcript: transcript.trim() });
        if (callRef.current) {
          interruptReplica(callRef.current);
        }
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
      if (closingDismissTimerRef.current) {
        clearTimeout(closingDismissTimerRef.current);
        closingDismissTimerRef.current = null;
      }
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

      agentLiveNotifiedRef.current = false;
      stopTriggeredRef.current = false;
      closingLinePendingRef.current = false;
      closingLineHeardRef.current = false;
      conversationIdRef.current = null;

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
          if (!agentLiveNotifiedRef.current) {
            agentLiveNotifiedRef.current = true;
            onAgentLiveRef.current?.();
          }
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
        if (!data) {
          return;
        }

        if (typeof data.conversation_id === "string") {
          conversationIdRef.current = data.conversation_id;
        }

        if (data.event_type === "system.replica_joined") {
          tavusLog("Tavus replica_joined — agent should start speaking soon");
          setStatusHint("Replica ready. Say “Hi” if the agent stays silent.");
        }

        const utterance = utteranceSpeech(data);
        if (utterance?.isFinal) {
          if (
            utterance.role === "user" &&
            STOP_UTTERANCE_PATTERN.test(utterance.speech) &&
            !stopTriggeredRef.current
          ) {
            stopTriggeredRef.current = true;
            closingLinePendingRef.current = true;
            tavusLog("Tavus user stop utterance", {
              speech: utterance.speech,
            });
            if (callRef.current) {
              interruptReplica(callRef.current);
            }
            onStopRequestedRef.current?.();
          }

          if (
            utterance.role === "replica" &&
            closingLinePendingRef.current &&
            CLOSING_LINE_PATTERN.test(utterance.speech)
          ) {
            closingLineHeardRef.current = true;
            tavusLog("Tavus replica closing line", {
              speech: utterance.speech,
            });
          }
        }

        const eventType =
          typeof data.event_type === "string" ? data.event_type : "";
        const stoppedProps =
          data.properties && typeof data.properties === "object"
            ? (data.properties as Record<string, unknown>)
            : null;
        const isReplicaStopped =
          eventType === "conversation.replica.stopped_speaking" ||
          (eventType === "conversation.stopped_speaking" &&
            stoppedProps?.role === "replica");

        if (
          isReplicaStopped &&
          closingLinePendingRef.current &&
          closingLineHeardRef.current
        ) {
          tavusLog("closing line finished — auto-dismissing ad", {
            interrupted: stoppedProps?.interrupted,
          });
          dismissAfterClosingLine();
        }

        if (
          isReplicaStopped &&
          !closingLinePendingRef.current &&
          !stopPendingRef.current &&
          typeof stoppedProps?.duration === "number" &&
          stoppedProps.duration >= 8 &&
          stoppedProps.interrupted === false
        ) {
          tavusLog("replica finished full pitch — auto-dismissing ad");
          dismissAfterClosingLine();
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
        if (!isConversationEndSuppressed()) {
          onConversationEndRef.current?.();
        }
      });
      call.on("participant-left", (event) => {
        tavusLog("Daily event: participant-left", {
          local: event?.participant?.local,
          userName: event?.participant?.user_name,
        });
        if (
          event?.participant &&
          !event.participant.local &&
          !isConversationEndSuppressed()
        ) {
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
      if (closingDismissTimerRef.current) {
        clearTimeout(closingDismissTimerRef.current);
        closingDismissTimerRef.current = null;
      }
      tavusLog("TavusAgentPanel unmount — detaching (call kept alive until dismiss)");
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
