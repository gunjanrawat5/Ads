/** Matches packages/integrations TAVUS_MOCK_URL_PREFIX — safe for client bundles. */
export const TAVUS_MOCK_URL_PREFIX = "tavus-mock://session/" as const;

export function isMockTavusUrl(url: string | undefined): boolean {
  return typeof url === "string" && url.startsWith(TAVUS_MOCK_URL_PREFIX);
}

/** Viewer asked to stop the ad (matches Tavus transcripts like "nah, stop"). */
export const STOP_UTTERANCE_PATTERN =
  /\b(stop|skip|enough|quit|not now|no thanks)\b/i;

/** Agent delivered the scripted closing line after a stop request. */
export const CLOSING_LINE_PATTERN =
  /\benjoy the game\b|\bfair\b|\bno problem\b|\b15% off\b/i;

/** Raven-1 perception tool names -> deterministic feedback button signals. */
export const RAVEN_SIGNAL_MAP: Record<string, string> = {
  mark_high_friction: "annoyed",
  mark_engaged: "interested",
  mark_rushed: "tell_me_quickly",
};

export type TavusSessionResponse = {
  provider: "tavus" | "mock";
  sessionId: string;
  tavusConversationUrl?: string;
  tavusConversationId?: string;
  meetingToken?: string;
  fallbackAgentScript?: string;
  status: "ready" | "fallback_ready";
};
