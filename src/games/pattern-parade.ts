export const PATTERN_PARADE_META = {
  id: 'pattern-parade',
  title: 'Patterns',
  icon: '◇○',
  color: 'berry',
  tagline: 'A sequence repeats. Work out what comes next.',
} as const;

export type PatternType = 'AB' | 'AABB' | 'ABC' | 'AAB' | 'ABB';

export interface PatternRound {
  readonly id: string;
  /** The visible items shown before the mystery slot (the parade so far). */
  readonly sequence: readonly string[];
  /** The item that correctly comes next. */
  readonly answer: string;
  /** Wrong-but-friendly candidate items (all also appear in the pattern). */
  readonly distractors: readonly string[];
  /** Which repeating structure this round teaches. */
  readonly type: PatternType;
}

export const PATTERN_ROUNDS: readonly PatternRound[] = [
  {
    id: 'ab-tri-circle',
    type: 'AB',
    sequence: ['🔺', '🟢', '🔺', '🟢', '🔺'],
    answer: '🟢',
    distractors: ['🔺', '🟦'],
  },
  {
    id: 'ab-sun-moon',
    type: 'AB',
    sequence: ['☀️', '🌙', '☀️', '🌙'],
    answer: '☀️',
    distractors: ['🌙', '⭐'],
  },
  {
    id: 'ab-cat-dog',
    type: 'AB',
    sequence: ['🐱', '🐶', '🐱', '🐶', '🐱'],
    answer: '🐶',
    distractors: ['🐱', '🐰'],
  },
  {
    id: 'aabb-red-blue',
    type: 'AABB',
    sequence: ['🔴', '🔴', '🔵', '🔵', '🔴', '🔴', '🔵'],
    answer: '🔵',
    distractors: ['🔴', '🟡'],
  },
  {
    id: 'aabb-star-heart',
    type: 'AABB',
    sequence: ['⭐', '⭐', '❤️', '❤️', '⭐'],
    answer: '⭐',
    distractors: ['❤️', '💚'],
  },
  {
    id: 'aabb-apple-banana',
    type: 'AABB',
    sequence: ['🍎', '🍎', '🍌', '🍌', '🍎', '🍎'],
    answer: '🍌',
    distractors: ['🍎', '🍇'],
  },
  {
    id: 'abc-shapes',
    type: 'ABC',
    sequence: ['🔺', '🟦', '🟡', '🔺', '🟦'],
    answer: '🟡',
    distractors: ['🔺', '🟦'],
  },
  {
    id: 'abc-fruit',
    type: 'ABC',
    sequence: ['🍓', '🍊', '🍇', '🍓', '🍊'],
    answer: '🍇',
    distractors: ['🍓', '🍊'],
  },
  {
    id: 'abc-animals',
    type: 'ABC',
    sequence: ['🐸', '🐢', '🐟', '🐸', '🐢', '🐟', '🐸'],
    answer: '🐢',
    distractors: ['🐟', '🐸'],
  },
  {
    id: 'aab-duck-frog',
    type: 'AAB',
    sequence: ['🦆', '🦆', '🐸', '🦆', '🦆'],
    answer: '🐸',
    distractors: ['🦆', '🐢'],
  },
  {
    id: 'aab-flowers',
    type: 'AAB',
    sequence: ['🌻', '🌻', '🌷', '🌻', '🌻', '🌷', '🌻'],
    answer: '🌻',
    distractors: ['🌷', '🌸'],
  },
  {
    id: 'abb-truck-car',
    type: 'ABB',
    sequence: ['🚛', '🚗', '🚗', '🚛', '🚗'],
    answer: '🚗',
    distractors: ['🚛', '🚕'],
  },
  {
    id: 'abb-balloons',
    type: 'ABB',
    sequence: ['🎈', '🎉', '🎉', '🎈', '🎉', '🎉', '🎈'],
    answer: '🎉',
    distractors: ['🎈', '🎊'],
  },
];

const TYPE_LENGTH: Record<PatternType, number> = {
  AB: 2,
  AABB: 4,
  ABC: 3,
  AAB: 3,
  ABB: 3,
};

/** Human-friendly name of the repeating unit, e.g. "A-B". */
export function patternTypeLabel(type: PatternType): string {
  return type.split('').join('-');
}

/**
 * Deterministic option list for a round: always the correct answer plus its
 * distractors, ordered so the correct answer's slot rotates by round index.
 * Always returns a stable length of 3.
 */
export function getPatternOptions(index: number): readonly string[] {
  const round = PATTERN_ROUNDS[index % PATTERN_ROUNDS.length];
  const pool = [round.answer, ...round.distractors];
  const size = 3;
  const opts = pool.slice(0, size);
  const rotate = index % size;
  return [...opts.slice(rotate), ...opts.slice(0, rotate)];
}

/** Warm, concrete feedback for ANY chosen item. */
export function getPatternFeedback(round: PatternRound, selected: string): string {
  const unit = patternTypeLabel(round.type);
  const repeatLen = TYPE_LENGTH[round.type];
  const start = round.sequence.slice(0, repeatLen).join(' ');
  if (selected === round.answer) {
    return `Yes! It is a ${unit} pattern that goes ${start} again and again, so ${round.answer} comes next.`;
  }
  return `Nice looking! You spotted ${selected}. This is a ${unit} pattern — it keeps going ${start}, so ${round.answer} marches in next.`;
}
