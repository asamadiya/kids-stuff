import { useMemo, useRef, useState, type ReactElement } from 'react';
import { drawer } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { pluck, step } from '../../workshop/tone';
import { exportPlate, printPlate } from '../../workshop/plate';
import { gate, type GateGroup } from '../../workshop/quadrat';
import {
  COMMON_FINDS,
  DOING,
  DOING_KEYS,
  FIELD_LOG_META,
  HABITATS,
  HABITAT_KEYS,
  PALETTE,
  PHASES,
  SHADOW_METHOD,
  STAGES,
  STAGE_LABEL,
  clockLabel,
  composeFind,
  composeShadow,
  composeWatch,
  findSummary,
  formatDate,
  inOrder,
  isoDate,
  logSignature,
  logSummary,
  namesSeen,
  shadowReadout,
  shadowSummary,
  stageIndex,
  subjectsWatched,
  tally,
  tallySummary,
  visitDates,
  watchSeries,
  watchSummary,
  type DoingKey,
  type FieldRecord,
  type HabitatKey,
  type LogPhase,
  type ShadowReading,
  type Stage,
} from '../../workshop/field-log';

const store = drawer<FieldRecord>('field-log');

const SANS = 'Inter, system-ui, sans-serif';
const SERIF = 'Literata, Georgia, serif';
const NUM = { fontVariantNumeric: 'tabular-nums' } as const;
const VIEW = { w: 960, h: 640 };

/* ------------------------------------------------------------ drawing parts */

function strokeGlyph(paths: readonly string[], x: number, y: number, size: number, color: string, weight = 1.4): ReactElement {
  const s = size / 24;
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={weight / s}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

const frame = (h = VIEW.h): ReactElement => (
  <>
    <rect x={0} y={0} width={VIEW.w} height={h} fill={PALETTE.paper} />
    <rect x={16} y={16} width={VIEW.w - 32} height={h - 32} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
  </>
);

const label = (text: string, x: number, y: number, size = 13): ReactElement => (
  <text x={x} y={y} fontFamily={SANS} fontSize={size} fill={PALETTE.faint} letterSpacing={0.6}>
    {text}
  </text>
);

/** The same five-bar gate the Quadrat writes its counts in. */
function gateMarks(count: number, x: number, y: number, height: number, color: string, weight = 2): ReactElement {
  const groups: readonly GateGroup[] = gate(count);
  const pitch = 5.5;
  const groupWidth = pitch * 4 + 9;
  return (
    <g stroke={color} strokeWidth={weight} strokeLinecap="round">
      {groups.map((g, gi) => (
        <g key={gi} transform={`translate(${x + gi * groupWidth} ${y})`}>
          {Array.from({ length: g.bars }, (_, i) => (
            <line key={i} x1={i * pitch} y1={0} x2={i * pitch} y2={height} />
          ))}
          {g.slash ? <line x1={-2} y1={height} x2={pitch * 3 + 2} y2={0} /> : null}
        </g>
      ))}
    </g>
  );
}

/* ------------------------------------------------------------- the find plate */

interface FindDraft {
  readonly what: string;
  readonly habitat: HabitatKey;
  readonly count: number;
  readonly doing: DoingKey | null;
}

function findPlate(records: readonly FieldRecord[], draft: FindDraft, today: string): ReactElement {
  const rows = tally(records);
  const shown = rows.slice(0, 9);
  const todays = inOrder(records, 'find').filter((r) => r.date === today);
  return (
    <g>
      {frame()}
      {label('FIELD LOG', 40, 54)}
      <text x={40} y={92} fontFamily={SERIF} fontSize={22} fill={PALETTE.ink} style={NUM}>
        {tallySummary(records)}
      </text>
      <line x1={40} y1={110} x2={920} y2={110} stroke={PALETTE.rule} strokeWidth={1} />

      {label('TODAY', 40, 142)}
      <g>
        {draft.what ? (
          <>
            {strokeGlyph(HABITATS[draft.habitat].paths, 40, 156, 30, PALETTE.teal, 1.5)}
            <text x={80} y={178} fontFamily={SERIF} fontSize={20} fill={PALETTE.ink} style={NUM}>
              {`${draft.what}: ${draft.count}`}
            </text>
            <text x={80} y={200} fontFamily={SANS} fontSize={13} fill={PALETTE.faint}>
              {`${HABITATS[draft.habitat].label.toLowerCase()}${draft.doing ? `, ${DOING[draft.doing].toLowerCase()}` : ''}`}
            </text>
            {gateMarks(draft.count, 320, 160, 24, PALETTE.terracotta, 2)}
          </>
        ) : (
          <text x={40} y={178} fontFamily={SANS} fontSize={15} fill={PALETTE.faint}>
            Nothing written down yet today.
          </text>
        )}
        {todays.map((r, i) => (
          <text key={r.id} x={560} y={168 + i * 22} fontFamily={SANS} fontSize={13} fill={PALETTE.ink} style={NUM}>
            {`${r.what}: ${r.count}`}
          </text>
        ))}
      </g>

      <line x1={40} y1={236} x2={920} y2={236} stroke={PALETTE.rule} strokeWidth={1} />
      {label('EVERY VISIT ADDED UP', 40, 266)}
      {shown.map((row, i) => {
        const y = 300 + i * 34;
        return (
          <g key={row.what}>
            <text x={40} y={y} fontFamily={SANS} fontSize={14} fill={PALETTE.ink}>
              {row.what.slice(0, 18)}
            </text>
            {gateMarks(Math.min(40, row.total), 220, y - 14, 18, PALETTE.olive, 1.6)}
            <text x={880} y={y} textAnchor="end" fontFamily={SANS} fontSize={14} fill={PALETTE.ink} style={NUM}>
              {`${row.total} in ${row.times}`}
            </text>
            <text x={640} y={y} textAnchor="end" fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
              {`${formatDate(row.first)} to ${formatDate(row.last)}`}
            </text>
          </g>
        );
      })}
      {shown.length === 0 ? (
        <text x={40} y={300} fontFamily={SANS} fontSize={15} fill={PALETTE.faint}>
          The tally fills up as you keep the entries. It only grows by going back out.
        </text>
      ) : null}
      <text x={40} y={608} fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
        {`counts written in fives · ${visitDates(records).length} days out so far`}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------ the watch plate */

function watchPlate(records: readonly FieldRecord[], subject: string): ReactElement {
  const series = watchSeries(records, subject);
  const points = series.points;
  const tallest = Math.max(1, ...points.map((p) => p.heightMm));
  const x0 = 120;
  const x1 = 880;
  const yTop = 190;
  const yBot = 470;
  const at = (i: number): number => (points.length <= 1 ? (x0 + x1) / 2 : x0 + (i * (x1 - x0)) / (points.length - 1));
  const height = (mm: number): number => yBot - (mm / tallest) * (yBot - yTop);
  return (
    <g>
      {frame()}
      {label('ONE THING, WEEK BY WEEK', 40, 54)}
      <text x={40} y={92} fontFamily={SERIF} fontSize={22} fill={PALETTE.ink}>
        {subject || 'Choose something to come back to'}
      </text>
      <text x={40} y={124} fontFamily={SANS} fontSize={14} fill={PALETTE.faint} style={NUM}>
        {watchSummary(series)}
      </text>
      <line x1={40} y1={144} x2={920} y2={144} stroke={PALETTE.rule} strokeWidth={1} />

      <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke={PALETTE.rule} strokeWidth={1} />
      <line x1={x0} y1={yTop} x2={x0} y2={yBot} stroke={PALETTE.rule} strokeWidth={1} />
      <text x={x0 - 12} y={yTop + 6} textAnchor="end" fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
        {`${tallest} mm`}
      </text>
      <text x={x0 - 12} y={yBot} textAnchor="end" fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
        0
      </text>

      {points.length > 1 ? (
        <polyline
          points={points.map((p, i) => `${at(i)},${height(p.heightMm)}`).join(' ')}
          fill="none"
          stroke={PALETTE.olive}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      ) : null}
      {points.map((p, i) => (
        <g key={`${p.date}-${i}`}>
          <circle cx={at(i)} cy={height(p.heightMm)} r={3.4} fill={PALETTE.olive} />
          <text x={at(i)} y={height(p.heightMm) - 12} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={PALETTE.ink} style={NUM}>
            {`${p.heightMm} mm`}
          </text>
          <text x={at(i)} y={yBot + 22} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
            {formatDate(p.date).replace(` ${p.date.slice(0, 4)}`, '')}
          </text>
          <text x={at(i)} y={yBot + 44} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={PALETTE.teal}>
            {STAGE_LABEL[p.stage]}
          </text>
        </g>
      ))}

      <line x1={40} y1={540} x2={920} y2={540} stroke={PALETTE.rule} strokeWidth={1} />
      {STAGES.map((s, i) => (
        <g key={s}>
          <circle
            cx={120 + i * 140}
            cy={572}
            r={6}
            fill={points.some((p) => p.stage === s) ? PALETTE.teal : PALETTE.raised}
            stroke={PALETTE.rule}
          />
          <text x={120 + i * 140} y={598} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={PALETTE.faint}>
            {STAGE_LABEL[s]}
          </text>
        </g>
      ))}
      <text x={880} y={618} textAnchor="end" fontFamily={SANS} fontSize={11} fill={PALETTE.faint}>
        the order it is usually seen in; some trees flower before they leaf
      </text>
    </g>
  );
}

/* ----------------------------------------------------------- the shadow plate */

function shadowPlate(record: FieldRecord): ReactElement {
  const read = shadowReadout(record);
  const readings = record.readings;
  const longest = Math.max(1, ...readings.map((r) => r.shadowMm), record.stickMm);
  const groundY = 330;
  const baseX = 200;
  const scale = 300 / longest;
  const stickH = record.stickMm * scale;
  const shadowW = read.noon ? read.noon.shadowMm * scale : 0;

  const gx0 = 120;
  const gx1 = 880;
  const gy0 = 420;
  const gy1 = 560;
  const first = readings.length ? readings[0].minutes : 0;
  const last = readings.length ? readings[readings.length - 1].minutes : 1;
  const px = (m: number): number => (last === first ? (gx0 + gx1) / 2 : gx0 + ((m - first) * (gx1 - gx0)) / (last - first));
  const py = (mm: number): number => gy1 - (mm / longest) * (gy1 - gy0);

  return (
    <g>
      {frame()}
      {label('A STICK AND ITS SHADOW', 40, 54)}
      <text x={40} y={92} fontFamily={SERIF} fontSize={20} fill={PALETTE.ink} style={NUM}>
        {read.noon
          ? `Sun ${read.noonAltitude} degrees up at ${clockLabel(read.noon.minutes)} · about ${Math.round(read.latitude)} degrees north`
          : 'Measure the shadow every hour and the shortest one is local noon.'}
      </text>
      <line x1={40} y1={110} x2={920} y2={110} stroke={PALETTE.rule} strokeWidth={1} />

      <line x1={60} y1={groundY} x2={900} y2={groundY} stroke={PALETTE.rule} strokeWidth={1.4} />
      <line x1={baseX} y1={groundY} x2={baseX} y2={groundY - stickH} stroke={PALETTE.ink} strokeWidth={4} strokeLinecap="round" />
      <text x={baseX - 14} y={groundY - stickH - 12} textAnchor="middle" fontFamily={SANS} fontSize={13} fill={PALETTE.ink} style={NUM}>
        {`${record.stickMm} mm`}
      </text>
      {read.noon ? (
        <>
          <line x1={baseX} y1={groundY} x2={baseX + shadowW} y2={groundY} stroke={PALETTE.slate} strokeWidth={8} strokeLinecap="butt" />
          <line
            x1={baseX}
            y1={groundY - stickH}
            x2={baseX + shadowW}
            y2={groundY}
            stroke={PALETTE.ochre}
            strokeWidth={1.6}
            strokeDasharray="6 4"
          />
          <text x={baseX + shadowW / 2} y={groundY + 28} textAnchor="middle" fontFamily={SANS} fontSize={13} fill={PALETTE.slate} style={NUM}>
            {`${read.noon.shadowMm} mm`}
          </text>
          <text x={baseX + 26} y={groundY - 14} fontFamily={SANS} fontSize={13} fill={PALETTE.ochre} style={NUM}>
            {`${read.noonAltitude}°`}
          </text>
          <text x={baseX + shadowW + 20} y={groundY - 6} fontFamily={SANS} fontSize={12} fill={PALETTE.faint}>
            shadow points {read.points}
          </text>
        </>
      ) : null}

      <line x1={40} y1={382} x2={920} y2={382} stroke={PALETTE.rule} strokeWidth={1} />
      {label('SHADOW THROUGH THE DAY', 40, 406)}
      <line x1={gx0} y1={gy1} x2={gx1} y2={gy1} stroke={PALETTE.rule} strokeWidth={1} />
      {readings.length > 1 ? (
        <polyline
          points={readings.map((r) => `${px(r.minutes)},${py(r.shadowMm)}`).join(' ')}
          fill="none"
          stroke={PALETTE.teal}
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      ) : null}
      {readings.map((r) => {
        const isNoon = read.noon !== null && r.minutes === read.noon.minutes && r.shadowMm === read.noon.shadowMm;
        return (
          <g key={r.minutes}>
            <circle cx={px(r.minutes)} cy={py(r.shadowMm)} r={isNoon ? 5 : 3} fill={isNoon ? PALETTE.terracotta : PALETTE.teal} />
            <text x={px(r.minutes)} y={gy1 + 20} textAnchor="middle" fontFamily={SANS} fontSize={11} fill={PALETTE.faint} style={NUM}>
              {clockLabel(r.minutes)}
            </text>
            {isNoon ? (
              <text x={px(r.minutes)} y={py(r.shadowMm) - 12} textAnchor="middle" fontFamily={SANS} fontSize={12} fill={PALETTE.terracotta}>
                local noon
              </text>
            ) : null}
          </g>
        );
      })}
      <text x={40} y={608} fontFamily={SANS} fontSize={12} fill={PALETTE.faint} style={NUM}>
        {`sun stands over ${read.declination} degrees today · latitude = 90 minus the sun's height plus that`}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------- the bench */

const HOURS: readonly number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export function FieldLog(): ReactElement {
  const boot = useMemo(() => store.list(), []);
  const svgRef = useRef<SVGSVGElement>(null);
  const today = isoDate(new Date());

  const [records, setRecords] = useState<readonly FieldRecord[]>(boot);
  const [phase, setPhase] = useState<LogPhase>('find');

  const [what, setWhat] = useState('');
  const [habitat, setHabitat] = useState<HabitatKey>('ground');
  const [count, setCount] = useState(1);
  const [doing, setDoing] = useState<DoingKey | null>(null);

  const seenSubjects = useMemo(() => subjectsWatched(records), [records]);
  const [subject, setSubject] = useState(() => (seenSubjects.length ? seenSubjects[0] : ''));
  const [stage, setStage] = useState<Stage>('bare');
  const [heightMm, setHeightMm] = useState(0);

  const [stickMm, setStickMm] = useState(1000);
  const [hour, setHour] = useState(12);
  const [shadowMm, setShadowMm] = useState(500);
  const [readings, setReadings] = useState<readonly ShadowReading[]>([]);

  const seenNames = useMemo(() => namesSeen(records), [records]);
  const series = useMemo(() => watchSeries(records, subject), [records, subject]);
  const draftShadow: FieldRecord = {
    ...composeShadow({ date: today, stickMm, readings }),
    id: 'draft',
    made: `${today}T12:00:00.000Z`,
  };
  const readout = shadowReadout(draftShadow);

  const keep = (entry: Omit<FieldRecord, 'id' | 'made'>): FieldRecord => {
    const saved = store.add(entry);
    setRecords(store.list());
    pluck(step(4), 0.3);
    return saved;
  };

  const keepFind = (): void => {
    if (!what.trim()) return;
    const saved = keep(composeFind({ date: today, what, habitat, count, doing }));
    say(findSummary(saved));
    setCount(1);
  };

  const keepWatch = (): void => {
    if (!subject.trim()) return;
    keep(composeWatch({ date: today, subject, stage, heightMm }));
    say(watchSummary(watchSeries([...records, { ...composeWatch({ date: today, subject, stage, heightMm }), id: 'x', made: `${today}T12:00:00.000Z` }], subject)));
  };

  const keepShadow = (): void => {
    if (!readings.length) return;
    keep(composeShadow({ date: today, stickMm, readings }));
    say(shadowSummary(draftShadow));
    setReadings([]);
  };

  const addReading = (): void => {
    const minutes = hour * 60;
    setReadings([...readings.filter((r) => r.minutes !== minutes), { minutes, shadowMm }].sort((a, b) => a.minutes - b.minutes));
    pluck(step(shadowMm > 800 ? -4 : 2), 0.25);
  };

  const primary = (): void => {
    if (phase === 'find') keepFind();
    else if (phase === 'watch') keepWatch();
    else keepShadow();
  };

  const primaryLabel =
    phase === 'find' ? 'Keep this find' : phase === 'watch' ? 'Keep this measurement' : 'Keep this day of readings';
  const primaryOff =
    phase === 'find' ? !what.trim() : phase === 'watch' ? !subject.trim() : readings.length === 0;

  const printTitle =
    phase === 'find' ? 'Field log' : phase === 'watch' ? `${subject || 'One thing'}, week by week` : 'A stick and its shadow';
  const printLine =
    phase === 'find' ? tallySummary(records) : phase === 'watch' ? watchSummary(series) : shadowSummary(draftShadow);

  const savePicture = async (): Promise<void> => {
    const svg = svgRef.current;
    if (!svg) return;
    await exportPlate(svg, { title: printTitle, lines: [formatDate(today), printLine] }, `field-log-${phase}-${today}`);
  };

  const many = (n: number, one: string, more: string): string => `${n} ${n === 1 ? one : more}`;
  const headReadout =
    phase === 'find'
      ? many(visitDates(records).length, 'day out', 'days out')
      : phase === 'watch'
        ? many(series.points.length, 'visit', 'visits')
        : many(readings.length, 'reading', 'readings');

  const stageLabel =
    phase === 'find' ? tallySummary(records) : phase === 'watch' ? watchSummary(series) : shadowSummary(draftShadow);

  return (
    <section className="bench" aria-labelledby="field-log-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{FIELD_LOG_META.eyebrow}</p>
          <h2 id="field-log-title" className="bench__title">{FIELD_LOG_META.title}</h2>
          <p className="bench__note">{FIELD_LOG_META.note}</p>
        </div>
        <p className="bench__readout">{headReadout}</p>
      </div>

      <div className="bench__stage">
        <svg ref={svgRef} viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} role="img" aria-label={stageLabel}>
          {phase === 'find'
            ? findPlate(records, { what: what.trim(), habitat, count, doing }, today)
            : phase === 'watch'
              ? watchPlate(records, subject)
              : shadowPlate(draftShadow)}
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">The book</p>
        <div className="bench__row">
          {PHASES.map((p) => (
            <button
              key={p.key}
              type="button"
              className={`bench-part${phase === p.key ? ' is-set' : ''}`}
              aria-pressed={phase === p.key}
              onClick={() => {
                setPhase(p.key);
                say(p.note);
              }}
            >
              {p.title}
            </button>
          ))}
        </div>

        {phase === 'find' ? (
          <>
            <p className="bench__tray-label">What did you find</p>
            <div className="bench__row">
              <input
                className="bench-part"
                style={{ cursor: 'text' }}
                value={what}
                maxLength={24}
                placeholder="write its name"
                aria-label="The name of the thing you found"
                onChange={(e) => setWhat(e.target.value)}
              />
              {[...seenNames, ...COMMON_FINDS.filter((n) => !seenNames.includes(n))].slice(0, 16).map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`bench-part${what === name ? ' is-set' : ''}`}
                  onClick={() => {
                    setWhat(name);
                    say(name);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">Where was it</p>
            <div className="bench__row">
              {HABITAT_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`bench-part${habitat === k ? ' is-set' : ''}`}
                  aria-pressed={habitat === k}
                  onClick={() => {
                    setHabitat(k);
                    say(HABITATS[k].label);
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    {strokeGlyph(HABITATS[k].paths, 0, 0, 24, PALETTE.ink, 1.5)}
                  </svg>{' '}
                  {HABITATS[k].label}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">How many</p>
            <div className="bench__row">
              <button type="button" className="bench-part" onClick={() => setCount(Math.max(1, count - 1))} aria-label="One fewer">
                &minus;
              </button>
              <span className="bench-part is-set" style={NUM} aria-live="polite">{count}</span>
              <button
                type="button"
                className="bench-part"
                onClick={() => {
                  setCount(count + 1);
                  say(String(count + 1));
                }}
                aria-label="One more"
              >
                +
              </button>
              <button type="button" className="bench-part" onClick={() => setCount(count + 10)} aria-label="Ten more">
                +10
              </button>
            </div>

            <p className="bench__tray-label">What was it doing</p>
            <div className="bench__row">
              {DOING_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`bench-part${doing === k ? ' is-set' : ''}`}
                  aria-pressed={doing === k}
                  onClick={() => {
                    setDoing(doing === k ? null : k);
                    say(DOING[k]);
                  }}
                >
                  {DOING[k]}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {phase === 'watch' ? (
          <>
            <p className="bench__tray-label">The thing you keep coming back to</p>
            <div className="bench__row">
              <input
                className="bench-part"
                style={{ cursor: 'text' }}
                value={subject}
                maxLength={28}
                placeholder="the oak by the gate"
                aria-label="The name of the thing you are following"
                onChange={(e) => setSubject(e.target.value)}
              />
              {seenSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`bench-part${subject === s ? ' is-set' : ''}`}
                  onClick={() => {
                    setSubject(s);
                    say(watchSummary(watchSeries(records, s)));
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">Which rung is it on today</p>
            <div className="bench__row">
              {STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`bench-part${stage === s ? ' is-set' : ''}`}
                  aria-pressed={stage === s}
                  onClick={() => {
                    setStage(s);
                    say(STAGE_LABEL[s]);
                  }}
                  aria-label={`${STAGE_LABEL[s]}, rung ${stageIndex(s) + 1} of ${STAGES.length}`}
                >
                  {STAGE_LABEL[s]}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">How tall is it, in millimetres</p>
            <div className="bench__row">
              {[-100, -10, -1, 1, 10, 100].map((by) => (
                <button
                  key={by}
                  type="button"
                  className="bench-part"
                  onClick={() => setHeightMm(Math.max(0, heightMm + by))}
                  aria-label={`${by > 0 ? 'Taller' : 'Shorter'} by ${Math.abs(by)} millimetres`}
                >
                  {by > 0 ? `+${by}` : by}
                </button>
              ))}
              <span className="bench-part is-set" style={NUM} aria-live="polite">{`${heightMm} mm`}</span>
            </div>
            <div className="bench__row">
              <button type="button" className="bench-part bench-part--wide" onClick={() => say(watchSummary(series))}>
                {watchSummary(series)}
              </button>
            </div>
          </>
        ) : null}

        {phase === 'shadow' ? (
          <>
            <p className="bench__tray-label">How much of the stick is above the ground, in millimetres</p>
            <div className="bench__row">
              {[-100, -10, 10, 100].map((by) => (
                <button
                  key={by}
                  type="button"
                  className="bench-part"
                  onClick={() => setStickMm(Math.max(10, stickMm + by))}
                  aria-label={`Stick ${by > 0 ? 'longer' : 'shorter'} by ${Math.abs(by)} millimetres`}
                >
                  {by > 0 ? `+${by}` : by}
                </button>
              ))}
              <span className="bench-part is-set" style={NUM}>{`${stickMm} mm`}</span>
            </div>

            <p className="bench__tray-label">What time is it</p>
            <div className="bench__row">
              {HOURS.map((h) => (
                <button
                  key={h}
                  type="button"
                  className={`bench-part${hour === h ? ' is-set' : ''}`}
                  aria-pressed={hour === h}
                  onClick={() => setHour(h)}
                  aria-label={clockLabel(h * 60)}
                >
                  {clockLabel(h * 60).replace(':00', '')}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">How long is the shadow, in millimetres</p>
            <div className="bench__row">
              {[-100, -10, 10, 100].map((by) => (
                <button
                  key={by}
                  type="button"
                  className="bench-part"
                  onClick={() => setShadowMm(Math.max(0, shadowMm + by))}
                  aria-label={`Shadow ${by > 0 ? 'longer' : 'shorter'} by ${Math.abs(by)} millimetres`}
                >
                  {by > 0 ? `+${by}` : by}
                </button>
              ))}
              <span className="bench-part is-set" style={NUM}>{`${shadowMm} mm`}</span>
              <button
                type="button"
                className="bench-part bench-part--wide"
                onClick={addReading}
                aria-label={`Write down ${shadowMm} millimetres at ${clockLabel(hour * 60)}`}
              >
                Write it down
              </button>
            </div>

            {readings.length ? (
              <>
                <p className="bench__tray-label">Today&#8217;s readings</p>
                <div className="bench__row">
                  {readings.map((r) => (
                    <button
                      key={r.minutes}
                      type="button"
                      className={`bench-part${readout.noon && readout.noon.minutes === r.minutes ? ' is-set' : ''}`}
                      onClick={() => setReadings(readings.filter((o) => o.minutes !== r.minutes))}
                      aria-label={`${r.shadowMm} millimetres at ${clockLabel(r.minutes)}. Rub it out`}
                    >
                      <span style={NUM}>{`${clockLabel(r.minutes)} · ${r.shadowMm} mm`}</span>
                    </button>
                  ))}
                </div>
                <div className="bench__row">
                  <button type="button" className="bench-part bench-part--wide" onClick={() => say(shadowSummary(draftShadow))}>
                    {shadowSummary(draftShadow)}
                  </button>
                </div>
              </>
            ) : null}

            <p className="bench__tray-label">How it is done</p>
            <div className="bench__row">
              {SHADOW_METHOD.map((line) => (
                <button key={line} type="button" className="bench-part bench-part--wide" onClick={() => say(line)}>
                  {line}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={primary} disabled={primaryOff}>
          {primaryLabel}
        </button>
        <button type="button" className="bench-btn" onClick={() => void savePicture()}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>
          Print
        </button>
        <button type="button" className="bench-btn" onClick={() => say(printLine)}>
          Read this out
        </button>
      </div>

      {records.length ? (
        <div className="bench__shelf">
          <p className="bench__shelf-title">{logSummary(records)}</p>
          <ul className="bench__shelf-list">
            {[...records]
              .slice()
              .reverse()
              .slice(0, 12)
              .map((r) => (
                <li className="bench__kept" key={r.id}>
                  <span className="bench__kept-name">{logSignature(r)}</span>
                  <span className="bench__kept-meta" style={NUM}>
                    {r.kind === 'find'
                      ? findSummary(r)
                      : r.kind === 'watch'
                        ? `${r.subject}: ${r.heightMm} mm, ${r.stage ? STAGE_LABEL[r.stage].toLowerCase() : ''}. ${formatDate(r.date)}.`
                        : shadowSummary(r)}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div className="plate-print">
        <p className="plate-print__title">{printTitle}</p>
        <p className="plate-print__line">{printLine}</p>
      </div>
    </section>
  );
}

export default FieldLog;
