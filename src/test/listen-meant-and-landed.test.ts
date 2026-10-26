import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { textKey } from '../audio/readAloud';
import {
  LANDINGS,
  LISTEN,
  MEANT_AND_LANDED_META,
  MOMENTS,
  SIDE_KEYS,
  THIRD_CLAUSE,
  THOUGHTS,
  landedClause,
  meantClause,
  sideOf,
  listenLines,
  type Side,
} from '../sel/meant-and-landed';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Read-aloud in Meant and Landed (audit .redesign/v4/research/sel-audit.md,
 * "Per component" 4): every line a button can ask for is one the clip builder
 * is handed, so the build makes every clip a button needs.
 */

const lines = listenLines();
const known = new Set(lines.map(textKey));
const allSides = (): Side[] => MOMENTS.flatMap((m) => SIDE_KEYS.map((k) => sideOf(m, k)));

describe('meant-and-landed: the lines handed to the clip builder', () => {
  it('has no empty line, no duplicate after normalising, and none over 300 characters', () => {
    for (const line of lines) {
      expect(textKey(line), JSON.stringify(line)).not.toBe('');
      expect(line.length, line).toBeLessThanOrEqual(300);
    }
    expect(known.size).toBe(lines.length);
  });

  it('is exactly the audit’s set, built independently of LISTEN: 311 atoms', () => {
    // The reference enumeration (.redesign/v4/research/sel-audit-enumerate.ts), restated.
    const who = (s: string): string => (s === 'You' ? 'you' : s);
    const expected = new Set<string>([
      MEANT_AND_LANDED_META.title,
      THIRD_CLAUSE,
      ...THOUGHTS.map((t) => t.label),
      ...LANDINGS.map((l) => l.word),
      ...MOMENTS.flatMap((m) => [
        m.caption,
        ...SIDE_KEYS.flatMap((k) => {
          const s = m.sides[k];
          return [
            s.ask,
            `What ${who(s.actor.subject)} meant`,
            `How it landed on ${who(s.receiver.subject)}`,
            ...THOUGHTS.map((t) => meantClause(s, t)),
            ...LANDINGS.map((l) => landedClause(s, l)),
          ];
        }),
      ]),
    ]);
    expect(new Set(lines)).toEqual(expected);
    expect(lines).toHaveLength(311);
  });

  it('voices no grown-up note', () => {
    expect(known.has(textKey(MEANT_AND_LANDED_META.note))).toBe(false);
  });
});

describe('meant-and-landed: every state a button can be in reads only known lines', () => {
  const missing: string[] = [];
  const check = (texts: readonly string[]): void => {
    expect(texts.length).toBeGreaterThan(0);
    for (const t of texts) if (!known.has(textKey(t))) missing.push(t);
  };

  it('walks every moment, both sides, and every pair of rails', () => {
    check(LISTEN.title());
    let joins = 0;
    for (const moment of MOMENTS) {
      for (const key of SIDE_KEYS) {
        const side = sideOf(moment, key);
        check(LISTEN.ask(moment, side));
        check(LISTEN.meant(side));
        check(LISTEN.landed(side));
        for (const thought of THOUGHTS) {
          for (const landing of LANDINGS) {
            const clauses = LISTEN.joined(side, thought, landing);
            expect(clauses).toHaveLength(3);
            check(clauses);
            joins += 1;
          }
        }
      }
    }
    expect(joins).toBe(allSides().length * THOUGHTS.length * LANDINGS.length);
    expect(missing).toEqual([]);
  });

  it('reads each tray as its label and then every choice in order', () => {
    for (const side of allSides()) {
      expect(LISTEN.meant(side)).toEqual([LISTEN.meant(side)[0], ...THOUGHTS.map((t) => t.label)]);
      expect(LISTEN.landed(side)).toHaveLength(1 + LANDINGS.length);
      expect(LISTEN.landed(side).slice(1)).toEqual(LANDINGS.map((l) => l.word));
    }
  });
});

describe('meant-and-landed: nothing speaks on its own', () => {
  it('has no say() left in the component', () => {
    const src = readFileSync('src/components/sel/MeantAndLanded.tsx', 'utf8');
    expect(src).not.toMatch(/\bsay\(/);
    expect(src).not.toMatch(/lib\/say/);
  });
});
