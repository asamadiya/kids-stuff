/**
 * The Number Mill.
 *
 * The child bolts operation-blocks into a chain and pours a number in. The
 * chain IS a composed function, so order matters: doubling then adding one is
 * not adding one then doubling, and the two leave visibly different marks on
 * the hundred-square. Everything here is pure so the mill can be tested, and
 * so a saved mill replays exactly.
 */

export const NUMBER_MILL_META = {
  id: 'number-mill',
  title: 'The Number Mill',
  eyebrow: 'Number',
  note: 'Bolt blocks into a chain, pour a number in, and see what the whole chain does to every number at once.',
} as const;

export type BlockKind =
  | 'add'
  | 'take'
  | 'times'
  | 'halve'
  | 'nextEven'
  | 'nextOdd'
  | 'digitSum'
  | 'swapDigits';

export interface Block {
  readonly kind: BlockKind;
  /** Only `add`, `take` and `times` carry a setting. */
  readonly param: number;
}

export interface BlockSpec {
  readonly kind: BlockKind;
  /** Shown as drawn counters, never as a numeral the child must read. */
  readonly settable: boolean;
  readonly label: string;
  readonly spoken: string;
  readonly defaultParam: number;
}

export const BLOCKS: readonly BlockSpec[] = [
  { kind: 'add', settable: true, label: 'add', spoken: 'add', defaultParam: 1 },
  { kind: 'take', settable: true, label: 'take away', spoken: 'take away', defaultParam: 1 },
  { kind: 'times', settable: true, label: 'times', spoken: 'times', defaultParam: 2 },
  { kind: 'halve', settable: false, label: 'halve', spoken: 'halve it', defaultParam: 0 },
  { kind: 'nextEven', settable: false, label: 'next even', spoken: 'go to the next even number', defaultParam: 0 },
  { kind: 'nextOdd', settable: false, label: 'next odd', spoken: 'go to the next odd number', defaultParam: 0 },
  { kind: 'digitSum', settable: false, label: 'add the digits', spoken: 'add the digits together', defaultParam: 0 },
  { kind: 'swapDigits', settable: false, label: 'swap the digits', spoken: 'swap the digits round', defaultParam: 0 },
];

export const MAX_SLOTS = 4;
export const MAX_PARAM = 9;
/** Anything past this has walked off the hundred-square. */
export const OFF_THE_BOARD = 9999;

const digits = (n: number): number[] => String(Math.abs(Math.trunc(n))).split('').map(Number);

/** One block, applied. Always returns a whole number. */
export function applyBlock(block: Block, n: number): number {
  switch (block.kind) {
    case 'add':
      return n + block.param;
    case 'take':
      return n - block.param;
    case 'times':
      return n * block.param;
    case 'halve':
      // Halving an odd number would leave the whole numbers, so it holds.
      return n % 2 === 0 ? n / 2 : n;
    case 'nextEven':
      return n % 2 === 0 ? n + 2 : n + 1;
    case 'nextOdd':
      return n % 2 === 0 ? n + 1 : n + 2;
    case 'digitSum':
      return digits(n).reduce((a, b) => a + b, 0) * (n < 0 ? -1 : 1);
    case 'swapDigits': {
      const d = digits(n);
      if (d.length < 2) return n;
      const swapped = Number([...d].reverse().join(''));
      return n < 0 ? -swapped : swapped;
    }
    default:
      return n;
  }
}

/** The value at every station: [start, after block 1, after block 2, ...]. */
export function trace(chain: readonly Block[], start: number): number[] {
  const out: number[] = [start];
  let n = start;
  for (const block of chain) {
    n = applyBlock(block, n);
    out.push(n);
  }
  return out;
}

/** What the whole chain does to one number. */
export function run(chain: readonly Block[], start: number): number {
  return chain.reduce((n, block) => applyBlock(block, n), start);
}

/** The chain's image over 1..n — the RULE seen as a pattern rather than one case. */
export function runDomain(chain: readonly Block[], upTo = 20): { from: number; to: number }[] {
  const out: { from: number; to: number }[] = [];
  for (let i = 1; i <= upTo; i += 1) out.push({ from: i, to: run(chain, i) });
  return out;
}

/**
 * With the return pipe hooked up the mill eats its own output, so the chain is
 * iterated. Stops early on a fixed point or when a value repeats (a cycle), and
 * gives up once a value has walked off the board.
 */
export interface Orbit {
  readonly values: number[];
  readonly ending: 'fixed' | 'cycle' | 'off-the-board' | 'ran-on';
}

export function orbit(chain: readonly Block[], start: number, steps = 24): Orbit {
  const values: number[] = [start];
  const seen = new Set<number>([start]);
  let n = start;
  for (let i = 0; i < steps; i += 1) {
    const next = run(chain, n);
    if (Math.abs(next) > OFF_THE_BOARD) {
      values.push(next);
      return { values, ending: 'off-the-board' };
    }
    values.push(next);
    if (next === n) return { values, ending: 'fixed' };
    if (seen.has(next)) return { values, ending: 'cycle' };
    seen.add(next);
    n = next;
  }
  return { values, ending: 'ran-on' };
}

/** A plain reading of the chain, for speech and for the plate caption. */
export function describeChain(chain: readonly Block[]): string {
  if (chain.length === 0) return 'an empty mill';
  return chain
    .map((b) => {
      const spec = BLOCKS.find((s) => s.kind === b.kind);
      if (!spec) return '';
      return spec.settable ? `${spec.spoken} ${b.param}` : spec.spoken;
    })
    .join(', then ');
}
