import { z } from "zod";

export const PreferenceMemorySchema = z.object({
  preferenceId: z.string(),
  label: z.string(),
  sourceSignal: z.string(),
  confidence: z.enum(["low", "medium", "high"]),
  scope: z.enum(["session", "temporary", "persistent_demo"]),
  expiresAt: z.string().optional(),
  viewerVisible: z.boolean(),
  safetyStatus: z.enum(["allowed", "blocked"]),
});
export type PreferenceMemory = z.infer<typeof PreferenceMemorySchema>;

export const MemoryUpdateSchema = z.object({
  sessionId: z.string(),
  allowedPreferences: z.array(PreferenceMemorySchema),
  blockedUnsafeLabels: z.array(PreferenceMemorySchema),
  currentMode: z.enum(["normal", "low_interruption", "ad_paused"]),
});
export type MemoryUpdate = z.infer<typeof MemoryUpdateSchema>;

export const NextAdDecisionSchema = z.object({
  sessionId: z.string(),
  style: z.enum(["short_utility", "direct", "educational", "paused"]),
  lengthSeconds: z.number(),
  tone: z.enum(["direct", "respectful", "minimal", "none"]),
  categoryRules: z.array(z.string()),
  frequencyRules: z.array(z.string()),
  explanation: z.string(),
});
export type NextAdDecision = z.infer<typeof NextAdDecisionSchema>;
