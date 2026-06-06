import { NextResponse } from "next/server";
import { ZodError, type ZodSchema } from "zod";

export type ApiErrorCode =
  | "PROVIDER_UNAVAILABLE"
  | "VALIDATION_ERROR"
  | "SAFETY_BLOCKED"
  | "UNKNOWN";

export interface ApiError {
  ok: false;
  code: ApiErrorCode;
  message: string;
  fallbackUsed: boolean;
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  fallbackUsed = false,
): NextResponse<ApiError> {
  return NextResponse.json<ApiError>(
    { ok: false, code, message, fallbackUsed },
    { status },
  );
}

export async function parseJson<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse<ApiError> }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: apiError("VALIDATION_ERROR", "Request body is not valid JSON.", 400),
    };
  }
  try {
    const data = schema.parse(raw);
    return { ok: true, data };
  } catch (err) {
    const message =
      err instanceof ZodError
        ? err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")
        : "Invalid request shape.";
    return {
      ok: false,
      response: apiError("VALIDATION_ERROR", message, 400),
    };
  }
}

export function getSessionId(request: Request): string | null {
  return new URL(request.url).searchParams.get("sessionId");
}
