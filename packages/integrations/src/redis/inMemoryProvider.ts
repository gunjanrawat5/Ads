import type {
  MemoryUpdate,
  NextAdDecision,
  PreferenceMemory,
  ViewerFeedback,
} from "@ads/core";
import type { MemoryProvider } from "./types";

interface SessionRecord {
  mode: MemoryUpdate["currentMode"];
  preferences: PreferenceMemory[];
  feedback: ViewerFeedback[];
  nextAd?: NextAdDecision;
}

function emptyRecord(): SessionRecord {
  return { mode: "normal", preferences: [], feedback: [] };
}

export class InMemoryProvider implements MemoryProvider {
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

  async getPreferences(sessionId: string): Promise<PreferenceMemory[]> {
    return [...this.record(sessionId).preferences];
  }

  async savePreferences(
    sessionId: string,
    preferences: PreferenceMemory[],
  ): Promise<void> {
    this.record(sessionId).preferences = [...preferences];
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
