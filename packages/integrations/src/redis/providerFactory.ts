import { AgentMemoryProvider } from "./agentMemoryProvider";
import { InMemoryProvider } from "./inMemoryProvider";

export type AgentMemoryProviderLike = AgentMemoryProvider | InMemoryProvider;

let cached: AgentMemoryProviderLike | undefined;

/**
 * Returns AgentMemoryProvider when REDIS_AGENT_MEMORY_URL is set and
 * NEXT_PUBLIC_REDIS_ENABLED === "true". Otherwise InMemoryProvider.
 *
 * Singleton: a single in-memory instance must persist across requests within
 * one Node process so the demo's session state survives the feedback loop.
 */
export function getAgentMemoryProvider(): AgentMemoryProviderLike {
  if (cached) return cached;

  const enabled = process.env.NEXT_PUBLIC_REDIS_ENABLED === "true";
  const url = process.env.REDIS_AGENT_MEMORY_URL;

  if (enabled && url) {
    cached = new AgentMemoryProvider({ baseUrl: url });
    return cached;
  }

  cached = new InMemoryProvider();
  return cached;
}

/** @deprecated Use getAgentMemoryProvider. Kept for routes not yet migrated. */
export const getMemoryProvider = getAgentMemoryProvider;

/** Test-only: forget the cached singleton. */
export function _resetAgentMemoryProvider(): void {
  cached = undefined;
}
