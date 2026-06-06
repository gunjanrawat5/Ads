import { describe, expect, it } from "vitest";
import { classifyFeedback } from "../src/classifier/classifyFeedback";
import { createMemoryUpdate } from "../src/memory/createMemoryUpdate";
import { isUnsafeLabel } from "../src/safety/unsafeLabels";
import type {
  ButtonSignal,
  ViewerFeedback,
} from "../src/schemas/feedback";

const ALL_SIGNALS: ButtonSignal[] = [
  "too_long",
  "not_relevant",
  "annoyed",
  "tell_me_quickly",
  "interested",
  "skip",
];

const DISALLOWED_PROBES = [
  "User is vulnerable",
  "User is angry and can be persuaded",
  "Exploit frustration",
  "Target based on health",
  "Inferred personality weakness",
  "Psychological profile of frustrated user",
];

describe("createMemoryUpdate", () => {
  it("never includes any disallowed §1.3 label in allowedPreferences", () => {
    for (const signal of ALL_SIGNALS) {
      const feedback: ViewerFeedback = {
        id: `f-${signal}`,
        sessionId: "s1",
        buttonSignal: signal,
        timestamp: "2026-06-06T00:00:00.000Z",
      };
      const analysis = classifyFeedback(feedback);
      const update = createMemoryUpdate({
        sessionId: "s1",
        feedback,
        analysis,
      });

      for (const probe of DISALLOWED_PROBES) {
        expect(isUnsafeLabel(probe)).toBe(true);
      }

      for (const pref of update.allowedPreferences) {
        expect(isUnsafeLabel(pref.label)).toBe(false);
        expect(pref.safetyStatus).toBe("allowed");
      }
    }
  });
});
