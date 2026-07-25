export const COLOR_MATCH_META = {
  id: 'color-match',
  title: 'Color Names',
  icon: '🎨',
  color: 'aqua',
  tagline: 'Naming colours, from a plate of flat washes.',
} as const;

export const COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'brown',
  'black',
  'white',
] as const;

export type Color = (typeof COLORS)[number];

export interface ColorRound {
  readonly id: string;
  readonly color: Color;
  /** Real CSS hex used for the swatch backgroundColor. */
  readonly hex: string;
  /** A concrete, kid-friendly thing that is this color. */
  readonly example: string;
}

export const COLOR_ROUNDS: readonly ColorRound[] = [
  { id: 'red-strawberry', color: 'red', hex: '#e63946', example: 'a strawberry' },
  { id: 'orange-carrot', color: 'orange', hex: '#f4791f', example: 'a carrot' },
  { id: 'yellow-sun', color: 'yellow', hex: '#ffd23f', example: 'the sunshine' },
  { id: 'green-grass', color: 'green', hex: '#2a9d3f', example: 'the grass' },
  { id: 'blue-sky', color: 'blue', hex: '#3a86ff', example: 'the sky' },
  { id: 'purple-grape', color: 'purple', hex: '#8338ec', example: 'a grape' },
  { id: 'pink-flower', color: 'pink', hex: '#ff70a6', example: 'a flower' },
  { id: 'brown-teddy', color: 'brown', hex: '#8b5a2b', example: 'a teddy bear' },
  { id: 'black-night', color: 'black', hex: '#22252a', example: 'the night sky' },
  { id: 'white-cloud', color: 'white', hex: '#f7f7f7', example: 'a fluffy cloud' },
  { id: 'red-apple', color: 'red', hex: '#d62828', example: 'a shiny apple' },
  { id: 'green-frog', color: 'green', hex: '#52b788', example: 'a little frog' },
  { id: 'blue-blueberry', color: 'blue', hex: '#4361ee', example: 'a blueberry' },
  { id: 'yellow-banana', color: 'yellow', hex: '#ffca3a', example: 'a banana' },
];

export function colorLabel(c: Color): string {
  return c[0].toUpperCase() + c.slice(1);
}

/**
 * Deterministic option list for a round. Always includes the correct color,
 * then fills with distinct distractors in a stable rotation. Length is 4
 * whenever possible (10 colors total), so it is stable across all rounds.
 */
export function getColorOptions(roundIndex: number): readonly Color[] {
  const round = COLOR_ROUNDS[roundIndex % COLOR_ROUNDS.length];
  const answer = round.color;
  const options: Color[] = [answer];
  const answerPos = COLORS.indexOf(answer);
  let step = 1;
  while (options.length < 4) {
    const candidate = COLORS[(answerPos + step * 3 + roundIndex) % COLORS.length];
    if (!options.includes(candidate)) {
      options.push(candidate);
    }
    step += 1;
    if (step > COLORS.length) break;
  }
  // Deterministic placement of the answer based on round index.
  const target = roundIndex % options.length;
  const answerIdx = options.indexOf(answer);
  [options[target], options[answerIdx]] = [options[answerIdx], options[target]];
  return options;
}

export function getColorFeedback(round: ColorRound, selected: Color): string {
  const name = colorLabel(round.color);
  if (selected === round.color) {
    return `Yes! ${name} like ${round.example}.`;
  }
  return `Nice pick, ${colorLabel(selected)} is a great color too! This one is ${name}, like ${round.example}.`;
}
