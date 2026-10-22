import { describe, expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { REQUIRED_NOTE_FIELDS } from '../notes/types';
import type { AnyGame, Level } from '../play/types';
import { aboutHowMany } from '../maths/games/about-how-many';
import { canYouMakeABiggerNumber } from '../maths/games/can-you-make-a-bigger-number';
import { canYouPayExactly } from '../maths/games/can-you-pay-exactly';
import { makeBothSidesMatch } from '../maths/games/make-both-sides-match';
import { shareTheRoti } from '../maths/games/share-the-roti';
import { whatsUnderTheCup } from '../maths/games/whats-under-the-cup';

const ALL: readonly AnyGame[] = [aboutHowMany, canYouMakeABiggerNumber, canYouPayExactly, makeBothSidesMatch, shareTheRoti, whatsUnderTheCup] as unknown as AnyGame[];
const LEVELS: readonly Level[] = [1, 2, 3];
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

describe.each(ALL.map((g) => [g.id, g] as const))('%s', (_id, game) => {
  it('note', () => { for (const f of REQUIRED_NOTE_FIELDS) { expect(game.note[f], f).toBeTruthy(); expect(String(game.note[f]).length, f).toBeGreaterThan(20); } });
  it('prompts <=12 words, explain <=30', () => {
    for (const level of LEVELS) for (let i = 0; i < 8; i += 1) {
      const r = game.generate(level, i);
      const p = game.prompt(r);
      expect(words(p), `L${level} #${i}: ${p}`).toBeLessThanOrEqual(12);
      if (game.kind === 'solve') expect(words(game.explain(r)), game.explain(r)).toBeLessThanOrEqual(30);
    }
  });
  it('renders', () => {
    const { Board } = game;
    for (const level of LEVELS) { const round = game.generate(level, 0);
      for (const stage of ['answering', 'hint', 'worked', 'solved'] as const) { render(<Board round={round} level={level} answer={game.emptyAnswer(round)} setAnswer={() => {}} stage={stage} />); cleanup(); } }
  });
  it('dumps text', () => {
    const out: string[] = [];
    for (const level of LEVELS) for (let i = 0; i < 8; i += 1) {
      const r = game.generate(level, i);
      out.push(`L${level}#${i} P: ${game.prompt(r)}`);
      if (game.kind === 'solve') { out.push(`   E: ${game.explain(r)}`); const v = game.check(r, game.emptyAnswer(r)); out.push(`   H0: ${v.ok ? 'OK' : v.hint}`); }
    }
    // eslint-disable-next-line no-console
    console.log(`== ${game.id}\n${out.join('\n')}`);
  });
});
