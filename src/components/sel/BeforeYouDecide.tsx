import { useMemo, useRef, useState } from 'react';
import {
  BEFORE_YOU_DECIDE_META, CASES, GLYPHS, QUESTION_KINDS, SHEET,
  askedFacts, caseAt, casesDecided, chipFor, closingLine, factFor, factText, plateLines, readout,
  sheetHeight, sheetRows, timelineMarks, unaskedFacts, unaskedKinds, unaskedLine,
} from '../../sel/before-you-decide';
import type { Case, Decided, Fact, QuestionKind } from '../../sel/before-you-decide';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';

interface Row extends Kept, Decided {}
const rack = drawer<Row>('before-you-decide');

const BASE = import.meta.env.BASE_URL;
const PAPER = '#f4f0e6', SUNKEN = '#eae4d5', INK = '#22211b', FAINT = '#6b6757';
const RULE = '#ddd6c4', TEAL = '#2a5957', OCHRE = '#8a6416';

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
function Plate({ id, alt, caption }: { id: string; alt: string; caption: string }) {
  return (
    <figure className="bench__figure" style={{ margin: 0, maxWidth: '22rem' }}>
      <img src={`${BASE}games/sel/${id}.png`} alt={alt}
        style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${RULE}`, background: SUNKEN }} />
      <figcaption className="bench__figure-caption">{caption}</figcaption>
    </figure>
  );
}

/** A fact, drawn rather than painted: its question mark, its question, its sentence. */
function FactCard({ subject, fact, prefix }: { subject: Case; fact: Fact; prefix?: string }) {
  return (
    <div className="bench__figure" style={{ maxWidth: '18rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
      <Mark path={chipFor(fact.kind).path} size={26} colour={TEAL} />
      <div>
        <p className="bench__figure-caption" style={{ margin: 0, color: FAINT }}>{prefix ?? fact.question}</p>
        <p className="bench__figure-caption" style={{ margin: 0, color: INK }}>{factText(subject, fact)}</p>
      </div>
    </div>
  );
}

/**
 * The clock question is a claim about time, so it is drawn as time: three stops
 * in order with the picture's stop filled in. Both this strip and the sentence
 * read aloud come from `Case.timeline`.
 */
function Timeline({ subject }: { subject: Case }) {
  const marks = timelineMarks(subject);
  const W = 560, H = 96, PAD = 34;
  const x = (at: number) => PAD + at * (W - PAD * 2);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`A line of ${marks.length} stops in time order. ${marks.map((m) => m.says).join(' ')}`}
      style={{ display: 'block', width: '100%', maxWidth: `${W}px`, height: 'auto' }}>
      <rect x="0" y="0" width={W} height={H} fill={PAPER} />
      <line x1={x(0)} y1="26" x2={x(1)} y2="26" stroke={RULE} strokeWidth="1" />
      {marks.map((m) => (
        <g key={m.says}>
          <circle cx={x(m.at)} cy="26" r="6" fill={m.isPicture ? OCHRE : 'none'}
            stroke={m.isPicture ? OCHRE : RULE} strokeWidth="1.2" />
          <text x={x(m.at)} y="50" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif"
            fontSize="11" fill={m.isPicture ? INK : FAINT}>
            {m.says}
          </text>
        </g>
      ))}
      <text x={x(subject.timeline.length > 0 ? marks[subject.pictureAt].at : 0)} y="74" textAnchor="middle"
        fontFamily="Inter, system-ui, sans-serif" fontSize="10" letterSpacing="1.2" fill={OCHRE}>
        THE PICTURE
      </text>
    </svg>
  );
}

export function BeforeYouDecide() {
  const [index, setIndex] = useState(0);
  const [asked, setAsked] = useState<readonly QuestionKind[]>([]);
  const [choiceId, setChoiceId] = useState<string | null>(null);
  const [turned, setTurned] = useState(false);
  const [records, setRecords] = useState<Row[]>(() => rack.list());
  const sheetRef = useRef<SVGSVGElement>(null);

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
    const fact = factFor(openCase, kind);
    setAsked([...asked, kind]);
    pluck(step(asked.length * 3 - 4), 0.22);
    say(`${fact.question} ${factText(openCase, fact)}`);
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
    say(choice.outcome);
  };

  const turnOver = () => {
    setTurned(true);
    const spoken = unaskedKinds(asked).map(unaskedLine).join(' ');
    say(spoken ? `${spoken} ${closingLine(openCase)}` : closingLine(openCase));
  };

  const height = sheetHeight(records);
  const standing = readout({ asked: asked.length, decided: chosen !== null, cases: casesDecided(records) });
  const timeShown = asked.includes('clock') || turned;

  return (
    <section className="bench" aria-labelledby="before-you-decide-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{BEFORE_YOU_DECIDE_META.eyebrow}</p>
          <h2 id="before-you-decide-title" className="bench__title">{BEFORE_YOU_DECIDE_META.title}</h2>
          <p className="bench__note">{BEFORE_YOU_DECIDE_META.note}</p>
        </div>
        <p className="bench__readout">{standing}</p>
      </div>

      <div className="bench__stage">
        <div className="bench__row" style={{ alignItems: 'flex-start' }}>
          <Plate id={openCase.setupPanelId} alt={openCase.setupAlt} caption={openCase.setup} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {seen.map((fact) => (
              <FactCard key={fact.kind} subject={openCase} fact={fact} />
            ))}
            {turned && held.map((fact) => (
              <FactCard key={fact.kind} subject={openCase} fact={fact} prefix={unaskedLine(fact.kind)} />
            ))}
          </div>
        </div>
        {timeShown && <Timeline subject={openCase} />}
        {chosen && <p className="bench__note" style={{ marginTop: 'var(--space-4)' }}>{chosen.outcome}</p>}
        {turned && <p className="bench__note" style={{ marginTop: 'var(--space-3)' }}>{closingLine(openCase)}</p>}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">
          {chosen ? 'The rack is closed for this one.' : 'Spend a question, or decide without spending any.'}
        </p>
        {QUESTION_KINDS.map((kind) => {
          const chip = chipFor(kind);
          const spent = asked.includes(kind);
          return (
            <button key={kind} type="button"
              className={`bench-part${spent ? ' is-set' : ''}`}
              aria-label={chip.label}
              aria-pressed={spent}
              disabled={spent || chosen !== null}
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
        <p className="bench__tray-label">
          {chosen ? 'What you did.' : 'Decide whenever you like.'}
        </p>
        {openCase.choices.map((choice) => (
          <button key={choice.id} type="button"
            className={`bench-part bench-part--wide${choice.id === choiceId ? ' is-set' : ''}`}
            aria-label={choice.label}
            aria-pressed={choice.id === choiceId}
            disabled={chosen !== null && choice.id !== choiceId}
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
          disabled={chosen === null || turned}
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
