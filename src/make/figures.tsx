import type { ReactElement, ReactNode } from 'react';

/**
 * Drawn diagrams for Make & Do steps whose point is exact geometry.
 *
 * The vision review of the generated step pictures found twelve dots where
 * the kolam step says nine, dots joined into a lattice (a kolam never joins
 * them), and a "tangram" of twenty rectangles. Those steps are only any use
 * if the count and the shapes are right, so they are drawn here from numbers,
 * in the same 1152x896 frame as the paintings so a step card keeps its size.
 * The step's `art` string is the figure's accessible description.
 */

const W = 1152;
const INK = '#24170f';
const H = 896;
type Pt = readonly [number, number];

function Frame({ label, ground, children }: { readonly label: string; readonly ground: string; readonly children: ReactNode }) {
  return (
    <svg className="make-figure" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      <rect width={W} height={H} fill={ground} />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------- kolam ----- */

const PAVING = '#5b6470';
const CHALK = '#fdfaf2';
const DOORSTEP = '#8a4a2c';
const FLOUR = '#f3ead7';
const GAP = 200;

/** A path through the dots: straight runs along a row, half-circle turns between rows. */
interface Sample {
  readonly p: Pt;
  readonly t: Pt;
  /** k·π at the k-th dot along the path; linear in arc length between dots. */
  readonly phase: number;
}

function straight(a: Pt, b: Pt, k: number, n = 48): Sample[] {
  const t: Pt = [(b[0] - a[0]) / GAP, (b[1] - a[1]) / GAP];
  return Array.from({ length: n }, (_, i) => {
    const u = i / n;
    return { p: [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u] as Pt, t, phase: (k + u) * Math.PI };
  });
}

/** Half-turn from a (heading `dir`) down to the row below, ending at a + (0, GAP). */
function uturn(a: Pt, dir: 1 | -1, k: number, n = 72): Sample[] {
  const c: Pt = [a[0], a[1] + GAP / 2];
  const r = GAP / 2;
  return Array.from({ length: n }, (_, i) => {
    const u = i / n;
    const ang = -Math.PI / 2 + u * Math.PI; // top of the circle round to the bottom
    const p: Pt = [c[0] + dir * r * Math.cos(ang), c[1] + r * Math.sin(ang)];
    const t: Pt = [-dir * Math.sin(ang), Math.cos(ang)];
    return { p, t, phase: (k + u) * Math.PI };
  });
}

/**
 * One unbroken line round dots laid along a path: it passes on one side of
 * the first dot, crosses the path between each pair, passes on the other side
 * of the next, turns round the last dot, and comes home on the opposite sides,
 * so every dot sits in its own loop. With amplitude A < GAP/2 the line never
 * touches itself on a turn.
 */
function weave(samples: readonly Sample[], end: Sample, A = 0.4 * GAP): string {
  const all = [...samples, end];
  const n = (s: Sample): Pt => [s.t[1], -s.t[0]];
  const off = (s: Sample, sign: 1 | -1): Pt => {
    const c = Math.cos(s.phase) * A * sign;
    const m = n(s);
    return [s.p[0] + m[0] * c, s.p[1] + m[1] * c];
  };
  const cap = (s: Sample, from: 1 | -1, back: boolean): Pt[] =>
    Array.from({ length: 25 }, (_, i) => {
      const psi = (i / 24) * Math.PI;
      const m = n(s);
      const c = Math.cos(s.phase) * from;
      const dir = back ? -1 : 1;
      return [s.p[0] + A * (Math.cos(psi) * m[0] * c + Math.sin(psi) * s.t[0] * dir), s.p[1] + A * (Math.cos(psi) * m[1] * c + Math.sin(psi) * s.t[1] * dir)] as Pt;
    });
  const pts: Pt[] = [
    ...all.map((s) => off(s, 1)),
    ...cap(end, 1, false),
    ...[...all].reverse().map((s) => off(s, -1)),
    ...cap(all[0], -1, true),
  ];
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
}

function row(cx: number, cy: number, count: number): { dots: Pt[]; d: string } {
  const x0 = cx - ((count - 1) / 2) * GAP;
  const dots: Pt[] = Array.from({ length: count }, (_, i) => [x0 + i * GAP, cy]);
  const samples = dots.slice(0, -1).flatMap((a, i) => straight(a, dots[i + 1], i));
  const last = dots[count - 1];
  const end: Sample = { p: last, t: [1, 0], phase: (count - 1) * Math.PI };
  return { dots, d: weave(samples.length ? samples : [end], end) };
}

/** Nine dots as one bendy row: along the top, back along the middle, along the bottom. */
function grid(cx: number, cy: number): { dots: Pt[]; d: string } {
  const at = (c: number, r: number): Pt => [cx + (c - 1) * GAP, cy + (r - 1) * GAP];
  const order: Pt[] = [at(0, 0), at(1, 0), at(2, 0), at(2, 1), at(1, 1), at(0, 1), at(0, 2), at(1, 2), at(2, 2)];
  const s = [
    ...straight(order[0], order[1], 0),
    ...straight(order[1], order[2], 1),
    ...uturn(order[2], 1, 2),
    ...straight(order[3], order[4], 3),
    ...straight(order[4], order[5], 4),
    ...uturn(order[5], -1, 5),
    ...straight(order[6], order[7], 6),
    ...straight(order[7], order[8], 7),
  ];
  return { dots: order, d: weave(s, { p: order[8], t: [1, 0], phase: 8 * Math.PI }) };
}

const Dots = ({ pts, r = 18, fill = CHALK }: { readonly pts: readonly Pt[]; readonly r?: number; readonly fill?: string }) => (
  <g>
    {pts.map(([x, y]) => (
      <circle key={`${x},${y}`} cx={x} cy={y} r={r} fill={fill} />
    ))}
  </g>
);

const Line = ({ d, color = CHALK, width = 13 }: { readonly d: string; readonly color?: string; readonly width?: number }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" strokeLinecap="round" />
);

const KOLAM: Record<string, (label: string) => ReactElement> = {
  'kolam-1': (label) => (
    <Frame label={label} ground={PAVING}>
      <Dots pts={grid(W / 2, H / 2).dots} r={22} />
    </Frame>
  ),
  'kolam-2': (label) => {
    const one = row(300, H / 2, 1);
    const two = row(780, H / 2, 2);
    return (
      <Frame label={label} ground={PAVING}>
        <Dots pts={[...one.dots, ...two.dots]} />
        <Line d={one.d} />
        <Line d={two.d} />
      </Frame>
    );
  },
  'kolam-3': (label) => {
    const r = row(W / 2, H / 2, 3);
    return (
      <Frame label={label} ground={PAVING}>
        <Dots pts={r.dots} />
        <Line d={r.d} />
      </Frame>
    );
  },
  'kolam-4': (label) => {
    const g = grid(W / 2, H / 2);
    return (
      <Frame label={label} ground={PAVING}>
        <Dots pts={g.dots} />
        <Line d={g.d} />
      </Frame>
    );
  },
  'kolam-5': (label) => {
    const g = grid(W / 2, H / 2);
    return (
      <Frame label={label} ground={PAVING}>
        <Dots pts={g.dots} />
        <Line d={g.d} />
        <Line d={g.d} color="#e9b949" width={5} />
        <circle cx={g.dots[0][0] - 0.4 * GAP} cy={g.dots[0][1]} r={20} fill="#e9b949" />
      </Frame>
    );
  },
  'kolam-6': (label) => {
    const r = row(W / 2, H / 2, 3);
    return (
      <Frame label={label} ground={DOORSTEP}>
        <Dots pts={r.dots} r={22} fill={FLOUR} />
        <Line d={r.d} color={FLOUR} width={24} />
      </Frame>
    );
  },
};

/* ------------------------------------------------------------ tangram ---- */

const PAPER = '#f7f1e4';
const CARD = '#1c6dd0';
const CARD_2 = '#4a8fe3';
const EDGE = '#0f4790';
const SLANT = '#e9b949';
const SLANT_EDGE = '#8a6416';
const GUIDE = '#5a4636';

/**
 * The seven pieces of a 4x4 square: two big triangles, the middle triangle,
 * two small triangles, the small square and the slanted piece. Areas 4, 4, 2,
 * 1, 1, 2, 2: two small triangles cover the square, and also the middle one.
 */
const PIECES: Record<string, readonly Pt[]> = {
  big1: [[0, 0], [4, 0], [2, 2]],
  big2: [[0, 0], [2, 2], [0, 4]],
  mid: [[4, 2], [4, 4], [2, 4]],
  small1: [[4, 0], [4, 2], [3, 1]],
  square: [[3, 1], [4, 2], [3, 3], [2, 2]],
  small2: [[2, 2], [3, 3], [1, 3]],
  slant: [[0, 4], [1, 3], [3, 3], [2, 4]],
};
const ORDER = ['big1', 'big2', 'mid', 'small1', 'small2', 'square', 'slant'] as const;

const pts = (ps: readonly Pt[], ox: number, oy: number, u: number) => ps.map(([x, y]) => `${(ox + x * u).toFixed(1)},${(oy + y * u).toFixed(1)}`).join(' ');

const Piece = ({ ps, ox, oy, u, fill = CARD, edge = EDGE }: { readonly ps: readonly Pt[]; readonly ox: number; readonly oy: number; readonly u: number; readonly fill?: string; readonly edge?: string }) => (
  <polygon points={pts(ps, ox, oy, u)} fill={fill} stroke={edge} strokeWidth={6} strokeLinejoin="round" />
);
const Guide = ({ ps, ox, oy, u }: { readonly ps: readonly Pt[]; readonly ox: number; readonly oy: number; readonly u: number }) => (
  <polygon points={pts(ps, ox, oy, u)} fill="none" stroke={GUIDE} strokeWidth={4} strokeDasharray="16 12" strokeLinejoin="round" />
);
const colour = (id: string) => (id === 'slant' ? { fill: SLANT, edge: SLANT_EDGE } : id.startsWith('small') ? { fill: CARD_2, edge: EDGE } : {});

const TANGRAM: Record<string, (label: string) => ReactElement> = {
  // The square pulled apart: every piece where it came from, so all seven can be counted.
  'tangram-2': (label) => {
    const u = 150;
    const ox = (W - 4 * u) / 2;
    const oy = (H - 4 * u) / 2;
    const spread = 0.55;
    return (
      <Frame label={label} ground={PAPER}>
        {ORDER.map((id) => {
          const ps = PIECES[id];
          const cx = ps.reduce((a, p) => a + p[0], 0) / ps.length - 2;
          const cy = ps.reduce((a, p) => a + p[1], 0) / ps.length - 2;
          return <Piece key={id} ps={ps} ox={ox + cx * u * spread} oy={oy + cy * u * spread} u={u} {...colour(id)} />;
        })}
      </Frame>
    );
  },
  // Two small triangles exactly cover the square, and exactly cover the middle triangle.
  'tangram-3': (label) => {
    const u = 190;
    const sq = { ox: 230 - 2 * u, oy: H / 2 - 2 * u };
    const md = { ox: 640 - 2 * u, oy: H / 2 - 3 * u };
    return (
      <Frame label={label} ground={PAPER}>
        <Piece ps={[[2, 2], [3, 1], [3, 3]]} {...sq} u={u} fill={CARD_2} />
        <Piece ps={[[3, 1], [4, 2], [3, 3]]} {...sq} u={u} fill={CARD_2} />
        <Guide ps={PIECES.square} {...sq} u={u} />
        <Piece ps={[[4, 2], [4, 4], [3, 3]]} {...md} u={u} fill={CARD_2} />
        <Piece ps={[[4, 4], [2, 4], [3, 3]]} {...md} u={u} fill={CARD_2} />
        <Guide ps={PIECES.mid} {...md} u={u} />
      </Frame>
    );
  },
  'tangram-4': (label) => {
    const u = 170;
    const ox = (W - 4 * u) / 2;
    const oy = (H - 4 * u) / 2;
    return (
      <Frame label={label} ground={PAPER}>
        {ORDER.map((id) => (
          <Piece key={id} ps={PIECES[id]} ox={ox} oy={oy} u={u} {...colour(id)} />
        ))}
      </Frame>
    );
  },
  // Walls: the two big triangles joined on their long sides, a square whose side
  // equals the middle triangle's long side; the middle triangle is the roof.
  'tangram-5': (label) => {
    const s = 500;
    const x = (W - s) / 2;
    const top = (H - 1.5 * s) / 2;
    const wall = top + s / 2;
    const roof: Pt[] = [[x, wall], [x + s / 2, top], [x + s, wall]];
    return (
      <Frame label={label} ground={PAPER}>
        <polygon points={`${x},${wall} ${x + s},${wall} ${x},${wall + s}`} fill={CARD} stroke={EDGE} strokeWidth={6} strokeLinejoin="round" />
        <polygon points={`${x + s},${wall} ${x + s},${wall + s} ${x},${wall + s}`} fill={CARD} stroke={EDGE} strokeWidth={6} strokeLinejoin="round" />
        <polygon points={roof.map((p) => p.join(',')).join(' ')} fill={CARD_2} stroke={EDGE} strokeWidth={6} strokeLinejoin="round" />
        <polygon points={`${x},${wall} ${x + s / 2},${top} ${x + s},${wall} ${x + s},${wall + s} ${x},${wall + s}`} fill="none" stroke={GUIDE} strokeWidth={4} strokeDasharray="16 12" />
      </Frame>
    );
  },
  // A sailboat of all seven: the big triangles are the sails; the hull is a small
  // triangle, the square, the other small triangle, the middle triangle and the
  // slanted piece (in gold), which only fits one way up.
  'tangram-6': (label) => {
    const u = 150;
    const ox = (W - 5 * u) / 2 + u; // x runs -1..4
    const by = (H + 3 * u) / 2; // y = 0 at the keel, up is negative on screen
    const P = (ps: readonly Pt[]) => ps.map(([x, y]) => [x, -y] as Pt);
    const parts: ReadonlyArray<readonly [string, readonly Pt[]]> = [
      ['big1', P([[0, 1], [2, 1], [2, 3]])],
      ['big2', P([[2, 1], [4, 1], [2, 3]])],
      ['small1', P([[-1, 1], [0, 0], [0, 1]])],
      ['square', P([[0, 0], [1, 0], [1, 1], [0, 1]])],
      ['small2', P([[1, 0], [2, 0], [1, 1]])],
      ['mid', P([[1, 1], [2, 0], [3, 1]])],
      ['slant', P([[2, 0], [3, 0], [4, 1], [3, 1]])],
    ];
    return (
      <Frame label={label} ground={PAPER}>
        {parts.map(([id, ps]) => (
          <Piece key={id} ps={ps} ox={ox} oy={by} u={u} {...colour(id)} />
        ))}
        <Guide ps={P([[0, 0], [3, 0], [4, 1], [2, 3], [0, 1], [-1, 1]])} ox={ox} oy={by} u={u} />
      </Frame>
    );
  },
};


/* -------------------------------------------------------------- lever ---- */

const TABLE = '#c99a62';
const TABLE_EDGE = '#8a6416';
const WOOD = '#e9c88a';
const WOOD_EDGE = '#8a6416';
const SOAP = '#f3ead7';
const STEEL = '#b8c2cc';
const STEEL_EDGE = '#5b6470';
const COPPER = '#c0723a';
const COPPER_EDGE = '#7a3f17';

/**
 * Side view of the ruler lever: the table, a pencil seen end-on as the pivot,
 * the ruler, soap taped to one end and a lid taped to the other, with `coins`
 * pennies in the lid. `at` is where the pivot sits along the ruler (0 = soap
 * end, 1 = lid end); `tilt` is the angle in degrees, positive = lid end down.
 */
function Lever({ cx, at, coins, tilt, scale = 1 }: { readonly cx: number; readonly at: number; readonly coins: number; readonly tilt: number; readonly scale?: number }) {
  const L = 640 * scale;
  const tableY = TABLE_Y;
  const r = 16 * scale;
  const py = tableY - r;
  const left = -at * L;
  const right = (1 - at) * L;
  const thick = 16 * scale;
  return (
    <g>
      <g transform={`translate(${cx} ${py}) rotate(${tilt})`}>
        <rect x={left} y={-r - thick} width={L} height={thick} rx={3} fill={WOOD} stroke={WOOD_EDGE} strokeWidth={4} />
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={left + (i * L) / 20} y1={-r - thick} x2={left + (i * L) / 20} y2={-r - thick + (i % 5 ? 6 : 11) * scale} stroke={WOOD_EDGE} strokeWidth={2} />
        ))}
        <rect x={left + 6 * scale} y={-r - thick - 70 * scale} width={120 * scale} height={70 * scale} rx={10} fill={SOAP} stroke={GUIDE} strokeWidth={4} />
        <g transform={`translate(${right - 75 * scale} ${-r - thick})`}>
          <path d={`M ${-70 * scale} 0 L ${-60 * scale} ${-36 * scale} L ${60 * scale} ${-36 * scale} L ${70 * scale} 0 Z`} fill={STEEL} stroke={STEEL_EDGE} strokeWidth={4} transform={`scale(1 1)`} />
          {Array.from({ length: coins }, (_, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            return <ellipse key={i} cx={(col - 2) * 22 * scale} cy={(-44 - row * 10) * scale} rx={12 * scale} ry={6 * scale} fill={COPPER} stroke={COPPER_EDGE} strokeWidth={2} />;
          })}
        </g>
      </g>
      <circle cx={cx} cy={py} r={r} fill="#e9b949" stroke={SLANT_EDGE} strokeWidth={4} />
      <circle cx={cx} cy={py} r={r * 0.35} fill={SLANT_EDGE} />
    </g>
  );
}

const TABLE_Y = 600;
const TableTop = () => <rect x={0} y={TABLE_Y} width={W} height={H - TABLE_Y} fill={TABLE} stroke={TABLE_EDGE} strokeWidth={4} />;

const LEVER: Record<string, (label: string) => ReactElement> = {
  // Pivot in the middle, lid empty: the soap end is down.
  'lever-2': (label) => (
    <Frame label={label} ground={PAPER}>
      <TableTop />
      <Lever cx={W / 2} at={0.5} coins={0} tilt={-6} scale={1.4} />
    </Frame>
  ),
  // Enough pennies in the lid and the lid end goes down.
  'lever-3': (label) => (
    <Frame label={label} ground={PAPER}>
      <TableTop />
      <Lever cx={W / 2} at={0.5} coins={15} tilt={6} scale={1.4} />
    </Frame>
  ),
  // The ruler slid along so the pencil sits close to the soap: where it was, and where it is now.
  'lever-4': (label) => {
    // Same ruler as before, slid right so the pencil now sits near the soap end.
    const L = 640 * 1.4;
    const cx = W / 2 - 0.32 * L;
    const was = cx + 0.32 * L;
    return (
      <Frame label={label} ground={PAPER}>
        <TableTop />
        <circle cx={was} cy={TABLE_Y - 16} r={18} fill="none" stroke={GUIDE} strokeWidth={4} strokeDasharray="8 6" />
        <path d={`M ${was - 20} ${TABLE_Y + 60} L ${cx + 26} ${TABLE_Y + 60}`} stroke={INK} strokeWidth={6} />
        <path d={`M ${cx + 50} ${TABLE_Y + 42} L ${cx + 22} ${TABLE_Y + 60} L ${cx + 50} ${TABLE_Y + 78}`} fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <Lever cx={cx} at={0.18} coins={0} tilt={0} scale={1.4} />
      </Frame>
    );
  },
  // The two tries side by side: pencil in the middle needs a pile; pencil near the soap needs a few.
  'lever-5': (label) => (
    <Frame label={label} ground={PAPER}>
      <rect x={0} y={330} width={W} height={18} fill={TABLE} stroke={TABLE_EDGE} strokeWidth={3} />
      <g transform="translate(0 -270)">
        <Lever cx={W / 2} at={0.5} coins={15} tilt={6} scale={1.15} />
      </g>
      <TableTop />
      <Lever cx={W / 2 - 230} at={0.18} coins={4} tilt={5} scale={1.15} />
    </Frame>
  ),
};

/* --------------------------------------------------- finger balance ----- */

const SKIN = '#b9784a';
const SKIN_EDGE = '#6e3a1e';
const DOUGH = '#d9473a';

/** A pointing finger from below, its tip at (x, y). */
const Finger = ({ x, y }: { readonly x: number; readonly y: number }) => (
  <g>
    <path d={`M ${x - 22} ${y + 200} L ${x - 22} ${y + 18} Q ${x - 22} ${y} ${x} ${y} Q ${x + 22} ${y} ${x + 22} ${y + 18} L ${x + 22} ${y + 200} Z`} fill={SKIN} stroke={SKIN_EDGE} strokeWidth={4} />
    <path d={`M ${x - 12} ${y + 10} Q ${x} ${y + 4} ${x + 12} ${y + 10}`} fill="none" stroke={SKIN_EDGE} strokeWidth={3} />
  </g>
);

/** A ruler resting on fingers at `fingers` (x positions), with optional dough at the right end and tape marks. */
function RulerOnFingers({ fingers, dough, mid, guess }: { readonly fingers: readonly number[]; readonly dough?: boolean; readonly mid?: number; readonly guess?: number }) {
  const y = 440;
  const x0 = 156;
  const len = 840;
  return (
    <g>
      <rect x={x0} y={y - 24} width={len} height={24} rx={3} fill={WOOD} stroke={WOOD_EDGE} strokeWidth={4} />
      {Array.from({ length: 31 }, (_, i) => (
        <line key={i} x1={x0 + (i * len) / 30} y1={y - 24} x2={x0 + (i * len) / 30} y2={y - 24 + (i % 5 ? 7 : 13)} stroke={WOOD_EDGE} strokeWidth={2} />
      ))}
      {mid !== undefined ? <rect x={mid - 9} y={y - 26} width={18} height={28} fill="#f3ead7" stroke={GUIDE} strokeWidth={2} /> : null}
      {guess !== undefined ? <rect x={guess - 9} y={y - 26} width={18} height={28} fill="#e9b949" stroke={SLANT_EDGE} strokeWidth={2} /> : null}
      {dough ? <path d={`M ${x0 + len - 120} ${y - 24} C ${x0 + len - 120} ${y - 110}, ${x0 + len + 10} ${y - 120}, ${x0 + len + 6} ${y - 24} Z`} fill={DOUGH} stroke="#8f2c05" strokeWidth={4} /> : null}
      {fingers.map((fx) => (
        <Finger key={fx} x={fx} y={y} />
      ))}
    </g>
  );
}

/** A broom lying on two fingers: handle to the left, bristle head to the right. */
function BroomOnFingers({ fingers }: { readonly fingers: readonly number[] }) {
  const y = 440;
  return (
    <g>
      <rect x={80} y={y - 22} width={760} height={22} rx={11} fill={WOOD} stroke={WOOD_EDGE} strokeWidth={4} />
      <rect x={836} y={y - 40} width={40} height={58} rx={6} fill="#5b6470" stroke={INK} strokeWidth={4} />
      <path d={`M 876 ${y - 52} L 1080 ${y - 110} L 1080 ${y + 80} L 876 ${y + 26} Z`} fill="#c99a62" stroke={TABLE_EDGE} strokeWidth={4} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={880} y1={y - 44 + i * 8} x2={1078} y2={y - 100 + i * 21} stroke={TABLE_EDGE} strokeWidth={2} />
      ))}
      {fingers.map((fx) => (
        <Finger key={fx} x={fx} y={y} />
      ))}
    </g>
  );
}

const BALANCE: Record<string, (label: string) => ReactElement> = {
  'balance-6': (label) => (
    <Frame label={label} ground={PAPER}>
      <BroomOnFingers fingers={[150, 800]} />
    </Frame>
  ),
  'balance-1': (label) => (
    <Frame label={label} ground={PAPER}>
      <RulerOnFingers fingers={[230, 922]} />
    </Frame>
  ),
  'balance-3': (label) => (
    <Frame label={label} ground={PAPER}>
      <RulerOnFingers fingers={[556, 596]} mid={576} />
    </Frame>
  ),
  'balance-4': (label) => (
    <Frame label={label} ground={PAPER}>
      <RulerOnFingers fingers={[230, 922]} dough mid={576} guess={700} />
    </Frame>
  ),
  'balance-5': (label) => (
    <Frame label={label} ground={PAPER}>
      <RulerOnFingers fingers={[790, 830]} dough mid={576} guess={700} />
      <path d="M 576 470 L 576 520 M 810 470 L 810 520 M 576 500 L 810 500" stroke={GUIDE} strokeWidth={4} strokeDasharray="12 9" fill="none" />
    </Frame>
  ),
};

/* --------------------------------------------------------- paper bridge -- */

const BOOKS = ['#c9420d', '#1c6dd0', '#0d8063', '#75465e'];
const Books = ({ x, y }: { readonly x: number; readonly y: number }) => (
  <g>
    {BOOKS.map((c, i) => (
      <rect key={c} x={x + (i % 2) * 8} y={y + i * 46} width={250} height={46} rx={4} fill={c} stroke={INK} strokeWidth={4} />
    ))}
  </g>
);

const BRIDGE: Record<string, (label: string) => ReactElement> = {
  // Top view of the sheet with its folds running the long way, and its end seen as a zigzag.
  'bridge-3': (label) => (
    <Frame label={label} ground={PAPER}>
      <rect x={176} y={150} width={800} height={300} fill="#ffffff" stroke={GUIDE} strokeWidth={4} />
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={176} y1={150 + i * 37.5} x2={976} y2={150 + i * 37.5} stroke={i % 2 ? CARD : SLANT_EDGE} strokeWidth={4} strokeDasharray={i % 2 ? undefined : '14 10'} />
      ))}
      <polyline points={Array.from({ length: 9 }, (_, i) => `${426 + i * 37.5},${i % 2 ? 720 : 640}`).join(' ')} fill="none" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <path d="M 576 470 L 576 600" stroke={GUIDE} strokeWidth={4} strokeDasharray="12 9" />
      <path d="M 560 585 L 576 610 L 592 585" fill="none" stroke={GUIDE} strokeWidth={4} />
    </Frame>
  ),
  // The zigzag across the gap between two book piles, coins stacked in the middle, and an end-on inset of the folds.
  'bridge-4': (label) => (
    <Frame label={label} ground={PAPER}>
      <TableTop />
      <Books x={140} y={456} />
      <Books x={762} y={456} />
      <rect x={260} y={440} width={632} height={16} fill="#ffffff" stroke={GUIDE} strokeWidth={4} />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={260 + 20} y1={444 + (i % 2) * 8} x2={892 - 20} y2={444 + (i % 2) * 8} stroke={CARD} strokeWidth={1.5} opacity={0.5} />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse key={i} cx={576} cy={432 - i * 10} rx={30} ry={8} fill={COPPER} stroke={COPPER_EDGE} strokeWidth={2} />
      ))}
      <circle cx={960} cy={190} r={130} fill="#ffffff" stroke={GUIDE} strokeWidth={4} />
      <polyline points={Array.from({ length: 9 }, (_, i) => `${880 + i * 20},${i % 2 ? 220 : 170}`).join(' ')} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M 860 300 L 640 400" stroke={GUIDE} strokeWidth={4} strokeDasharray="12 9" />
    </Frame>
  ),
};

/* ---------------------------------------------------------- pendulum ---- */

const SOCK = '#f3ead7';
/** A sock with a rice bag in it, hanging from (x, top) on a string `len` px long, pulled back by `pull` px. */
function Swing({ x, top, len, pull, label }: { readonly x: number; readonly top: number; readonly len: number; readonly pull: number; readonly label: string }) {
  const bx = x - pull;
  const by = top + Math.sqrt(len * len - pull * pull);
  return (
    <g>
      <line x1={x} y1={top} x2={x} y2={top + len} stroke={GUIDE} strokeWidth={3} strokeDasharray="10 8" />
      <line x1={x} y1={top} x2={bx} y2={by} stroke={INK} strokeWidth={4} />
      <path d={`M ${bx - 26} ${by} Q ${bx - 30} ${by + 70} ${bx} ${by + 76} Q ${bx + 34} ${by + 80} ${bx + 32} ${by + 52} L ${bx + 26} ${by} Z`} fill={SOCK} stroke={INK} strokeWidth={4} />
      <text x={x + 24} y={top + len / 2} fontFamily="Andika, sans-serif" fontSize={44} fill={INK}>
        {label}
      </text>
    </g>
  );
}

const PENDULUM: Record<string, (label: string) => ReactElement> = {
  'pendulum-2': (label) => (
    <Frame label={label} ground={PAPER}>
      <rect x={120} y={96} width={912} height={26} rx={13} fill={WOOD} stroke={WOOD_EDGE} strokeWidth={4} />
      <Swing x={420} top={122} len={560} pull={130} label="70 cm" />
      <Swing x={820} top={122} len={200} pull={130} label="25 cm" />
    </Frame>
  ),
};

export const MAKE_FIGURES: Record<string, (label: string) => ReactElement> = { ...KOLAM, ...TANGRAM, ...LEVER, ...BALANCE, ...BRIDGE, ...PENDULUM };

export function MakeFigure({ id, label }: { readonly id: string; readonly label: string }) {
  const f = MAKE_FIGURES[id];
  return f ? f(label) : null;
}
