import { placeOptions } from './options';
export const GROUPS_OF_META = {
  id: 'groups-of',
  title: 'Equal Groups',
  icon: '✖',
  color: 'leaf',
  tagline: 'Three baskets of four. Equal groups are what multiplication counts.',
} as const;

export interface GroupsRound {
  /** number of groups */
  groups: number;
  /** items per group */
  per: number;
  /** emoji shown in each slot */
  emoji: string;
  /** friendly word for one container, e.g. 'basket' */
  unit: string;
}

/** The correct product for a round. */
export function productOf(round: GroupsRound): number {
  return round.groups * round.per;
}

/** Human question, e.g. "3 groups of 4 — how many in all?" */
export function questionOf(round: GroupsRound): string {
  return `${round.groups} groups of ${round.per} — how many in all?`;
}

/** 14 rounds, every product <= 30. */
export const GROUPS_ROUNDS: readonly GroupsRound[] = [
  { groups: 3, per: 4, emoji: '🍎', unit: 'basket' },
  { groups: 2, per: 5, emoji: '🌰', unit: 'plate' },
  { groups: 4, per: 3, emoji: '🟦', unit: 'box' },
  { groups: 5, per: 2, emoji: '🧦', unit: 'pair' },
  { groups: 3, per: 6, emoji: '🥚', unit: 'carton' },
  { groups: 2, per: 8, emoji: '🖍️', unit: 'cup' },
  { groups: 6, per: 4, emoji: '🍓', unit: 'bowl' },
  { groups: 4, per: 5, emoji: '⭐', unit: 'row' },
  { groups: 5, per: 5, emoji: '🌟', unit: 'jar' },
  { groups: 3, per: 7, emoji: '🍇', unit: 'bunch' },
  { groups: 7, per: 3, emoji: '🥄', unit: 'bag' },
  { groups: 2, per: 9, emoji: '🍉', unit: 'crate' },
  { groups: 6, per: 5, emoji: '🌼', unit: 'vase' },
  { groups: 4, per: 6, emoji: '🥞', unit: 'tray' },
] as const;

const OPTION_COUNT = 4;

/**
 * Deterministic option list of length OPTION_COUNT (4) that always
 * includes the true product. Distractors are near-misses that model
 * common counting slips (off-by-a-group, wrong operation), all positive
 * and distinct, ordered ascending.
 */
export function getGroupsOptions(index: number): number[] {
  const round = GROUPS_ROUNDS[index % GROUPS_ROUNDS.length];
  const answer = productOf(round);

  // Candidate distractors ordered by how tempting they are.
  const candidates = [
    round.groups + round.per, // added instead of multiplied
    answer + round.per, // one extra group
    answer - round.per, // one missing group
    answer + round.groups, // one extra item per group
    answer - round.groups, // one missing item per group
    answer + 1,
    answer - 1,
    answer + 2,
  ];

  const opts: number[] = [answer];
  for (const c of candidates) {
    if (opts.length >= OPTION_COUNT) break;
    if (c > 0 && !opts.includes(c)) opts.push(c);
  }

  // Guarantee full length even in pathological cases.
  let pad = answer + 3;
  while (opts.length < OPTION_COUNT) {
    if (pad > 0 && !opts.includes(pad)) opts.push(pad);
    pad += 1;
  }

  const [, ...rest] = opts;
  return placeOptions({
    gameId: 'groups-of', roundIndex: index % GROUPS_ROUNDS.length, answer,
    distractors: rest, count: OPTION_COUNT,
  });
}

/** Warm, no-fail feedback for any selection. */
export function getGroupsFeedback(round: GroupsRound, selected: number): string {
  const answer = productOf(round);
  const eq = `${round.groups} × ${round.per} = ${answer}`;
  if (selected === answer) {
    return `Correct. ${round.groups} equal groups of ${round.per} makes ${answer}. That is exactly what ${eq} means.`;
  }
  return `Not quite. Count the equal groups: ${round.groups} groups, ${round.per} in each. Add them up and you get ${answer}, because ${eq}.`;
}

/** Short hint shown before answering. */
export function getGroupsHint(round: GroupsRound): string {
  return `Tip: count one ${round.unit} of ${round.per}, then add a ${round.per} for every group.`;
}
