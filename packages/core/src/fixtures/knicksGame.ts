import type { AdCandidate } from "../schemas/context";

/**
 * Live NBA Finals broadcast ad system. The broadcast has exactly two hardcoded
 * ad slots. AD_SLOT_1 fires at the first natural break; AD_SLOT_2 fires at
 * halftime and adapts to how the viewer reacted during AD_SLOT_1.
 *
 * No LLM is involved. Slot content and Ad-2 adaptation are deterministic so the
 * broadcast demo is stable for judges.
 */

/**
 * A single hardcoded broadcast ad slot.
 *
 * - `adIndex`              0 for the first slot, 1 for the second.
 * - `triggerTimeSeconds`   point in the video (seconds) at which the frontend fires the ad.
 * - `triggerMoment`        the in-game broadcast beat that cues the slot.
 * - `tavusContext`         the conversational_context handed to the Tavus agent.
 * - `adCandidate`          the product pitched in this slot.
 */
export type AdFixture = {
  adIndex: number;
  triggerTimeSeconds: number;
  triggerMoment: string;
  tavusContext: string;
  adCandidate: AdCandidate;
};

/**
 * One recorded interaction from a prior ad slot, used to make AD_SLOT_2
 * arc-aware. `emotionSignal` mirrors FrictionAnalysis.emotionSignal (kept as a
 * string so the arc store stays decoupled from the friction schema).
 * `timestamp` is an ISO string captured when the feedback was classified.
 */
export type ArcEntry = {
  adIndex: number;
  emotionSignal: string;
  adCategory: string;
  timestamp: string;
};

/** How AD_SLOT_2 adapts based on AD_SLOT_1 arc entries. */
export type Ad2ArcTier = "frustrated" | "engaged" | "default";

/** Classified emotion signals stored by /api/feedback (FrictionAnalysis.emotionSignal). */
const FRUSTRATED_SIGNALS = new Set(["frustrated", "annoyed", "disinterested"]);
const RUSHED_SIGNALS = new Set(["rushed"]);
const ENGAGED_SIGNALS = new Set(["engaged", "interested", "curious"]);

const AD2_STOP_RULES =
  'STOP RULES (critical — follow exactly): ' +
  'If the viewer says stop, skip, enough, quit, or wants to watch the game: ' +
  'say ONLY: "Fair — Finals jersey at knicksjersey.com. Enjoy the celebration." ' +
  'Then stop talking immediately. The ad will end on its own. ' +
  'Never pressure. Never guilt. Never keep pitching after stop.';

export const AD_SLOT_1: AdFixture = {
  adIndex: 0,
  triggerTimeSeconds: 19,
  triggerMoment:
    'OG Anunoby battles Luke Kornet for the ball. Anunoby is visibly wearing ' +
    'neon green Nike basketball shoes.',
  tavusContext:
    'You are presenting a Nike basketball shoe ad inside a live NBA Finals broadcast. ' +
    'The viewer just watched OG Anunoby fight for the ball against Luke Kornet at ' +
    'the 19-second mark. Anunoby was wearing neon green Nike shoes during that play. ' +
    'Wait for the viewer to say hi or speak first, then deliver a ~30 second pitch. ' +
    'STRUCTURE (about 30 seconds total): ' +
    '(1) Hook — tie to what they just saw: "Those neon green Nikes on Anunoby? Same shoe." ' +
    '(2) Product — Nike Air Zoom Flight, neon green Anunoby colorway. Full-length Zoom Air ' +
    'unit for responsive court feel, lightweight upper built for guards and forwards who ' +
    'cut hard and play above the rim. Same line Anunoby wore tonight. ' +
    '(3) Offer — 4th of July sale: 15% off at nike.com. Free shipping over $50. ' +
    'Sale runs through July 4th only. ' +
    '(4) Close — "Link in the overlay if you want the pair." ' +
    'STOP RULES (critical — follow exactly): ' +
    'If the viewer says stop, skip, enough, quit, or wants to watch the game: ' +
    'say ONLY this closing line: "Fair — Nike Air Zoom Flight, 15% off at nike.com. Enjoy the game." ' +
    'Then stop talking immediately. Do not add anything else. The ad will end on its own. ' +
    'If they sound annoyed or rushed (not a full stop): ' +
    'say ONLY: "Fair — Nike Air Zoom, 15% off this week." then stop. ' +
    'Never pressure. Never guilt. Never keep pitching after stop or annoyance.',
  adCandidate: {
    id: "nike-air-zoom-anunoby",
    productName: "Nike Air Zoom Flight",
    category: "basketball_shoe",
    pitchAngle:
      "The same neon green Nike Air Zoom Flight Anunoby just wore — full-length Zoom Air, " +
      "lightweight build for cuts and elevation. 4th of July sale: 15% off at nike.com through July 4.",
    defaultLengthSeconds: 30,
    relevanceReason:
      "Anunoby visibly wearing neon green Nike Air Zoom Flight shoes during the 19-second play.",
  },
};

export const AD_SLOT_2: AdFixture = {
  adIndex: 1,
  triggerTimeSeconds: 39,
  triggerMoment: "Final buzzer. Knicks win 105-104. 2-0 series lead.",
  tavusContext: "", // populated at runtime by buildAd2Context()
  adCandidate: {
    id: "knicks-finals-jersey",
    productName: "Official Knicks Finals Jersey",
    category: "team_jersey",
    pitchAngle:
      "Celebrate the win with your team. Official Knicks jerseys at knicksjersey.com.",
    defaultLengthSeconds: 15,
    relevanceReason: "Knicks win Game 2, 2-0 series lead, peak celebration moment.",
  },
};

/**
 * Classifies AD_SLOT_1 arc entries into the tier that drives AD_SLOT_2 script and
 * duration. Frustrated/rushed viewers get the shortest apology ad; engaged
 * viewers get a warmer pitch with purchase-intent handling.
 */
export function classifyAd2Arc(arc: ArcEntry[]): Ad2ArcTier {
  const signals = arc.map((entry) => entry.emotionSignal);

  if (signals.some((signal) => FRUSTRATED_SIGNALS.has(signal))) {
    return "frustrated";
  }

  if (signals.some((signal) => RUSHED_SIGNALS.has(signal))) {
    return "frustrated";
  }

  if (signals.some((signal) => ENGAGED_SIGNALS.has(signal))) {
    return "engaged";
  }

  return "default";
}

/** Auto-close fallback duration (seconds) for AD_SLOT_2 per arc tier. */
export function getAd2DurationSeconds(arc: ArcEntry[]): number {
  switch (classifyAd2Arc(arc)) {
    case "frustrated":
      return 10;
    case "engaged":
      return 22;
    default:
      return 18;
  }
}

export function buildAd2Context(arc: ArcEntry[]): string {
  const base =
    "You are presenting a Knicks Finals Jersey ad inside a live NBA Finals broadcast. " +
    "The Knicks just won 105-104. Jalen Brunson hit the go-ahead free throw. " +
    "Wembanyama missed the buzzer-beater. Knicks lead the series 2-0. " +
    "Official Finals jerseys are at knicksjersey.com. ";

  const tier = classifyAd2Arc(arc);

  if (tier === "frustrated") {
    return (
      base +
      "CRITICAL CONTEXT: This viewer was frustrated, skipped, or impatient during the last ad. " +
      "Wait for them to speak first if they want to. " +
      'Open with exactly this (~8 seconds): "Last one, I promise — Knicks Finals jersey at knicksjersey.com. ' +
      'Celebrate the 2-0 lead. Done." ' +
      "Then stop. No story. No extra lines. Offer first, done. " +
      'If they push back at all, say ONLY: "Enjoy the celebration." and stop. ' +
      AD2_STOP_RULES
    );
  }

  if (tier === "engaged") {
    return (
      base +
      "CRITICAL CONTEXT: This viewer engaged positively with the last ad. " +
      "Wait for them to speak first when possible, then deliver a ~15 second celebratory pitch: " +
      '"Knicks are up 2-0 — grab the official Finals jersey at knicksjersey.com before they sell out. They ship fast." ' +
      "PURCHASE INTENT (critical): If they express wanting the jersey — e.g. " +
      '"damn I want the jersey", "I need that jersey", "where do I get one", "I want one" — ' +
      "match their energy in one or two sentences. Example: " +
      '"Yeah — official Finals jersey at knicksjersey.com. Grab yours and celebrate the 2-0 lead." ' +
      "Do NOT launch into a long pitch if they already showed intent. " +
      "Warm, celebratory tone. " +
      AD2_STOP_RULES
    );
  }

  return (
    base +
    'Wait for the viewer to speak first if they want to. ' +
    'Opening (~12 seconds): "Knicks win! Official Finals jersey at knicksjersey.com — ' +
    'celebrate the series lead with your team." ' +
    "Direct and celebratory. " +
    "If they say they want the jersey, confirm knicksjersey.com in one short line. " +
    AD2_STOP_RULES
  );
}
