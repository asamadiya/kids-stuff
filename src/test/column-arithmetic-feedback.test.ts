import { describe, expect, it } from 'vitest';
import { TWO_DIGIT_ADD_ROUNDS, getAddFeedback } from '../games/two-digit-add';
import { SUBTRACT_ROUNDS, getSubtractFeedback } from '../games/two-digit-subtract';

/**
 * When carrying and borrowing were allowed, the explanations were left behind —
 * the same two-authorities failure the whole redesign exists to remove, in the
 * gap between a round and the prose describing it.
 *
 * getAddFeedback glued the two column results together as digits, which is only
 * ever right when nothing carries: 27 + 15 printed "so 312 = 42". Subtraction
 * took the columns independently, so 52 − 27 printed "2 − 7 = -5 ones".
 *
 * These read the RENDERED sentence and check it against the round, so an
 * explanation cannot drift from the arithmetic it explains.
 */

/**
 * Whole expressions only. The carry line has three terms ("Tens 2+1+1=4"), and
 * a two-term regex clips it to "1+1=4" and reports a false failure.
 */
const arithmeticIn = (text: string): { terms: number[]; result: number }[] => {
  const out: { terms: number[]; result: number }[] = [];
  for (const m of text.matchAll(/(\d+(?:\s*\+\s*\d+)+)\s*=\s*(\d+)/g)) {
    out.push({ terms: m[1].split('+').map((t) => Number(t.trim())), result: Number(m[2]) });
  }
  for (const m of text.matchAll(/(\d+)\s*[−-]\s*(\d+)\s*=\s*(-?\d+)/g)) {
    out.push({ terms: [Number(m[1]), -Number(m[2])], result: Number(m[3]) });
  }
  return out;
};

describe('the explanation matches the arithmetic it explains', () => {
  it('never states a sum or difference that is untrue', () => {
    const wrong: string[] = [];
    for (const r of [...TWO_DIGIT_ADD_ROUNDS]) {
      const text = getAddFeedback(r, r.answer);
      for (const s of arithmeticIn(text)) {
        const sum = s.terms.reduce((x, y) => x + y, 0);
        if (sum !== s.result) wrong.push(`add ${r.a}+${r.b}: "${s.terms.join(' + ')} = ${s.result}"`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('never prints a negative quantity to a five-year-old', () => {
    // "2 − 7 = -5 ones" is not a thing a child can act on.
    const negatives: string[] = [];
    for (const r of SUBTRACT_ROUNDS) {
      for (const chosen of [r.answer, r.answer + 1]) {
        const text = getSubtractFeedback(r, chosen);
        if (/-\d/.test(text)) negatives.push(`${r.top}-${r.bottom}: ${text}`);
      }
    }
    expect(negatives).toEqual([]);
  });

  it('narrates the carry when a round carries, rather than gluing digits', () => {
    for (const r of TWO_DIGIT_ADD_ROUNDS.filter((x) => x.carries)) {
      const text = getAddFeedback(r, r.answer);
      expect(text, `${r.a}+${r.b}`).toMatch(/carry/i);
      expect(text).toContain(String(r.answer));
    }
  });

  it('narrates the borrow when a round borrows', () => {
    for (const r of SUBTRACT_ROUNDS.filter((x) => x.borrows)) {
      const text = getSubtractFeedback(r, r.answer);
      expect(text, `${r.top}-${r.bottom}`).toMatch(/take a ten/i);
      expect(text).toContain(String(r.answer));
    }
  });

  it('does not still claim the exercise avoids regrouping', () => {
    for (const r of [TWO_DIGIT_ADD_ROUNDS[0], SUBTRACT_ROUNDS[0]]) void r;
    const add = getAddFeedback(TWO_DIGIT_ADD_ROUNDS[0], TWO_DIGIT_ADD_ROUNDS[0].answer);
    const sub = getSubtractFeedback(SUBTRACT_ROUNDS[0], SUBTRACT_ROUNDS[0].answer);
    for (const t of [add, sub]) expect(t).not.toMatch(/no borrowing|without regrouping/i);
  });
});
