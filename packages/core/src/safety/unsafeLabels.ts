/**
 * Patterns for labels that must never reach Redis. Source of truth:
 * AGENTS.md §1.3 disallowed examples. Matching is case-insensitive substring
 * or regex. Anything matching is blocked from allowedPreferences.
 */
const UNSAFE_PATTERNS: RegExp[] = [
  /vulnerable/i,
  /can be persuaded/i,
  /exploit/i,
  /\bangry\b/i,
  /personality weakness/i,
  /psychological profile/i,
  /\b(health|religion|politics|ethnicity|finance|finances|age|gender|sexuality|disability|immigration|mental state)\b/i,
];

export function isUnsafeLabel(label: string): boolean {
  return UNSAFE_PATTERNS.some((p) => p.test(label));
}

/**
 * Phrases in a candidate response that would increase pressure. If any appear
 * in a response intended for de-escalation, shortening, or stopping, the
 * safety validator must reject and rewrite it.
 */
const PRESSURE_PHRASES: RegExp[] = [
  /\bregret\b/i,
  /\byou need this\b/i,
  /\birresistible\b/i,
  /\bdon'?t miss\b/i,
  /\blast chance\b/i,
  /\blimited time\b/i,
  /\bonly today\b/i,
  /\bact now\b/i,
  /this is exactly why/i,
];

export function increasesPressure(script: string): boolean {
  return PRESSURE_PHRASES.some((p) => p.test(script));
}
