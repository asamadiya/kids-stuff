/**
 * Bose, page 9: what the dots on the smoked plate say.
 *
 * The page asks a five-year-old to compare dot spacing, and generated art
 * drew three columns whose gaps were nearly the same, which hides the very
 * evidence the words point at. So the record is drawn from numbers: one
 * column per condition, the gap between dots proportional to how much the
 * stalk grew between two touches of the plate.
 *
 * Ordinary (medium gaps), cooled (gaps shrink: growth slows), warmed (gaps
 * widen: growth speeds up). The values are illustrative, not Bose's data;
 * the caption says so.
 */

const W = 760;
const H = 470;
const PLATE = { x: 150, y: 40, w: 460, h: 360 };
const TOP = PLATE.y + 40;
const DOT_R = 8;

const COLUMNS: ReadonlyArray<{ readonly label: string; readonly gap: number; readonly x: number }> = [
  { label: 'Ordinary', gap: 40, x: PLATE.x + 90 },
  { label: 'Cooled', gap: 16, x: PLATE.x + PLATE.w / 2 },
  { label: 'Warmed', gap: 64, x: PLATE.x + PLATE.w - 90 },
];

const dots = (x: number, gap: number) => {
  const out: number[] = [];
  for (let y = TOP; y <= PLATE.y + PLATE.h - 30; y += gap) out.push(y);
  return out.map((y, i) => <circle key={i} cx={x} cy={y} r={DOT_R} fill="#f6f1e6" />);
};

export function BoseTheThreeTraces() {
  return (
    <svg
      className="story-figure__svg"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A smoke-blackened glass plate with three columns of white dots. In the first column, for an ordinary plant, the dots are a medium distance apart. In the middle column, for a cooled plant, the dots are crowded close together, because it grew less between touches. In the third column, for a warmed plant, the dots are far apart, because it grew more."
    >
      <rect x={PLATE.x - 10} y={PLATE.y - 10} width={PLATE.w + 20} height={PLATE.h + 20} rx="6" fill="#8a6a3c" />
      <rect x={PLATE.x} y={PLATE.y} width={PLATE.w} height={PLATE.h} rx="3" fill="#1d1a17" />
      {COLUMNS.map((c) => (
        <g key={c.label}>
          {dots(c.x, c.gap)}
          {/* one gap, bracketed in gold: the thing to compare across columns */}
          <path d={`M ${c.x + 18} ${TOP} h 18 v ${c.gap} h -18`} fill="none" stroke="#e9b949" strokeWidth="5" strokeLinejoin="round" />
          <text x={c.x} y={PLATE.y + PLATE.h + 42} textAnchor="middle" fontSize="24" fontWeight="700" fill="#24170f">
            {c.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default BoseTheThreeTraces;
