import { INK } from './thread';

/**
 * Page 9: why where she pushes matters more than how hard.
 *
 * This is the question "how does the girl make it move", and draft three had
 * no answer to it. It explained the thread — why turning produces descending —
 * and then simply had her turn the thing, as though turning were free. It is
 * not: her bare hands at the screw could not turn it either. The bar is a
 * lever, and the whole of her contribution is knowing to hold the far end.
 *
 * Two pushes, drawn at once, is the only honest way to show it: a comparison
 * cannot be a painting. The arrow weights carry the argument before any word
 * is read — one is fat and long, one is thin and short, and they produce the
 * same turn.
 *
 * The door is the anchor. Every child has shoved a door beside its hinge and
 * felt it fight back, without ever being told what a moment is.
 */

const CX = 380;
const BAR_Y = 210;
const NEAR = 448;   // just clear of the screw head, which ends at 424
const FAR = 600;    // right at the end

/** A dimension line with end ticks: how far out this push is. */
const span = (x0: number, x1: number, y: number, key: string) => (
  <g key={key} stroke={INK.stoneDark} strokeWidth="1.6">
    <line x1={x0} y1={y} x2={x1} y2={y} />
    <line x1={x0} y1={y - 7} x2={x0} y2={y + 7} />
    <line x1={x1} y1={y - 7} x2={x1} y2={y + 7} />
  </g>
);

export function OliveTheLongBar() {
  return (
    <svg
      className="story-figure__svg"
      viewBox="0 0 760 470"
      role="img"
      aria-label="A diagram of the press bar seen from above. Close beside the screw, a thick heavy arrow shows that a huge shove is needed to turn it. Out at the far end of the bar, a small thin arrow shows that a gentle push turns it just as much. Below, the same comparison on a door seen from above: pushing beside the hinge is hard, pushing at the outer edge is easy. Where you push matters more than how hard you push."
    >
      <rect x="0" y="0" width="760" height="470" fill={INK.paper} />

      {/* ---------------- the bar, from above ---------------- */}
      <text className="story-figure__lead" x="30" y="42" fill={INK.line}>The bar, seen from above</text>
      <text className="story-figure__lead" x="730" y="42" fill={INK.mark} textAnchor="end">Both give the same turn.</text>

      {/* the screw head, and the bar passing through it */}
      <circle cx={CX} cy={BAR_Y} r="44" fill={INK.woodShade} stroke={INK.line} strokeWidth="2.5" />
      <circle cx={CX} cy={BAR_Y} r="26" fill={INK.wood} stroke={INK.stoneDark} strokeWidth="1.6" />
      <rect x="140" y={BAR_Y - 14} width="480" height="28" rx="5" fill={INK.wood} stroke={INK.line} strokeWidth="2" />

      {/* which way it goes round */}
      <path d={`M${CX - 66},${BAR_Y - 54} A 86 86 0 0 1 ${CX + 30},${BAR_Y - 84}`}
        fill="none" stroke={INK.mark} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${CX + 20},${BAR_Y - 92} L${CX + 32},${BAR_Y - 83} L${CX + 19},${BAR_Y - 75}`}
        fill="none" stroke={INK.mark} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* close in: a shove */}
      <path d={`M${NEAR},118 L${NEAR},188`} stroke={INK.mark} strokeWidth="12" strokeLinecap="round" />
      <path d={`M${NEAR - 15},172 L${NEAR},193 L${NEAR + 15},172`}
        fill="none" stroke={INK.mark} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <text className="story-figure__note" x={NEAR} y="102" fill={INK.mark} textAnchor="middle">a big shove</text>

      {/* at the end: a push */}
      <path d={`M${FAR},158 L${FAR},188`} stroke={INK.mark} strokeWidth="3.5" strokeLinecap="round" />
      <path d={`M${FAR - 7},181 L${FAR},193 L${FAR + 7},181`}
        fill="none" stroke={INK.mark} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <text className="story-figure__note" x={FAR} y="142" fill={INK.mark} textAnchor="middle">a small push</text>

      {/* how far out each one is */}
      {span(CX, NEAR, 272, 'near')}
      <text className="story-figure__note" x={(CX + NEAR) / 2} y="298" fill={INK.line} textAnchor="middle">a little way out</text>
      {span(CX, FAR, 314, 'far')}
      <text className="story-figure__note" x={(CX + FAR) / 2} y="340" fill={INK.line} textAnchor="middle">right at the end</text>

      <line x1="30" y1="348" x2="730" y2="348" stroke={INK.stoneDark} strokeWidth="1.2" strokeDasharray="5 6" />

      {/* ---------------- the same thing, on a door ---------------- */}
      {/* the wall, and the hinge it turns on */}
      <rect x="52" y="392" width="60" height="16" fill={INK.stone} stroke={INK.line} strokeWidth="1.6" />
      <g stroke={INK.stoneDark} strokeWidth="1.2">
        {[0, 1, 2].map((i) => <line key={`w${i}`} x1={58 + i * 18} y1={408} x2={72 + i * 18} y2={392} />)}
      </g>
      <circle cx="120" cy="400" r="9" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      <rect x="120" y="392" width="330" height="16" rx="3" fill={INK.wood} stroke={INK.line} strokeWidth="2" />

      <path d="M166,364 L166,382" stroke={INK.mark} strokeWidth="12" strokeLinecap="round" />
      <path d="M151,370 L166,387 L181,370" fill="none" stroke={INK.mark} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M432,368 L432,382" stroke={INK.mark} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M425,377 L432,387 L439,377" fill="none" stroke={INK.mark} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      <text className="story-figure__note" x="166" y="440" fill={INK.line} textAnchor="middle">beside the hinge</text>
      <text className="story-figure__note" x="432" y="440" fill={INK.line} textAnchor="middle">at the edge</text>

      <text className="story-figure__note" x="500" y="392" fill={INK.mark}>
        <tspan x="500">Same door.</tspan>
        <tspan x="500" dy="22">You already know this.</tspan>
      </text>
    </svg>
  );
}

export default OliveTheLongBar;
