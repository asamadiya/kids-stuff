import { useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import {
  MAX_OFFERS, ONE_SWING_TWO_KIDS_META, SCENARIOS,
  addPlayed, clampShare, clockRanOut, coverageText, endingText, offerLine, plateLines, reactTo,
  scenarioById, settle, splitText, spokenSplit,
} from '../../sel/one-swing-two-kids';
import type { EndingKind, Outcome, Reaction, Scenario } from '../../sel/one-swing-two-kids';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptRound extends Kept {
  readonly scenario: string;
  readonly mine: number;
  readonly theirs: number;
  readonly offers: number;
  readonly asked: boolean;
}
const shelf = drawer<KeptRound>('one-swing-two-kids');

const BASE = import.meta.env.BASE_URL;

/* Paper, ink and hairlines. Colour identifies; it never decorates. */
const PAPER = '#f4f0e6';
const RAISED = '#fbf9f4';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TERRA = '#9e4b27';
const OCHRE = '#8a6416';
const TEAL = '#2a5957';

const VIEW_W = 720;
const VIEW_H = 212;
const X0 = 56;
const X1 = 664;
const SPAN = X1 - X0;
const BAND_Y = 96;
const BAND_H = 42;

const PICTURE = { width: '100%', maxWidth: '20rem', height: 'auto', border: `1px solid ${RULE}` } as const;
const PORTRAIT = { width: '100%', maxWidth: '8rem', height: 'auto', border: `1px solid ${RULE}` } as const;
const THUMB = { display: 'block', width: '6rem', height: 'auto', border: `1px solid ${RULE}` } as const;
const NUM = { fontVariantNumeric: 'tabular-nums' } as const;

export function OneSwingTwoKids() {
  const [scenarioId, setScenarioId] = useState<string>(SCENARIOS[0].id);
  const [mine, setMine] = useState<number>(Math.floor(SCENARIOS[0].total / 2));
  const [offers, setOffers] = useState<readonly number[]>([]);
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [dragging, setDragging] = useState(false);
  const [played, setPlayed] = useState<readonly string[]>(() =>
    shelf.list().reduce<readonly string[]>((acc, k) => addPlayed(acc, k.scenario), []));
  const [kept, setKept] = useState<readonly KeptRound[]>(() => shelf.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const s: Scenario = scenarioById(scenarioId) ?? SCENARIOS[0];
  const locked = outcome !== null;
  const theirs = s.total - mine;
  const xAt = (v: number): number => X0 + (v / s.total) * SPAN;
  const dividerX = xAt(mine);
  const counterX = reaction && reaction.ask !== null ? xAt(s.total - reaction.ask) : null;
  const face = outcome ? outcome.face : reaction ? reaction.face : s.faces.waiting;
  const panel = outcome ? s.outcome : s.setup;
  const panelAlt = outcome ? s.outcomeAlt : s.setupAlt;

  /* ---------------------------------------------------------------- playing */

  const begin = (next: Scenario): void => {
    setScenarioId(next.id);
    setMine(Math.floor(next.total / 2));
    setOffers([]);
    setReaction(null);
    setOutcome(null);
    say(next.stop);
  };

  const finish = (list: readonly number[], ending: EndingKind): void => {
    const done = settle(s, list, ending);
    setOutcome(done);
    setMine(done.mine);
    setPlayed((p) => addPlayed(p, s.id));
    pluck(step(-7), 0.6);
    say([...done.lines, endingText(s, done)].join(' '));
  };

  const offer = (): void => {
    if (locked || offers.length >= MAX_OFFERS) return;
    const next = [...offers, theirs];
    const answer = reactTo(s, next);
    if (!answer) return;
    setOffers(next);
    setReaction(answer);
    pluck(step(2), 0.22);
    if (answer.kind === 'accepted') { finish(next, 'accepted'); return; }
    if (answer.kind === 'left') { finish(next, 'left'); return; }
    if (clockRanOut(next, answer)) { finish(next, 'ranOut'); return; }
    say(`${offerLine(s, mine)} ${answer.line}`);
  };

  const take = (): void => {
    if (locked || !reaction || reaction.kind !== 'counter') return;
    finish(offers, 'took');
  };

  const nudge = (delta: number): void => {
    if (locked) return;
    const v = clampShare(s, mine + delta);
    if (v === mine) return;
    setMine(v);
    pluck(step(delta > 0 ? 4 : -3), 0.18);
    say(spokenSplit(s, v));
  };

  /* --------------------------------------------------------- sliding it about */

  const valueFromX = (clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return mine;
    const box = svg.getBoundingClientRect();
    if (!box.width) return mine;
    const vx = ((clientX - box.left) / box.width) * VIEW_W;
    return clampShare(s, ((vx - X0) / SPAN) * s.total);
  };

  const onHandleDown = (e: ReactPointerEvent<SVGGElement>): void => {
    if (locked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setMine(valueFromX(e.clientX));
  };

  const onHandleMove = (e: ReactPointerEvent<SVGGElement>): void => {
    if (locked || !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    setMine(valueFromX(e.clientX));
  };

  const onHandleUp = (e: ReactPointerEvent<SVGGElement>): void => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    if (locked) return;
    pluck(step(-2), 0.2);
    say(spokenSplit(s, mine));
  };

  const onHandleKey = (e: ReactKeyboardEvent<SVGGElement>): void => {
    if (locked) return;
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = mine - 1;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = mine + 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = s.total;
    if (next === null) return;
    e.preventDefault();
    const v = clampShare(s, next);
    setMine(v);
    say(spokenSplit(s, v));
  };

  /* ----------------------------------------------------------------- keeping */

  const keep = (): void => {
    if (!outcome) return;
    shelf.add({
      scenario: s.id, mine: outcome.mine, theirs: outcome.theirs,
      offers: outcome.offers, asked: outcome.asked,
    });
    setKept(shelf.list());
    say('kept in the drawer');
  };

  const drop = (id: string): void => {
    shelf.remove(id);
    setKept(shelf.list());
  };

  const lines = outcome ? plateLines(s, outcome) : [s.stop, splitText(s, mine)];

  const savePicture = (): void => {
    if (!svgRef.current) return;
    void exportPlate(
      svgRef.current,
      { title: `${ONE_SWING_TWO_KIDS_META.title} — ${s.short}`, lines },
      `one-swing-two-kids-${s.id}`,
    );
  };

  /* ---------------------------------------------------------------- drawing */

  const ticks = Array.from({ length: s.total + 1 }, (_, i) => i);

  return (
    <section className="bench" aria-labelledby="one-swing-two-kids-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{ONE_SWING_TWO_KIDS_META.eyebrow}</p>
          <h2 id="one-swing-two-kids-title" className="bench__title">{ONE_SWING_TWO_KIDS_META.title}</h2>
          <p className="bench__note">{ONE_SWING_TWO_KIDS_META.note}</p>
        </div>
        <p className="bench__readout">{coverageText(played)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row">
          <figure className="bench__figure">
            <img src={`${BASE}games/sel/${panel}.png`} alt={panelAlt} style={PICTURE} />
            <figcaption className="bench__figure-caption">{s.thing}</figcaption>
          </figure>
          <figure className="bench__figure">
            <img src={`${BASE}games/faces/${face}.png`} alt={`${s.other}, looking ${face}.`} style={PORTRAIT} />
            <figcaption className="bench__figure-caption">{s.other}</figcaption>
          </figure>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`A band of ${s.total} ${s.unit}. ${splitText(s, mine)}.`}
        >
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={PAPER} />

          <text x={X0} y="30" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            {`${s.total} ${s.unit}`.toUpperCase()}
          </text>

          {/* the three offers the clock allows, filled as they are spent */}
          <text x={X1 - 92} y="30" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            OFFERS
          </text>
          {[0, 1, 2].map((i) => (
            <circle
              key={i} cx={X1 - 34 + i * 17} cy="25" r="5.5"
              fill={i < offers.length ? INK : 'none'} stroke={i < offers.length ? INK : RULE} strokeWidth="1.2"
            />
          ))}

          {/* who the two ends belong to */}
          <text x={(X0 + dividerX) / 2} y="56" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="1.4" fill={FAINT}>
            YOU
          </text>
          <text x={(dividerX + X1) / 2} y="56" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="1.4" fill={FAINT}>
            {s.other.toUpperCase()}
          </text>
          <text x={(X0 + dividerX) / 2} y="84" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="26" fill={TEAL} style={NUM}>
            {mine}
          </text>
          <text x={(dividerX + X1) / 2} y="84" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="26" fill={TERRA} style={NUM}>
            {theirs}
          </text>

          {/* the band itself, ruled off one unit at a time */}
          <rect x={X0} y={BAND_Y} width={SPAN} height={BAND_H} fill={RAISED} stroke={RULE} strokeWidth="1" />
          <rect x={X0} y={BAND_Y} width={dividerX - X0} height={BAND_H} fill={TEAL} fillOpacity="0.16" />
          <rect x={dividerX} y={BAND_Y} width={X1 - dividerX} height={BAND_H} fill={TERRA} fillOpacity="0.14" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={xAt(t)} y1={BAND_Y} x2={xAt(t)} y2={BAND_Y + BAND_H} stroke={RULE} strokeWidth="1" />
              <line x1={xAt(t)} y1={BAND_Y + BAND_H} x2={xAt(t)} y2={BAND_Y + BAND_H + 6} stroke={RULE} strokeWidth="1" />
            </g>
          ))}
          <rect x={X0} y={BAND_Y} width={SPAN} height={BAND_H} fill="none" stroke={INK} strokeWidth="1.2" />

          {/* what they answered with, on the same band */}
          {counterX !== null && reaction !== null && reaction.ask !== null && (
            <g>
              <line
                x1={counterX} y1={BAND_Y - 10} x2={counterX} y2={BAND_Y + BAND_H + 10}
                stroke={OCHRE} strokeWidth="2" strokeDasharray="5 4"
              />
              <path
                d={`M${counterX} ${BAND_Y - 10}L${counterX - 7} ${BAND_Y - 22}L${counterX + 7} ${BAND_Y - 22}Z`}
                fill={OCHRE}
              />
              <text x={counterX - 10} y={BAND_Y + BAND_H + 46} textAnchor="end" fontFamily="Inter, sans-serif" fontSize="16" fill={OCHRE} style={NUM}>
                {s.total - reaction.ask}
              </text>
              <text x={counterX + 10} y={BAND_Y + BAND_H + 46} fontFamily="Inter, sans-serif" fontSize="16" fill={OCHRE} style={NUM}>
                {reaction.ask}
              </text>
            </g>
          )}

          {/* his own divider, dragged in the dividing-string hand */}
          <g
            role="slider"
            tabIndex={locked ? -1 : 0}
            aria-label={`Where the ${s.unit} divide between you and ${s.other}`}
            aria-valuemin={0}
            aria-valuemax={s.total}
            aria-valuenow={mine}
            aria-valuetext={spokenSplit(s, mine)}
            aria-disabled={locked || undefined}
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
            onKeyDown={onHandleKey}
            style={{ cursor: locked ? 'default' : 'ew-resize', touchAction: 'none' }}
          >
            <rect
              x={dividerX - 28} y={BAND_Y - 20} width="56" height={BAND_H + 52}
              fill="transparent" stroke="none"
            />
            <line
              x1={dividerX} y1={BAND_Y - 16} x2={dividerX} y2={BAND_Y + BAND_H + 6}
              stroke={INK} strokeWidth={dragging ? 4 : 3}
            />
            <path
              d={`M${dividerX} ${BAND_Y + BAND_H + 6}L${dividerX - 13} ${BAND_Y + BAND_H + 26}L${dividerX + 13} ${BAND_Y + BAND_H + 26}Z`}
              fill={locked ? TEAL : PAPER} stroke={INK} strokeWidth="1.5"
            />
            <line
              x1={dividerX - 6} y1={BAND_Y + BAND_H + 20} x2={dividerX + 6} y2={BAND_Y + BAND_H + 20}
              stroke={INK} strokeWidth="1"
            />
          </g>

          <line x1={X0} y1={VIEW_H - 30} x2={X1} y2={VIEW_H - 30} stroke={RULE} strokeWidth="1" />
          <text x={X0} y={VIEW_H - 12} fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
            {s.stop}
          </text>
        </svg>
      </div>

      <div className="bench__row">
        <p className="bench__readout">{outcome ? endingText(s, outcome) : splitText(s, mine)}</p>
      </div>

      {s.guide !== null && <p className="bench__note">{s.guide}</p>}
      {reaction !== null && !locked && (
        <p className="bench__note">{`${offerLine(s, s.total - (offers[offers.length - 1] ?? 0))} ${reaction.line}`}</p>
      )}
      {outcome !== null && outcome.lines.map((line) => <p className="bench__note" key={line}>{line}</p>)}

      <div className="bench__actions">
        <button
          type="button" className="bench-btn" onClick={() => nudge(-1)}
          disabled={locked || mine <= 0}
          aria-label={`One more ${s.unitOne} for ${s.other}`}
        >
          ← {s.other}
        </button>
        <button
          type="button" className="bench-btn" onClick={() => nudge(1)}
          disabled={locked || mine >= s.total}
          aria-label={`One more ${s.unitOne} for you`}
        >
          You →
        </button>
        <button
          type="button" className="bench-btn bench-btn--primary" onClick={offer}
          disabled={locked || offers.length >= MAX_OFFERS}
        >
          {offers.length === 0 ? 'Offer this' : 'Offer again'}
        </button>
        {reaction !== null && reaction.kind === 'counter' && !locked && (
          <button type="button" className="bench-btn" onClick={take}>
            {`Take ${s.other}'s offer`}
          </button>
        )}
        {locked && (
          <>
            <button type="button" className="bench-btn" onClick={keep}>Keep this</button>
            <button type="button" className="bench-btn" onClick={() => begin(s)}>Play it again</button>
            <button type="button" className="bench-btn" onClick={savePicture}>Save the picture</button>
            <button type="button" className="bench-btn" onClick={() => printPlate()}>Print</button>
          </>
        )}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">Choose a situation</p>
        {SCENARIOS.map((c) => (
          <button
            key={c.id} type="button"
            className={c.id === s.id ? 'bench-part is-set' : 'bench-part'}
            onClick={() => begin(c)}
          >
            <img src={`${BASE}games/sel/${c.setup}.png`} alt={c.short} style={THUMB} />
          </button>
        ))}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">In the drawer</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept"><span className="bench__kept-meta">Nothing kept yet.</span></li>}
          {kept.map((k) => (
            <li className="bench__kept" key={k.id}>
              <span className="bench__kept-name">{scenarioById(k.scenario)?.short ?? k.scenario}</span>
              <span className="bench__kept-meta" style={NUM}>
                {`${k.mine} and ${k.theirs} · ${k.offers} ${k.offers === 1 ? 'offer' : 'offers'}`}
              </span>
              <button
                type="button" className="bench-part" onClick={() => drop(k.id)}
                aria-label={`Take ${scenarioById(k.scenario)?.short ?? k.scenario} out of the drawer`}
              >
                Take out
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{`${ONE_SWING_TWO_KIDS_META.title} — ${s.short}`}</p>
        {lines.map((line) => <p className="plate-print__line" key={line}>{line}</p>)}
      </div>
    </section>
  );
}

export default OneSwingTwoKids;
