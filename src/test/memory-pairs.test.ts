import { describe, it, expect } from 'vitest';
import {
  MEMORY_POOLS,
  MEMORY_PAIRS_META,
  buildDeck,
  matchFeedback,
  winFeedback,
  memoryHint,
  PAIRS_PER_ROUND,
  CARDS_PER_ROUND,
} from '../games/memory-pairs';

describe('memory-pairs data', () => {
  it('has a non-empty pool list', () => {
    expect(MEMORY_POOLS.length).toBeGreaterThan(0);
  });

  it('every pool has exactly 4 distinct emojis', () => {
    for (const pool of MEMORY_POOLS) {
      expect(pool.length).toBe(PAIRS_PER_ROUND);
      expect(new Set(pool).size).toBe(PAIRS_PER_ROUND);
    }
  });

  it('exposes valid meta', () => {
    expect(MEMORY_PAIRS_META.id).toBe('memory-pairs');
    expect(MEMORY_PAIRS_META.title.length).toBeGreaterThan(0);
    expect(MEMORY_PAIRS_META.color).toBe('plum');
  });
});

describe('buildDeck', () => {
  it('produces 8 cards / 4 pairs for every round', () => {
    for (let round = 0; round < MEMORY_POOLS.length + 2; round++) {
      const deck = buildDeck(round);
      expect(deck.length).toBe(CARDS_PER_ROUND);

      const byPair = new Map<number, number>();
      for (const card of deck) {
        byPair.set(card.pairId, (byPair.get(card.pairId) ?? 0) + 1);
      }
      expect(byPair.size).toBe(PAIRS_PER_ROUND);
      for (const count of byPair.values()) {
        expect(count).toBe(2);
      }
    }
  });

  it('gives every card a unique id', () => {
    const deck = buildDeck(0);
    expect(new Set(deck.map((c) => c.id)).size).toBe(CARDS_PER_ROUND);
  });

  it('matching cards share an emoji', () => {
    const deck = buildDeck(3);
    for (let p = 0; p < PAIRS_PER_ROUND; p++) {
      const cards = deck.filter((c) => c.pairId === p);
      expect(cards.length).toBe(2);
      expect(cards[0].emoji).toBe(cards[1].emoji);
    }
  });

  it('is deterministic across calls', () => {
    expect(buildDeck(5)).toEqual(buildDeck(5));
  });

});

describe('feedback helpers', () => {
  it('matchFeedback returns non-empty strings for both outcomes', () => {
    expect(matchFeedback(true).length).toBeGreaterThan(0);
    expect(matchFeedback(false).length).toBeGreaterThan(0);
  });

  it('winFeedback returns a non-empty string', () => {
    expect(winFeedback().length).toBeGreaterThan(0);
  });

  it('memoryHint returns a non-empty string for any progress', () => {
    for (let found = 0; found <= PAIRS_PER_ROUND; found++) {
      expect(memoryHint(found).length).toBeGreaterThan(0);
    }
  });
});
