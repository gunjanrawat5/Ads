"use client";

import { AD_SLOT_1, AD_SLOT_2, type AdFixture } from "@ads/core";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TavusAgentPanel } from "../../components/tavus/TavusAgentPanel";
import { destroyDailyCall } from "../../lib/dailyCallSingleton";
import { tavusLog } from "../../lib/tavusDebug";
import type { TavusSessionResponse } from "../../lib/tavus";

const AD_SLOTS: AdFixture[] = [AD_SLOT_1, AD_SLOT_2];

/** Safety net if Tavus never emits replica-stopped after a stop request. */
const AD_STOP_BACKUP_CLOSE_SECONDS = 15;

const QUICK_CLOSE_SIGNALS = new Set([
  "skip",
  "annoyed",
  "tell_me_quickly",
  "not_relevant",
  "too_long",
]);

const knicksVideoContext = {
  id: "knicks-finals-game2",
  title: "Knicks vs Spurs — NBA Finals Game 2",
  topic: "NBA Finals live broadcast",
  tags: ["nba", "knicks", "finals", "basketball"],
  transcriptSnippet:
    "Live coverage of Knicks Finals Game 2 at Madison Square Garden.",
  viewerMode: "focused" as const,
  interruptionRisk: "high" as const,
  recommendedAdStyle: "short_utility" as const,
};

const FEEDBACK_BUTTONS = [
  { signal: "too_long", label: "Too long" },
  { signal: "not_relevant", label: "Not relevant" },
  { signal: "annoyed", label: "I'm annoyed" },
  { signal: "tell_me_quickly", label: "Tell me quickly" },
  { signal: "interested", label: "I'm interested" },
  { signal: "skip", label: "Skip this" },
] as const;

type ActiveAd = {
  slot: AdFixture;
  session: TavusSessionResponse;
};

function formatTime(timeInSeconds: number) {
  const safeTime = Number.isFinite(timeInSeconds)
    ? Math.max(0, timeInSeconds)
    : 0;
  const minutes = Math.floor(safeTime / 60);
  const seconds = Math.floor(safeTime % 60);

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export default function GetStartedPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const firedRef = useRef<Set<number>>(new Set());
  const adCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const adStopRequestedRef = useRef(false);
  const [sessionId, setSessionId] = useState(() => `demo-${Date.now()}`);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [activeAd, setActiveAd] = useState<ActiveAd | null>(null);
  const [adLoading, setAdLoading] = useState(false);
  const [stopPending, setStopPending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  const markers = useMemo(
    () =>
      AD_SLOTS.map((slot) => ({
        label: `Ad ${slot.adIndex + 1}`,
        time: slot.triggerTimeSeconds,
        triggerMoment: slot.triggerMoment,
      })).map((marker) => ({
        ...marker,
        left: `${(marker.time / duration) * 100}%`,
      })),
    [duration],
  );

  const dismissAd = useCallback(() => {
    tavusLog("dismissAd — closing overlay and resuming video");
    if (adCloseTimerRef.current) {
      clearTimeout(adCloseTimerRef.current);
      adCloseTimerRef.current = null;
    }

    adStopRequestedRef.current = false;
    setStopPending(false);
    void destroyDailyCall();
    setActiveAd(null);
    setFeedbackStatus(null);
    void videoRef.current?.play();
  }, []);

  const scheduleAdClose = useCallback(
    (seconds: number, reason: string) => {
      if (adCloseTimerRef.current) {
        clearTimeout(adCloseTimerRef.current);
      }

      tavusLog(`scheduling ad close in ${seconds}s`, { reason });
      adCloseTimerRef.current = setTimeout(() => {
        dismissAd();
      }, seconds * 1000);
    },
    [dismissAd],
  );

  const sendFeedback = useCallback(
    async (buttonSignal: string, options?: { scheduleClose?: boolean }) => {
      const scheduleClose = options?.scheduleClose ?? true;

      if (!activeAd) {
        return;
      }

      setFeedbackStatus("Sending feedback…");

      try {
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId,
            feedback: {
              id: `feedback-${Date.now()}`,
              sessionId,
              buttonSignal,
              timestamp: new Date().toISOString(),
            },
            videoContext: knicksVideoContext,
            adCandidate: activeAd.slot.adCandidate,
            adCategory: activeAd.slot.adCandidate.category,
          }),
        });

        const data = (await res.json()) as {
          agentResponse?: { script?: string; shouldStop?: boolean };
          analysis?: { emotionSignal?: string };
        };

        if (res.ok) {
          const closing =
            data.agentResponse?.shouldStop ||
            QUICK_CLOSE_SIGNALS.has(buttonSignal);

          setFeedbackStatus(
            closing
              ? `${data.agentResponse?.script ?? "Got it."} Closing ad…`
              : (data.agentResponse?.script ??
                `Signal recorded (${data.analysis?.emotionSignal ?? buttonSignal}).`),
          );

          if (closing && scheduleClose && !adStopRequestedRef.current) {
            scheduleAdClose(
              AD_STOP_BACKUP_CLOSE_SECONDS,
              `feedback:${buttonSignal}`,
            );
          }
        } else {
          setFeedbackStatus("Feedback failed — try again.");
        }
      } catch {
        setFeedbackStatus("Feedback failed — try again.");
      }
    },
    [activeAd, scheduleAdClose, sessionId],
  );

  const handleStopRequested = useCallback(() => {
    if (adStopRequestedRef.current) {
      return;
    }

    adStopRequestedRef.current = true;
    setStopPending(true);
    tavusLog(
      "viewer requested stop — auto-dismiss when agent finishes closing line",
    );
    setFeedbackStatus("Got it — closing ad after the agent finishes…");
    scheduleAdClose(AD_STOP_BACKUP_CLOSE_SECONDS, "voice-stop-backup");
    void sendFeedback("skip", { scheduleClose: false });
  }, [sendFeedback, scheduleAdClose]);

  const triggerAd = useCallback(
    async (slot: AdFixture) => {
      if (adLoading || activeAd) {
        return;
      }

      videoRef.current?.pause();
      setAdLoading(true);
      setFeedbackStatus(null);

      try {
        const res = await fetch("/api/tavus/session", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionId,
            videoContext: knicksVideoContext,
            adCandidate: slot.adCandidate,
            openingScript: slot.tavusContext || slot.adCandidate.pitchAngle,
            adIndex: slot.adIndex,
          }),
        });

        const data = (await res.json()) as TavusSessionResponse;

        tavusLog("Tavus session created for ad slot", {
          adIndex: slot.adIndex,
          provider: data.provider,
          status: data.status,
          conversationUrl: data.tavusConversationUrl,
          hasMeetingToken: Boolean(data.meetingToken),
        });

        setActiveAd({ slot, session: data });
      } catch {
        setActiveAd({
          slot,
          session: {
            provider: "mock",
            sessionId,
            fallbackAgentScript:
              slot.tavusContext || slot.adCandidate.pitchAngle,
            status: "fallback_ready",
          },
        });
      } finally {
        setAdLoading(false);
      }
    },
    [activeAd, adLoading, sessionId],
  );

  const scheduleFullAdClose = useCallback(() => {
    if (!activeAd) {
      return;
    }

    scheduleAdClose(
      activeAd.slot.adCandidate.defaultLengthSeconds + 5,
      `slot-${activeAd.slot.adIndex}-full-duration`,
    );
  }, [activeAd, scheduleAdClose]);

  useEffect(() => {
    if (!activeAd) {
      return;
    }

    // Schedule immediately as a fallback if the agent never reports live.
    scheduleAdClose(
      activeAd.slot.adCandidate.defaultLengthSeconds + 20,
      `slot-${activeAd.slot.adIndex}-join-fallback`,
    );
    // Intentionally no cleanup — React Strict Mode remounts were clearing the
    // timer before it fired. dismissAd() clears the timer when the ad closes.
  }, [activeAd?.session.sessionId, activeAd?.slot.adIndex, scheduleAdClose]);

  function syncTime() {
    if (!videoRef.current) {
      return;
    }

    const time = videoRef.current.currentTime;
    setCurrentTime(time);

    for (const slot of AD_SLOTS) {
      if (
        time >= slot.triggerTimeSeconds &&
        !firedRef.current.has(slot.adIndex) &&
        !activeAd &&
        !adLoading
      ) {
        firedRef.current.add(slot.adIndex);
        void triggerAd(slot);
      }
    }
  }

  function syncDuration() {
    if (!videoRef.current || !Number.isFinite(videoRef.current.duration)) {
      return;
    }

    setDuration(videoRef.current.duration);
  }

  function handleTimelineChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextTime = Number(event.target.value);

    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
  }

  function jumpTo(time: number) {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.currentTime = time;
    setCurrentTime(time);
  }

  function startSession() {
    if (adCloseTimerRef.current) {
      clearTimeout(adCloseTimerRef.current);
      adCloseTimerRef.current = null;
    }

    adStopRequestedRef.current = false;
    setStopPending(false);
    void destroyDailyCall();
    setSessionId(`demo-${Date.now()}`);
    firedRef.current.clear();
    setActiveAd(null);
    setAdLoading(false);
    setFeedbackStatus(null);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play();
    }
    setCurrentTime(0);
  }

  const fallbackScript =
    activeAd?.session.fallbackAgentScript ??
    activeAd?.slot.tavusContext ??
    activeAd?.slot.adCandidate.pitchAngle ??
    "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#1b1b1b] px-4 py-6 text-[#fff8d6]">
      <section className="w-full max-w-5xl border-2 border-[#f3e8a6] bg-[#1b1b1b] p-3 font-mono shadow-[10px_10px_0px_0px_#000]">
        <div className="border-2 border-[#f3e8a6]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-[#f3e8a6] px-3 py-3 text-sm sm:text-lg">
            <div className="flex items-center gap-2">
              <span>MomentSense Ads</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <span>Memory: On</span>
              <button
                type="button"
                className="border-l-2 border-[#f3e8a6] pl-3 text-[#fff8d6] transition-colors duration-150 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid min-h-[18rem] grid-cols-1 border-b-2 border-[#f3e8a6] md:grid-cols-[1.65fr_1fr]">
            <div className="border-b-2 border-[#f3e8a6] px-5 py-6 md:border-b-0 md:border-r-2 md:border-[#f3e8a6]">
              <div className="flex h-full flex-col gap-4">
                <p className="text-lg sm:text-2xl">Video Player</p>
                <div className="relative flex-1 overflow-hidden border-2 border-[#f3e8a6] bg-black">
                  <video
                    ref={videoRef}
                    src="/Knicks-Video.mp4"
                    className="h-full min-h-[13rem] w-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    onTimeUpdate={syncTime}
                    onLoadedMetadata={syncDuration}
                  />

                  {(activeAd || adLoading) && (
                    <div className="absolute inset-0 flex items-end justify-end bg-black/50 p-3 sm:p-4">
                      <div className="flex max-h-[85%] w-full max-w-md flex-col border-2 border-[#7bdff6] bg-[#1b1b1b] p-3 shadow-[6px_6px_0px_0px_#000] sm:max-w-lg">
                        {adLoading ? (
                          <p className="text-sm text-[#7bdff6]">
                            Starting Tavus agent…
                          </p>
                        ) : (
                          activeAd && (
                            <>
                              <TavusAgentPanel
                                conversationUrl={
                                  activeAd.session.tavusConversationUrl ?? ""
                                }
                                meetingToken={activeAd.session.meetingToken}
                                provider={activeAd.session.provider}
                                fallbackScript={fallbackScript}
                                productName={
                                  activeAd.slot.adCandidate.productName
                                }
                                triggerMoment={activeAd.slot.triggerMoment}
                                onPerceptionSignal={sendFeedback}
                                onConversationEnd={dismissAd}
                                onStopRequested={handleStopRequested}
                                onAgentLive={scheduleFullAdClose}
                                stopPending={stopPending}
                              />

                              <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[#f3e8a6]/30 pt-3">
                                {FEEDBACK_BUTTONS.map(({ signal, label }) => (
                                  <button
                                    key={signal}
                                    type="button"
                                    onClick={() =>
                                      signal === "skip"
                                        ? handleStopRequested()
                                        : void sendFeedback(signal)
                                    }
                                    className="border border-[#f3e8a6]/60 px-2 py-1 text-[10px] uppercase tracking-wide transition-colors hover:bg-[#f3e8a6] hover:text-black sm:text-xs"
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>

                              {feedbackStatus && (
                                <p className="mt-2 text-xs leading-relaxed text-[#86efac]">
                                  {feedbackStatus}
                                </p>
                              )}

                              <button
                                type="button"
                                onClick={dismissAd}
                                className="mt-3 w-full border border-[#f3e8a6] px-2 py-1 text-xs transition-colors hover:bg-[#f3e8a6] hover:text-black"
                              >
                                Dismiss &amp; resume game
                              </button>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="max-w-md text-base leading-relaxed sm:text-xl">
                  {activeAd
                    ? `Ad runs up to ${activeAd.slot.adCandidate.defaultLengthSeconds}s. Say "stop" to hear the closing line and auto-dismiss.`
                    : adLoading
                      ? "Tavus agent is starting…"
                      : "Ads auto-trigger at 0:19 and 0:39 based on what happens in the clip."}
                </p>
              </div>
            </div>

            <aside className="flex flex-col justify-start px-3 py-4 text-lg sm:px-4 sm:text-2xl">
              <div className="space-y-3 border-l-2 border-[#7bdff6] pl-3">
                <p>Context Intelligence</p>
                <p>Preference Memory</p>
                <p>Next Ad Strategy</p>
              </div>
            </aside>
          </div>

          <div className="px-3 py-4 sm:px-4 sm:py-5">
            <div className="flex flex-col gap-4 text-sm sm:text-lg">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span>{`Timeline: ${formatTime(currentTime)}`}</span>
                <div className="relative min-w-[12rem] flex-1">
                  <div className="pointer-events-none absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-[#f3e8a6]" />
                  {markers.map((marker) => (
                    <button
                      key={marker.label}
                      type="button"
                      aria-label={`Jump to ${marker.label} at ${formatTime(marker.time)}`}
                      title={marker.triggerMoment}
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#fff8d6] bg-white"
                      style={{ left: marker.left }}
                      onClick={() => jumpTo(marker.time)}
                    />
                  ))}
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    step={0.1}
                    value={Math.min(currentTime, duration)}
                    onChange={handleTimelineChange}
                    className="relative h-4 w-full cursor-pointer appearance-none bg-transparent [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#1b1b1b] [&::-moz-range-thumb]:bg-[#ff6b6b] [&::-moz-range-track]:h-[2px] [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-[2px] [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#1b1b1b] [&::-webkit-slider-thumb]:bg-[#ff6b6b]"
                  />
                </div>
                <span>{formatTime(duration)}</span>
                <span className="ml-auto hidden text-[#ff7a7a] sm:inline">|</span>
              </div>

              <div className="relative h-8">
                {markers.map((marker) => (
                  <button
                    key={`${marker.label}-label`}
                    type="button"
                    className="absolute top-0 -translate-x-1/2 transition-colors duration-150 hover:text-white"
                    style={{ left: marker.left }}
                    onClick={() => jumpTo(marker.time)}
                  >
                    {`${marker.label} (${formatTime(marker.time)})`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 font-sans text-xs font-black uppercase tracking-[0.18em] text-white sm:text-sm">
          <Link href="/" className="hover:text-[#ffd93d]">
            Back
          </Link>
          <button
            type="button"
            onClick={startSession}
            className="border-2 border-[#f3e8a6] bg-[#ff6b6b] px-4 py-2 text-black transition-transform duration-150 hover:-translate-y-0.5"
          >
            Start Session
          </button>
        </div>
      </section>
    </main>
  );
}
