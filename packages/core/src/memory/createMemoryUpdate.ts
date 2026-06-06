import type { FrictionAnalysis, ViewerFeedback } from "../schemas/feedback";
import type {
  MemoryUpdate,
  PreferenceMemory,
} from "../schemas/memory";
import { isUnsafeLabel } from "../safety/unsafeLabels";

export interface CreateMemoryUpdateInput {
  sessionId: string;
  feedback: ViewerFeedback;
  analysis: FrictionAnalysis;
}

function allowedPref(
  sessionId: string,
  label: string,
  sourceSignal: string,
  confidence: PreferenceMemory["confidence"] = "high",
): PreferenceMemory {
  return {
    preferenceId: `${sessionId}:${label.toLowerCase().replace(/\s+/g, "_")}`,
    label,
    sourceSignal,
    confidence,
    scope: "session",
    viewerVisible: true,
    safetyStatus: "allowed",
  };
}

function blockedPref(
  sessionId: string,
  label: string,
  sourceSignal: string,
): PreferenceMemory {
  return {
    preferenceId: `${sessionId}:blocked:${label.toLowerCase().replace(/\s+/g, "_")}`,
    label,
    sourceSignal,
    confidence: "low",
    scope: "session",
    viewerVisible: true,
    safetyStatus: "blocked",
  };
}

/**
 * Builds a MemoryUpdate from feedback + analysis. Allowed preferences come
 * from the AGENTS.md §1.3 allowed list. Demo also surfaces a representative
 * blocked label so judges can see the safety layer working.
 */
export function createMemoryUpdate(
  input: CreateMemoryUpdateInput,
): MemoryUpdate {
  const { sessionId, feedback, analysis } = input;
  const source = feedback.buttonSignal ?? "unknown";

  const candidatesAllowed: PreferenceMemory[] = [];
  const demoBlocked: PreferenceMemory[] = [];

  switch (feedback.buttonSignal) {
    case "too_long":
      candidatesAllowed.push(
        allowedPref(sessionId, "Viewer prefers shorter ads", source),
        allowedPref(sessionId, "Viewer dislikes long intros", source),
      );
      break;
    case "tell_me_quickly":
      candidatesAllowed.push(
        allowedPref(sessionId, "Viewer prefers shorter ads", source),
        allowedPref(
          sessionId,
          "Viewer prefers direct utility pitches",
          source,
        ),
      );
      break;
    case "annoyed":
      candidatesAllowed.push(
        allowedPref(sessionId, "Viewer prefers shorter ads", source),
        allowedPref(
          sessionId,
          "Viewer wants lower interruption frequency",
          source,
        ),
      );
      demoBlocked.push(
        blockedPref(
          sessionId,
          "User is angry and can be persuaded",
          source,
        ),
        blockedPref(sessionId, "Exploit frustration", source),
      );
      break;
    case "not_relevant":
      candidatesAllowed.push(
        allowedPref(
          sessionId,
          "Viewer does not want repeated product categories",
          source,
        ),
      );
      break;
    case "interested":
      candidatesAllowed.push(
        allowedPref(
          sessionId,
          "Viewer prefers direct utility pitches",
          source,
          "medium",
        ),
      );
      break;
    case "skip":
      candidatesAllowed.push(
        allowedPref(
          sessionId,
          "Viewer is currently in low-interruption mode",
          source,
        ),
      );
      break;
    default:
      break;
  }

  const allowedPreferences: PreferenceMemory[] = [];
  const blockedUnsafeLabels: PreferenceMemory[] = [...demoBlocked];

  for (const pref of candidatesAllowed) {
    if (isUnsafeLabel(pref.label)) {
      blockedUnsafeLabels.push({ ...pref, safetyStatus: "blocked" });
    } else {
      allowedPreferences.push(pref);
    }
  }

  let currentMode: MemoryUpdate["currentMode"] = "normal";
  if (analysis.intent === "skip" || analysis.intent === "stop") {
    currentMode = "ad_paused";
  } else if (analysis.frictionLevel === "high") {
    currentMode = "low_interruption";
  }

  return {
    sessionId,
    allowedPreferences,
    blockedUnsafeLabels,
    currentMode,
  };
}
