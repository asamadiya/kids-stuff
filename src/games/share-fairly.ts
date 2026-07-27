import { NOUNS, VESSELS, counted, type Noun } from './nouns';
// Share It Fairly — division as fair sharing (exact division only).
// Pure typed logic module. No React.

export const SHARE_FAIRLY_META = {
  id: 'share-fairly',
  title: 'Sharing Equally',
  icon: '➗',
  color: 'coral',
  tagline: 'Twelve biscuits across four plates. Division as fair sharing.',
} as const;

export interface ShareRound {
  /** Total number of things to share. */
  total: number;
  /** Number of groups (plates) to share across. */
  plates: number;
  /** The thing being shared: glyph and both word forms, from NOUNS. */
  item: Noun;
  /** What it is shared onto: glyph and both word forms, from VESSELS. */
  vessel: Noun;
}

/** total must be exactly divisible by plates for every round. */
export const SHARE_ROUNDS: readonly ShareRound[] = [
  { total: 12, plates: 4, item: NOUNS.seed, vessel: VESSELS.bowl },
  { total: 6, plates: 2, item: NOUNS.shell, vessel: VESSELS.basket },
  { total: 10, plates: 5, item: NOUNS.stone, vessel: VESSELS.bucket },
  { total: 8, plates: 2, item: NOUNS.brick, vessel: VESSELS.box },
  { total: 9, plates: 3, item: NOUNS.spoon, vessel: VESSELS.jar },
  { total: 15, plates: 3, item: NOUNS.chestnut, vessel: VESSELS.bowl },
  { total: 12, plates: 3, item: NOUNS.key, vessel: VESSELS.box },
  { total: 16, plates: 4, item: NOUNS.leaf, vessel: VESSELS.basket },
  { total: 14, plates: 2, item: NOUNS.feather, vessel: VESSELS.jar },
  { total: 20, plates: 5, item: NOUNS.bolt, vessel: VESSELS.box },
  { total: 18, plates: 3, item: NOUNS.egg, vessel: VESSELS.basket },
  { total: 21, plates: 3, item: NOUNS.carrot, vessel: VESSELS.bucket },
  { total: 24, plates: 4, item: NOUNS.sock, vessel: VESSELS.shelf },
  { total: 12, plates: 6, item: NOUNS.candle, vessel: VESSELS.shelf },
];

/** The exact fair-share quotient for a round. */
export function shareAnswer(round: ShareRound): number {
  return round.total / round.plates;
}

const OPTION_COUNT = 4;

/**
 * Deterministic option list of length OPTION_COUNT, always including the
 * correct quotient. Distractors are near the answer but never equal to it,
 * and never below 1. Order is deterministic (varies per index) so buttons
 * feel shuffled without randomness.
 */
export function getShareOptions(index: number): number[] {
  const round = SHARE_ROUNDS[index % SHARE_ROUNDS.length];
  const answer = shareAnswer(round);

  const distractors: number[] = [];
  // Candidate wrong answers, in priority order, filtered to be valid & unique.
  const candidates = [answer + 1, answer - 1, answer + 2, answer + 3, answer - 2];
  for (const c of candidates) {
    if (c >= 1 && c !== answer && !distractors.includes(c)) {
      distractors.push(c);
    }
    if (distractors.length === OPTION_COUNT - 1) break;
  }

  const pool = [answer, ...distractors];
  // Deterministic rotation so the answer isn't always first.
  const shift = index % pool.length;
  return [...pool.slice(shift), ...pool.slice(0, shift)];
}

/** Warm, no-fail feedback for any selection. */
export function getShareFeedback(round: ShareRound, selected: number): string {
  const answer = shareAnswer(round);
  const each = `${counted(answer, round.item)} on each ${round.vessel.singular}`;
  if (selected === answer) {
    return `Correct. ${round.total} shared into ${round.plates} equal groups is ${answer} each — every ${round.vessel.singular} gets the same. That's dividing!`;
  }
  return `Not quite. When you share ${counted(round.total, round.item)} fairly across ${counted(round.plates, round.vessel)}, it's ${each}. ${round.plates} groups of ${answer} makes ${round.plates} × ${answer} = ${round.total}.`;
}

/** Short hint shown before answering. */
export function getShareHint(round: ShareRound): string {
  return `Give one ${round.item.singular} to each ${round.vessel.singular}, then go around again until they are gone. Equal piles.`;
}
