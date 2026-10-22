import type { Pair } from './types';

/**
 * Round `n` of the listening game. Every recorded word is asked once before any
 * is asked again: the pool is dealt in a shuffled order (seeded by which pass
 * through the pool this is, so it is stable across renders), and the two other
 * pictures are the next two cards after the target in that same order.
 */
export function pickRound(pool: readonly Pair[], n: number) {
  const pass = Math.floor(n / pool.length);
  const order = shuffled(pool, pass + 1);
  const at = n % pool.length;
  const target = order[at];
  const others = [order[(at + 1) % order.length], order[(at + 2) % order.length]];
  const choices = [target, ...others];
  const rot = (n * 2 + pass) % choices.length;
  return { target, choices: [...choices.slice(rot), ...choices.slice(0, rot)] };
}

/** A deterministic Fisher–Yates shuffle (mulberry32 seeded). */
function shuffled<T>(xs: readonly T[], seed: number): T[] {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
