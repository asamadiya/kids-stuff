// Pure typed logic for the "How Many Groups?" mini-game.
// Division seen as grouping: total items shared into equal-sized groups.
// No React here — just data + deterministic pure helpers.

export const HOW_MANY_GROUPS_META = {
  id: 'how-many-groups',
  title: 'How Many Groups?',
  icon: '➗',
  color: 'aqua',
  tagline: 'Twelve socks in pairs. Division as counting the groups.',
} as const;

export interface GroupRound {
  /** Emoji shown for each item in the stage. */
  readonly item: string;
  /** Total number of items. */
  readonly total: number;
  /** How many items go in each group. */
  readonly per: number;
  /** Word for one group ("pair", "box", "bag"). */
  readonly groupWord: string;
  /** Plural word for groups ("pairs", "boxes", "bags"). */
  readonly groupWordPlural: string;
  /** Short story prompt shown to the child. */
  readonly prompt: string;
}

// total / per is always exact (no remainder) for every round.
export const GROUP_ROUNDS: readonly GroupRound[] = [
  { item: '🧦', total: 12, per: 2, groupWord: 'pair', groupWordPlural: 'pairs', prompt: '12 socks. Put 2 in each pair. How many pairs?' },
  { item: '🍪', total: 6, per: 3, groupWord: 'plate', groupWordPlural: 'plates', prompt: '6 cookies. Put 3 on each plate. How many plates?' },
  { item: '🍎', total: 10, per: 5, groupWord: 'bag', groupWordPlural: 'bags', prompt: '10 apples. Put 5 in each bag. How many bags?' },
  { item: '🦋', total: 8, per: 4, groupWord: 'jar', groupWordPlural: 'jars', prompt: '8 butterflies. Put 4 in each jar. How many jars?' },
  { item: '🍓', total: 9, per: 3, groupWord: 'bowl', groupWordPlural: 'bowls', prompt: '9 strawberries. Put 3 in each bowl. How many bowls?' },
  { item: '⭐', total: 15, per: 5, groupWord: 'row', groupWordPlural: 'rows', prompt: '15 stars. Put 5 in each row. How many rows?' },
  { item: '🍌', total: 12, per: 3, groupWord: 'bunch', groupWordPlural: 'bunches', prompt: '12 bananas. Put 3 in each bunch. How many bunches?' },
  { item: '🥚', total: 8, per: 2, groupWord: 'carton', groupWordPlural: 'cartons', prompt: '8 eggs. Put 2 in each carton. How many cartons?' },
  { item: '🎸', total: 12, per: 6, groupWord: 'band', groupWordPlural: 'bands', prompt: '12 guitars. Put 6 in each band. How many bands?' },
  { item: '🔴', total: 16, per: 4, groupWord: 'box', groupWordPlural: 'boxes', prompt: '16 balls. Put 4 in each box. How many boxes?' },
  { item: '🍇', total: 14, per: 7, groupWord: 'basket', groupWordPlural: 'baskets', prompt: '14 grapes. Put 7 in each basket. How many baskets?' },
  { item: '🧮', total: 18, per: 6, groupWord: 'shelf', groupWordPlural: 'shelves', prompt: '18 blocks. Put 6 on each shelf. How many shelves?' },
  { item: '🍩', total: 20, per: 5, groupWord: 'plate', groupWordPlural: 'plates', prompt: '20 donuts. Put 5 on each plate. How many plates?' },
  { item: '🐟', total: 10, per: 2, groupWord: 'tank', groupWordPlural: 'tanks', prompt: '10 fish. Put 2 in each tank. How many tanks?' },
];

export const GROUP_OPTION_COUNT = 4;

/** Correct answer for a round: number of equal groups. */
export function groupAnswer(round: GroupRound): number {
  return round.total / round.per;
}

/**
 * Deterministic option list for a round. Always length GROUP_OPTION_COUNT,
 * always includes the correct answer, always positive distinct integers,
 * ordered ascending so equal inputs render identically.
 */
export function getGroupOptions(index: number): number[] {
  const round = GROUP_ROUNDS[index % GROUP_ROUNDS.length];
  const answer = groupAnswer(round);
  const opts = new Set<number>([answer]);
  // Deterministic nearby distractors: off-by-one and simple confusions
  // (e.g. the "per" value, or answer +/- small deltas). Keep all positive.
  const candidates = [answer - 1, answer + 1, answer + 2, round.per, answer - 2, answer + 3];
  for (const c of candidates) {
    if (opts.size >= GROUP_OPTION_COUNT) break;
    if (c > 0 && c !== answer) opts.add(c);
  }
  // Backfill if still short (small answers) with ascending fillers.
  let filler = 1;
  while (opts.size < GROUP_OPTION_COUNT) {
    if (filler !== answer) opts.add(filler);
    filler += 1;
  }
  return Array.from(opts).sort((a, b) => a - b);
}

/** Warm, never-negative feedback for any choice. */
export function getGroupFeedback(round: GroupRound, selected: number): string {
  const answer = groupAnswer(round);
  const plural = answer === 1 ? round.groupWord : round.groupWordPlural;
  if (selected === answer) {
    return `Yes! ${round.total} shared ${round.per} at a time makes ${answer} ${plural}. ➗`;
  }
  return `Good thinking! Count by ${round.per}s: it takes ${answer} ${plural} to hold all ${round.total}. That's why the answer is ${answer}.`;
}

/** Label shown on an option button. */
export function groupOptionLabel(value: number): string {
  return String(value);
}
