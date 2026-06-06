import { Redis } from "@upstash/redis";
import type {
  MemoryUpdate,
  NextAdDecision,
  PreferenceMemory,
  ViewerFeedback,
} from "@ads/core";
import { key, TTL_SECONDS, type MemoryProvider } from "./types";

export interface UpstashProviderOptions {
  url: string;
  token: string;
}

interface SessionRecord {
  mode: MemoryUpdate["currentMode"];
}

export class UpstashProvider implements MemoryProvider {
  readonly name = "redis" as const;
  private readonly redis: Redis;

  constructor(options: UpstashProviderOptions) {
    this.redis = new Redis({ url: options.url, token: options.token });
  }

  async getPreferences(sessionId: string): Promise<PreferenceMemory[]> {
    const raw = await this.redis.get<PreferenceMemory[]>(
      key("preferences", sessionId),
    );
    return Array.isArray(raw) ? raw : [];
  }

  async savePreferences(
    sessionId: string,
    preferences: PreferenceMemory[],
  ): Promise<void> {
    await this.redis.set(key("preferences", sessionId), preferences, {
      ex: TTL_SECONDS.preferences,
    });
  }

  async appendFeedback(
    sessionId: string,
    feedback: ViewerFeedback,
  ): Promise<void> {
    const k = key("feedback", sessionId);
    await this.redis.rpush(k, JSON.stringify(feedback));
    await this.redis.expire(k, TTL_SECONDS.feedback);
  }

  async getSessionMode(
    sessionId: string,
  ): Promise<MemoryUpdate["currentMode"]> {
    const raw = await this.redis.get<SessionRecord>(key("session", sessionId));
    return raw?.mode ?? "normal";
  }

  async setSessionMode(
    sessionId: string,
    mode: MemoryUpdate["currentMode"],
  ): Promise<void> {
    const record: SessionRecord = { mode };
    await this.redis.set(key("session", sessionId), record, {
      ex: TTL_SECONDS.session,
    });
  }

  async saveNextAdDecision(
    sessionId: string,
    decision: NextAdDecision,
  ): Promise<void> {
    await this.redis.set(key("next-ad", sessionId), decision, {
      ex: TTL_SECONDS.nextAd,
    });
  }

  async clear(sessionId: string): Promise<void> {
    await Promise.all([
      this.redis.del(key("session", sessionId)),
      this.redis.del(key("preferences", sessionId)),
      this.redis.del(key("feedback", sessionId)),
      this.redis.del(key("next-ad", sessionId)),
    ]);
  }
}
