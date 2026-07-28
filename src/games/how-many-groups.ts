import { NOUNS, VESSELS, counted, type Noun } from './nouns';
import { placeOptions } from './options';

/**
 * How Many Groups? — division seen as grouping.
 *
 * Two things were wrong with the shipped version.
 *
 * The picture already showed the answer. "12 socks. Put 2 in each pair. How
 * many pairs?" was drawn with the pairs *already made*, so the division was
 * pre-solved before the child read the question; all that was left was to count
 * the clusters. Worse, the separation was a `marginLeft` on a flex-wrap row, so
 * at twenty items the row wrapped and the visible clusters stopped matching
 * `per` — the picture then claimed something the arithmetic did not.
 *
 * And every round divided exactly. Fourteen rounds, no remainder anywhere, so
 * "there is some left over" was a case the exercise never once presented.
 *
 * Here the stimulus starts as one undivided heap, the child fills the vessels
 * himself (each filled vessel is a real element holding exactly `per` items,
 * not a margin), and rounds with a remainder are ordinary. `groupAnswer` is the
 * number of FULL vessels, which is the quotient; `groupRemainder` is what is
 * left in the heap.
 */

export const HOW_MANY_GROUPS_META = {
  id: 'how-many-groups',
  title: 'How Many Groups?',
  icon: '➗',
  color: 'aqua',
  tagline: 'Seventeen stones, five to a bucket. Division as counting the groups, and the leftovers.',
} as const;

export interface GroupRound {
  /** What is being counted, from the vetted noun table. */
  readonly item: Noun;
  /** What it is put into, from the vetted vessel table. */
  readonly vessel: Noun;
  /** How many items there are altogether. */
  readonly total: number;
  /** How many items fill one vessel. */
  readonly per: number;
}

/**
 * Ten of these divide exactly and six leave a remainder. The remainder rounds
 * are the reason the exercise exists: the child has to notice that the last few
 * items are real but do not make another full vessel.
 */
export const GROUP_ROUNDS: readonly GroupRound[] = [
  { item: NOUNS.seed, vessel: VESSELS.jar, total: 12, per: 3 },
  { item: NOUNS.shell, vessel: VESSELS.basket, total: 14, per: 4 },
  { item: NOUNS.brick, vessel: VESSELS.box, total: 15, per: 5 },
  { item: NOUNS.egg, vessel: VESSELS.bowl, total: 13, per: 4 },
  { item: NOUNS.spoon, vessel: VESSELS.jar, total: 10, per: 2 },
  { item: NOUNS.stone, vessel: VESSELS.bucket, total: 17, per: 5 },
  { item: NOUNS.carrot, vessel: VESSELS.basket, total: 18, per: 6 },
  { item: NOUNS.key, vessel: VESSELS.box, total: 9, per: 4 },
  { item: NOUNS.leaf, vessel: VESSELS.bowl, total: 20, per: 5 },
  { item: NOUNS.feather, vessel: VESSELS.jar, total: 11, per: 3 },
  { item: NOUNS.chestnut, vessel: VESSELS.basket, total: 16, per: 4 },
  { item: NOUNS.bolt, vessel: VESSELS.box, total: 19, per: 6 },
  { item: NOUNS.candle, vessel: VESSELS.shelf, total: 12, per: 4 },
  { item: NOUNS.log, vessel: VESSELS.shelf, total: 13, per: 3 },
  { item: NOUNS.sock, vessel: VESSELS.bucket, total: 12, per: 2 },
  { item: NOUNS.ruler, vessel: VESSELS.shelf, total: 15, per: 4 },
];

export const GROUP_OPTION_COUNT = 4;

/** The scored answer: how many vessels are filled right up. */
export function groupAnswer(round: GroupRound): number {
  return Math.floor(round.total / round.per);
}

/** What is left in the heap when no further vessel can be filled. */
export function groupRemainder(round: GroupRound): number {
  return round.total % round.per;
}

/**
 * The question, built from the record. The wording is the same whether or not
 * anything is left over: asking for "full" vessels only on the remainder rounds
 * would be a tell.
 */
export function groupPrompt(round: GroupRound): string {
  return `${counted(round.total, round.item)}. Put ${counted(round.per, round.item)} in each ${
    round.vessel.singular
  }. How many full ${round.vessel.plural}?`;
}

/**
 * Wrong answers, each a misconception with a name.
 *
 * The total is never offered: with more than one item to a vessel it can never
 * be the answer, so it is a dead option — and a dead option turns a
 * one-of-four into a one-of-three.
 *
 * The size of a group is deliberately NOT excluded, even though it is printed
 * in the question. Some rounds divide to exactly that number (11 feathers, 3 to
 * a jar, 3 jars). If `per` could only ever appear as the right answer, then
 * seeing it on a button would be the answer, which is the same defect in a new
 * costume.
 */
export function groupDistractors(round: GroupRound): number[] {
  const answer = groupAnswer(round);
  const left = groupRemainder(round);
  const candidates = [
    answer + 1, // counted the leftovers as one more full vessel
    left, // answered with what was left over instead of what was filled
    answer - 1, // lost the last vessel
    round.total - round.per, // took one group away instead of grouping
    answer + 2,
  ];
  const out: number[] = [];
  for (const c of candidates) {
    if (c > 0 && c !== answer && c !== round.total && !out.includes(c)) out.push(c);
  }
  return out;
}

export function getGroupOptions(index: number): number[] {
  const i = ((index % GROUP_ROUNDS.length) + GROUP_ROUNDS.length) % GROUP_ROUNDS.length;
  const round = GROUP_ROUNDS[i];
  return placeOptions({
    gameId: HOW_MANY_GROUPS_META.id,
    roundIndex: i,
    answer: groupAnswer(round),
    distractors: groupDistractors(round),
    count: GROUP_OPTION_COUNT,
  });
}

/** What is left over, in words. */
export function groupLeftoverLine(round: GroupRound): string {
  const left = groupRemainder(round);
  if (left === 0) return 'Nothing is left over.';
  return `${counted(left, round.item)} left over, too few to fill another ${
    round.vessel.singular
  }.`;
}

export function getGroupFeedback(round: GroupRound, selected: number): string {
  const answer = groupAnswer(round);
  const working = `${counted(round.total, round.item)}, ${round.per} to a ${
    round.vessel.singular
  }, fills ${counted(answer, round.vessel)}.`;
  if (selected === answer) {
    return `Correct. ${working} ${groupLeftoverLine(round)}`;
  }
  return `The answer is ${answer}. ${working} ${groupLeftoverLine(round)}`;
}

/** Label shown on an option button. */
export function groupOptionLabel(value: number): string {
  return String(value);
}
