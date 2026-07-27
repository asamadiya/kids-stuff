/**
 * The Ornament Lathe.
 *
 * A drawing language for someone who cannot read yet. Six instruction cards
 * make a path; a REPEAT bracket may hold other repeats, which is where the
 * recursion — and the very large outcome space — comes from. A symmetry stamp
 * then multiplies the path into a rosette, a frieze or a spiral.
 *
 * Everything is pure: the same program always draws the same ornament.
 */

export const ORNAMENT_LATHE_META = {
  id: 'ornament-lathe',
  title: 'The Ornament Lathe',
  eyebrow: 'Compose',
  note: 'Lay out instruction cards to draw one stroke at a time, put repeats inside repeats, and turn the whole path into an ornament.',
} as const;

export type Op = 'forward' | 'left' | 'right' | 'lift' | 'drop' | 'grow' | 'shrink';

/** The flat program the child edits. Brackets may nest. */
export type Token =
  | { readonly kind: 'op'; readonly op: Op }
  | { readonly kind: 'repeat'; readonly times: number }
  | { readonly kind: 'end' };

export interface OpSpec {
  readonly op: Op;
  readonly label: string;
  readonly spoken: string;
  readonly glyph: string;
}

export const OPS: readonly OpSpec[] = [
  { op: 'forward', label: 'draw', spoken: 'draw a stroke', glyph: '│' },
  { op: 'left', label: 'turn left', spoken: 'turn left', glyph: '↰' },
  { op: 'right', label: 'turn right', spoken: 'turn right', glyph: '↱' },
  { op: 'lift', label: 'lift', spoken: 'lift the pen', glyph: '◌' },
  { op: 'drop', label: 'drop', spoken: 'put the pen down', glyph: '●' },
  { op: 'grow', label: 'grow', spoken: 'make the stroke longer', glyph: '▲' },
  { op: 'shrink', label: 'shrink', spoken: 'make the stroke shorter', glyph: '▼' },
];

export const MAX_TOKENS = 24;
export const MAX_REPEAT = 12;
/** A hard ceiling, so a nest of repeats cannot hang the page. */
export const MAX_SEGMENTS = 6000;

export type Symmetry = 'none' | 'r2' | 'r3' | 'r4' | 'r6' | 'r8' | 'mirror' | 'frieze' | 'spiral';

export interface SymmetrySpec {
  readonly id: Symmetry;
  readonly label: string;
  /** How many copies of the path the stamp lays down. */
  readonly copies: number;
}

export const SYMMETRIES: readonly SymmetrySpec[] = [
  { id: 'none', label: 'one', copies: 1 },
  { id: 'r2', label: 'two-fold', copies: 2 },
  { id: 'r3', label: 'three-fold', copies: 3 },
  { id: 'r4', label: 'four-fold', copies: 4 },
  { id: 'r6', label: 'six-fold', copies: 6 },
  { id: 'r8', label: 'eight-fold', copies: 8 },
  { id: 'mirror', label: 'mirrored', copies: 2 },
  { id: 'frieze', label: 'a border', copies: 5 },
  { id: 'spiral', label: 'a spiral', copies: 7 },
];

export interface Segment {
  readonly x1: number; readonly y1: number;
  readonly x2: number; readonly y2: number;
}

/* --------------------------------------------------------------- the tree -- */

export type Node =
  | { readonly kind: 'op'; readonly op: Op }
  | { readonly kind: 'loop'; readonly times: number; readonly body: readonly Node[] };

/**
 * Parse the flat token list into a tree. Unmatched brackets are forgiving: an
 * unclosed repeat simply runs to the end, and a stray end is ignored — the
 * child is arranging cards, not compiling.
 */
export function parse(tokens: readonly Token[]): Node[] {
  const walk = (at: number, depth: number): { nodes: Node[]; next: number } => {
    const nodes: Node[] = [];
    let i = at;
    while (i < tokens.length) {
      const t = tokens[i];
      if (t.kind === 'op') { nodes.push({ kind: 'op', op: t.op }); i += 1; continue; }
      if (t.kind === 'repeat') {
        if (depth >= 4) { i += 1; continue; }
        const inner = walk(i + 1, depth + 1);
        nodes.push({ kind: 'loop', times: Math.max(1, Math.min(MAX_REPEAT, t.times)), body: inner.nodes });
        i = inner.next;
        continue;
      }
      return { nodes, next: i + 1 };
    }
    return { nodes, next: i };
  };
  return walk(0, 0).nodes;
}

/** How many strokes the program draws, brackets expanded. */
export function strokeCount(nodes: readonly Node[]): number {
  return nodes.reduce((n, node) => {
    if (node.kind === 'op') return n + (node.op === 'forward' ? 1 : 0);
    return n + node.times * strokeCount(node.body);
  }, 0);
}

export interface TurtleSettings {
  readonly turn: number;
  readonly step: number;
  readonly growth: number;
}

export const DEFAULTS: TurtleSettings = { turn: 45, step: 26, growth: 1.06 };

/** Run the program and return the strokes it draws, in order. */
export function draw(nodes: readonly Node[], settings: TurtleSettings = DEFAULTS): Segment[] {
  const out: Segment[] = [];
  const state = { x: 0, y: 0, heading: -90, step: settings.step, pen: true };
  const run = (list: readonly Node[]): void => {
    for (const node of list) {
      if (out.length >= MAX_SEGMENTS) return;
      if (node.kind === 'loop') {
        for (let i = 0; i < node.times; i += 1) {
          run(node.body);
          if (out.length >= MAX_SEGMENTS) return;
        }
        continue;
      }
      switch (node.op) {
        case 'forward': {
          const rad = (state.heading * Math.PI) / 180;
          const nx = state.x + Math.cos(rad) * state.step;
          const ny = state.y + Math.sin(rad) * state.step;
          if (state.pen) out.push({ x1: state.x, y1: state.y, x2: nx, y2: ny });
          state.x = nx; state.y = ny;
          break;
        }
        case 'left': state.heading -= settings.turn; break;
        case 'right': state.heading += settings.turn; break;
        case 'lift': state.pen = false; break;
        case 'drop': state.pen = true; break;
        case 'grow': state.step *= settings.growth; break;
        case 'shrink': state.step /= settings.growth; break;
      }
    }
  };
  run(nodes);
  return out;
}

const rotate = (s: Segment, deg: number, scale = 1): Segment => {
  const r = (deg * Math.PI) / 180, c = Math.cos(r) * scale, n = Math.sin(r) * scale;
  return {
    x1: s.x1 * c - s.y1 * n, y1: s.x1 * n + s.y1 * c,
    x2: s.x2 * c - s.y2 * n, y2: s.x2 * n + s.y2 * c,
  };
};

/** Lay the stamp down: the path, multiplied. */
export function stamp(path: readonly Segment[], sym: Symmetry): Segment[] {
  const spec = SYMMETRIES.find((s) => s.id === sym) ?? SYMMETRIES[0];
  if (sym === 'none') return [...path];
  if (sym === 'mirror') return [...path, ...path.map((s) => ({ x1: -s.x1, y1: s.y1, x2: -s.x2, y2: s.y2 }))];
  if (sym === 'frieze') {
    const width = Math.max(40, ...path.map((s) => Math.max(Math.abs(s.x1), Math.abs(s.x2))) ) * 2.1;
    return Array.from({ length: spec.copies }, (_, i) =>
      path.map((s) => ({
        x1: s.x1 + (i - (spec.copies - 1) / 2) * width, y1: s.y1,
        x2: s.x2 + (i - (spec.copies - 1) / 2) * width, y2: s.y2,
      }))).flat();
  }
  if (sym === 'spiral') {
    return Array.from({ length: spec.copies }, (_, i) =>
      path.map((s) => rotate(s, (360 / spec.copies) * i, 1 - i * 0.09))).flat();
  }
  return Array.from({ length: spec.copies }, (_, i) =>
    path.map((s) => rotate(s, (360 / spec.copies) * i))).flat();
}

/** Fit the ornament to a box, returning an SVG path plus the transform used. */
export function toPath(segments: readonly Segment[], size: number, pad = 14): string {
  if (segments.length === 0) return '';
  const xs = segments.flatMap((s) => [s.x1, s.x2]);
  const ys = segments.flatMap((s) => [s.y1, s.y2]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const w = Math.max(1e-6, maxX - minX), h = Math.max(1e-6, maxY - minY);
  const k = Math.min((size - pad * 2) / w, (size - pad * 2) / h);
  const ox = (size - w * k) / 2 - minX * k;
  const oy = (size - h * k) / 2 - minY * k;
  const at = (x: number, y: number) => `${(x * k + ox).toFixed(2)} ${(y * k + oy).toFixed(2)}`;
  return segments.map((s) => `M ${at(s.x1, s.y1)} L ${at(s.x2, s.y2)}`).join(' ');
}

/** The ornament states its own grammar, in plain measured words. */
export function catalogueLine(
  nodes: readonly Node[],
  sym: Symmetry,
  settings: TurtleSettings = DEFAULTS,
): string {
  const spec = SYMMETRIES.find((s) => s.id === sym) ?? SYMMETRIES[0];
  const strokes = strokeCount(nodes);
  const grows = Math.round((settings.growth - 1) * 100);
  const parts = [
    spec.label === 'one' ? 'single' : spec.label,
    `${strokes} ${strokes === 1 ? 'stroke' : 'strokes'}`,
    `turn ${settings.turn}°`,
  ];
  if (nodes.some((n) => n.kind === 'loop')) parts.push(`repeats ${deepest(nodes)} deep`);
  if (grows !== 0) parts.push(`grows ${grows}% each time`);
  return parts.join('; ');
}

/** How deeply repeats are nested. */
export function deepest(nodes: readonly Node[]): number {
  return nodes.reduce((m, n) => (n.kind === 'loop' ? Math.max(m, 1 + deepest(n.body)) : m), 0);
}
