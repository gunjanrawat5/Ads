import { describe, expect, it } from "vitest";
import { validateSafety } from "../src/safety/validateSafety";
import type { AgentResponse } from "../src/schemas/feedback";
import type { MemoryUpdate } from "../src/schemas/memory";

const emptyMemoryUpdate: MemoryUpdate = {
  sessionId: "s1",
  allowedPreferences: [],
  blockedUnsafeLabels: [],
  currentMode: "low_interruption",
};

describe("validateSafety", () => {
  it("returns safe=false when a response increases pressure after high friction", () => {
    const unsafeResponse: AgentResponse = {
      strategy: "de_escalate",
      script:
        "You will regret skipping this. This is exactly why you need this irresistible offer.",
      shouldContinue: false,
      shouldStop: false,
      safetyStatus: "allowed",
    };

    const result = validateSafety({
      response: unsafeResponse,
      memoryUpdate: emptyMemoryUpdate,
    });

    expect(result.safe).toBe(false);
    expect(result.modifiedResponse).toBeDefined();
    expect(result.modifiedResponse?.strategy).toBe("stop");
    expect(result.modifiedResponse?.shouldStop).toBe(true);
    expect(result.modifiedResponse?.safetyStatus).toBe("modified");
  });
});
