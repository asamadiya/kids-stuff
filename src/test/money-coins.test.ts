import { describe, it, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as money from '../games/money-coins';
import {
  MONEY_COINS_META,
  MONEY_OPTION_COUNT,
  MONEY_PALETTE,
  MONEY_PROMPT,
  MONEY_ROUNDS,
  COIN_EDGE,
  COIN_KINDS,
  COIN_LABEL,
  COIN_LEGEND,
  COIN_MM,
  COIN_PLURAL,
  COIN_PX_PER_MM,
  COIN_VALUE,
  centsLabel,
  coinsOf,
  getMoneyOptions,
  getMoneyFeedback,
  roundBreakdown,
  roundCoinCount,
  roundTotal,
  totalOf,
  type CoinKind,
} from '../games/money-coins';
import MoneyCoinsGame from '../components/MoneyCoinsGame';

afterEach(cleanup);

describe('money-coins meta', () => {
  it('has expected identity', () => {
    expect(MONEY_COINS_META.id).toBe('money-coins');
    expect(MONEY_COINS_META.title).toBe('Money');
    expect(MONEY_COINS_META.color).toBe('aqua');
    expect(MONEY_COINS_META.icon.length).toBeGreaterThan(0);
    expect(MONEY_COINS_META.tagline.length).toBeGreaterThan(0);
  });
});

describe('the coins are the real coins', () => {
  it('spells each value in words, as the mint does, with no numeral on the face', () => {
    expect(COIN_LEGEND.dime).toBe('ONE DIME');
    expect(COIN_LEGEND.nickel).toBe('FIVE CENTS');
    expect(COIN_LEGEND.penny).toBe('ONE CENT');
    for (const kind of COIN_KINDS) {
      expect(/\d/.test(COIN_LEGEND[kind]), `${kind} legend`).toBe(false);
    }
  });

  it('keeps the US Mint diameters, so a dime really is the smallest of the three', () => {
    expect(COIN_MM).toEqual({ dime: 17.91, nickel: 21.21, penny: 19.05 });
    expect(COIN_MM.dime).toBeLessThan(COIN_MM.penny);
    expect(COIN_MM.penny).toBeLessThan(COIN_MM.nickel);
    // The size order is the opposite of the value order — the point of the drill.
    expect(COIN_VALUE.dime).toBeGreaterThan(COIN_VALUE.nickel);
  });

  it('records the edge finish, the other way to tell them apart', () => {
    expect(COIN_EDGE.dime).toBe('reeded');
    expect(COIN_EDGE.nickel).toBe('smooth');
    expect(COIN_EDGE.penny).toBe('smooth');
  });

  it('draws in the palette from tokens.css', () => {
    const tokens = readFileSync('src/styles/tokens.css', 'utf8');
    const token = (name: string): string =>
      tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))![1];
    expect(MONEY_PALETTE.silver).toBe(token('paper-sunken'));
    expect(MONEY_PALETTE.silverLine).toBe(token('ink-soft'));
    expect(MONEY_PALETTE.copper).toBe(token('terracotta'));
    expect(MONEY_PALETTE.copperLine).toBe(token('ink'));
    expect(MONEY_PALETTE.copperInk).toBe(token('paper'));
  });
});

describe('money-coins rounds', () => {
  it('has at least 12 rounds', () => {
    expect(MONEY_ROUNDS.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps every total between 1c and 50c', () => {
    for (const round of MONEY_ROUNDS) {
      const total = roundTotal(round);
      expect(total).toBeGreaterThan(0);
      expect(total).toBeLessThanOrEqual(50);
    }
  });

  it('totals the round by classifying its coins, one entry per coin', () => {
    for (const round of MONEY_ROUNDS) {
      const kinds = coinsOf(round);
      expect(kinds.length).toBe(roundCoinCount(round));
      expect(kinds.length).toBe(round.coins.reduce((n, c) => n + c.count, 0));
      for (const kind of kinds) expect(COIN_KINDS).toContain(kind);
      expect(roundTotal(round)).toBe(totalOf(kinds));
      expect(totalOf(kinds)).toBe(kinds.reduce((sum, k) => sum + COIN_VALUE[k], 0));
    }
  });

  it('no longer exports the expression builder that printed the answer', () => {
    // `10c + 10c + 10c + 10c + 1c + 1c = how many cents?` was the round-13 prompt.
    expect(money).not.toHaveProperty('roundExpression');
    expect(MONEY_PROMPT).toBe('How much is this?');
    expect(/\d/.test(MONEY_PROMPT)).toBe(false);
  });
});

describe('money-coins options', () => {
  it('returns a stable-length list including the correct answer for every round', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const opts = getMoneyOptions(i);
      expect(opts.length).toBe(MONEY_OPTION_COUNT);
      expect(opts).toContain(roundTotal(MONEY_ROUNDS[i]));
    }
  });

  it('has no duplicate options', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const opts = getMoneyOptions(i);
      expect(new Set(opts).size).toBe(opts.length);
    }
  });

  it('is deterministic across calls and wraps by modulo index', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      expect(getMoneyOptions(i)).toEqual(getMoneyOptions(i));
    }
    const len = MONEY_ROUNDS.length;
    expect(getMoneyOptions(len)).toEqual(getMoneyOptions(0));
    expect(getMoneyOptions(len + 3)).toEqual(getMoneyOptions(3));
  });
});

describe('money-coins feedback', () => {
  it('shows the working for the correct choice', () => {
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const answer = roundTotal(MONEY_ROUNDS[i]);
      const fb = getMoneyFeedback(i, answer);
      expect(fb).toContain('Correct.');
      expect(fb).toContain(centsLabel(answer));
      expect(fb).toContain(roundBreakdown(MONEY_ROUNDS[i]));
    }
  });

  it('states the sum on a miss without grading the child', () => {
    const banned = /(wrong|incorrect|\bno\b|lose|fail|great|good job)/i;
    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const answer = roundTotal(MONEY_ROUNDS[i]);
      const fb = getMoneyFeedback(i, answer + 1);
      expect(fb).toContain(centsLabel(answer));
      expect(fb).toContain(centsLabel(answer + 1));
      expect(banned.test(fb), fb).toBe(false);
      expect(fb).not.toContain('!');
    }
  });

  it('names every coin and its value in the breakdown', () => {
    for (const round of MONEY_ROUNDS) {
      const text = roundBreakdown(round);
      for (const c of round.coins) {
        const name = c.count === 1 ? COIN_LABEL[c.kind] : COIN_PLURAL[c.kind];
        expect(text.toLowerCase()).toContain(`${c.count} ${name.toLowerCase()}`);
        expect(text).toContain(centsLabel(COIN_VALUE[c.kind]));
      }
    }
  });
});

describe('money-coins helpers', () => {
  it('centsLabel uses the cent sign', () => {
    expect(centsLabel(16)).toBe('16¢');
    expect(centsLabel(50)).toBe('50¢');
  });
});

/** Every coin drawn on screen, classified by the handle the markup exposes. */
function coinsInDom(root: HTMLElement): { kind: CoinKind; svg: Element }[] {
  return Array.from(root.querySelectorAll('svg[data-kind]')).map((svg) => ({
    kind: svg.getAttribute('data-kind') as CoinKind,
    svg,
  }));
}

describe('the coins on screen are the question', () => {
  it('draws each coin at its real diameter, with a legend and no number on the face', () => {
    const { container } = render(createElement(MoneyCoinsGame));
    const drawn = coinsInDom(container);
    // Round 0 is a dime, a nickel and a penny — one of each.
    expect(drawn.map((c) => c.kind).sort()).toEqual(['dime', 'nickel', 'penny']);

    const radius = new Map<CoinKind, number>();
    for (const { kind, svg } of drawn) {
      expect(COIN_KINDS).toContain(kind);
      const r = Number(svg.querySelector('circle')!.getAttribute('r'));
      // The drawing is derived from the millimetre record, not typed beside it.
      expect((2 * r) / COIN_PX_PER_MM).toBeCloseTo(COIN_MM[kind], 9);
      radius.set(kind, r);

      const faces = Array.from(svg.querySelectorAll('text')).map((t) => t.textContent ?? '');
      expect(faces.join(' ')).toBe(COIN_LEGEND[kind]);
      for (const face of faces) {
        expect(/\d/.test(face), `${kind} face "${face}"`).toBe(false);
        expect(face).not.toBe(String(COIN_VALUE[kind]));
        expect(face).not.toBe(`${COIN_VALUE[kind]}c`);
        expect(face).not.toBe(centsLabel(COIN_VALUE[kind]));
      }
    }

    // A dime is smaller than a nickel on screen because it is smaller in the hand.
    expect(radius.get('dime')!).toBeLessThan(radius.get('penny')!);
    expect(radius.get('penny')!).toBeLessThan(radius.get('nickel')!);
  });

  it('announces every coin instead of hiding the row from the listener', () => {
    render(createElement(MoneyCoinsGame));
    // Role queries skip aria-hidden subtrees, so finding these proves they are exposed.
    for (const kind of COIN_KINDS) {
      expect(screen.getAllByRole('img', { name: COIN_LABEL[kind] })).toHaveLength(1);
    }
    expect(screen.getByRole('group', { name: /coins/i })).toBeInTheDocument();
  });

  it('keeps the value key available without putting it in the question', () => {
    const { container } = render(createElement(MoneyCoinsGame));
    const key = container.querySelector('details.mini-game__key')!;
    expect(key).toBeTruthy();
    expect(key.querySelector('summary')!.textContent).toBe('Coin values');
    for (const kind of COIN_KINDS) {
      expect(key.textContent).toContain(COIN_LEGEND[kind]);
      expect(key.textContent).toContain(centsLabel(COIN_VALUE[kind]));
      expect(key.textContent).toContain(String(COIN_MM[kind]));
      expect(key.textContent).toContain(COIN_EDGE[kind]);
    }
    // A disclosure, so it is closed until asked for.
    expect((key as HTMLDetailsElement).open).toBe(false);
  });

  it('asks a question with no answer in it, and scores the total that is on the table '
    + '— fails if the prompt goes back to the coin expression', async () => {
    const user = userEvent.setup();
    const { container } = render(createElement(MoneyCoinsGame));

    for (let i = 0; i < MONEY_ROUNDS.length; i += 1) {
      const round = MONEY_ROUNDS[i];
      const where = `round ${i}`;

      const prompt = container.querySelector('.mini-game__prompt')!.textContent ?? '';
      expect(prompt, where).toBe(MONEY_PROMPT);
      expect(/\d/.test(prompt), `${where}: "${prompt}" contains a digit`).toBe(false);
      expect(/\d\s*[c¢]/i.test(prompt), `${where}: "${prompt}" contains a cents token`).toBe(false);

      const kinds = coinsInDom(container).map((c) => c.kind);
      expect(kinds.length, where).toBe(coinsOf(round).length);
      expect(screen.getAllByRole('img'), where).toHaveLength(kinds.length);

      // The total is recomputed from what is drawn, then used to answer the round.
      const drawnTotal = totalOf(kinds);
      expect(drawnTotal, where).toBe(roundTotal(round));

      await user.click(screen.getByRole('button', { name: centsLabel(drawnTotal) }));
      expect(container.querySelector('.mini-game__tally-count')!.textContent, where).toBe(String(i + 1));
      expect(screen.getByRole('status').textContent, where).toContain('Correct.');
      await user.click(screen.getByRole('button', { name: 'Next' }));
    }

    expect(container.querySelector('.mini-game__tally-count')!.textContent)
      .toBe(String(MONEY_ROUNDS.length));
  });

  it('leaves answered options reachable and states the sum on a miss', async () => {
    const user = userEvent.setup();
    render(createElement(MoneyCoinsGame));
    const answer = roundTotal(MONEY_ROUNDS[0]);
    const miss = getMoneyOptions(0).find((o) => o !== answer)!;

    await user.click(screen.getByRole('button', { name: centsLabel(miss) }));
    expect(screen.getByRole('status').textContent).toBe(getMoneyFeedback(0, miss));
    const option = screen.getByRole('button', { name: centsLabel(miss) });
    expect(option).not.toBeDisabled();
    expect(option.getAttribute('aria-disabled')).toBe('true');
  });
});
