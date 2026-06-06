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
    id: 'nike-air-zoom-anunoby',
    productName: 'Nike Air Zoom Flight',
    category: 'basketball_shoe',
    pitchAngle:
      'The same neon green Nike Air Zoom Flight Anunoby just wore — full-length Zoom Air, ' +
      'lightweight build for cuts and elevation. 4th of July sale: 15% off at nike.com through July 4.',
    defaultLengthSeconds: 30,
    relevanceReason:
      'Anunoby visibly wearing neon green Nike Air Zoom Flight shoes during the 19-second play.',
  },
};

export const AD_SLOT_2: AdFixture = {
  adIndex: 1,
  triggerTimeSeconds: 39,
  triggerMoment: 'Final buzzer. Knicks win 105-104. 2-0 series lead.',
  tavusContext: '', // populated at runtime by buildAd2Context()
  adCandidate: {
    id: 'knicks-finals-jersey',
    productName: 'Official Knicks Finals Jersey',
    category: 'team_jersey',
    pitchAngle:
      'Celebrate the win with your team. Official Knicks jerseys at knicksjersey.com.',
    defaultLengthSeconds: 12,
    relevanceReason: 'Knicks win Game 2, 2-0 series lead, peak celebration moment.',
  },
};

export function buildAd2Context(arc: ArcEntry[]): string {
  const base =
    'You are presenting a Knicks Finals Jersey ad inside a live NBA Finals broadcast. ' +
    'The Knicks just won 105-104. Jalen Brunson hit the go-ahead free throw. ' +
    'Wembanyama missed the buzzer-beater. Knicks lead the series 2-0. ' +
    'The jersey is available at knicksjersey.com. ';

  const wasFrustrated = arc.some(
    (e) => e.emotionSignal === 'frustrated' || e.emotionSignal === 'annoyed',
  );
  const wasRushed = arc.some((e) => e.emotionSignal === 'tell_me_quickly');
  const wasEngaged = arc.some((e) => e.emotionSignal === 'interested');

  if (wasFrustrated || wasRushed) {
    return (
      base +
      'CRITICAL CONTEXT: This viewer was frustrated or impatient during the last ad. ' +
      'Open with exactly this: "Last one, I promise - Knicks jersey at knicksjersey.com. ' +
      'Celebrate the 2-0 lead. Done." ' +
      'Then stop. 8 seconds maximum. No story. Offer first, done. ' +
      'If they push back at all, say "Enjoy the celebration." and stop.'
    );
  }

  if (wasEngaged) {
    return (
      base +
      'The viewer engaged positively with the last ad. ' +
      'Opening: "Knicks are up 2-0 and heading to the Garden. ' +
      'Grab your official Finals jersey at knicksjersey.com before they sell out. ' +
      'They ship fast." ' +
      '15 seconds. Warm, celebratory tone. ' +
      'If they push back, acknowledge and stop.'
    );
  }

  return (
    base +
    'Opening: "Knicks win! Official Finals jersey at knicksjersey.com - ' +
    'celebrate the series lead with your team." ' +
    '12 seconds. Direct and celebratory. ' +
    'If the viewer pushes back, acknowledge once and stop immediately.'
  );
}
