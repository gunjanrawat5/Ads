import type { ArcEntry } from "@ads/core";
import { getAgentMemoryProvider } from "./providerFactory";

export async function storeArcEntry(
  sessionId: string,
  entry: ArcEntry,
): Promise<void> {
  return getAgentMemoryProvider().storeArcEntry(sessionId, entry);
}

export async function getArcEntries(sessionId: string): Promise<ArcEntry[]> {
  return getAgentMemoryProvider().getArcEntries(sessionId);
}

/** Test-only: forget the cached provider singleton. */
export { _resetAgentMemoryProvider as _resetArcStore } from "./providerFactory";
