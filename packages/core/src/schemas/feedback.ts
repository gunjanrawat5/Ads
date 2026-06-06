import { z } from "zod";

export const ButtonSignalSchema = z.enum([
  "too_long",
  "not_relevant",
  "annoyed",
  "tell_me_quickly",
  "interested",
  "skip",
]);
export type ButtonSignal = z.infer<typeof ButtonSignalSchema>;

export const ViewerFeedbackSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  buttonSignal: ButtonSignalSchema.optional(),
  voiceText: z.string().optional(),
  timestamp: z.string(),
});
export type ViewerFeedback = z.infer<typeof ViewerFeedbackSchema>;

export const FrictionAnalysisSchema = z.object({
  emotionSignal: z.enum([
    "frustrated",
    "curious",
    "rushed",
    "disinterested",
    "engaged",
    "neutral",
  ]),
  frictionLevel: z.enum(["none", "low", "medium", "high"]),
  intent: z.enum([
    "continue",
    "compress",
    "clarify",
    "stop",
    "skip",
    "unknown",
  ]),
  adRisk: z.enum([
    "none",
    "low_relevance",
    "interruption_fatigue",
    "too_long",
    "hard_rejection",
  ]),
  recommendedAction: z.enum([
    "continue",
    "shorten",
    "clarify",
    "stop",
    "lower_frequency",
  ]),
  confidence: z.enum(["low", "medium", "high"]),
});
export type FrictionAnalysis = z.infer<typeof FrictionAnalysisSchema>;

export const AgentResponseSchema = z.object({
  strategy: z.enum(["continue", "shorten", "clarify", "stop", "de_escalate"]),
  script: z.string(),
  shouldContinue: z.boolean(),
  shouldStop: z.boolean(),
  safetyStatus: z.enum(["allowed", "modified", "blocked"]),
});
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
