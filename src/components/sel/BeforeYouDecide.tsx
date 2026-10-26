import { useMemo, useRef, useState } from 'react';
import {
  BEFORE_YOU_DECIDE_META, CASES, GLYPHS, LISTEN, PICTURE_MARK, QUESTION_KINDS, SHEET,
  askedFacts, caseAt, casesDecided, chipFor, choiceTrayLabel, factFor, plateLines,
  rackLabel, readout, sheetHeight, sheetRows, timelineMarks, unaskedFacts, unaskedLine,
} from '../../sel/before-you-decide';
import type { Case, Decided, QuestionKind, StatedFact } from '../../sel/before-you-decide';
import { drawer } from '../../lib/drawer';
import type { Kept } from '../../lib/drawer';
import { pluck, step } from '../../lib/tone';
import { exportPlate, printPlate } from '../../lib/plate';
import { ReadAloud } from '../../audio/ReadAloud';
import { useStopOnInteraction } from '../../audio/useStopOnInteraction';

interface Row extends Kept, Decided {}
const rack = drawer<Row>('before-you-decide');

const BASE = import.meta.env.BASE_URL;
const PAPER = '#f4f0e6', SUNKEN = '#eae4d5', INK = '#22211b', FAINT = '#6b6757';
const RULE = '#ddd6c4', TEAL = '#2a5957', OCHRE = '#8a6416';

/** Read-aloud button ids, unique on the screen. */
const READ = 'sel/before-you-decide';

function Mark({ path, size = 30, colour = INK }: { path: string; size?: number; colour?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"
      style={{ display: 'block', width: size, height: size }}>
      <path d={path} fill="none" stroke={colour} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The one picture in the case. There is exactly one of these on screen, because
 * `Fact` has no field that could name a second plate.
 */
function Plate({ subject }: { subject: Case }) {
  const caption = LISTEN.setup(subject);
  return (
    <figure className="bench__figure" style={{ margin: 0, maxWidth: '22rem' }}>
      <img src={`${BASE}games/sel/${subject.setupPanelId}.png`} alt={subject.setupAlt}
        style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${RULE}`, background: SUNKEN }} />
      <figcaption className="bench__figure-caption">{caption.join(' ')}</figcaption>
      <ReadAloud id={`${READ}/setup`} texts={caption} compact />
    </figure>
  );
}

/**
 * A fact, drawn rather than painted: its question mark, its question (or, once
 * turned over, what was not asked), its sentence. The two lines on the card are
 * the two lines its read button plays.
 */
function FactCard({ fact, prefix }: { fact: StatedFact; prefix?: string }) {
  const [head, said] = LISTEN.card(fact, prefix);
  return (
    <div className="bench__figure" style={{ maxWidth: '20rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start', textAlign: 'left' }}>
      <Mark path={chipFor(fact.kind).path} size={26} colour={TEAL} />
      <div>
        <p className="bench__figure-caption" style={{ margin: 0, textAlign: 'left', color: FAINT }}>{head}</p>
        <p className="bench__figure-caption" style={{ margin: 0, textAlign: 'left', color: INK }}>{said}</p>
      </div>
      <ReadAloud id={`${READ}/fact/${fact.kind}`} texts={[head, said]} compact />
    </div>
  );
}

/**
 * The clock question is a claim about time, so it is drawn as time rather than
 * said as a sentence: three stops in order, down the page so a stop can be as
 * long as it needs to be, with the picture's stop filled in and `PICTURE_MARK`
 * under it. This strip and its read button both come from `Case.timeline`, and
 * this replaces the clock fact's card rather than sitting beside it. Turned over
 * unasked, it carries the same "You did not ask" line above its question that a
 * card would, and reads it.
 */
function Timeline({ subject, prefix }: { subject: Case; prefix?: string }) {
  const marks = timelineMarks(subject);
  const head = [...(prefix === undefined ? [] : [prefix]), factFor(subject, 'clock').question];
  const LINE = 16;
  const W = 330, TOP = 30 + (head.length - 1) * LINE, STEP = 34, H = TOP + (marks.length - 1) * STEP + 34;
  const y = (at: number) => TOP + at * (marks.length - 1) * STEP;
  const said = LISTEN.timeline(subject, prefix);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.4rem', width: '100%', maxWidth: `${W}px` }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={said.join(' ')}
        style={{ display: 'block', width: '100%', maxWidth: `${W}px`, height: 'auto' }}>
        <rect x="0" y="0" width={W} height={H} fill={PAPER} />
        {head.map((line, i) => (
          <text key={line} x="0" y={12 + i * LINE} fontFamily="Inter, system-ui, sans-serif" fontSize="12" fill={FAINT}>
            {line}
          </text>
        ))}
        <line x1="9" y1={y(0)} x2="9" y2={y(1)} stroke={RULE} strokeWidth="1" />
        {marks.map((m) => (
          <g key={m.says}>
            <circle cx="9" cy={y(m.at)} r="5.5" fill={m.isPicture ? OCHRE : PAPER}
              stroke={m.isPicture ? OCHRE : RULE} strokeWidth="1.2" />
            <text x="26" y={y(m.at) + 4} fontFamily="Inter, system-ui, sans-serif" fontSize="12"
              fill={m.isPicture ? INK : FAINT}>
              {m.says}
            </text>
            {m.isPicture && (
              <text x="26" y={y(m.at) + 20} fontFamily="Inter, system-ui, sans-serif" fontSize="11"
                fontWeight="600" fill={OCHRE}>
                {PICTURE_MARK}
              </text>
            )}
          </g>
        ))}
      </svg>
      <ReadAloud id={`${READ}/fact/clock`} texts={said} />
    </div>
  );
}

export function BeforeYouDecide() {
  const [index, setIndex] = useState(0);
  const [asked, setAsked] = useState<readonly QuestionKind[]>([]);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [turned, setTurned] = useState(false);
  const [records, setRecords] = useState<Row[]>(() => rack.list());
  const sheetRef = useRef<SVGSVGElement>(null);
  const benchRef = useRef<HTMLElement>(null);
  useStopOnInteraction(benchRef);

  const openCase = caseAt(index);
  const chosen = openCase.choices.find((c) => c.id === choiceId) ?? null;
  const seen = useMemo(() => askedFacts(openCase, asked), [openCase, asked]);
  const held = useMemo(() => unaskedFacts(openCase, asked), [openCase, asked]);
  const rows = useMemo(() => sheetRows(records), [records]);
  const lines = useMemo(() => plateLines(records), [records]);

  const goTo = (next: number) => {
    setIndex(next);
    setAsked([]);
    setChoiceId(null);
    setTurned(false);
  };

  const spend = (kind: QuestionKind) => {
    if (asked.includes(kind) || chosen) return;
    setAsked([...asked, kind]);
    pluck(step(asked.length * 3 - 4), 0.22);
  };

  const decide = (id: string) => {
    if (chosen) return;
    const choice = openCase.choices.find((c) => c.id === id);
    if (!choice) return;
    setChoiceId(id);
    const row = rack.add({
      caseId: openCase.id, caseTitle: openCase.title, asked: [...asked],
      choiceId: choice.id, choiceLabel: choice.label, glyph: choice.glyph,
    });
    setRecords([...records, row]);
  };

  const turnOver = () => setTurned(true);

  const height = sheetHeight(records);
  const decided = chosen !== null;
  const standing = readout({ asked: asked.length, decided, cases: casesDecided(records) });
  const closing = LISTEN.closing(openCase);

  return (
    <section ref={benchRef} className="bench" aria-labelledby="before-you-decide-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{BEFORE_YOU_DECIDE_META.eyebrow}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h2 id="before-you-decide-title" className="bench__title">{LISTEN.title().join(' ')}</h2>
            <ReadAloud id={`${READ}/title`} texts={LISTEN.title()} compact />
          </div>
          <p className="bench__note">{BEFORE_YOU_DECIDE_META.note}</p>
        </div>
        <p className="bench__readout">{standing}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row" style={{ alignItems: 'flex-start' }}>
          <Plate subject={openCase} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {seen.map((fact) => (fact.kind === 'clock'
              ? <Timeline key={fact.kind} subject={openCase} />
              : <FactCard key={fact.kind} fact={fact} />))}
            {turned && held.map((fact) => (fact.kind === 'clock'
              ? <Timeline key={fact.kind} subject={openCase} prefix={unaskedLine(fact.kind)} />
              : <FactCard key={fact.kind} fact={fact} prefix={unaskedLine(fact.kind)} />))}
          </div>
        </div>
        {chosen && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            <p className="bench__note" style={{ marginTop: 0, flex: '1 1 16rem' }}>{LISTEN.outcome(chosen).join(' ')}</p>
            <ReadAloud id={`${READ}/outcome`} texts={LISTEN.outcome(chosen)} />
          </div>
        )}
        {turned && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <p className="bench__note" style={{ marginTop: 0, flex: '1 1 16rem' }}>{closing.join(' ')}</p>
            <ReadAloud id={`${READ}/closing`} texts={closing} />
          </div>
        )}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">{rackLabel(decided)}</p>
        <ReadAloud id={`${READ}/questions`} texts={LISTEN.questions(openCase, decided)} label="Read these out" />
        {QUESTION_KINDS.map((kind) => {
          const chip = chipFor(kind);
          const spent = asked.includes(kind);
          return (
            <button key={kind} type="button"
              className={`bench-part${spent ? ' is-set' : ''}`}
              aria-label={chip.label}
              aria-pressed={spent}
              disabled={spent || decided}
              onClick={() => spend(kind)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mark path={chip.path} colour={spent ? TEAL : INK} />
                <span>{factFor(openCase, kind).question}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">{choiceTrayLabel(decided)}</p>
        <ReadAloud id={`${READ}/choices`} texts={LISTEN.choices(openCase, decided)} label="Read these out" />
        {openCase.choices.map((choice) => (
          <button key={choice.id} type="button"
            className={`bench-part bench-part--wide${choice.id === choiceId ? ' is-set' : ''}`}
            aria-label={choice.label}
            aria-pressed={choice.id === choiceId}
            disabled={decided && choice.id !== choiceId}
            onClick={() => decide(choice.id)}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mark path={GLYPHS[choice.glyph]} colour={choice.id === choiceId ? TEAL : INK} />
              <span>{choice.label}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary"
          disabled={!decided || turned}
          onClick={turnOver}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mark path={chipFor('unasked').path} size={22} colour="#fff" />
            <span>Turn over what you did not ask</span>
          </span>
        </button>
        <button type="button" className="bench-btn" onClick={() => goTo(index + 1)}>Next case</button>
        <button type="button" className="bench-btn"
          onClick={() => { if (sheetRef.current) void exportPlate(sheetRef.current, { title: 'Before you decide', lines }, 'before-you-decide'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">The other cases.</p>
        {CASES.map((c, i) => (
          <button key={c.id} type="button" className={`bench-part${i === index ? ' is-set' : ''}`}
            aria-pressed={i === index} onClick={() => goTo(i)}>{c.title}</button>
        ))}
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">The record sheet</p>
        <svg ref={sheetRef} viewBox={`0 0 ${SHEET.width} ${height}`} role="img"
          aria-label={`A ruled sheet with one line for each of the ${records.length} decisions made, showing how many questions were asked each time.`}
          style={{ display: 'block', width: '100%', height: 'auto', maxWidth: `${SHEET.width}px` }}>
          <rect x="0" y="0" width={SHEET.width} height={height} fill={PAPER} />
          <text x="18" y="30" fontFamily="Literata, Georgia, serif" fontSize="17" fill={INK}>Before you decide</text>
          <text x="18" y="47" fontFamily="Inter, system-ui, sans-serif" fontSize="11" fill={FAINT}>
            {`questions asked · what you did · ${casesDecided(records)} of ${CASES.length} cases`}
          </text>
          <line x1="18" y1={SHEET.top - 12} x2={SHEET.width - 18} y2={SHEET.top - 12} stroke={RULE} strokeWidth="1" />
          {rows.map((row) => (
            <g key={`${row.title}-${row.y}`}>
              <text x="18" y={row.y + 16} fontFamily="Literata, Georgia, serif" fontSize="13" fill={INK}>{row.title}</text>
              {row.marks.map((filled, i) => (
                <circle key={i} cx={SHEET.width - 150 + i * 22} cy={row.y + 11} r="6"
                  fill={filled ? OCHRE : 'none'} stroke={filled ? OCHRE : RULE} strokeWidth="1.2" />
              ))}
              <g transform={`translate(${SHEET.width - 56} ${row.y})`}>
                <path d={GLYPHS[row.glyph]} fill="none" stroke={TEAL} strokeWidth="1.4"
                  strokeLinecap="round" strokeLinejoin="round" />
              </g>
              <line x1="18" y1={row.y + SHEET.rowHeight - 12} x2={SHEET.width - 18} y2={row.y + SHEET.rowHeight - 12}
                stroke={RULE} strokeWidth="1" />
            </g>
          ))}
          {rows.length === 0 && (
            <text x="18" y={SHEET.top + 18} fontFamily="Inter, system-ui, sans-serif" fontSize="12" fill={FAINT}>
              Nothing decided yet.
            </text>
          )}
        </svg>
        <ul className="bench__shelf-list">
          {records.slice(-6).map((row) => (
            <li key={row.id} className="bench__kept">
              <Mark path={GLYPHS[row.glyph]} size={22} colour={TEAL} />
              <span className="bench__kept-name">{row.caseTitle}</span>
              <span className="bench__kept-meta">{`asked ${row.asked.length} of ${QUESTION_KINDS.length}`}</span>
            </li>
          ))}
          {records.length === 0 && <li className="bench__kept"><span className="bench__kept-meta">Nothing decided yet.</span></li>}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">Before you decide</p>
        {lines.map((line) => <p key={line} className="plate-print__line">{line}</p>)}
      </div>
    </section>
  );
}

export default BeforeYouDecide;
