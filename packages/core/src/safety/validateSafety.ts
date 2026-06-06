import type { AgentResponse } from "../schemas/feedback";
import type {
  MemoryUpdate,
  PreferenceMemory,
} from "../schemas/memory";
import { increasesPressure, isUnsafeLabel } from "./unsafeLabels";

export interface ValidateSafetyInput {
  response: AgentResponse;
  memoryUpdate: MemoryUpdate;
}

export interface ValidateSafetyResult {
  safe: boolean;
  modifiedResponse?: AgentResponse;
  blockedLabels: PreferenceMemory[];
}

const DE_ESCALATION_STRATEGIES: ReadonlyArray<AgentResponse["strategy"]> = [
  "de_escalate",
  "shorten",
  "stop",
];

/**
 * Final safety check before a response or memory update reaches the user.
 * Catches three failure modes:
 *  1. Response contains pressure language while strategy is meant to
 *     de-escalate, shorten, or stop. Rewrite to a hard stop.
 *  2. allowedPreferences contains a label that matches an unsafe pattern.
 *     Move it to blockedLabels.
 *  3. Strategy is "stop" but shouldContinue is true. Force shouldStop.
 */
export function validateSafety(
  input: ValidateSafetyInput,
): ValidateSafetyResult {
  const { response, memoryUpdate } = input;

  const blockedLabels: PreferenceMemory[] = [];
  for (const pref of memoryUpdate.allowedPreferences) {
    if (isUnsafeLabel(pref.label)) {
      blockedLabels.push({ ...pref, safetyStatus: "blocked" });
    }
  }

  const isDeEscalationContext = DE_ESCALATION_STRATEGIES.includes(
    response.strategy,
  );
  const hasPressure = increasesPressure(response.script);
  const pressureViolation = isDeEscalationContext && hasPressure;

  const stopButContinues =
    response.strategy === "stop" && response.shouldContinue;

  if (pressureViolation || stopButContinues || blockedLabels.length > 0) {
    let modifiedResponse: AgentResponse | undefined;

    if (pressureViolation || stopButContinues) {
      modifiedResponse = {
        strategy: "stop",
        script: "I'll stop here.",
        shouldContinue: false,
        shouldStop: true,
        safetyStatus: "modified",
      };
    }

    return {
      safe: false,
      ...(modifiedResponse ? { modifiedResponse } : {}),
      blockedLabels,
    };
  }

  return { safe: true, blockedLabels: [] };
}
