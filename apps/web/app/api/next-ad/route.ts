import { NextResponse } from "next/server";
import { z } from "zod";
import {
  PreferenceMemorySchema,
  VideoContextSchema,
  selectNextAd,
  type NextAdDecision,
} from "@ads/core";
import { getMemoryProvider } from "@ads/integrations";
import { apiError, parseJson } from "../_lib/http";

const NextAdRequestSchema = z.object({
  sessionId: z.string().min(1),
  videoContext: VideoContextSchema,
  preferences: z.array(PreferenceMemorySchema).optional(),
});

interface NextAdResponseBody {
  decision: NextAdDecision;
}

export async function POST(request: Request): Promise<NextResponse> {
  const parsed = await parseJson(request, NextAdRequestSchema);
  if (!parsed.ok) return parsed.response;

  const { sessionId, videoContext } = parsed.data;
  const provider = getMemoryProvider();
  const fallbacksEnabled =
    process.env.ENABLE_PROVIDER_FALLBACKS !== "false";

  // Prefer server-side preferences over client-provided ones to avoid trusting
  // unverified client memory. Fall back to client-provided preferences only if
  // the provider read fails AND fallbacks are enabled.
  let preferences = parsed.data.preferences ?? [];
  let providerFailed = false;
  try {
    preferences = await provider.getPreferences(sessionId);
  } catch (err) {
    providerFailed = true;
    console.warn("[/api/next-ad] provider read failed", {
      provider: provider.name,
      message: err instanceof Error ? err.message : "unknown",
    });
    if (!fallbacksEnabled) {
      return apiError("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
    }
  }

  const decision = selectNextAd({ sessionId, videoContext, preferences });

  try {
    await provider.saveNextAdDecision(sessionId, decision);
  } catch (err) {
    providerFailed = true;
    console.warn("[/api/next-ad] provider write failed", {
      provider: provider.name,
      message: err instanceof Error ? err.message : "unknown",
    });
    if (!fallbacksEnabled) {
      return apiError("PROVIDER_UNAVAILABLE", "Memory provider unavailable.", 503);
    }
  }

  const body: NextAdResponseBody = { decision };
  return NextResponse.json(body, {
    headers: providerFailed ? { "x-fallback-used": "true" } : undefined,
  });
}
