import { describe, expect, it } from 'vitest';
import {
  FEELING_ROUNDS,
  getFeelingFeedback,
  getFeelingOptions,
} from '../games/feelings';

describe('Name the Feeling game logic', () => {
  it('provides a varied set of curated rounds', () => {
    expect(FEELING_ROUNDS.length).toBeGreaterThanOrEqual(12);
    expect(FEELING_ROUNDS.length).toBeLessThanOrEqual(16);
    expect(new Set(FEELING_ROUNDS.map((round) => round.feeling)).size).toBeGreaterThanOrEqual(8);
  });

  it('always includes the round feeling among unique options', () => {
    for (const [index, round] of FEELING_ROUNDS.entries()) {
      const options = getFeelingOptions(index);
      expect(options).toContain(round.feeling);
      expect(new Set(options).size).toBe(options.length);
      expect(options.length).toBeGreaterThanOrEqual(3);
      expect(options.length).toBeLessThanOrEqual(4);
    }
  });

  it('responds kindly to every choice without a fail state', () => {
    for (const round of FEELING_ROUNDS) {
      for (const feeling of getFeelingOptions(FEELING_ROUNDS.indexOf(round))) {
        const feedback = getFeelingFeedback(round, feeling);
        expect(feedback).toMatch(new RegExp(feeling, 'i'));
        expect(feedback).not.toMatch(/wrong|incorrect|lose|failed|try again/i);
      }
    }
  });
});
