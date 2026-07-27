import { useMemo, useRef, useState, type ReactElement } from 'react';
import { drawer } from '../../workshop/drawer';
import { pluck, step } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';
import {
  CM_TO_PX,
  EXTRA_THINGS,
  MAX_LAYS,
  MAX_NOTCHES,
  PALETTE,
  SHEET_CM,
  TABLE_OF_MEASURES_META,
  THINGS,
  UNIT_SPECS,
  buildTable,
  bumpCount,
  composeReading,
  composeUnit,
  countLabel,
  fmt,
  isCalibrated,
  isoDay,
  ownsGlyph,
  plateLines,
  recalibrated,
  rulerSummary,
  rulerTicks,
  rulerWidthPx,
  tableSummary,
  thingSpec,
  unitCm,
  unitLine,
  unitSpec,
  unitsInOrder,
  type Draft,
  type MeasureTable,
  type Reading,
  type ThingKey,
  type Unit,
  type UnitGlyphKey,
} from '../../workshop/table-of-measures';

const unitRack = drawer<Unit>('measures-units');
const readingRack = drawer<Reading>('measures-readings');

type Panel = 'none' | 'invent' | 'calibrate' | 'things';

/* ------------------------------------------------------------ drawing parts */

function glyph(
  paths: readonly string[],
  x: number,
  y: number,
  size: number,
  color: string,
  weight = 1.4,
): ReactElement {
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

const band = (text: string, x: number, y: number, anchor: 'start' | 'end' | 'middle' = 'start'): ReactElement => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    fontFamily="Inter, system-ui, sans-serif"
    fontSize={11}
    letterSpacing={2.2}
    fill={PALETTE.faint}
  >
    {text}
  </text>
);

/* ------------------------------------------------------------- the table */

const W = 960;
const LABEL_X = 34;
const COLS_X = 272;
const COLS_END = 926;
const HEAD_RULE_Y = 106;
const GLYPH_TOP = 118;
const HEAD_TEXT_Y = 160;
const ROW_TOP = 172;
const ROW_H = 34;

function tablePlateHeight(rowCount: number): number {
  return ROW_TOP + Math.max(1, rowCount) * ROW_H + 62;
}

function tablePlate(table: MeasureTable): ReactElement {
  const { columns, rows } = table;
  const n = Math.max(1, rows.length);
  const rowsBottom = ROW_TOP + n * ROW_H;
  const height = tablePlateHeight(rows.length);
  const colW = (COLS_END - COLS_X) / Math.max(1, columns.length);
  const colLeft = (i: number): number => COLS_X + i * colW;
  const colMid = (i: number): number => COLS_X + (i + 0.5) * colW;
  const firstStandard = columns.findIndex((c) => c.standard);
  const mine = columns.filter((c) => !c.standard).length;
  const valueSize = colW < 52 ? 12 : 14;

  return (
    <g>
      <rect x={0} y={0} width={W} height={height} fill={PALETTE.paper} />
      <rect x={16} y={16} width={W - 32} height={height - 32} fill="none" stroke={PALETTE.rule} strokeWidth={1} />

      {band('THE TABLE OF MEASURES', 40, 54)}
      <text
        x={40}
        y={92}
        fontFamily="Literata, Georgia, serif"
        fontSize={24}
        fill={PALETTE.ink}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${rows.length} ${rows.length === 1 ? 'thing' : 'things'} measured in ${mine} ${
          mine === 1 ? 'unit' : 'units'
        } of my own`}
      </text>
      <line x1={40} y1={HEAD_RULE_Y} x2={920} y2={HEAD_RULE_Y} stroke={PALETTE.rule} strokeWidth={1} />

      {firstStandard >= 0 ? (
        <g>
          <rect
            x={colLeft(firstStandard)}
            y={112}
            width={COLS_END - colLeft(firstStandard)}
            height={rowsBottom - 112}
            fill={PALETTE.sunken}
          />
          {band(
            'EVERYONE ELSE',
            (colLeft(firstStandard) + COLS_END) / 2,
            134,
            'middle',
          )}
        </g>
      ) : null}

      {columns.map((col, i) => (
        <g key={col.id}>
          {col.glyph ? glyph(unitSpec(col.glyph).paths, colMid(i) - 11, GLYPH_TOP, 22, PALETTE.ink, 1.4) : null}
          <text
            x={colMid(i)}
            y={HEAD_TEXT_Y}
            textAnchor="middle"
            fontFamily="Inter, system-ui, sans-serif"
            fontSize={12}
            fill={col.standard ? PALETTE.faint : PALETTE.ink}
          >
            {col.head}
          </text>
          {i > 0 ? (
            <line x1={colLeft(i)} y1={112} x2={colLeft(i)} y2={rowsBottom} stroke={PALETTE.rule} strokeWidth={0.7} />
          ) : null}
        </g>
      ))}
      <line x1={COLS_X} y1={112} x2={COLS_X} y2={rowsBottom} stroke={PALETTE.rule} strokeWidth={1} />
      <line x1={40} y1={ROW_TOP} x2={920} y2={ROW_TOP} stroke={PALETTE.rule} strokeWidth={1} />

      {rows.length === 0 ? (
        <text
          x={LABEL_X + 6}
          y={ROW_TOP + 22}
          fontFamily="Literata, Georgia, serif"
          fontSize={15}
          fill={PALETTE.faint}
        >
          Nothing measured yet.
        </text>
      ) : null}

      {rows.map((row, r) => {
        const top = ROW_TOP + r * ROW_H;
        const mid = top + ROW_H / 2;
        return (
          <g key={row.thing}>
            {r > 0 ? <line x1={40} y1={top} x2={920} y2={top} stroke={PALETTE.rule} strokeWidth={0.7} /> : null}
            {glyph(thingSpec(row.thing).paths, LABEL_X + 6, mid - 10, 20, PALETTE.ink, 1.3)}
            <text x={LABEL_X + 34} y={mid + 5} fontFamily="Literata, Georgia, serif" fontSize={15} fill={PALETTE.ink}>
              {row.label}
            </text>
            {row.cells.map((cell, c) => (
              <text
                key={columns[c].id}
                x={colMid(c)}
                y={mid + 5}
                textAnchor="middle"
                fontFamily="Inter, system-ui, sans-serif"
                fontSize={valueSize}
                fontWeight={cell.measured ? 600 : 400}
                fill={cell.value === null ? PALETTE.rule : cell.measured ? PALETTE.ink : PALETTE.faint}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmt(cell.value)}
              </text>
            ))}
            {row.live ? (
              <rect
                x={LABEL_X}
                y={top}
                width={COLS_END - LABEL_X}
                height={ROW_H}
                fill="none"
                stroke={PALETTE.terracotta}
                strokeWidth={1.4}
              />
            ) : null}
          </g>
        );
      })}

      <line x1={40} y1={rowsBottom + 18} x2={920} y2={rowsBottom + 18} stroke={PALETTE.rule} strokeWidth={1} />
      <text
        x={40}
        y={rowsBottom + 42}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {'dark figures were laid out by hand · pale figures were worked out from them'}
      </text>
      <text
        x={920}
        y={rowsBottom + 42}
        textAnchor="end"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${columns.length} columns`}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------ paper ruler */

const RULER_PAD = 6;
const RULER_H = 96;
const RULER_BASE = 76;

function rulerPlate(cmPerUnit: number, name: string): ReactElement {
  const ticks = rulerTicks(cmPerUnit);
  const w = rulerWidthPx(SHEET_CM) + RULER_PAD * 2;
  const at = (cm: number): number => RULER_PAD + cm * CM_TO_PX;
  const topOf = (kind: 'unit' | 'half' | 'part'): number =>
    kind === 'unit' ? 40 : kind === 'half' ? 54 : 64;
  return (
    <g>
      <rect x={0} y={0} width={w} height={RULER_H} fill={PALETTE.paper} />
      <rect
        x={0.5}
        y={16.5}
        width={w - 1}
        height={RULER_H - 26}
        fill={PALETTE.raised}
        stroke={PALETTE.faint}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      {band(name.toUpperCase(), RULER_PAD, 11)}
      <line x1={at(0)} y1={RULER_BASE} x2={w - RULER_PAD} y2={RULER_BASE} stroke={PALETTE.ink} strokeWidth={1} />
      {ticks.map((t) => (
        <g key={t.cm}>
          <line
            x1={at(t.cm)}
            y1={RULER_BASE}
            x2={at(t.cm)}
            y2={topOf(t.kind)}
            stroke={t.kind === 'unit' ? PALETTE.ink : PALETTE.faint}
            strokeWidth={t.kind === 'unit' ? 1.3 : 0.8}
          />
          {t.label !== null ? (
            <text
              x={at(t.cm)}
              y={34}
              textAnchor="middle"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={11}
              fill={PALETTE.ink}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {t.label}
            </text>
          ) : null}
        </g>
      ))}
      <text x={RULER_PAD} y={RULER_H - 2} fontFamily="Inter, system-ui, sans-serif" fontSize={10} fill={PALETTE.faint}>
        {'cut along the dashes · print at full size, not scaled to fit'}
      </text>
    </g>
  );
}

/* --------------------------------------------------------------- the bench */

export function TableOfMeasures(): ReactElement {
  const boot = useMemo(() => ({ units: unitRack.list(), readings: readingRack.list() }), []);
  const svgRef = useRef<SVGSVGElement>(null);

  const [units, setUnits] = useState<readonly Unit[]>(boot.units);
  const [readings, setReadings] = useState<readonly Reading[]>(boot.readings);
  const [unitId, setUnitId] = useState<string | null>(boot.units.length ? unitsInOrder(boot.units)[0].id : null);
  const [thing, setThing] = useState<ThingKey | null>(null);
  const [lays, setLays] = useState(0);
  const [notches, setNotches] = useState(0);
  const [panel, setPanel] = useState<Panel>(boot.units.length ? 'none' : 'invent');
  const [showRuler, setShowRuler] = useState(false);
  const [rulerInCm, setRulerInCm] = useState(false);

  const ordered = useMemo(() => unitsInOrder(units), [units]);
  const chosen = ordered.find((u) => u.id === unitId) ?? null;
  const chosenId = chosen ? chosen.id : null;
  const table = useMemo(() => {
    const draft: Draft | null = thing && chosenId && lays > 0 ? { thing, unitId: chosenId, lays } : null;
    return buildTable(units, readings, draft);
  }, [units, readings, thing, chosenId, lays]);
  const spec = chosen ? unitSpec(chosen.glyph) : null;
  const rulerCm = rulerInCm || !isCalibrated(chosen) ? 1 : (unitCm(chosen) ?? 1);
  const rulerName = rulerCm === 1 && (rulerInCm || !isCalibrated(chosen)) ? 'centimetres' : spec ? spec.many : 'centimetres';

  const inventUnit = (key: UnitGlyphKey): void => {
    const made = unitRack.add(composeUnit(key));
    setUnits(unitRack.list());
    setUnitId(made.id);
    setNotches(0);
    setPanel('calibrate');
    setLays(0);
    say(`${unitSpec(key).label}. Now find out how long it is.`);
  };

  const tapNotch = (by: number): void => {
    const next = bumpCount(notches, by, MAX_NOTCHES);
    setNotches(next);
    if (by > 0) {
      pluck(step(next % 10 === 0 ? -5 : (next % 10) - 4), next % 10 === 0 ? 0.4 : 0.18);
      say(String(next));
    }
  };

  const setLength = (): void => {
    if (!chosen || notches <= 0) return;
    const fixed = recalibrated(chosen, notches);
    unitRack.remove(chosen.id);
    unitRack.add(fixed);
    setUnits(unitRack.list());
    setPanel('none');
    setNotches(0);
    say(`${unitSpec(fixed.glyph).label} is ${notches} centimetres.`);
  };

  const pickUnit = (u: Unit): void => {
    setUnitId(u.id);
    setLays(0);
    setNotches(0);
    setPanel('none');
    say(unitLine(u));
  };

  const pickThing = (key: ThingKey): void => {
    setThing(key);
    setLays(0);
    say(thingSpec(key).label);
  };

  const layDown = (): void => {
    if (!chosen || !thing) return;
    const next = bumpCount(lays, 1, MAX_LAYS);
    setLays(next);
    pluck(step(next % 5 === 0 ? -8 : ((next % 5) - 1) * 2), next % 5 === 0 ? 0.45 : 0.2);
    say(String(next));
  };

  const takeOneBack = (): void => setLays(bumpCount(lays, -1, MAX_LAYS));

  const keepMeasurement = (): void => {
    if (!chosen || !thing || lays <= 0) return;
    for (const old of readings) {
      if (old.thing === thing && old.unitId === chosen.id) readingRack.remove(old.id);
    }
    readingRack.add(composeReading({ thing, unitId: chosen.id, lays }));
    setReadings(readingRack.list());
    setLays(0);
    say(`${thingSpec(thing).label} is ${countLabel(lays, chosen)}.`);
  };

  const forget = (id: string): void => {
    readingRack.remove(id);
    setReadings(readingRack.list());
  };

  const startAgain = (): void => {
    setLays(0);
    setNotches(0);
    setPanel('none');
  };

  const savePicture = async (): Promise<void> => {
    const svg = svgRef.current;
    if (!svg) return;
    await exportPlate(
      svg,
      { title: TABLE_OF_MEASURES_META.title, lines: plateLines(table, units) },
      `table-of-measures-${isoDay(new Date())}`,
    );
  };

  const readout = (): string => {
    if (panel === 'calibrate') return `${notches} cm`;
    if (lays > 0 && chosen) return countLabel(lays, chosen);
    return `${table.rows.length} ${table.rows.length === 1 ? 'thing' : 'things'}`;
  };

  const calibrating = panel === 'calibrate' && chosen !== null;
  const primaryLabel = calibrating
    ? spec
      ? `That is how long ${spec.label} is`
      : 'Set the length'
    : 'Keep this measurement';
  const primaryOff = calibrating ? notches <= 0 : !chosen || !thing || lays <= 0;
  const kept = useMemo(
    () => [...readings].sort((a, b) => b.made.localeCompare(a.made)),
    [readings],
  );
  const byId = useMemo(() => new Map(ordered.map((u) => [u.id, u])), [ordered]);

  return (
    <section className="bench" aria-labelledby="table-of-measures-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{TABLE_OF_MEASURES_META.eyebrow}</p>
          <h2 id="table-of-measures-title" className="bench__title">
            {TABLE_OF_MEASURES_META.title}
          </h2>
          <p className="bench__note">{TABLE_OF_MEASURES_META.note}</p>
        </div>
        <p className="bench__readout">{readout()}</p>
      </div>

      <div className="bench__stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${tablePlateHeight(table.rows.length)}`}
          role="img"
          aria-label={tableSummary(table)}
        >
          {tablePlate(table)}
        </svg>
        {showRuler ? (
          <div className="bench__figure">
            <svg
              viewBox={`0 0 ${rulerWidthPx(SHEET_CM) + RULER_PAD * 2} ${RULER_H}`}
              width={rulerWidthPx(SHEET_CM) + RULER_PAD * 2}
              height={RULER_H}
              style={{
                width: `${rulerWidthPx(SHEET_CM) + RULER_PAD * 2}px`,
                height: `${RULER_H}px`,
              }}
              role="img"
              aria-label={rulerInCm ? rulerSummary(null) : rulerSummary(chosen)}
            >
              {rulerPlate(rulerCm, rulerName)}
            </svg>
            <p className="bench__figure-caption">{`the paper ruler, in ${rulerName}`}</p>
          </div>
        ) : null}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">Your units</p>
        <div className="bench__row">
          {ordered.map((u) => {
            const s = unitSpec(u.glyph);
            return (
              <button
                key={u.id}
                type="button"
                className={`bench-part${unitId === u.id ? ' is-set' : ''}`}
                onClick={() => pickUnit(u)}
                aria-pressed={unitId === u.id}
                aria-label={`Measure with ${unitLine(u)}`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  {glyph(s.paths, 0, 0, 24, PALETTE.ink, 1.4)}
                </svg>{' '}
                {s.label}{' '}
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {isCalibrated(u) ? `${unitCm(u)} cm` : 'no length'}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            className={`bench-part${panel === 'invent' ? ' is-set' : ''}`}
            onClick={() => setPanel(panel === 'invent' ? 'none' : 'invent')}
            aria-pressed={panel === 'invent'}
          >
            Invent a unit
          </button>
          {chosen ? (
            <button
              type="button"
              className={`bench-part${panel === 'calibrate' ? ' is-set' : ''}`}
              onClick={() => {
                setPanel(panel === 'calibrate' ? 'none' : 'calibrate');
                setNotches(0);
              }}
              aria-pressed={panel === 'calibrate'}
            >
              {isCalibrated(chosen) ? 'Measure it again' : 'How long is it?'}
            </button>
          ) : null}
        </div>

        {panel === 'invent' ? (
          <>
            <p className="bench__tray-label">Choose a thing to measure with. It becomes yours.</p>
            <div className="bench__row">
              {UNIT_SPECS.map((s) => {
                const taken = ownsGlyph(units, s.key);
                return (
                  <button
                    key={s.key}
                    type="button"
                    className="bench-part"
                    onClick={() => inventUnit(s.key)}
                    disabled={taken}
                    aria-label={taken ? `${s.label}, already yours` : `Make ${s.label} a unit`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                      {glyph(s.paths, 0, 0, 24, PALETTE.ink, 1.4)}
                    </svg>{' '}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {calibrating && chosen && spec ? (
          <>
            <p className="bench__tray-label">
              {`Print the paper ruler, lay ${spec.label} along it, and tap once for every notch it covers`}
            </p>
            <div className="bench__row">
              <button
                type="button"
                className="bench-part bench-part--wide"
                onClick={() => tapNotch(1)}
                aria-label={`One more notch. ${notches} centimetres so far.`}
              >
                <svg width="120" height="26" viewBox="0 0 120 26" aria-hidden="true">
                  <line x1={4} y1={22} x2={116} y2={22} stroke={PALETTE.ink} strokeWidth={1} />
                  {Array.from({ length: Math.min(24, notches) }, (_, i) => (
                    <line key={i} x1={6 + i * 4.6} y1={22} x2={6 + i * 4.6} y2={i % 5 === 4 ? 6 : 12} stroke={PALETTE.ink} strokeWidth={1} />
                  ))}
                </svg>{' '}
                One notch
              </button>
              <button type="button" className="bench-part" onClick={() => tapNotch(10)}>
                Ten notches
              </button>
              <button type="button" className="bench-part" onClick={() => tapNotch(-1)} disabled={notches === 0}>
                Take one back
              </button>
              <button
                type="button"
                className={`bench-part${showRuler ? ' is-set' : ''}`}
                onClick={() => {
                  setShowRuler(true);
                  setRulerInCm(true);
                }}
                aria-pressed={showRuler && rulerInCm}
              >
                Show the centimetre ruler
              </button>
            </div>
          </>
        ) : null}

        <p className="bench__tray-label">
          {chosen && spec ? `Measure a thing with ${spec.label}` : 'Invent a unit first, then choose a thing'}
        </p>
        <div className="bench__row">
          {THINGS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`bench-part${thing === t.key ? ' is-set' : ''}`}
              onClick={() => pickThing(t.key)}
              disabled={!chosen}
              aria-pressed={thing === t.key}
              aria-label={`Measure ${t.label}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                {glyph(t.paths, 0, 0, 24, PALETTE.ink, 1.3)}
              </svg>{' '}
              {t.label}
            </button>
          ))}
          <button
            type="button"
            className={`bench-part${panel === 'things' ? ' is-set' : ''}`}
            onClick={() => setPanel(panel === 'things' ? 'none' : 'things')}
            aria-pressed={panel === 'things'}
          >
            Something else
          </button>
        </div>

        {panel === 'things' ? (
          <div className="bench__row">
            {EXTRA_THINGS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={`bench-part${thing === t.key ? ' is-set' : ''}`}
                onClick={() => pickThing(t.key)}
                disabled={!chosen}
                aria-pressed={thing === t.key}
                aria-label={`Measure ${t.label}`}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                  {glyph(t.paths, 0, 0, 24, PALETTE.ink, 1.3)}
                </svg>{' '}
                {t.label}
              </button>
            ))}
          </div>
        ) : null}

        <p className="bench__tray-label">
          {thing && spec
            ? `Lay ${spec.label} along ${thingSpec(thing).label}, end over end. Tap once every time you put it down.`
            : 'Choose a thing, then tap once for every lay'}
        </p>
        <div className="bench__row">
          <button
            type="button"
            className="bench-part bench-part--wide"
            onClick={layDown}
            disabled={!chosen || !thing}
            aria-label={
              chosen && thing
                ? `Lay it down once more. ${countLabel(lays, chosen)} so far.`
                : 'Lay it down once more'
            }
          >
            <svg width="150" height="26" viewBox="0 0 150 26" aria-hidden="true">
              <line x1={2} y1={24} x2={148} y2={24} stroke={PALETTE.rule} strokeWidth={1} />
              {Array.from({ length: Math.min(12, lays) }, (_, i) => (
                <rect
                  key={i}
                  x={3 + i * 12}
                  y={6}
                  width={10}
                  height={16}
                  fill="none"
                  stroke={PALETTE.terracotta}
                  strokeWidth={1.2}
                />
              ))}
            </svg>{' '}
            Lay it down
          </button>
          <button type="button" className="bench-part" onClick={takeOneBack} disabled={lays === 0}>
            Take one back
          </button>
          <button
            type="button"
            className={`bench-part${showRuler ? ' is-set' : ''}`}
            onClick={() => {
              setShowRuler(!showRuler);
              setRulerInCm(false);
            }}
            aria-pressed={showRuler}
          >
            {showRuler ? 'Put the ruler away' : 'Make a paper ruler'}
          </button>
        </div>
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={calibrating ? setLength : keepMeasurement} disabled={primaryOff}>
          {primaryLabel}
        </button>
        <button type="button" className="bench-btn" onClick={() => void savePicture()}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>
          Print
        </button>
        <button type="button" className="bench-btn" onClick={startAgain}>
          Start again
        </button>
      </div>

      {kept.length ? (
        <div className="bench__shelf">
          <p className="bench__shelf-title">Everything measured so far</p>
          <ul className="bench__shelf-list">
            {kept.map((r) => (
              <li className="bench__kept" key={r.id}>
                <span className="bench__kept-name">{thingSpec(r.thing).label}</span>
                <span className="bench__kept-meta" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {countLabel(r.lays, byId.get(r.unitId))}
                </span>
                <button
                  type="button"
                  className="bench-part"
                  onClick={() => forget(r.id)}
                  aria-label={`Take ${thingSpec(r.thing).label}, ${countLabel(r.lays, byId.get(r.unitId))}, out of the table`}
                >
                  Take out
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="plate-print">
        <p className="plate-print__title">{TABLE_OF_MEASURES_META.title}</p>
        {plateLines(table, units).map((line) => (
          <p className="plate-print__line" key={line}>
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}

export default TableOfMeasures;
