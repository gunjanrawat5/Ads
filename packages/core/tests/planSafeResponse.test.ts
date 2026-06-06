import { describe, expect, it } from "vitest";
import { classifyFeedback } from "../src/classifier/classifyFeedback";
import { planSafeResponse } from "../src/planner/planSafeResponse";
import { demoAdCandidate, demoVideoContext } from "../src/fixtures";
import type { ViewerFeedback } from "../src/schemas/feedback";

function feedbackFor(
  signal: ViewerFeedback["buttonSignal"],
): ViewerFeedback {
  return {
    id: `f-${signal}`,
    sessionId: "s1",
    buttonSignal: signal,
    timestamp: "2026-06-06T00:00:00.000Z",
  };
}

describe("planSafeResponse", () => {
  it("annoyed never returns strategy 'continue'", () => {
    const analysis = classifyFeedback(feedbackFor("annoyed"));
    const response = planSafeResponse({
      analysis,
      videoContext: demoVideoContext,
      adCandidate: demoAdCandidate,
    });
    expect(response.strategy).not.toBe("continue");
  });

  it("skip always returns shouldStop true", () => {
    const analysis = classifyFeedback(feedbackFor("skip"));
    const response = planSafeResponse({
      analysis,
      videoContext: demoVideoContext,
      adCandidate: demoAdCandidate,
    });
    expect(response.shouldStop).toBe(true);
  });
});
