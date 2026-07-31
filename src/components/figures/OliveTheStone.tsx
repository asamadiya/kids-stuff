import { INK } from './thread';

/**
 * Page 3: how the stone moves.
 *
 * "Grandfather pushed its handle, and the stone rolled" is a sentence, not a
 * mechanism, and the parent said so. Three things have to land, and none of
 * them survives being told in prose to a five-year-old:
 *
 *   1. The wheel is far too heavy to lift or drag — but it is ROUND, so it
 *      rolls, and rolling is cheap.
 *   2. A post in the middle of the basin holds the arm, so the wheel cannot
 *      wander off. It goes round a circle, over the same olives again and
 *      again. That needs a view from ABOVE; a side view cannot show a path.
 *   3. Nobody presses down on the olives. The wheel's own weight does that.
 *      The child only keeps it moving.
 *
 * This is the mola olearia, the Roman edge-runner mill: a stone wheel on a
 * horizontal arm turning about a central pillar in a stone basin.
 */

const FLOOR = 336;      // top of the basin's stone floor
const OLIVE_TOP = 320;  // the olives the wheel rolls on
const POST_X = 230;
const WHEEL = { cx: 330, cy: 244, r: 76 };

// Plan view.
const PLAN = { cx: 600, cy: 250, r: 118 };

const olive = (cx: number, cy: number, key: string) => (
  <circle key={key} cx={cx} cy={cy} r="5" fill={INK.paste} stroke={INK.pasteDark} strokeWidth="1" />
);

export function OliveTheStone() {
  return (
    <svg
      className="story-figure__svg"
      viewBox="0 0 760 470"
      role="img"
      aria-label="A diagram of the olive crushing mill in two views. From the side: a great stone wheel stands on its edge in a shallow stone basin, joined by a wooden arm to a post in the middle of the basin, with olives underneath it and the wheel's own weight bearing straight down on them. From above: the arm swings about the post so the wheel rolls round and round the same circular track, over the same olives again and again. The wheel is far too heavy to lift, but because it is round it rolls, so a child only has to keep it moving."
    >
      <rect x="0" y="0" width="760" height="470" fill={INK.paper} />

      <text className="story-figure__lead" x="230" y="40" fill={INK.line} textAnchor="middle">From the side</text>
      <text className="story-figure__lead" x={PLAN.cx} y="40" fill={INK.line} textAnchor="middle">From above</text>

      {/* ---------------- side view ---------------- */}
      {/* the basin: a shallow stone trough with a low rim at each end */}
      <rect x="40" y={FLOOR} width="390" height="30" fill={INK.stone} stroke={INK.line} strokeWidth="2" />
      <rect x="40" y="296" width="28" height={FLOOR - 296} fill={INK.stone} stroke={INK.line} strokeWidth="2" />
      <rect x="402" y="296" width="28" height={FLOOR - 296} fill={INK.stone} stroke={INK.line} strokeWidth="2" />
      {/* the olives it rolls on */}
      <rect x="68" y={OLIVE_TOP} width="334" height={FLOOR - OLIVE_TOP} fill={INK.pasteDark} opacity="0.35" />
      {[86, 118, 150, 182, 214, 246, 278, 374].map((x) => olive(x, 328, `o${x}`))}

      {/* the post, and the arm reaching out from it to the wheel */}
      <rect x={POST_X - 16} y="112" width="32" height={FLOOR - 112} fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      <rect x={POST_X} y={WHEEL.cy - 9} width="196" height="18" rx="3" fill={INK.wood} stroke={INK.line} strokeWidth="2" />
      <circle cx={WHEEL.cx} cy={WHEEL.cy} r="7" fill={INK.woodDark} stroke={INK.line} strokeWidth="1.5" />

      {/* the wheel, on its edge */}
      <circle cx={WHEEL.cx} cy={WHEEL.cy} r={WHEEL.r} fill={INK.stone} stroke={INK.line} strokeWidth="2.5" />
      <circle cx={WHEEL.cx} cy={WHEEL.cy} r={WHEEL.r - 13} fill="none" stroke={INK.stoneDark} strokeWidth="1.6" />

      {/* all of that weight lands on one small patch of olives */}
      <path
        d={`M${WHEEL.cx},${WHEEL.cy + WHEEL.r + 6} L${WHEEL.cx},${OLIVE_TOP - 2}`}
        stroke={INK.mark} strokeWidth="0" />
      <path
        d="M330,352 L330,392 M322,382 L330,393 L338,382"
        fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />
      <text className="story-figure__note" x="40" y="396" fill={INK.mark}>
        <tspan x="40">All its weight lands here.</tspan>
        <tspan x="40" dy="22">That is what crushes them.</tspan>
      </text>

      {/* the push, out at the end of the arm */}
      <path d="M406,206 Q430,186 452,200" fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M444,192 L454,201 L441,206" fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M182,150 L216,160" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="26" y="130" fill={INK.line}>
        <tspan x="26">A post in the</tspan>
        <tspan x="26" dy="22">middle. It never</tspan>
        <tspan x="26" dy="22">moves.</tspan>
      </text>

      {/* ---------------- plan view ---------------- */}
      <circle cx={PLAN.cx} cy={PLAN.cy} r={PLAN.r} fill={INK.stone} stroke={INK.line} strokeWidth="2.5" />
      <circle cx={PLAN.cx} cy={PLAN.cy} r={PLAN.r - 22} fill={INK.pasteDark} opacity="0.35" stroke={INK.stoneDark} strokeWidth="1.4" />
      {/* the track it rolls, over and over */}
      <circle
        cx={PLAN.cx} cy={PLAN.cy} r="70"
        fill="none" stroke={INK.mark} strokeWidth="2" strokeDasharray="7 6"
      />
      {/* the arm, and the wheel seen edge-on from above */}
      <rect x={PLAN.cx} y={PLAN.cy - 7} width="104" height="14" rx="3" fill={INK.wood} stroke={INK.line} strokeWidth="2" />
      <rect x={PLAN.cx + 46} y={PLAN.cy - 26} width="20" height="52" rx="3" fill={INK.stoneDark} stroke={INK.line} strokeWidth="2" />
      <circle cx={PLAN.cx} cy={PLAN.cy} r="15" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />

      {/* which way it goes */}
      <path
        d={`M${PLAN.cx + 92},${PLAN.cy + 44} A 100 100 0 0 1 ${PLAN.cx - 6},${PLAN.cy + 102}`}
        fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round"
      />
      <path d={`M${PLAN.cx + 6},${PLAN.cy + 94} L${PLAN.cx - 8},${PLAN.cy + 103} L${PLAN.cx + 2},${PLAN.cy + 110}`}
        fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

      <text className="story-figure__note" x={PLAN.cx} y="396" fill={INK.mark} textAnchor="middle">
        <tspan x={PLAN.cx}>Round the same circle,</tspan>
        <tspan x={PLAN.cx} dy="22">over the same olives.</tspan>
      </text>

      {/* the point of the whole page */}
      <text className="story-figure__lead" x="380" y="462" fill={INK.line} textAnchor="middle">
        She could never lift it. She only keeps it rolling.
      </text>
    </svg>
  );
}

export default OliveTheStone;
