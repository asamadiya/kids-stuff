import { describe, expect, it, vi } from 'vitest';
import { pickRound } from '../languages/deck';
import { WORDS } from '../languages';

// Walks every reachable state: seconds alone, longer under the full parallel suite.
vi.setConfig({ testTimeout: 60_000 });

/**
 * Astra round 3: `(round * 7) % pool.length` asked the same word forever with
 * seven recordings. Every recorded word must come up once per pass, with three
 * different pictures to choose from each time.
 */
describe('listening game deck', () => {
  it.each(Array.from({ length: 22 }, (_, i) => i + 3))('with %i recordings every word is asked once per pass', (n) => {
    const pool = WORDS.slice(0, n);
    for (let pass = 0; pass < 3; pass++) {
      const asked = Array.from({ length: n }, (_, i) => pickRound(pool, pass * n + i));
      expect(new Set(asked.map((r) => r.target.id)).size).toBe(n);
      for (const r of asked) {
        expect(new Set(r.choices.map((c) => c.id)).size).toBe(3);
        expect(r.choices.map((c) => c.id)).toContain(r.target.id);
      }
    }
  });
});
