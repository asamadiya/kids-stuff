import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  LETTER_LAND_META,
  LETTER_QUESTION,
  LETTER_ROUNDS,
  OPTION_COUNT,
  getLetterFeedback,
  getLetterOptions,
  letterDistractors,
  letterOf,
  maskedTail,
  wordTitle,
  type Letter,
} from '../games/letter-land';
import { LetterLandGame } from '../components/LetterLandGame';

const game = () => createElement(LetterLandGame);

/** Records what say() actually handed to the platform. */
const spoken: string[] = [];

class FakeUtterance {
  text: string;
  voice: unknown = null;
  lang = '';
  rate = 1;
  pitch = 1;
  constructor(text: string) {
    this.text = text;
  }
}

beforeEach(() => {
  spoken.length = 0;
  vi.stubGlobal('speechSynthesis', {
    getVoices: () => [],
    speak: (u: { text: string }) => {
      spoken.push(u.text);
    },
    cancel: () => {},
    addEventListener: () => {},
  });
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** say() yields a task before speaking, to dodge a Chrome cancel/speak race. */
const drainSpeech = () => new Promise((resolve) => setTimeout(resolve, 0));

/**
 * The shipped question was `Which letter does ${wordTitle(round.word)} start
 * with?`, so round 1 rendered "Which letter does Apple start with?" over
 * buttons A / P / L: the answer was the first character of the question.
 *
 * The detector below is the gate — a question that contains the word leaks the
 * letter that writes its first sound. It is applied to every rendered round,
 * and shown to fire on the sentence that shipped.
 */
const leaksTheWord = (question: string, word: string): boolean =>
  question.toLowerCase().includes(word.toLowerCase());

describe('the word list', () => {
  it('is long enough and exposes coherent meta', () => {
    expect(LETTER_ROUNDS.length).toBeGreaterThanOrEqual(14);
    expect(LETTER_LAND_META.id).toBe('letter-land');
    expect(LETTER_LAND_META.title.length).toBeGreaterThan(0);
    expect(LETTER_LAND_META.tagline.length).toBeGreaterThan(0);
  });

  it('reads the answer off the word, so the two can never disagree', () => {
    for (const round of LETTER_ROUNDS) {
      expect(round.word).toMatch(/^[a-z]+$/);
      expect(letterOf(round)).toBe(round.word[0].toUpperCase());
      expect(letterOf(round)).toMatch(/^[A-Z]$/);
      expect(maskedTail(round)).toBe(round.word.slice(1));
    }
  });

  it('carries no glyph, so no picture can contradict its word', () => {
    // "hat" drew a monkey and "igloo" drew a house. There are no pictures now,
    // and a round has nowhere to put one.
    for (const round of LETTER_ROUNDS) {
      const fields = Object.values(round).join(' ');
      expect(fields, round.word).toMatch(/^[\x20-\x7e]*$/);
      expect(Object.keys(round).sort()).toEqual(['note', 'word']);
    }
  });

  it('holds no meat, no fish and no candy', () => {
    const banned =
      /\b(meat|fish|beef|pork|chicken|ham|bacon|lamb|tuna|salmon|sausage|prawn|shrimp|candy|candies|sweets|lollipop|cupcake|donut|doughnut|cookie)\b/i;
    for (const round of LETTER_ROUNDS) {
      expect(banned.test(round.word), round.word).toBe(false);
      expect(banned.test(round.note), round.note).toBe(false);
    }
  });

  it('uses every word once', () => {
    const words = LETTER_ROUNDS.map((r) => r.word);
    expect(new Set(words).size).toBe(words.length);
  });
});

describe('options', () => {
  it('contain the answer exactly once and never repeat a letter', () => {
    LETTER_ROUNDS.forEach((round, i) => {
      const opts = getLetterOptions(i);
      expect(opts).toHaveLength(OPTION_COUNT);
      expect(new Set(opts).size).toBe(opts.length);
      expect(opts.filter((o) => o === letterOf(round))).toHaveLength(1);
    });
  });

  it('build distractors from the word, so one can never be the answer', () => {
    for (const round of LETTER_ROUNDS) {
      const answer = letterOf(round);
      const distractors = letterDistractors(round);
      expect(distractors.length).toBeGreaterThanOrEqual(OPTION_COUNT - 1);
      expect(distractors).not.toContain(answer);
      // The first is a letter that really is in the word, just not at the front.
      expect(maskedTail(round).toUpperCase()).toContain(distractors[0]);
    }
  });

  it('are deterministic and wrap by modulo', () => {
    LETTER_ROUNDS.forEach((_, i) => {
      expect(getLetterOptions(i)).toEqual(getLetterOptions(i));
      expect(getLetterOptions(i)).toEqual(getLetterOptions(i + LETTER_ROUNDS.length));
    });
  });

  it('do not park the answer in one slot', () => {
    const counts = new Map<number, number>();
    LETTER_ROUNDS.forEach((round, i) => {
      const slot = getLetterOptions(i).indexOf(letterOf(round));
      expect(slot).toBeGreaterThanOrEqual(0);
      counts.set(slot, (counts.get(slot) ?? 0) + 1);
    });
    expect(Math.max(...counts.values())).toBeLessThanOrEqual(
      Math.ceil(LETTER_ROUNDS.length / OPTION_COUNT) + 1,
    );
  });
});

describe('GATE: the question does not contain the word it is asking about', () => {
  it('holds for every rendered round', async () => {
    const user = userEvent.setup();
    render(game());

    for (let i = 0; i < LETTER_ROUNDS.length; i += 1) {
      const round = LETTER_ROUNDS[i];
      const question = screen.getByTestId('prompt').textContent ?? '';
      expect(question, `round ${i}`).toBe(LETTER_QUESTION);
      expect(leaksTheWord(question, round.word), `round ${i}`).toBe(false);
      await user.click(screen.getAllByTestId('option')[0]);
      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  }, 20000);

  it('fires on the sentence that shipped, which is what makes the gate load-bearing', () => {
    const shipped = `Which letter does ${wordTitle('apple')} start with?`;
    expect(shipped).toContain('Apple');
    expect(leaksTheWord(shipped, 'apple')).toBe(true);
    expect(leaksTheWord(LETTER_QUESTION, 'apple')).toBe(false);
  });
});

describe('GATE: the stimulus shows the word with its first letter missing', () => {
  it('prints the tail and leaves the slot blank until an answer is given', async () => {
    const user = userEvent.setup();
    render(game());

    for (let i = 0; i < LETTER_ROUNDS.length; i += 1) {
      const round = LETTER_ROUNDS[i];
      const shown = screen.getByTestId('masked-word').textContent ?? '';
      expect(shown, `round ${i}`).toBe(maskedTail(round));
      expect(shown.toLowerCase(), `round ${i}`).not.toContain(round.word);
      expect(screen.getByTestId('letter-slot').textContent, `round ${i}`).toBe('');
      expect(screen.getAllByTestId('letter-tile'), `round ${i}`).toHaveLength(round.word.length - 1);

      await user.click(screen.getAllByTestId('option')[0]);
      // Only once the child has chosen does the slot fill in, completing the word.
      expect(screen.getByTestId('letter-slot').textContent, `round ${i}`).toBe(letterOf(round));
      expect((screen.getByTestId('masked-word').textContent ?? '').toLowerCase(), `round ${i}`)
        .toBe(round.word);

      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  });

  it('never leaves the answer as the only option visible in the stimulus', async () => {
    // "river" shows _iver, so R is on screen — but so are I, V and E, which are
    // its distractors. A letter being visible must not identify it as the answer.
    const user = userEvent.setup();
    render(game());

    for (let i = 0; i < LETTER_ROUNDS.length; i += 1) {
      const round = LETTER_ROUNDS[i];
      const shown = (screen.getByTestId('masked-word').textContent ?? '').toUpperCase();
      const visible = getLetterOptions(i).filter((o) => shown.includes(o));
      expect(visible, `round ${i}`).not.toEqual([letterOf(round)]);

      await user.click(screen.getAllByTestId('option')[0]);
      await user.click(screen.getByRole('button', { name: /next/i }));
    }
  });

  it('names the blank for a listener without naming the letter', () => {
    render(game());
    const slot = screen.getByTestId('letter-slot');
    expect(slot.getAttribute('aria-label')).toBe('the missing first letter');
    expect(slot.textContent).toBe('');
  });
});

describe('a child who cannot read yet', () => {
  it('can hear the word, and hears the next one when he moves on', async () => {
    const user = userEvent.setup();
    render(game());

    await user.click(screen.getByTestId('hear-word'));
    await drainSpeech();
    expect(spoken).toEqual([LETTER_ROUNDS[0].word]);

    await user.click(screen.getAllByTestId('option')[0]);
    await user.click(screen.getByRole('button', { name: /next/i }));
    await drainSpeech();
    expect(spoken).toEqual([LETTER_ROUNDS[0].word, LETTER_ROUNDS[1].word]);
  });

  it('is never spoken the answer', async () => {
    const user = userEvent.setup();
    render(game());
    await user.click(screen.getByTestId('hear-word'));
    await drainSpeech();
    for (const said of spoken) expect(said).not.toContain(letterOf(LETTER_ROUNDS[0]));
  });
});

describe('what the child is told', () => {
  it('names the word and the letter for any choice', () => {
    LETTER_ROUNDS.forEach((round, i) => {
      const answer = letterOf(round);
      for (const o of getLetterOptions(i)) {
        const text = getLetterFeedback(round, o as Letter);
        expect(text).toContain(wordTitle(round.word));
        expect(text).toContain(answer);
        expect(text).toContain(round.note);
      }
    });
  });

  it('keeps the register: no praise, no exclamation marks', () => {
    const praise = /\b(great|good job|well done|awesome|amazing|super|yay|clever|brilliant|nice try)\b/i;
    LETTER_ROUNDS.forEach((round, i) => {
      expect(round.note).not.toContain('!');
      for (const o of getLetterOptions(i)) {
        const text = getLetterFeedback(round, o as Letter);
        expect(praise.test(text), text).toBe(false);
        expect(text).not.toContain('!');
      }
    });
  });
});

describe('wordTitle', () => {
  it('title-cases a word and leaves the rest alone', () => {
    expect(wordTitle('apple')).toBe('Apple');
    expect(wordTitle('umbrella')).toBe('Umbrella');
    expect(wordTitle('')).toBe('');
  });
});
