import type {
  MemoryUpdate,
  NextAdDecision,
  PreferenceMemory,
  ViewerFeedback,
} from "@ads/core";

/**
 * Backend memory provider. Implementations: UpstashProvider (REST) when env
 * vars are present, InMemoryProvider (process Map) otherwise.
 *
 * Namespaces (AGENTS.md §13.2):
 *   ad-demo:session:{sessionId}      -> { mode }
 *   ad-demo:preferences:{sessionId}  -> PreferenceMemory[]
 *   ad-demo:feedback:{sessionId}     -> ViewerFeedback[] (append-only list)
 *   ad-demo:next-ad:{sessionId}      -> NextAdDecision
 *
 * TTLs (AGENTS.md §13.3):
 *   session: 2h, feedback: 2h, preferences: 24h, next-ad: 2h.
 */
export interface MemoryProvider {
  readonly name: "redis" | "memory";

  getPreferences(sessionId: string): Promise<PreferenceMemory[]>;
  savePreferences(
    sessionId: string,
    preferences: PreferenceMemory[],
  ): Promise<void>;

  appendFeedback(sessionId: string, feedback: ViewerFeedback): Promise<void>;

  getSessionMode(sessionId: string): Promise<MemoryUpdate["currentMode"]>;
  setSessionMode(
    sessionId: string,
    mode: MemoryUpdate["currentMode"],
  ): Promise<void>;

  saveNextAdDecision(
    sessionId: string,
    decision: NextAdDecision,
  ): Promise<void>;

  clear(sessionId: string): Promise<void>;
}

export const TTL_SECONDS = {
  session: 60 * 60 * 2,
  feedback: 60 * 60 * 2,
  preferences: 60 * 60 * 24,
  nextAd: 60 * 60 * 2,
} as const;

export function key(kind: "session" | "preferences" | "feedback" | "next-ad", sessionId: string): string {
  return `ad-demo:${kind}:${sessionId}`;
}
