import { describe, expect, it } from "vitest";
import { classifyFeedback } from "../src/classifier/classifyFeedback";
import type {
  ButtonSignal,
  FrictionAnalysis,
  ViewerFeedback,
} from "../src/schemas/feedback";

function fb(buttonSignal: ButtonSignal): ViewerFeedback {
  return {
    id: `feedback-${buttonSignal}`,
    sessionId: "test-session",
    buttonSignal,
    timestamp: "2026-06-06T00:00:00.000Z",
  };
}

const EXPECTED: Record<ButtonSignal, FrictionAnalysis> = {
  too_long: {
    emotionSignal: "rushed",
    frictionLevel: "medium",
    intent: "compress",
    adRisk: "too_long",
    recommendedAction: "shorten",
    confidence: "high",
  },
  not_relevant: {
    emotionSignal: "disinterested",
    frictionLevel: "high",
    intent: "stop",
    adRisk: "low_relevance",
    recommendedAction: "stop",
    confidence: "high",
  },
  annoyed: {
    emotionSignal: "frustrated",
    frictionLevel: "high",
    intent: "compress",
    adRisk: "interruption_fatigue",
    recommendedAction: "lower_frequency",
    confidence: "high",
  },
  tell_me_quickly: {
    emotionSignal: "rushed",
    frictionLevel: "low",
    intent: "compress",
    adRisk: "too_long",
    recommendedAction: "shorten",
    confidence: "medium",
  },
  interested: {
    emotionSignal: "engaged",
    frictionLevel: "none",
    intent: "continue",
    adRisk: "none",
    recommendedAction: "continue",
    confidence: "high",
  },
  skip: {
    emotionSignal: "disinterested",
    frictionLevel: "high",
    intent: "skip",
    adRisk: "hard_rejection",
    recommendedAction: "stop",
    confidence: "high",
  },
};

describe("classifyFeedback", () => {
  for (const signal of Object.keys(EXPECTED) as ButtonSignal[]) {
    it(`maps ${signal} to the §10 friction analysis`, () => {
      const analysis = classifyFeedback(fb(signal));
      expect(analysis).toEqual(EXPECTED[signal]);
    });
  }

  it("ignores voiceText (Chunk A: classifier maps buttonSignal only)", () => {
    const feedback: ViewerFeedback = {
      id: "f1",
      sessionId: "s1",
      buttonSignal: "interested",
      voiceText: "This is so annoying, leave me alone",
      timestamp: "2026-06-06T00:00:00.000Z",
    };
    expect(classifyFeedback(feedback)).toEqual(EXPECTED.interested);
  });
});
