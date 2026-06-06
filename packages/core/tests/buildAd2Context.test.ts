import { describe, expect, it } from "vitest";
import {
  buildAd2Context,
  classifyAd2Arc,
  getAd2DurationSeconds,
  type ArcEntry,
} from "../src/fixtures/knicksGame";

function arc(emotionSignal: string): ArcEntry[] {
  return [
    {
      adIndex: 0,
      emotionSignal,
      adCategory: "basketball_shoe",
      timestamp: new Date().toISOString(),
    },
  ];
}

describe("classifyAd2Arc", () => {
  it("maps annoyed/frustrated to frustrated tier", () => {
    expect(classifyAd2Arc(arc("frustrated"))).toBe("frustrated");
    expect(classifyAd2Arc(arc("annoyed"))).toBe("frustrated");
  });

  it("maps skip/disinterested to frustrated tier", () => {
    expect(classifyAd2Arc(arc("disinterested"))).toBe("frustrated");
  });

  it("maps rushed to frustrated tier (short ad)", () => {
    expect(classifyAd2Arc(arc("rushed"))).toBe("frustrated");
  });

  it("maps engaged and interested to engaged tier", () => {
    expect(classifyAd2Arc(arc("engaged"))).toBe("engaged");
    expect(classifyAd2Arc(arc("interested"))).toBe("engaged");
    expect(classifyAd2Arc(arc("curious"))).toBe("engaged");
  });

  it("returns default with no arc", () => {
    expect(classifyAd2Arc([])).toBe("default");
    expect(classifyAd2Arc(arc("neutral"))).toBe("default");
  });
});

describe("buildAd2Context", () => {
  it("frustrated arc uses Last one, I promise opening", () => {
    const script = buildAd2Context(arc("frustrated"));
    expect(script).toContain("Last one, I promise");
    expect(script).toContain("knicksjersey.com");
  });

  it("engaged arc handles purchase intent", () => {
    const script = buildAd2Context(arc("engaged"));
    expect(script).toContain("damn I want the jersey");
    expect(script).toContain("knicksjersey.com");
  });

  it("rushed arc uses short frustrated script", () => {
    const script = buildAd2Context(arc("rushed"));
    expect(script).toContain("Last one, I promise");
  });
});

describe("getAd2DurationSeconds", () => {
  it("returns tier-appropriate fallback durations", () => {
    expect(getAd2DurationSeconds(arc("frustrated"))).toBe(10);
    expect(getAd2DurationSeconds(arc("engaged"))).toBe(22);
    expect(getAd2DurationSeconds([])).toBe(18);
  });
});
