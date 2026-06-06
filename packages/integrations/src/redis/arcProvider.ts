import { Redis } from "@upstash/redis";
import type { ArcEntry } from "@ads/core";

/**
 * Arc store for the two-slot NBA Finals broadcast. It records what happened
 * during AD_SLOT_1 so AD_SLOT_2 can adapt (see buildAd2Context in @ads/core).
 *
 * Key:  ad-demo:arc:{sessionId}  -> ArcEntry[]
 * TTL:  7200s (2 hours), matching the session/feedback TTLs in AGENTS.md §13.3.
 *
 * Uses Upstash when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set
 * AND NEXT_PUBLIC_REDIS_ENABLED === "true". Otherwise it falls back to a
 * process-level Map so the demo (and the smoke test) work without Redis. Per
 * AGENTS.md §1.6 / §13.4 a missing Redis must never break the broadcast.
 */

const ARC_TTL_SECONDS = 7200;

function arcKey(sessionId: string): string {
  return `ad-demo:arc:${sessionId}`;
}

// Persists across requests within one Node process (the dev/server runtime).
const memoryStore = new Map<string, ArcEntry[]>();

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const enabled = process.env.NEXT_PUBLIC_REDIS_ENABLED === "true";

  if (enabled && url && token) {
    try {
      redisClient = new Redis({ url, token });
      return redisClient;
    } catch {
      // fall through to in-memory
    }
  }

  redisClient = null;
  return null;
}

export async function appendArcEntry(
  sessionId: string,
  entry: ArcEntry,
): Promise<void> {
  const redis = getRedis();

  if (redis) {
    const k = arcKey(sessionId);
    const current = await redis.get<ArcEntry[]>(k);
    const next = Array.isArray(current) ? [...current, entry] : [entry];
    await redis.set(k, next, { ex: ARC_TTL_SECONDS });
    return;
  }

  const current = memoryStore.get(sessionId) ?? [];
  memoryStore.set(sessionId, [...current, entry]);
}

export async function getArcEntries(sessionId: string): Promise<ArcEntry[]> {
  const redis = getRedis();

  if (redis) {
    const raw = await redis.get<ArcEntry[]>(arcKey(sessionId));
    return Array.isArray(raw) ? raw : [];
  }

  return memoryStore.get(sessionId) ?? [];
}

/** Test-only: forget the cached Redis client and in-memory arc store. */
export function _resetArcStore(): void {
  redisClient = undefined;
  memoryStore.clear();
}
