import { INK, edgeToPath, interlockEdge, toothCentres } from './thread';

/**
 * Page 6: why turning the screw makes it go down.
 *
 * The question the parent asked and the story could not answer. The answer is
 * a cutaway — the screw runs through a threaded hole in a beam that cannot
 * move, so its ridge has no choice but to follow the groove, and the groove
 * runs round AND down. No painting can show the inside of that hole.
 *
 * The right-hand panel is the whole point pedagogically: a five-year-old has
 * already turned a hundred jar lids and watched them walk down onto the jar.
 * The press is that, made enormous.
 *
 * Every label is placed against the margins deliberately. The first draft put
 * five of them outside the viewBox and ran a sixth straight through the screw
 * shaft, which `scripts/verify-figures.mjs` measures rather than eyeballs.
 */

const CX = 186;
const CORE = 22;
const RIDGE = 14;
const HALF = 9;
const PITCH = 32;

const SHAFT_TOP = 110;
const SHAFT_BOTTOM = 368;
const BEAM_TOP = 210;
const BEAM_BOTTOM = 280;

const left = toothCentres(SHAFT_TOP + 14, SHAFT_BOTTOM - 6, PITCH);
const right = toothCentres(SHAFT_TOP + 14, SHAFT_BOTTOM - 6, PITCH, PITCH / 2);

const beamLeft = edgeToPath(
  26 + 0,
  interlockEdge(CX - CORE, CX - CORE - RIDGE, BEAM_TOP, BEAM_BOTTOM, left, HALF),
);
const beamRight = edgeToPath(
  410,
  interlockEdge(CX + CORE, CX + CORE + RIDGE, BEAM_TOP, BEAM_BOTTOM, right, HALF),
);

/** A tooth is a rectangle: press screws were cut in wood with a square thread. */
const tooth = (y: number, side: -1 | 1) => (
  <rect
    key={`${side}-${y}`}
    x={side < 0 ? CX - CORE - RIDGE : CX + CORE}
    y={y - HALF}
    width={RIDGE}
    height={HALF * 2}
    fill={INK.woodShade}
    stroke={INK.line}
    strokeWidth={1.5}
  />
);

/**
 * The front of the thread, crossing the shaft from the left tooth down to the
 * right one. Without these the teeth read as a ladder of separate rungs; with
 * them the eye follows one ridge winding round, which is the sentence the
 * child just read on page 5.
 */
const band = (y: number) => (
  <path
    key={`band${y}`}
    d={`M${CX - CORE},${y - HALF} L${CX + CORE},${y + PITCH / 2 - HALF} L${CX + CORE},${y + PITCH / 2 + HALF} L${CX - CORE},${y + HALF} Z`}
    fill={INK.woodShade}
    stroke={INK.woodDark}
    strokeWidth={1.2}
  />
);

// Jar panel.
const JAR_CX = 592;
const NECK = 34;
const JAR_RIDGE = 13;
const JAR_HALF = 7;
const JAR_PITCH = 24;
const neckTeeth = toothCentres(246, 296, JAR_PITCH);
const skirtGroove = toothCentres(178, 218, JAR_PITCH);

export function OliveScrewAndNut() {
  return (
    <svg
      className="story-figure__svg"
      viewBox="0 0 760 470"
      role="img"
      aria-label="A cutaway diagram. On the left, the wooden press screw passes through a hole in a fixed beam; the hole has a groove cut to match the screw's ridge, so turning the bar round drives the screw down. On the right, a jar lid does the same thing: its skirt has a groove that matches the thread on the jar's neck."
    >
      <rect x="0" y="0" width="760" height="470" fill={INK.paper} />

      {/* ---------------- the press ---------------- */}
      <text className="story-figure__lead" x={CX} y="26" fill={INK.mark} textAnchor="middle">
        Walk the bar round…
      </text>
      <path d={`M80,58 Q${CX},32 292,58`} fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M283,48 L294,59 L279,62" fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* where the bar sat one turn ago, and how far it has come */}
      <rect x="62" y="62" width="248" height="12" rx="4" fill="none" stroke={INK.stoneDark} strokeWidth="1.5" strokeDasharray="6 5" />
      <path
        d="M330,68 L330,103 M325,74 L330,67 L335,74 M325,97 L330,104 L335,97"
        fill="none" stroke={INK.mark} strokeWidth="2.2" strokeLinecap="round"
      />
      <text className="story-figure__note" x="340" y="93" fill={INK.mark}>one turn</text>

      {/* the bar and the screw */}
      <rect x="62" y="96" width="248" height="14" rx="4" fill={INK.wood} stroke={INK.line} strokeWidth="2" />
      <rect x={CX - 32} y="88" width="64" height="26" rx="3" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      <rect
        x={CX - CORE} y={SHAFT_TOP} width={CORE * 2} height={SHAFT_BOTTOM - SHAFT_TOP}
        fill={INK.wood} stroke={INK.line} strokeWidth="2"
      />
      {left.filter((y) => y + PITCH / 2 <= SHAFT_BOTTOM - 6).map(band)}
      {left.map((y) => tooth(y, -1))}
      {right.map((y) => tooth(y, 1))}

      {/* the beam, cut through, with the groove that receives the ridge */}
      <path d={beamLeft} fill={INK.stone} stroke={INK.line} strokeWidth="2" />
      <path d={beamRight} fill={INK.stone} stroke={INK.line} strokeWidth="2" />
      <g stroke={INK.stoneDark} strokeWidth="1.2" opacity="0.65">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`hl${i}`} x1={32 + i * 20} y1={BEAM_BOTTOM} x2={52 + i * 20} y2={BEAM_TOP} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`hr${i}`} x1={244 + i * 22} y1={BEAM_BOTTOM} x2={264 + i * 22} y2={BEAM_TOP} />
        ))}
      </g>

      {/* the plate, and where it is headed */}
      <rect x="124" y={SHAFT_BOTTOM} width="124" height="18" rx="4" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      <path
        d={`M${CX},394 L${CX},428 M${CX - 8},418 L${CX},429 L${CX + 8},418`}
        fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
      />
      <text className="story-figure__lead" x={CX} y="458" fill={INK.mark} textAnchor="middle">
        …and it walks down.
      </text>

      {/* labels. Both sit above the beam: below it, the left margin is only
          124 units wide before the thread starts. That margin also caps the
          left label at about ten characters a line — "cannot move." reached
          x=150 and touched a tooth, which the text-only checker could not
          see and a person could. */}
      <path d="M96,208 L58,220" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="26" y="176" fill={INK.line}>
        <tspan x="26">The beam</tspan>
        <tspan x="26" dy="22">is bolted.</tspan>
      </text>
      <path d="M276,204 L232,236" fill="none" stroke={INK.line} strokeWidth="1.4" />
      <text className="story-figure__note" x="240" y="168" fill={INK.line}>
        <tspan x="240">A groove cut to</tspan>
        <tspan x="240" dy="22">fit the ridge.</tspan>
      </text>

      {/* ---------------- the jar ---------------- */}
      <line x1="424" y1="60" x2="424" y2="430" stroke={INK.stoneDark} strokeWidth="1.5" strokeDasharray="5 6" />

      <text className="story-figure__lead" x={JAR_CX} y="96" fill={INK.mark} textAnchor="middle">
        You know this one.
      </text>
      <path d={`M534,138 Q${JAR_CX},114 650,138`} fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M641,128 L652,139 L637,142" fill="none" stroke={INK.mark} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

      {/* the lid, lifted and cut through, so both threads are visible at once */}
      <rect x="534" y="152" width="116" height="20" rx="4" fill={INK.woodDark} stroke={INK.line} strokeWidth="2" />
      <path
        d={edgeToPath(534, interlockEdge(JAR_CX - NECK, JAR_CX - NECK - JAR_RIDGE, 172, 222, skirtGroove, JAR_HALF))}
        fill={INK.woodDark} stroke={INK.line} strokeWidth="2"
      />
      <path
        d={edgeToPath(650, interlockEdge(JAR_CX + NECK, JAR_CX + NECK + JAR_RIDGE, 172, 222, skirtGroove, JAR_HALF))}
        fill={INK.woodDark} stroke={INK.line} strokeWidth="2"
      />
      <path
        d="M545,226 L545,240 M540,234 L545,241 L550,234 M639,226 L639,240 M634,234 L639,241 L644,234"
        fill="none" stroke={INK.mark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />

      {/* the jar: a neck with a matching thread, on a body */}
      <path
        d={`M${JAR_CX - NECK},248 L${JAR_CX - NECK},300 L${JAR_CX - 64},330 L${JAR_CX - 64},408 Q${JAR_CX - 64},424 ${JAR_CX - 48},424 L${JAR_CX + 48},424 Q${JAR_CX + 64},424 ${JAR_CX + 64},408 L${JAR_CX + 64},330 L${JAR_CX + NECK},300 L${JAR_CX + NECK},248 Z`}
        fill={INK.stone} stroke={INK.line} strokeWidth="2"
      />
      {neckTeeth.map((y) => (
        <rect
          key={`nl${y}`} x={JAR_CX - NECK - JAR_RIDGE} y={y - JAR_HALF}
          width={JAR_RIDGE} height={JAR_HALF * 2}
          fill={INK.woodShade} stroke={INK.line} strokeWidth="1.5"
        />
      ))}
      {neckTeeth.map((y) => (
        <rect
          key={`nr${y}`} x={JAR_CX + NECK} y={y - JAR_HALF}
          width={JAR_RIDGE} height={JAR_HALF * 2}
          fill={INK.woodShade} stroke={INK.line} strokeWidth="1.5"
        />
      ))}

      <text className="story-figure__note" x={JAR_CX} y="458" fill={INK.line} textAnchor="middle">
        Round makes down.
      </text>
    </svg>
  );
}

export default OliveScrewAndNut;
