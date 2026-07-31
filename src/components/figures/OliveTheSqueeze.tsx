import { INK } from './thread';

/**
 * Page 8: where the oil actually comes out.
 *
 * The second half of the parent's question. The story said the stack "squashed
 * flatter" and then oil appeared, which is a sequence, not a cause. The cause
 * is that the mats are woven loose: squeezing leaves the liquid nowhere to
 * stay, so it is forced out through the gaps while the pulp — too coarse to
 * fit — stays behind. That is a filter, and it is the reason for the whole
 * stack-of-flat-baskets design.
 *
 * The figure carries it in one move the eye can follow before reading a word:
 * the gold is INSIDE the mats on the left and OUTSIDE them on the right.
 *
 * The sponge is drawn, not merely named. The first draft captioned a sponge
 * that was not on the page, which is the same defect as a picture that does
 * not show its text — the one that got this story rejected in the first place.
 */

const FLOOR = 316;

const BEFORE_X = 84;
const BEFORE_W = 208;
const beforeMats = [288, 260, 232, 204];

const AFTER_X = 452;
const AFTER_W = 236;
const afterMats = [301, 286, 271, 256];

/** A mat of paste in section. Loosely woven, so its outline is drawn broken. */
function Mat({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={3} fill={INK.paste} stroke={INK.pasteDark} strokeWidth="1.2" />
      <rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke={INK.line} strokeWidth="2" strokeDasharray="5 4" />
    </g>
  );
}

const drop = (cx: number, cy: number, key: string, r = 5) => (
  <circle key={key} cx={cx} cy={cy} r={r} fill={INK.oil} stroke={INK.oilDark} strokeWidth="1" />
);

/** Oil leaving one mat: an arrow through the weave and a bead beyond it. */
const vent = (y: number, key: string) => (
  <g key={key}>
    <path
      d={`M${AFTER_X - 4},${y} L${AFTER_X - 26},${y} M${AFTER_X - 18},${y - 5} L${AFTER_X - 27},${y} L${AFTER_X - 18},${y + 5}`}
      fill="none" stroke={INK.oilDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d={`M${AFTER_X + AFTER_W + 4},${y} L${AFTER_X + AFTER_W + 26},${y} M${AFTER_X + AFTER_W + 18},${y - 5} L${AFTER_X + AFTER_W + 27},${y} L${AFTER_X + AFTER_W + 18},${y + 5}`}
      fill="none" stroke={INK.oilDark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    {drop(AFTER_X - 38, y, `${key}l`, 4)}
    {drop(AFTER_X + AFTER_W + 38, y, `${key}r`, 4)}
  </g>
);

export function OliveTheSqueeze() {
  return (
    <svg
      className="story-figure__svg"
      viewBox="0 0 760 470"
      role="img"
      aria-label="A cutaway diagram in two halves. On the left, before pressing: four thick mats of crushed olive paste are stacked under the press lid, with oil still trapped inside them. On the right, after pressing: the lid has come down, the mats are squashed thin and wide, and the oil has been forced out sideways through the gaps in the loose weave, running into a channel in the floor, while the pulp stays inside. Below, a squeezed sponge does the same thing."
    >
      <rect x="0" y="0" width="760" height="470" fill={INK.paper} />

      <text className="story-figure__lead" x="188" y="46" fill={INK.line} textAnchor="middle">Before</text>
      <text className="story-figure__lead" x="570" y="46" fill={INK.line} textAnchor="middle">After</text>

      {/* ---------------- before: thick mats, oil locked in ---------------- */}
      <path d="M120,126 L166,164" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="40" y="112" fill={INK.line}>the screw pushes this lid</text>

      <rect x="168" y="132" width="40" height="52" fill={INK.wood} stroke={INK.line} strokeWidth="2" />
      <rect x="68" y="184" width="240" height="20" rx="4" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      {beforeMats.map((y) => <Mat key={`b${y}`} x={BEFORE_X} y={y} w={BEFORE_W} h={28} />)}
      {beforeMats.flatMap((y) =>
        [0, 1, 2, 3, 4].map((i) => drop(BEFORE_X + 26 + i * 40, y + 14, `bd${y}-${i}`)),
      )}
      <rect x="46" y={FLOOR} width="284" height="18" fill={INK.stone} stroke={INK.line} strokeWidth="1.6" />

      <path d="M198,352 L228,326" fill="none" stroke={INK.oilDark} strokeWidth="1.4" />
      <text className="story-figure__note" x="40" y="370" fill={INK.oilDark}>oil, still shut inside</text>

      {/* ---------------- the move ---------------- */}
      <path
        d="M346,244 L392,244 M382,234 L393,244 L382,254"
        fill="none" stroke={INK.mark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
      />
      <text className="story-figure__note" x="369" y="226" fill={INK.mark} textAnchor="middle">squeeze</text>

      {/* ---------------- after: thin mats, oil outside ---------------- */}
      <path d="M640,130 L694,268" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="466" y="112" fill={INK.line}>woven loose, full of gaps</text>

      <rect x="550" y="132" width="40" height="104" fill={INK.wood} stroke={INK.line} strokeWidth="2" />
      <rect x="442" y="236" width="256" height="20" rx="4" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      {afterMats.map((y) => <Mat key={`a${y}`} x={AFTER_X} y={y} w={AFTER_W} h={15} />)}
      {afterMats.map((y, i) => vent(y + 8, `v${i}`))}

      {/* floor, with the channel the oil runs along, and the sunken jar */}
      <rect x="404" y={FLOOR} width="344" height="18" fill={INK.stone} stroke={INK.line} strokeWidth="1.6" />
      <rect x="410" y={FLOOR + 4} width="286" height="9" rx="3" fill={INK.oil} stroke={INK.oilDark} strokeWidth="1" />
      <path
        d={`M700,${FLOOR + 2} L700,${FLOOR + 30} Q700,${FLOOR + 38} 712,${FLOOR + 38} L730,${FLOOR + 38} Q742,${FLOOR + 38} 742,${FLOOR + 30} L742,${FLOOR + 2} Z`}
        fill={INK.oil} stroke={INK.line} strokeWidth="1.8"
      />

      <path d="M470,352 L494,332" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="404" y="386" fill={INK.line}>
        <tspan x="404">Only the oil fits through.</tspan>
        <tspan x="404" dy="22">The mush stays behind.</tspan>
      </text>

      {/* ---------------- the same thing, in a hand ---------------- */}
      <path
        d="M112,398 L112,410 M106,404 L112,411 L118,404 M112,462 L112,450 M106,456 L112,449 L118,456"
        fill="none" stroke={INK.mark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <rect x="52" y="414" width="120" height="32" rx="8" fill={INK.stone} stroke={INK.line} strokeWidth="1.8" />
      {[70, 92, 114, 136, 156].map((cx) => (
        <circle key={`h${cx}`} cx={cx} cy="430" r="4.5" fill={INK.paper} stroke={INK.stoneDark} strokeWidth="1" />
      ))}
      {drop(186, 424, 'sp1', 4)}
      {drop(198, 440, 'sp2', 4)}
      {drop(182, 452, 'sp3', 4)}
      <text className="story-figure__note" x="216" y="436" fill={INK.mark}>A wet sponge, exactly.</text>
    </svg>
  );
}

export default OliveTheSqueeze;
