import { InMemoryProvider } from "./inMemoryProvider";
import { UpstashProvider } from "./upstashProvider";
import type { MemoryProvider } from "./types";

export type { MemoryProvider } from "./types";
export { TTL_SECONDS, key } from "./types";
export { InMemoryProvider } from "./inMemoryProvider";
export { UpstashProvider } from "./upstashProvider";
export {
  appendArcEntry,
  getArcEntries,
  _resetArcStore,
} from "./arcProvider";

let cached: MemoryProvider | undefined;

/**
 * Selects Upstash when UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are
 * set AND NEXT_PUBLIC_REDIS_ENABLED === "true". Otherwise InMemoryProvider.
 *
 * Singleton: a single in-memory instance must persist across requests within
 * one Node process so the demo's session state survives the feedback loop.
 */
export function getMemoryProvider(): MemoryProvider {
  if (cached) return cached;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  const enabled = process.env.NEXT_PUBLIC_REDIS_ENABLED === "true";

  if (enabled && url && token) {
    try {
      cached = new UpstashProvider({ url, token });
      return cached;
    } catch {
      // fall through to in-memory
    }
  }

  cached = new InMemoryProvider();
  return cached;
}

/** Test-only: forget the cached singleton. */
export function _resetMemoryProvider(): void {
  cached = undefined;
}
