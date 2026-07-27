import { describe, expect, it } from 'vitest';
import {
  FACE_ROUNDS,
  FEELING_MODES,
  FEELING_ROUNDS,
  FIND_ROUNDS,
  LETTER_ROUNDS,
  OPPOSITE_ROUNDS,
  feelingLabel,
  getFaceFeedback,
  getFaceOptions,
  getFeelingFeedback,
  getFeelingOptions,
  getFindFeedback,
  getFindOptions,
  getLetterFeedback,
  getLetterOptions,
  getOppositeFeedback,
  getOppositeOptions,
} from '../games/feelings';

const BANNED = /wrong|incorrect|\blose\b|failed|\bno\b|try again/i;

describe('Name the Feeling — shared story mode', () => {
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
        expect(feedback.length).toBeGreaterThan(0);
        expect(feedback).not.toMatch(/wrong|incorrect|lose|failed|try again/i);
      }
    }
  });
});

describe('Name the Feeling — mode registry', () => {
  it('offers five distinct modes', () => {
    expect(FEELING_MODES.length).toBe(5);
    expect(new Set(FEELING_MODES.map((m) => m.id)).size).toBe(5);
    for (const m of FEELING_MODES) {
      expect(m.label.length).toBeGreaterThan(0);
      expect(m.hint.length).toBeGreaterThan(0);
    }
  });
});

describe('Name the Feeling — Faces mode', () => {
  it('has rounds and always offers the correct feeling', () => {
    expect(FACE_ROUNDS.length).toBeGreaterThanOrEqual(1);
    for (const [index, round] of FACE_ROUNDS.entries()) {
      const options = getFaceOptions(index);
      expect(options).toContain(round.feeling);
      expect(new Set(options).size).toBe(options.length);
      const feedback = getFaceFeedback(round, round.feeling);
      expect(feedback.length).toBeGreaterThan(0);
      expect(feedback).not.toMatch(BANNED);
    }
  });
});

describe('Name the Feeling — First Letter mode', () => {
  it('has rounds and always offers the correct uppercase letter', () => {
    expect(LETTER_ROUNDS.length).toBeGreaterThanOrEqual(1);
    for (const [index, round] of LETTER_ROUNDS.entries()) {
      const options = getLetterOptions(index);
      expect(options).toContain(round.letter);
      expect(round.letter).toBe(round.feeling[0].toUpperCase());
      expect(new Set(options).size).toBe(options.length);
      expect(options.length).toBeGreaterThanOrEqual(3);
      const feedback = getLetterFeedback(round, round.letter);
      expect(feedback.length).toBeGreaterThan(0);
      expect(feedback).not.toMatch(BANNED);
    }
  });
});

describe('Name the Feeling — Find the Face mode', () => {
  it('has rounds and always offers the matching face', () => {
    expect(FIND_ROUNDS.length).toBeGreaterThanOrEqual(1);
    for (const [index, round] of FIND_ROUNDS.entries()) {
      const options = getFindOptions(index);
      expect(options).toContain(round.face);
      expect(new Set(options).size).toBe(options.length);
      expect(options.length).toBe(3);
      const feedback = getFindFeedback(round, round.face);
      expect(feedback.length).toBeGreaterThan(0);
      expect(feedback).not.toMatch(BANNED);
    }
  });
});

describe('Name the Feeling — Opposite mode', () => {
  it('has rounds and always offers the paired opposite', () => {
    expect(OPPOSITE_ROUNDS.length).toBeGreaterThanOrEqual(1);
    for (const [index, round] of OPPOSITE_ROUNDS.entries()) {
      const options = getOppositeOptions(index);
      expect(options).toContain(round.opposite);
      expect(options).not.toContain(round.feeling);
      expect(new Set(options).size).toBe(options.length);
      expect(options.length).toBeGreaterThanOrEqual(3);
      const feedback = getOppositeFeedback(round, round.opposite);
      expect(feedback).toMatch(new RegExp(feelingLabel(round.opposite), 'i'));
      expect(feedback.length).toBeGreaterThan(0);
      expect(feedback).not.toMatch(BANNED);
    }
  });
});
