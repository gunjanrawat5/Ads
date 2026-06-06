import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  _resetMemoryProvider,
  getMemoryProvider,
} from "../src/redis";

const KEYS = [
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "NEXT_PUBLIC_REDIS_ENABLED",
] as const;

describe("getMemoryProvider", () => {
  const original: Partial<Record<(typeof KEYS)[number], string>> = {};

  beforeEach(() => {
    for (const key of KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
    _resetMemoryProvider();
  });

  afterEach(() => {
    for (const key of KEYS) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
    _resetMemoryProvider();
  });

  it("falls back to InMemoryProvider when UPSTASH env vars are unset", () => {
    const provider = getMemoryProvider();
    expect(provider.name).toBe("memory");
  });

  it("falls back to InMemoryProvider when NEXT_PUBLIC_REDIS_ENABLED is not 'true' even if creds present", () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "fake-token";
    process.env.NEXT_PUBLIC_REDIS_ENABLED = "false";
    const provider = getMemoryProvider();
    expect(provider.name).toBe("memory");
  });

  it("returns the same instance across calls (singleton)", () => {
    const a = getMemoryProvider();
    const b = getMemoryProvider();
    expect(a).toBe(b);
  });
});
