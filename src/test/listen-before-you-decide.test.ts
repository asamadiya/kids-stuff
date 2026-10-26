import { describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  BEFORE_YOU_DECIDE_META, CASES, CHIPS, LISTEN, PICTURE_MARK, QUESTION_KINDS, STILL,
  askedFacts, clockLine, clockParts, closingLine, listenLines, unaskedFacts, unaskedLine,
} from '../sel/before-you-decide';
import type { Case, Choice, Fact, QuestionKind } from '../sel/before-you-decide';
import { textKey } from '../audio/readAloud';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Before You Decide reads aloud only through `LISTEN`, and `listenLines()` is
 * what the clip builder makes. Every state the exercise can reach must ask
 * only for lines in that list, or its button says "No recording of this yet".
 */

/** Every order the questions can be spent in: each subset, in each order. */
const orders = (xs: readonly QuestionKind[]): QuestionKind[][] =>
  xs.length === 0
    ? [[]]
    : [[], ...xs.flatMap((x) => orders(xs.filter((y) => y !== x)).map((rest) => [x, ...rest]))];

const factButton = (subject: Case, fact: Fact, prefix?: string): readonly string[] =>
  fact.kind === 'clock' ? LISTEN.timeline(subject, prefix) : LISTEN.card(fact, prefix);

/** The texts of every read button on screen, as the component composes them. */
const screen = (subject: Case, asked: readonly QuestionKind[], chosen: Choice | null, turned: boolean): (readonly string[])[] => [
  LISTEN.title(),
  LISTEN.setup(subject),
  ...askedFacts(subject, asked).map((f) => factButton(subject, f)),
  ...(turned ? unaskedFacts(subject, asked).map((f) => factButton(subject, f, unaskedLine(f.kind))) : []),
  ...(chosen ? [LISTEN.outcome(chosen)] : []),
  ...(turned ? [LISTEN.closing(subject)] : []),
  LISTEN.questions(subject, chosen !== null),
  LISTEN.choices(subject, chosen !== null),
];

const reachable = (): (readonly string[])[] =>
  CASES.flatMap((subject) =>
    orders(QUESTION_KINDS).flatMap((asked) => [
      ...screen(subject, asked, null, false),
      ...subject.choices.flatMap((c) => [...screen(subject, asked, c, false), ...screen(subject, asked, c, true)]),
    ]),
  );

describe('before you decide: the lines the build makes', () => {
  const lines = listenLines();

  it('has no empty line, no line twice once normalised, and no line too long for one clip', () => {
    expect(lines.length).toBeGreaterThan(0);
    expect(lines.filter((l) => textKey(l) === '')).toEqual([]);
    const keys = lines.map(textKey);
    expect(keys.filter((k, i) => keys.indexOf(k) !== i)).toEqual([]);
    expect(lines.filter((l) => l.length > 300)).toEqual([]);
  });

  it('covers every line any reachable state asks for, and nothing no state asks for', () => {
    const have = new Set(lines.map(textKey));
    const asked = new Set(reachable().flat().map(textKey));
    expect([...asked].filter((l) => !have.has(l))).toEqual([]);
    expect([...have].filter((l) => !asked.has(l))).toEqual([]);
  });

  it('never reads the grown-up note, the picture description, the chip names or the case names', () => {
    const have = new Set(lines.map(textKey));
    const unread = [
      BEFORE_YOU_DECIDE_META.note,
      BEFORE_YOU_DECIDE_META.eyebrow,
      ...CHIPS.map((c) => c.label),
      ...CASES.flatMap((c) => [c.setupAlt, c.title]),
    ];
    expect(unread.filter((l) => have.has(textKey(l)))).toEqual([]);
  });

  it('reads the clock fact as the strip draws it, with the picture mark straight after the picture stop', () => {
    for (const c of CASES) {
      const parts = clockParts(c);
      expect(parts.join(' ')).toBe(clockLine(c));
      expect(parts.filter((p) => p === PICTURE_MARK)).toHaveLength(1);
      expect(parts[parts.indexOf(PICTURE_MARK) - 1]).toBe(c.timeline[c.pictureAt].says);
      expect(LISTEN.timeline(c)).toEqual([c.facts.find((f) => f.kind === 'clock')!.question, ...parts]);
      expect(LISTEN.timeline(c, unaskedLine('clock'))[0]).toBe(unaskedLine('clock'));
    }
  });

  it('splits "You still do not know." off the closing of an unsettled case', () => {
    for (const c of CASES) {
      expect(LISTEN.closing(c).join(' ')).toBe(closingLine(c));
      expect(LISTEN.closing(c)).toEqual(c.settles ? [c.closing] : [c.closing, STILL]);
    }
  });
});

describe('before you decide: nothing speaks on its own', () => {
  const source = readFileSync('src/components/sel/BeforeYouDecide.tsx', 'utf8');

  it('has no say() and no import of the old seam', () => {
    expect(source).not.toMatch(/\bsay\(/);
    expect(source).not.toMatch(/lib\/say/);
  });

  it('draws the picture mark from the one constant, not a second typed string', () => {
    expect(source).not.toMatch(/THIS IS THE PICTURE/);
    expect(source).toMatch(/\{PICTURE_MARK\}/);
  });
});
