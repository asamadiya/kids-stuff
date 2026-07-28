import { useMemo, useRef, useState } from 'react';
import {
  BORROWED_EYES_META, CHIPS, MOMENTS,
  bothSentences, chipAt, chipById, chipClause, chipWord, coneIn, coverageLine, earlierChip,
  eyeFor, eyeLineIn, hiddenFrom, momentComplete, nextNotch, notchAngle, plateChips, plateLines,
  readingFor, seesIn, sentenceFor, slotKey, spotsIn, wrapWords,
} from '../../sel/borrowed-eyes';
import type { ChipId, Moment, Other, Placed, PlateChip, View } from '../../sel/borrowed-eyes';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptPlate extends Kept {
  readonly moment: string;
  readonly title: string;
  readonly chips: readonly PlateChip[];
}
const rack = drawer<KeptPlate>('borrowed-eyes');

const PAPER = '#f4f0e6', RAISED = '#fbf9f4', SUNKEN = '#eae4d5';
const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4';
const OCHRE = '#8a6416', TEAL = '#2a5957', SLATE = '#3c566f';

/* ------------------------------------------------------------------ chips -- */

/** The six intent chips, drawn. Geometry only, in a 48 by 48 box. */
function ChipGlyph({ id, tint }: { id: ChipId; tint: string }) {
  const s = { fill: 'none', stroke: tint, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (id) {
    case 'join':
      return (
        <g>
          <circle cx="30" cy="18" r="4.5" {...s} />
          <circle cx="38" cy="30" r="4.5" {...s} />
          <circle cx="26" cy="34" r="4.5" {...s} />
          <circle cx="10" cy="26" r="4.5" {...s} fill={tint} />
          <path d="M15 26 H22" {...s} />
          <path d="M19 22 L23 26 L19 30" {...s} />
        </g>
      );
    case 'help':
      return (
        <g>
          <rect x="17" y="9" width="14" height="12" rx="1.5" {...s} />
          <path d="M11 30 C11 39, 37 39, 37 30" {...s} />
          <path d="M24 22 V26" {...s} />
        </g>
      );
    case 'own':
      return (
        <g>
          <circle cx="19" cy="24" r="6" {...s} fill={tint} />
          <path d="M8 12 C2 24, 8 36, 8 36" {...s} />
          <path d="M27 24 H40" {...s} />
          <path d="M36 19 L41 24 L36 29" {...s} />
        </g>
      );
    case 'unseen':
      return (
        <g>
          <path d="M7 26 C14 16, 34 16, 41 26 C34 36, 14 36, 7 26 Z" {...s} />
          <circle cx="24" cy="26" r="4" {...s} />
          <rect x="4" y="20" width="40" height="5" fill={PAPER} stroke="none" />
          <path d="M4 22.5 H44" {...s} />
        </g>
      );
    case 'hurry':
      return (
        <g>
          <path d="M6 15 H20" {...s} />
          <path d="M4 24 H18" {...s} />
          <path d="M8 33 H21" {...s} />
          <path d="M31 10 L26 24 H34 L28 38" {...s} />
        </g>
      );
    case 'copy':
      return (
        <g>
          <rect x="7" y="14" width="16" height="20" rx="1.5" {...s} />
          <rect x="26" y="14" width="16" height="20" rx="1.5" {...s} strokeDasharray="3 3" />
          <path d="M13 24 H17" {...s} />
          <path d="M32 24 H36" {...s} />
        </g>
      );
  }
}

/* ------------------------------------------------------------------- plan -- */

const PLAN_W = 360, PLAN_H = 300;

/**
 * The room from above, with the standing eye's cone drawn over it and every
 * figure that eye cannot see left hollow. Nothing here is asserted: the cone,
 * the positions and the hollow marks are all read off the same plan the spoken
 * sentence is generated from.
 */
function RoomPlan({ moment, view }: { moment: Moment; view: View }) {
  const eye = eyeFor(moment.plan, view.id);
  const spots = spotsIn(moment.plan, PLAN_W, PLAN_H);
  const cone = coneIn(moment.plan, eye, PLAN_W, PLAN_H);
  const covered = new Set(hiddenFrom(moment.plan, eye).map((s) => s.figure.id));
  return (
    <svg viewBox={`0 0 ${PLAN_W} ${PLAN_H}`} role="img"
      aria-label={`${moment.where}, seen from above. ${seesIn(moment, view)}`}
      style={{ display: 'block', width: '100%', maxWidth: `${PLAN_W}px`, height: 'auto' }}>
      <rect x="0" y="0" width={PLAN_W} height={PLAN_H} fill={PAPER} />
      <clipPath id={`plan-${moment.id}`}>
        <rect x="0" y="0" width={PLAN_W} height={PLAN_H} />
      </clipPath>
      <g clipPath={`url(#plan-${moment.id})`}>
        <path
          d={`M${cone.x} ${cone.y} L${cone.left[0]} ${cone.left[1]} L${cone.right[0]} ${cone.right[1]} Z`}
          fill={SUNKEN}
          stroke={RULE}
          strokeWidth="1"
        />
      </g>
      {spots.map((s) => {
        const self = s.figure.id === eye.self;
        const hidden = covered.has(s.figure.id);
        return (
          <g key={s.figure.id}>
            <circle cx={s.x} cy={s.y} r={s.r}
              fill={self ? OCHRE : hidden ? PAPER : RAISED}
              stroke={self ? OCHRE : hidden ? RULE : INK}
              strokeWidth="1.2"
              strokeDasharray={hidden ? '3 3' : undefined} />
            <text x={s.x} y={s.y - s.r - 4} textAnchor="middle" fontFamily="Inter, sans-serif"
              fontSize="9" fill={hidden ? FAINT : INK}>
              {s.figure.label}
            </text>
          </g>
        );
      })}
      <text x="8" y={PLAN_H - 8} fontFamily="Inter, sans-serif" fontSize="9" letterSpacing="1.2" fill={FAINT}>
        {`${moment.plan.across} BY ${moment.plan.deep} CENTIMETRES, FROM ABOVE`}
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------- the exhibit -- */

export function BorrowedEyes() {
  const [momentIndex, setMomentIndex] = useState(0);
  const [notch, setNotch] = useState(0);
  const [placed, setPlaced] = useState<Placed>({});
  const [kept, setKept] = useState<KeptPlate[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const moment: Moment = MOMENTS[momentIndex];
  const views = moment.views;
  const view: View = views[Math.min(notch, views.length - 1)];
  const other: Other = moment.other;
  const complete = momentComplete(moment, placed);

  const earlier = useMemo(() => {
    const runs = kept.filter((k) => k.moment === moment.id);
    return runs.length > 0 ? runs[runs.length - 1].chips : [];
  }, [kept, moment.id]);

  const goTo = (index: number, next = 0) => {
    setMomentIndex(index);
    setNotch(next);
    say(seesIn(MOMENTS[index], MOMENTS[index].views[next]));
  };

  const turn = (to: number) => {
    setNotch(to);
    pluck(step(to === 0 ? -5 : 2), 0.3);
    say(seesIn(moment, views[to]));
  };

  const place = (id: ChipId) => {
    const key = slotKey(moment.id, view.id);
    const next: Placed = { ...placed, [key]: id };
    setPlaced(next);
    pluck(step(0), 0.25);
    if (momentComplete(moment, next)) say(bothSentences(moment).join(' '));
    else say(chipWord(chipById(id), other));
  };

  const keep = () => {
    if (!complete) return;
    rack.add({ moment: moment.id, title: moment.title, chips: plateChips(moment, placed) });
    setKept(rack.list());
    say('kept');
  };

  const lines = plateLines(moment, placed);

  /* ------------------------------------------------------- the two-view plate */
  const W = 720, H = 300, MID = W / 2;
  const columns = views.map((v, i) => {
    const id = chipAt(placed, moment.id, v.id);
    return {
      view: v,
      x: 28 + i * (MID - 8),
      chip: id ? chipById(id) : null,
      was: earlierChip(earlier, v.id),
    };
  });

  return (
    <section className="bench" aria-labelledby="borrowed-eyes-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{BORROWED_EYES_META.eyebrow}</p>
          <h2 id="borrowed-eyes-title" className="bench__title">{BORROWED_EYES_META.title}</h2>
          <p className="bench__note">{BORROWED_EYES_META.note}</p>
        </div>
        <p className="bench__readout">{coverageLine(placed)}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row" style={{ alignItems: 'flex-start' }}>
          <figure className="bench__figure" style={{ margin: 0, flex: '1 1 20rem' }}>
            <img
              src={`${import.meta.env.BASE_URL}games/sel/${moment.imageId}.png`}
              alt={moment.alt}
              style={{
                display: 'block', width: '100%', height: 'auto',
                border: `1px solid ${RULE}`, background: SUNKEN,
              }}
            />
            <figcaption className="bench__figure-caption">{moment.where}</figcaption>
          </figure>
          <figure className="bench__figure" style={{ margin: 0, flex: '1 1 20rem' }}>
            <RoomPlan moment={moment} view={view} />
            <figcaption className="bench__figure-caption">{seesIn(moment, view)}</figcaption>
          </figure>
        </div>

        <div className="bench__row" style={{ marginTop: 'var(--space-4)', gap: 'var(--space-4)' }}>
          <svg viewBox="0 0 120 76" width="120" height="76" aria-hidden="true" style={{ width: '120px', flex: '0 0 auto' }}>
            <rect x="0" y="0" width="120" height="76" fill={PAPER} />
            <circle cx="60" cy="52" r="30" fill={RAISED} stroke={OCHRE} strokeWidth="2" />
            <circle cx="60" cy="52" r="22" fill="none" stroke={RULE} strokeWidth="1" />
            {views.map((v, i) => {
              const a = ((notchAngle(i, views.length) - 90) * Math.PI) / 180;
              return (
                <line
                  key={v.id}
                  x1={60 + Math.cos(a) * 24} y1={52 + Math.sin(a) * 24}
                  x2={60 + Math.cos(a) * 30} y2={52 + Math.sin(a) * 30}
                  stroke={OCHRE} strokeWidth="2"
                />
              );
            })}
            <g transform={`rotate(${notchAngle(notch, views.length)} 60 52)`} style={{ transition: 'transform 420ms ease' }}>
              <line x1="60" y1="52" x2="60" y2="24" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
            </g>
            <circle cx="60" cy="52" r="4" fill={OCHRE} />
          </svg>
          {views.map((v, i) => (
            <button
              key={v.id}
              type="button"
              className={`bench-part${i === notch ? ' is-set' : ''}`}
              aria-pressed={i === notch}
              onClick={() => turn(i)}
            >
              {v.whose}
              <span className="bench__figure-caption" style={{ display: 'block' }}>{eyeLineIn(moment, v)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          A chip for this position — {view.whose.toLowerCase()}. {sentenceFor(view)}
        </p>
        {CHIPS.map((c) => {
          const set = chipAt(placed, moment.id, view.id) === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`bench-part${set ? ' is-set' : ''}`}
              aria-pressed={set}
              onClick={() => place(c.id)}
            >
              <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" style={{ display: 'block', margin: '0 auto' }}>
                <ChipGlyph id={c.id} tint={set ? TEAL : INK} />
              </svg>
              <span className="bench__figure-caption" style={{ display: 'block' }}>{chipWord(c, other)}</span>
            </button>
          );
        })}
      </div>

      <div className="bench__stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label={`${moment.title}: ${bothSentences(moment).join(' ')}`}
        >
          <rect x="0" y="0" width={W} height={H} fill={PAPER} />
          <text x="28" y="30" fontFamily="Inter, sans-serif" fontSize="12" letterSpacing="1.6" fill={FAINT}>
            {moment.title.toUpperCase()}
          </text>
          <line x1="28" y1="44" x2={W - 28} y2="44" stroke={RULE} strokeWidth="1" />
          <line x1={MID} y1="56" x2={MID} y2={H - 28} stroke={RULE} strokeWidth="1" />
          {columns.map((col) => (
            <g key={col.view.id} transform={`translate(${col.x} 0)`}>
              <text x="0" y="76" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="1.2" fill={FAINT}>
                {col.view.whose.toUpperCase()}
              </text>
              {wrapWords(sentenceFor(col.view), 40).map((line, li) => (
                <text key={`${li}-${line}`} x="0" y={102 + li * 20} fontFamily="Literata, Georgia, serif" fontSize="15" fill={INK}>
                  {line}
                </text>
              ))}
              <g transform="translate(0 176)">
                <rect x="0" y="0" width="52" height="52" fill={RAISED} stroke={col.chip ? TEAL : RULE} strokeWidth="1.2" />
                {col.chip && (
                  <g transform="translate(2 2) scale(1)">
                    <ChipGlyph id={col.chip.id} tint={TEAL} />
                  </g>
                )}
              </g>
              {col.chip && wrapWords(`${col.view.from}, ${chipClause(col.chip, other)}.`, 30).map((line, li) => (
                <text key={`${li}-${line}`} x="64" y={196 + li * 18} fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
                  {line}
                </text>
              ))}
              {col.was && (
                <g transform="translate(0 244)">
                  <text x="0" y="0" fontFamily="Inter, sans-serif" fontSize="11" letterSpacing="1.2" fill={FAINT}>
                    EARLIER
                  </text>
                  <g transform="translate(58 -16) scale(0.5)">
                    <ChipGlyph id={col.was} tint={SLATE} />
                  </g>
                  <text x="86" y="0" fontFamily="Inter, sans-serif" fontSize="12" fill={SLATE}>
                    {chipWord(chipById(col.was), other)}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={() => turn(nextNotch(notch, views.length))}>
          Turn the dial
        </button>
        <button type="button" className="bench-btn" onClick={() => say(bothSentences(moment).join(' '))}>
          Read both out loud
        </button>
        <button type="button" className="bench-btn" aria-disabled={!complete} onClick={keep}>
          Keep this plate
        </button>
        <button
          type="button"
          className="bench-btn"
          onClick={() => {
            if (svgRef.current) void exportPlate(svgRef.current, { title: moment.title, lines }, `borrowed-eyes-${moment.id}`);
          }}
        >
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">Another moment</p>
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            className={`bench-part bench-part--wide${i === momentIndex ? ' is-set' : ''}`}
            aria-pressed={i === momentIndex}
            onClick={() => goTo(i)}
          >
            {m.title}
            <span className="bench__figure-caption" style={{ display: 'block' }}>{m.where}</span>
          </button>
        ))}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Both readings</p>
        <ul className="bench__shelf-list" style={{ display: 'block' }}>
          {views.map((v) => {
            const id = chipAt(placed, moment.id, v.id);
            return (
              <li key={v.id} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>
                {sentenceFor(v)}
                {id ? ` ${readingFor(moment, v, chipById(id))}` : ''}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Kept plates</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing kept yet.</li>}
          {kept.slice(-6).reverse().map((k) => (
            <li key={k.id} className="bench__kept">
              <button
                type="button"
                className="bench-btn"
                onClick={() => goTo(Math.max(0, MOMENTS.findIndex((m) => m.id === k.moment)))}
              >
                <span className="bench__kept-name">{k.title}</span>{' '}
                <span className="bench__kept-meta">{k.chips.length} positions</span>
              </button>
              <button
                type="button"
                className="bench-btn"
                aria-label={`Discard the plate for ${k.title}`}
                onClick={() => { rack.remove(k.id); setKept(rack.list()); }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{moment.title}</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default BorrowedEyes;
