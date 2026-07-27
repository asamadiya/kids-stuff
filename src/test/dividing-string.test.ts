import { describe, it, expect } from 'vitest';
import {
  BASE_HZ, DIVIDING_STRING_META, MAX_DENOMINATOR, MAX_PHRASE, MAX_STUDS, MIN_LENGTH,
  SIMPLE_RATIOS, STOP_TOLERANCE,
  addNote, beatsPerSecond, bestFraction, cardLines, cardSummary, clampLength, closestRatio,
  combinedWave, describePosition, describeStud, dropLastNote, fractionText, fractionValue, gcd,
  intervalName, makeStud, movePosition, nearestRatio, phraseInWords, phraseStops, pinStud,
  plankMark, prunePhrase, readingText, reduce, repeatAfter, shakeText, spokenFraction, studKey,
  unpinStud, frequencyAt,
} from '../workshop/dividing-string';
import type { Stud } from '../workshop/dividing-string';

const rack = (...positions: number[]): readonly Stud[] =>
  positions.reduce<readonly Stud[]>((studs, p) => pinStud(studs, makeStud(p)), []);

describe('the whole tool rests on one fact: pitch is the reciprocal of length', () => {
  it('halves the string and the frequency doubles — an octave', () => {
    expect(frequencyAt(BASE_HZ, 1 / 2)).toBe(BASE_HZ * 2);
    expect(frequencyAt(200, 0.5)).toBe(400);
    expect(nearestRatio(0.5)?.name).toBe('an octave');
    expect(nearestRatio(0.5)?.ratio).toBe(2);
  });

  it('stops at two thirds and the frequency is three halves — a fifth', () => {
    const f = frequencyAt(BASE_HZ, 2 / 3);
    expect(f).toBeCloseTo(BASE_HZ * 1.5, 10);
    expect(f / BASE_HZ).toBeCloseTo(3 / 2, 10);
    expect(frequencyAt(200, 2 / 3)).toBeCloseTo(300, 10);
    expect(nearestRatio(2 / 3)?.name).toBe('a fifth');
  });

  it('quarters the string for two octaves, and thirds it for an octave and a fifth', () => {
    expect(frequencyAt(BASE_HZ, 1 / 4)).toBe(BASE_HZ * 4);
    expect(frequencyAt(BASE_HZ, 1 / 3)).toBeCloseTo(BASE_HZ * 3, 10);
  });

  it('leaves the open string alone', () => {
    expect(frequencyAt(BASE_HZ, 1)).toBe(BASE_HZ);
  });

  it('gives every listed ratio the frequency its fraction promises', () => {
    for (const stop of SIMPLE_RATIOS) {
      expect(frequencyAt(BASE_HZ, stop.position)).toBeCloseTo(BASE_HZ * stop.ratio, 9);
      expect(stop.ratio).toBeCloseTo(stop.den / stop.num, 12);
    }
  });
});

describe('the ends of the board are safe places to stand', () => {
  it('never divides by zero and never hands back infinity', () => {
    for (const p of [0, -1, 1, 2, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
      const f = frequencyAt(BASE_HZ, p);
      expect(Number.isFinite(f)).toBe(true);
      expect(f).toBeGreaterThan(0);
    }
  });

  it('clamps the bridge to a piece of string that can still shake', () => {
    expect(clampLength(0)).toBe(MIN_LENGTH);
    expect(clampLength(1)).toBe(1);
    expect(clampLength(3)).toBe(1);
    expect(clampLength(Number.NaN)).toBe(1);
    expect(frequencyAt(BASE_HZ, 0)).toBe(BASE_HZ / MIN_LENGTH);
  });

  it('moves by a step without ever leaving the board', () => {
    expect(movePosition(0.5, 0.1)).toBeCloseTo(0.6, 10);
    expect(movePosition(MIN_LENGTH, -1)).toBe(MIN_LENGTH);
    expect(movePosition(1, 1)).toBe(1);
  });

  it('describes the boundaries in words rather than in symbols', () => {
    expect(describePosition(0)).toContain('shakes a second');
    expect(describePosition(1)).toContain('1/1');
    expect(readingText(1)).toBe('1/1 · the same note');
  });
});

describe('fractions reduce, because 4/8 and 1/2 are one division', () => {
  it('reduces by the greatest common divisor', () => {
    expect(reduce(4, 8)).toEqual({ num: 1, den: 2 });
    expect(reduce(6, 8)).toEqual({ num: 3, den: 4 });
    expect(reduce(10, 15)).toEqual({ num: 2, den: 3 });
    expect(reduce(7, 9)).toEqual({ num: 7, den: 9 });
    expect(reduce(5, 5)).toEqual({ num: 1, den: 1 });
  });

  it('survives a zero denominator instead of producing infinity', () => {
    expect(reduce(3, 0)).toEqual({ num: 0, den: 1 });
    expect(Number.isFinite(gcd(0, 0))).toBe(true);
    expect(gcd(0, 0)).toBe(1);
    expect(gcd(12, 18)).toBe(6);
  });

  it('reads a fraction as a value and as text', () => {
    expect(fractionValue({ num: 3, den: 4 })).toBe(0.75);
    expect(fractionText({ num: 3, den: 4 })).toBe('3/4');
    expect(studKey({ num: 3, den: 4 })).toBe('3/4');
  });

  it('speaks a fraction, since he does not read numerals yet', () => {
    expect(spokenFraction({ num: 1, den: 2 })).toBe('one half');
    expect(spokenFraction({ num: 2, den: 3 })).toBe('two thirds');
    expect(spokenFraction({ num: 3, den: 4 })).toBe('three quarters');
    expect(spokenFraction({ num: 5, den: 6 })).toBe('five sixths');
    expect(spokenFraction({ num: 1, den: 1 })).toBe('the whole string');
  });
});

describe('the simple ratios are found, and only when he is really on them', () => {
  it('finds one half exactly at the middle of the string', () => {
    const found = nearestRatio(0.5);
    expect(found).not.toBeNull();
    expect(found?.num).toBe(1);
    expect(found?.den).toBe(2);
  });

  it('finds nothing when the bridge sits between the ratios', () => {
    expect(nearestRatio(0.55)).toBeNull();
    expect(nearestRatio(0.7)).toBeNull();
    expect(nearestRatio(0.45)).toBeNull();
    expect(nearestRatio(0.28)).toBeNull();
  });

  it('holds on just inside the tolerance and lets go just outside it', () => {
    expect(nearestRatio(0.5 + STOP_TOLERANCE * 0.9)?.den).toBe(2);
    expect(nearestRatio(0.5 - STOP_TOLERANCE * 0.9)?.den).toBe(2);
    expect(nearestRatio(0.5 + STOP_TOLERANCE * 1.5)).toBeNull();
    expect(nearestRatio(0.5 - STOP_TOLERANCE * 1.5)).toBeNull();
  });

  it('never lets two studs claim the same place', () => {
    for (let i = 1; i < SIMPLE_RATIOS.length; i += 1) {
      const gap = SIMPLE_RATIOS[i].position - SIMPLE_RATIOS[i - 1].position;
      expect(gap).toBeGreaterThan(STOP_TOLERANCE * 2);
    }
  });

  it('still points at the ratio he is hunting when he has not found it', () => {
    expect(closestRatio(0.55).position).toBeCloseTo(0.6, 10);
    expect(closestRatio(0.52).position).toBeCloseTo(0.5, 10);
    expect(closestRatio(0.99).position).toBe(1);
  });

  it('names the intervals of the listed ratios and nothing else', () => {
    expect(intervalName({ num: 2, den: 3 })).toBe('a fifth');
    expect(intervalName({ num: 3, den: 4 })).toBe('a fourth');
    expect(intervalName({ num: 5, den: 9 })).toBeNull();
  });
});

describe('the wobble is a number, so it can be drawn as well as heard', () => {
  it('is silent exactly on a simple ratio', () => {
    expect(beatsPerSecond(BASE_HZ, 2 / 3, { num: 2, den: 3 })).toBeCloseTo(0, 9);
    expect(beatsPerSecond(BASE_HZ, 0.5, { num: 1, den: 2 })).toBeCloseTo(0, 9);
  });

  it('grows as he wanders off the ratio', () => {
    const near = beatsPerSecond(BASE_HZ, 0.67, { num: 2, den: 3 });
    const far = beatsPerSecond(BASE_HZ, 0.69, { num: 2, den: 3 });
    expect(near).toBeGreaterThan(0);
    expect(far).toBeGreaterThan(near);
  });

  it('draws a combined wave that closes on a simple ratio and not otherwise', () => {
    const fifth = combinedWave(3 / 2, 121, 6);
    expect(fifth).toHaveLength(121);
    expect(fifth.every((y) => Number.isFinite(y) && Math.abs(y) <= 1.0001)).toBe(true);
    // Two turns of the open string is one turn of the whole shape at a fifth.
    expect(fifth[0]).toBeCloseTo(fifth[40], 8);
    const sour = combinedWave(1.53, 121, 6);
    expect(Math.abs(sour[0] - sour[40])).toBeGreaterThan(0.01);
  });

  it('is deterministic — the same division draws the same wave', () => {
    expect(combinedWave(3 / 2)).toEqual(combinedWave(3 / 2));
  });

  it('says how many turns before the shape comes round', () => {
    expect(repeatAfter({ num: 2, den: 3 })).toBe(2);
    expect(repeatAfter({ num: 1, den: 2 })).toBe(1);
  });
});

describe('the plainest fraction for wherever he actually stands', () => {
  it('names the simple places by their own fractions', () => {
    expect(bestFraction(0.5)).toEqual({ num: 1, den: 2 });
    expect(bestFraction(2 / 3)).toEqual({ num: 2, den: 3 });
    expect(bestFraction(0.75)).toEqual({ num: 3, den: 4 });
    expect(bestFraction(1)).toEqual({ num: 1, den: 1 });
  });

  it('prefers small denominators and always reduces', () => {
    const f = bestFraction(0.5001);
    expect(f).toEqual({ num: 1, den: 2 });
    for (let p = 0.25; p <= 1; p += 0.013) {
      const g = bestFraction(p);
      expect(g.den).toBeLessThanOrEqual(MAX_DENOMINATOR);
      expect(g.num).toBeGreaterThanOrEqual(1);
      expect(g.num).toBeLessThanOrEqual(g.den);
      expect(reduce(g.num, g.den)).toEqual(g);
    }
  });
});

describe('pinning a division invents a scale', () => {
  it('pins the exact ratio when he is standing on one', () => {
    const stud = makeStud(0.5 + STOP_TOLERANCE * 0.5);
    expect(stud.key).toBe('1/2');
    expect(stud.position).toBe(0.5);
    expect(stud.name).toBe('an octave');
    expect(stud.ratio).toBe(2);
  });

  it('pins a plain fraction when he is standing between them', () => {
    const stud = makeStud(0.55);
    expect(stud.name).toBeNull();
    expect(stud.den).toBeLessThanOrEqual(MAX_DENOMINATOR);
    expect(stud.position).toBeCloseTo(0.55, 1);
  });

  it('keeps the rack long-to-short and refuses a repeat', () => {
    const studs = rack(1, 0.5, 2 / 3, 0.5);
    expect(studs.map((s) => s.key)).toEqual(['1/1', '2/3', '1/2']);
  });

  it('will not overfill the rack', () => {
    const studs = rack(1, 5 / 6, 4 / 5, 3 / 4, 2 / 3, 3 / 5, 1 / 2, 2 / 5, 1 / 3, 1 / 4);
    expect(studs).toHaveLength(MAX_STUDS);
  });

  it('takes a stud off again', () => {
    const studs = rack(1, 0.5);
    expect(unpinStud(studs, '1/2').map((s) => s.key)).toEqual(['1/1']);
    expect(unpinStud(studs, '9/11')).toHaveLength(2);
  });

  it('gives the grown-up a measurement to cut to', () => {
    expect(plankMark({ num: 1, den: 2 })).toBe(300);
    expect(plankMark({ num: 2, den: 3 })).toBe(400);
    expect(plankMark({ num: 3, den: 4 }, 800)).toBe(600);
  });
});

describe('the phrase is an ordered list of stops', () => {
  const studs = rack(1, 2 / 3, 0.5);

  it('records the order he tapped, repeats and all', () => {
    const phrase = ['1/1', '2/3', '1/1', '1/2'].reduce(addNote, [] as readonly string[]);
    expect(phrase).toEqual(['1/1', '2/3', '1/1', '1/2']);
    expect(phraseStops(phrase, studs).map((s) => s.key)).toEqual(phrase);
  });

  it('rubs out the last note only', () => {
    expect(dropLastNote(['1/1', '1/2'])).toEqual(['1/1']);
    expect(dropLastNote([])).toEqual([]);
  });

  it('stops writing once the phrase is full', () => {
    let phrase: readonly string[] = [];
    for (let i = 0; i < MAX_PHRASE + 5; i += 1) phrase = addNote(phrase, '1/2');
    expect(phrase).toHaveLength(MAX_PHRASE);
  });

  it('drops notes whose stud has been pulled off the rack', () => {
    const phrase = ['1/1', '1/2', '2/3'];
    expect(prunePhrase(phrase, unpinStud(studs, '1/2'))).toEqual(['1/1', '2/3']);
    expect(phraseStops(phrase, [])).toEqual([]);
  });

  it('says what it is in words', () => {
    expect(phraseInWords([], studs)).toContain('No phrase');
    expect(phraseInWords(['1/1', '1/2'], studs)).toBe('2 notes: 1/1 1/2');
  });
});

describe('the card is buildable from a plank, two nails and a length of line', () => {
  it('lists the studs, the nail marks, the names and the phrase', () => {
    const studs = rack(1, 2 / 3, 0.5);
    const lines = cardLines({ studs, phrase: ['1/1', '2/3', '1/2'], base: BASE_HZ });
    expect(lines.join(' | ')).toContain('1/1  2/3  1/2');
    expect(lines.join(' | ')).toContain('600, 400, 300 mm');
    expect(lines.join(' | ')).toContain('a fifth');
    expect(lines.join(' | ')).toContain('Phrase: 1/1 2/3 1/2');
    expect(lines.join(' | ')).toContain('196 shakes a second');
    expect(lines.every((l) => l.length > 0)).toBe(true);
  });

  it('reads plainly when nothing has been made yet', () => {
    const lines = cardLines({ studs: [], phrase: [], base: BASE_HZ });
    expect(lines[0]).toBe('No studs pinned yet.');
    expect(cardSummary({ studs: [], phrase: [], base: BASE_HZ })).toContain('bare string');
  });

  it('summarises what he built without praising him for it', () => {
    const studs = rack(1, 0.5, 0.55);
    const text = cardSummary({ studs, phrase: ['1/2'], base: BASE_HZ });
    expect(text).toContain('3 ways');
    expect(text).toContain('2 of them at simple ratios');
    expect(text).toContain('1 note');
    expect(text).not.toMatch(/well done|good job|great|amazing/i);
  });

  it('describes one stud without needing the drawing', () => {
    expect(describeStud(makeStud(2 / 3))).toBe("2/3 of the string, a fifth, 3 shakes to the open string's 2");
    expect(shakeText({ num: 1, den: 2 })).toBe("2 shakes to the open string's 1");
  });

  it('says whether the notes lock or wobble', () => {
    expect(describePosition(2 / 3)).toContain('lock');
    expect(describePosition(0.55)).toContain('wobble');
    expect(describePosition(0.55)).toContain('between the simple places');
  });
});

describe('the tool announces itself', () => {
  it('carries the metadata the hub needs', () => {
    expect(DIVIDING_STRING_META.id).toBe('dividing-string');
    expect(DIVIDING_STRING_META.title).toBe('The Dividing String');
    expect(DIVIDING_STRING_META.eyebrow).toBe('Compose');
    expect(DIVIDING_STRING_META.note.trim().endsWith('.')).toBe(true);
  });
});
