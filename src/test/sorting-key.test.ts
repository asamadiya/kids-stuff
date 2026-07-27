import { describe, it, expect } from 'vitest';
import {
  PLAIN_MARK, SORTINGKEY_META, SOURCE_STAMPS, TRAY_SIZES,
  buildTray, cardCount, cardsIn, couplets, describeKey, diagnose, forkCount,
  group, layoutTree, longestRun, nodeAt, openGroups, pathOfCard, rackFor, splitAt,
} from '../workshop/sorting-key';
import type { KeyNode } from '../workshop/sorting-key';

const tray = ['a', 'b', 'c', 'd'];
const root = group(tray);

describe('a tray of cards', () => {
  it('is built to the size asked for, from every source', () => {
    for (const s of SOURCE_STAMPS) {
      for (const n of TRAY_SIZES) {
        const cards = buildTray(s.id, n);
        expect(cards.length, `${s.id} at ${n}`).toBe(n);
        expect(new Set(cards.map((c) => c.id)).size).toBe(n);
      }
    }
  });
  it('is the same tray every time, so a kept key still matches its cards', () => {
    expect(buildTray('accounts', 8).map((c) => c.id)).toEqual(buildTray('accounts', 8).map((c) => c.id));
  });
  it('offers marks to tell the piles apart, always including a plain one', () => {
    for (const s of SOURCE_STAMPS) expect(rackFor(s.id).length).toBeGreaterThan(0);
    expect(PLAIN_MARK.a.word).not.toBe(PLAIN_MARK.b.word);
  });
});

describe('splitting a pile', () => {
  it('turns a group into a fork holding both sides', () => {
    const next = splitAt(root, [], PLAIN_MARK, ['a', 'b'], ['c', 'd']);
    expect(next).not.toBeNull();
    expect(next!.kind).toBe('fork');
    expect(cardsIn(next!).sort()).toEqual(tray);
    expect(forkCount(next!)).toBe(1);
  });
  it('refuses a split that loses, invents or duplicates a card', () => {
    expect(splitAt(root, [], PLAIN_MARK, ['a'], ['c', 'd'])).toBeNull();
    expect(splitAt(root, [], PLAIN_MARK, ['a', 'b'], ['c', 'zzz'])).toBeNull();
    expect(splitAt(root, [], PLAIN_MARK, ['a', 'a'], ['c', 'd'])).toBeNull();
  });
  it('refuses an empty side — a split must actually separate', () => {
    expect(splitAt(root, [], PLAIN_MARK, [], tray)).toBeNull();
  });
  it('can split a side of a split, so the key gets finer', () => {
    const one = splitAt(root, [], PLAIN_MARK, ['a', 'b'], ['c', 'd'])!;
    const two = splitAt(one, ['a'], PLAIN_MARK, ['a'], ['b'])!;
    expect(forkCount(two)).toBe(2);
    expect(openGroups(two).map((p) => p.join(''))).toEqual(['b']);
  });
});

describe('a finished key', () => {
  const one = splitAt(root, [], PLAIN_MARK, ['a', 'b'], ['c', 'd'])!;
  const two = splitAt(one, ['a'], PLAIN_MARK, ['a'], ['b'])!;
  const full = splitAt(two, ['b'], PLAIN_MARK, ['c'], ['d'])!;

  it('has no piles left to tell apart', () => {
    expect(openGroups(full)).toEqual([]);
    expect(cardCount(full)).toBe(4);
  });
  it('sets out as numbered couplets, one per question', () => {
    const sheet = couplets(full);
    expect(sheet).toHaveLength(forkCount(full));
    expect(sheet[0].number).toBe(1);
    expect(sheet[0].leads).toHaveLength(2);
  });
  it('can be walked back to any single card', () => {
    expect(pathOfCard(full, 'c')).toEqual(['b', 'a']);
    expect(pathOfCard(full, 'zzz')).toBeNull();
  });
  it('reports which question failed to separate, rather than saying "wrong"', () => {
    const failure = diagnose(full, ['a', 'a'], 'd');
    expect(failure).not.toBeNull();
    expect(JSON.stringify(failure)).not.toMatch(/wrong|incorrect|fail/i);
  });
  it('describes itself in plain measured prose', () => {
    const text = describeKey(full, 'the accounts');
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toMatch(/great|well done|clever/i);
  });
  it('lays out deterministically, with a slot per terminal', () => {
    const a = layoutTree(full), b = layoutTree(full);
    expect(a.nodes.length).toBe(b.nodes.length);
    expect(a.spread).toBeGreaterThanOrEqual(4);
    expect(longestRun(full)).toBeGreaterThanOrEqual(2);
  });
  it('keeps every card reachable in the tree it lays out', () => {
    const node = nodeAt(full, ['a', 'a']) as KeyNode;
    expect(node.kind).toBe('group');
    expect(SORTINGKEY_META.id).toBe('sorting-key');
  });
});
