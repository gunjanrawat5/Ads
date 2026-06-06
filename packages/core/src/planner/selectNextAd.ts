import type { VideoContext } from "../schemas/context";
import type {
  NextAdDecision,
  PreferenceMemory,
} from "../schemas/memory";

export interface SelectNextAdInput {
  sessionId: string;
  videoContext: VideoContext;
  preferences: PreferenceMemory[];
}

/**
 * Computes the next ad strategy. High-friction preferences (shorter ads,
 * lower frequency, low-interruption mode) shrink length and add frequency
 * rules. Pause mode short-circuits to a paused decision.
 */
export function selectNextAd(input: SelectNextAdInput): NextAdDecision {
  const { sessionId, videoContext, preferences } = input;
  const labels = preferences
    .filter((p) => p.safetyStatus === "allowed")
    .map((p) => p.label.toLowerCase());

  const wantsShorter = labels.some(
    (l) => l.includes("shorter") || l.includes("dislikes long"),
  );
  const wantsLowerFrequency = labels.some((l) =>
    l.includes("lower interruption"),
  );
  const inLowInterruptionMode = labels.some((l) =>
    l.includes("low-interruption mode"),
  );
  const wantsDirect = labels.some((l) => l.includes("direct utility"));
  const avoidsCategory = labels.some((l) =>
    l.includes("repeated product categories"),
  );

  if (inLowInterruptionMode) {
    return {
      sessionId,
      style: "paused",
      lengthSeconds: 0,
      tone: "none",
      categoryRules: avoidsCategory
        ? [`Avoid repeating: ${videoContext.topic}`]
        : [],
      frequencyRules: ["Pause new ads for this session"],
      explanation:
        "Viewer is in low-interruption mode. No new ad will be served this session.",
    };
  }

  const highFriction = wantsShorter || wantsLowerFrequency;
  const lengthSeconds = highFriction ? 8 : 15;
  const style: NextAdDecision["style"] = wantsDirect
    ? "direct"
    : "short_utility";
  const tone: NextAdDecision["tone"] = highFriction ? "minimal" : "respectful";

  const categoryRules: string[] = [];
  if (avoidsCategory) {
    categoryRules.push(`Avoid repeating: ${videoContext.topic}`);
  }

  const frequencyRules: string[] = [];
  if (wantsLowerFrequency) {
    frequencyRules.push("Reduce interruption frequency");
  }

  return {
    sessionId,
    style,
    lengthSeconds,
    tone,
    categoryRules,
    frequencyRules,
    explanation: `Next ad strategy: ${lengthSeconds}-second ${style.replace(
      "_",
      " ",
    )} pitch. Tone: ${tone}.${
      wantsLowerFrequency ? " Frequency: reduced." : ""
    }`,
  };
}
