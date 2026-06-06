import { z } from "zod";

export const VideoContextSchema = z.object({
  id: z.string(),
  title: z.string(),
  topic: z.string(),
  tags: z.array(z.string()),
  transcriptSnippet: z.string(),
  viewerMode: z.enum(["focused", "casual", "researching", "unknown"]),
  interruptionRisk: z.enum(["low", "medium", "high"]),
  recommendedAdStyle: z.enum([
    "short_utility",
    "direct_offer",
    "educational",
    "none",
  ]),
});
export type VideoContext = z.infer<typeof VideoContextSchema>;

export const AdCandidateSchema = z.object({
  id: z.string(),
  productName: z.string(),
  category: z.string(),
  pitchAngle: z.string(),
  defaultLengthSeconds: z.number(),
  relevanceReason: z.string(),
});
export type AdCandidate = z.infer<typeof AdCandidateSchema>;
