import Daily, { type DailyCall, type DailyParticipant } from "@daily-co/daily-js";
import { tavusError, tavusLog, tavusWarn } from "./tavusDebug";

declare global {
  interface Window {
    __tavusDailyCallObject?: DailyCall | null;
    __tavusSuppressEndCallback?: boolean;
  }
}

/** Suppress left-meeting → dismiss while we intentionally tear down the call. */
export function setSuppressConversationEnd(suppress: boolean): void {
  window.__tavusSuppressEndCallback = suppress;
}

export function isConversationEndSuppressed(): boolean {
  return window.__tavusSuppressEndCallback === true;
}

/** Tear down the singleton Daily call object (Tavus embed docs pattern). */
export async function destroyDailyCall(): Promise<void> {
  const call = window.__tavusDailyCallObject;
  if (!call) {
    return;
  }

  tavusLog("destroying Daily call object");
  setSuppressConversationEnd(true);
  try {
    await call.leave();
    await call.destroy();
  } catch (err) {
    tavusWarn("destroy Daily call failed (may already be gone)", err);
  } finally {
    setSuppressConversationEnd(false);
  }

  window.__tavusDailyCallObject = null;
}

export function getDailyCall(): DailyCall {
  if (!window.__tavusDailyCallObject) {
    tavusLog("creating new Daily call object");
    window.__tavusDailyCallObject = Daily.createCallObject();
  }

  return window.__tavusDailyCallObject;
}

export function getReplicaParticipant(
  participants: Record<string, DailyParticipant>,
): DailyParticipant | null {
  for (const [id, participant] of Object.entries(participants)) {
    if (id !== "local") {
      return participant;
    }
  }

  return null;
}

export function describeParticipantTracks(participant: DailyParticipant): {
  videoState: string;
  audioState: string;
  userName: string;
  sessionId: string;
} {
  return {
    videoState: participant.tracks.video?.state ?? "none",
    audioState: participant.tracks.audio?.state ?? "none",
    userName: participant.user_name ?? "unknown",
    sessionId: participant.session_id,
  };
}

export function attachParticipantMedia(
  participant: DailyParticipant,
  videoEl: HTMLVideoElement | null,
  audioEl: HTMLAudioElement | null,
): boolean {
  const info = describeParticipantTracks(participant);
  tavusLog("replica track state", info);

  let attached = false;
  const videoTrack = participant.tracks.video?.persistentTrack;
  if (videoEl && videoTrack && participant.tracks.video?.state === "playable") {
    videoEl.srcObject = new MediaStream([videoTrack]);
    void videoEl.play().then(
      () => tavusLog("replica video playing"),
      (err) => tavusWarn("replica video play() blocked or failed", err),
    );
    attached = true;
  } else if (videoEl) {
    tavusWarn("replica video not playable yet", {
      state: participant.tracks.video?.state,
      hasTrack: Boolean(videoTrack),
    });
  }

  const audioTrack = participant.tracks.audio?.persistentTrack;
  if (audioEl && audioTrack && participant.tracks.audio?.state === "playable") {
    audioEl.srcObject = new MediaStream([audioTrack]);
    void audioEl.play().then(
      () => tavusLog("replica audio playing — you should hear the agent now"),
      (err) =>
        tavusWarn(
          "replica audio play() blocked (browser autoplay?) — try clicking the page or saying hi",
          err,
        ),
    );
    attached = true;
  } else if (audioEl) {
    tavusWarn("replica audio not playable yet", {
      state: participant.tracks.audio?.state,
      hasTrack: Boolean(audioTrack),
    });
  }

  return attached;
}
