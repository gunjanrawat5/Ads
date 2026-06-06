import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  _resetAgentMemoryProvider,
  getAgentMemoryProvider,
} from "../src/redis";

const KEYS = [
  "REDIS_AGENT_MEMORY_URL",
  "REDIS_AGENT_MEMORY_TOKEN",
  "NEXT_PUBLIC_REDIS_ENABLED",
] as const;

describe("getAgentMemoryProvider", () => {
  const original: Partial<Record<(typeof KEYS)[number], string>> = {};

  beforeEach(() => {
    for (const key of KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
    _resetAgentMemoryProvider();
  });

  afterEach(() => {
    for (const key of KEYS) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
    _resetAgentMemoryProvider();
  });

  it("falls back to InMemoryProvider when REDIS_AGENT_MEMORY_URL is unset", () => {
    const provider = getAgentMemoryProvider();
    expect(provider.name).toBe("memory");
  });

  it("falls back to InMemoryProvider when NEXT_PUBLIC_REDIS_ENABLED is not 'true' even if URL present", () => {
    process.env.REDIS_AGENT_MEMORY_URL = "http://localhost:8000";
    process.env.NEXT_PUBLIC_REDIS_ENABLED = "false";
    const provider = getAgentMemoryProvider();
    expect(provider.name).toBe("memory");
  });

  it("returns AgentMemoryProvider when URL is set and NEXT_PUBLIC_REDIS_ENABLED is 'true'", () => {
    process.env.REDIS_AGENT_MEMORY_URL = "http://localhost:8000";
    process.env.NEXT_PUBLIC_REDIS_ENABLED = "true";
    const provider = getAgentMemoryProvider();
    expect(provider.name).toBe("redis_agent_memory");
  });

  it("returns the same instance across calls (singleton)", () => {
    const a = getAgentMemoryProvider();
    const b = getAgentMemoryProvider();
    expect(a).toBe(b);
  });
});
