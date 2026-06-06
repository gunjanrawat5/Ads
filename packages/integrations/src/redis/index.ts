import type { ArcEntry, PreferenceMemory } from "@ads/core";
import { getAgentMemoryProvider } from "./providerFactory";

export {
  storeArcEntry,
  getArcEntries,
  _resetArcStore,
} from "./arcProvider";
export {
  getAgentMemoryProvider,
  getMemoryProvider,
  _resetAgentMemoryProvider,
} from "./providerFactory";
export type { AgentMemoryProviderLike } from "./providerFactory";
export { AgentMemoryProvider } from "./agentMemoryProvider";
export { InMemoryProvider } from "./inMemoryProvider";

export async function storePreference(
  sessionId: string,
  pref: PreferenceMemory,
): Promise<void> {
  return getAgentMemoryProvider().storePreference(sessionId, pref);
}

export async function getPreferences(
  sessionId: string,
): Promise<PreferenceMemory[]> {
  return getAgentMemoryProvider().getPreferences(sessionId);
}
