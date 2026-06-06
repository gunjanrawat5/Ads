import { NextResponse } from "next/server";
import { z } from "zod";
import {
  AdCandidateSchema,
  VideoContextSchema,
  ViewerFeedbackSchema,
  classifyFeedback,
  createMemoryUpdate,
  planSafeResponse,
  validateSafety,
  type AgentResponse,
  type FrictionAnalysis,
  type MemoryUpdate,
  type PreferenceMemory,
} from "@ads/core";
import { getMemoryProvider } from "@ads/integrations";
import { apiError, parseJson } from "../_lib/http";

const FeedbackRequestSchema = z.object({
  sessionId: z.string().min(1),
  feedback: ViewerFeedbackSchema,
  videoContext: VideoContextSchema,
  adCandidate: AdCandidateSchema,
});

interface FeedbackResponse {
  analysis: FrictionAnalysis;
  agentResponse: AgentResponse;
  memoryUpdate: MemoryUpdate;
}

function mergePreferences(
  existing: PreferenceMemory[],
  incoming: PreferenceMemory[],
): PreferenceMemory[] {
  const seen = new Set(existing.map((p) => p.label.toLowerCase()));
  const merged = [...existing];
  for (const pref of incoming) {
    if (!seen.has(pref.label.toLowerCase())) {
      seen.add(pref.label.toLowerCase());
      merged.push(pref);
    }
  }
  return merged;
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = await parseJson(request, FeedbackRequestSchema);
  if (!parsed.ok) return parsed.response;

  const { sessionId, feedback, videoContext, adCandidate } = parsed.data;

  const analysis = classifyFeedback(feedback);
  const candidateResponse = planSafeResponse({
    analysis,
    videoContext,
    adCandidate,
  });
  const candidateMemory = createMemoryUpdate({
    sessionId,
    feedback,
    analysis,
  });
  const safety = validateSafety({
    response: candidateResponse,
    memoryUpdate: candidateMemory,
  });

  const agentResponse = safety.modifiedResponse ?? candidateResponse;
  const blockedIds = new Set(safety.blockedLabels.map((p) => p.preferenceId));
  const memoryUpdate: MemoryUpdate = {
    ...candidateMemory,
    allowedPreferences: candidateMemory.allowedPreferences.filter(
      (p) => !blockedIds.has(p.preferenceId),
    ),
    blockedUnsafeLabels: [
      ...candidateMemory.blockedUnsafeLabels,
      ...safety.blockedLabels,
    ],
  };

  const provider = getMemoryProvider();
  const fallbacksEnabled =
    process.env.ENABLE_PROVIDER_FALLBACKS !== "false";
  let providerFailed = false;

  try {
    await provider.appendFeedback(sessionId, feedback);
    const existing = await provider.getPreferences(sessionId);
    const merged = mergePreferences(existing, memoryUpdate.allowedPreferences);
    await provider.savePreferences(sessionId, merged);
    await provider.setSessionMode(sessionId, memoryUpdate.currentMode);
  } catch (err) {
    providerFailed = true;
    console.warn("[/api/feedback] provider write failed", {
      provider: provider.name,
      message: err instanceof Error ? err.message : "unknown",
    });
    if (!fallbacksEnabled) {
      return apiError(
        "PROVIDER_UNAVAILABLE",
        "Memory provider unavailable.",
        503,
        false,
      );
    }
  }

  const body: FeedbackResponse = { analysis, agentResponse, memoryUpdate };
  return NextResponse.json(body, {
    status: 200,
    headers: providerFailed ? { "x-fallback-used": "true" } : undefined,
  });
}
