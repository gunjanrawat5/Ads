import {
  buildConversationalContext,
  resolvePersona,
} from "./personaConfig";
import {
  TAVUS_MOCK_URL_PREFIX,
  type TavusProvider,
  type TavusSessionInput,
  type TavusSessionResult,
} from "./types";

/**
 * Synthetic Tavus session for offline/demo-mode. The conversation_url uses
 * the literal "tavus-mock://session/" prefix so the frontend can detect mock
 * sessions and render its scripted fallback agent card instead of an iframe.
 *
 * The mock runs the same persona resolution as the real provider so category
 * routing behaves identically offline, but always returns the fixed mock URL.
 * fallbackAgentScript carries the persona-grounded conversational context (the
 * scripted opening line is embedded in it) so the fallback card stays on-brand.
 */
export class MockTavusProvider implements TavusProvider {
  readonly name = "mock" as const;

  async createSession(
    input: TavusSessionInput,
  ): Promise<TavusSessionResult> {
    const persona = resolvePersona(input.adCandidate.category);
    const fallbackAgentScript =
      input.conversationalContext ??
      buildConversationalContext({
        persona,
        videoContext: input.videoContext,
        adCandidate: input.adCandidate,
        openingScript: input.openingScript,
      });

    return {
      provider: "mock",
      sessionId: input.sessionId,
      tavusConversationUrl: `${TAVUS_MOCK_URL_PREFIX}${input.sessionId}`,
      tavusConversationId: `mock-${input.sessionId}`,
      fallbackAgentScript,
      status: "fallback_ready",
    };
  }

  async endSession(_sessionId: string): Promise<void> {
    // no-op
  }
}
