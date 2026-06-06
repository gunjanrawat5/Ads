import type {
  ArcEntry,
  MemoryUpdate,
  NextAdDecision,
  PreferenceMemory,
  ViewerFeedback,
} from "@ads/core";

interface SessionRecord {
  mode: MemoryUpdate["currentMode"];
  preferences: PreferenceMemory[];
  arc: ArcEntry[];
  feedback: ViewerFeedback[];
  nextAd?: NextAdDecision;
}

function emptyRecord(): SessionRecord {
  return { mode: "normal", preferences: [], arc: [], feedback: [] };
}

/**
 * Process-local fallback when REDIS_AGENT_MEMORY_URL is unset or unreachable.
 * Implements the Agent Memory Server surface (arc + preferences) plus session
 * state used by next-ad and interruption mode.
 */
export class InMemoryProvider {
  readonly name = "memory" as const;
  private readonly store = new Map<string, SessionRecord>();

  private record(sessionId: string): SessionRecord {
    let r = this.store.get(sessionId);
    if (!r) {
      r = emptyRecord();
      this.store.set(sessionId, r);
    }
    return r;
  }

  async storeArcEntry(sessionId: string, entry: ArcEntry): Promise<void> {
    this.record(sessionId).arc.push(entry);
  }

  async getArcEntries(sessionId: string): Promise<ArcEntry[]> {
    return [...this.record(sessionId).arc];
  }

  async storePreference(
    sessionId: string,
    pref: PreferenceMemory,
  ): Promise<void> {
    if (pref.safetyStatus !== "allowed") return;

    const record = this.record(sessionId);
    const seen = new Set(record.preferences.map((p) => p.label.toLowerCase()));
    if (!seen.has(pref.label.toLowerCase())) {
      record.preferences.push(pref);
    }
  }

  async getPreferences(sessionId: string): Promise<PreferenceMemory[]> {
    return [...this.record(sessionId).preferences];
  }

  async appendFeedback(
    sessionId: string,
    feedback: ViewerFeedback,
  ): Promise<void> {
    this.record(sessionId).feedback.push(feedback);
  }

  async getSessionMode(
    sessionId: string,
  ): Promise<MemoryUpdate["currentMode"]> {
    return this.record(sessionId).mode;
  }

  async setSessionMode(
    sessionId: string,
    mode: MemoryUpdate["currentMode"],
  ): Promise<void> {
    this.record(sessionId).mode = mode;
  }

  async saveNextAdDecision(
    sessionId: string,
    decision: NextAdDecision,
  ): Promise<void> {
    this.record(sessionId).nextAd = decision;
  }

  async clear(sessionId: string): Promise<void> {
    this.store.delete(sessionId);
  }
}
