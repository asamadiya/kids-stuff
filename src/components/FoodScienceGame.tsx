import { useMemo, useRef, useState, type ReactElement } from 'react';
import {
  AMINOS,
  BENCHES,
  CHALAZA_CORDS,
  CURD_STATES,
  CURD_STEPS,
  CURD_VIEW,
  EGG,
  EGG_FLOAT_TEST,
  EGG_PAINT_ORDER,
  EGG_PARTS,
  FOOD_GROUPS,
  FOOD_SCIENCE_META,
  NUTRIENTS,
  NUTRIENT_KEYS,
  airCellPath,
  axisNote,
  barFraction,
  blockCheck,
  blockLine,
  clearPlate,
  contribution,
  eggOutlinePath,
  eggPart,
  foodsInGroup,
  leaderFor,
  micelles,
  plateLines,
  plateSize,
  plateSummary,
  plateTotals,
  serve,
  servingsOn,
  topSources,
  type Bench,
  type EggPartId,
  type NutrientKey,
  type Plate,
} from '../games/food-science';
import { say } from '../workshop/say';
import { exportPlate, printPlate } from '../workshop/plate';

/* Paper, ink and hairlines, as everywhere else in the guide. */
const PAPER = '#f4f0e6';
const RAISED = '#fbf9f4';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TEAL = '#2a5957';
const OCHRE = '#8a6416';

const SANS = 'Inter, system-ui, sans-serif';
const SERIF = 'Literata, Georgia, serif';
const NUM = { fontVariantNumeric: 'tabular-nums' } as const;

const label = (text: string, x: number, y: number, size = 13): ReactElement => (
  <text x={x} y={y} fontFamily={SANS} fontSize={size} fill={FAINT} letterSpacing={0.6}>
    {text}
  </text>
);

const frame = (w: number, h: number): ReactElement => (
  <>
    <rect x={0} y={0} width={w} height={h} fill={PAPER} />
    <rect x={16} y={16} width={w - 32} height={h - 32} fill="none" stroke={RULE} strokeWidth={1} />
  </>
);

const round1 = (v: number): string => String(Math.round(v * 10) / 10);

/** Break a sentence on word boundaries; SVG text does not wrap on its own. */
function wrap(text: string, perLine: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    if (line && `${line} ${word}`.length > perLine) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* ------------------------------------------------------------- the plate bench */

const PLATE_VIEW = { w: 960, h: 640 };

function platePlate(plate: Plate): ReactElement {
  const on = servingsOn(plate);
  const totals = plateTotals(plate);
  const check = blockCheck(plate);
  const cx = 232;
  const cy = 268;
  const r = 148;
  const glyphs = on.flatMap((s) =>
    Array.from({ length: s.servings }, (_, k) => ({ food: s.food, key: `${s.food.id}-${k}` })));
  const rowY = (i: number): number => 132 + i * 62;

  return (
    <g>
      {frame(PLATE_VIEW.w, PLATE_VIEW.h)}
      {label('THE PLATE', 40, 54)}
      <text x={40} y={92} fontFamily={SERIF} fontSize={22} fill={INK} style={NUM}>
        {plateSummary(plate)}
      </text>
      <line x1={40} y1={108} x2={920} y2={108} stroke={RULE} strokeWidth={1} />

      <circle cx={cx} cy={cy} r={r} fill={RAISED} stroke={RULE} strokeWidth={1} />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke={RULE} strokeWidth={0.7} />
      {glyphs.map((g, i) => {
        const ring = i < 6 ? 0 : 1;
        const inRing = ring === 0 ? Math.min(6, glyphs.length) : glyphs.length - 6;
        const at = ring === 0 ? i : i - 6;
        const angle = (at / Math.max(1, inRing)) * Math.PI * 2 - Math.PI / 2;
        const rr = ring === 0 ? r * 0.46 : r * 0.82;
        return (
          <text
            key={g.key}
            x={cx + rr * Math.cos(angle)}
            y={cy + rr * Math.sin(angle)}
            fontSize={34}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={SANS}
          >
            {g.food.glyph}
          </text>
        );
      })}
      <text x={cx} y={cy + r + 34} textAnchor="middle" fontFamily={SANS} fontSize={13} fill={FAINT} style={NUM}>
        {plateSize(plate) === 1 ? '1 serving' : `${plateSize(plate)} servings`}
      </text>

      {NUTRIENT_KEYS.map((key, i) => {
        const y = rowY(i);
        const x0 = 452;
        const x1 = 828;
        const width = (x1 - x0) * barFraction(plate, key);
        const top = topSources(plate, key, 2)
          .map((s) => `${s.food.name} ${round1(contribution(s, key))}`)
          .join(' · ');
        return (
          <g key={key}>
            <text x={x0} y={y - 8} fontFamily={SANS} fontSize={13} fill={INK}>
              {NUTRIENTS[key].name}
            </text>
            <text x={x1 + 84} y={y - 8} textAnchor="end" fontFamily={SANS} fontSize={15} fill={INK} style={NUM}>
              {`${round1(totals[key])} ${NUTRIENTS[key].unit}`}
            </text>
            <line x1={x0} y1={y + 4} x2={x1} y2={y + 4} stroke={RULE} strokeWidth={1} />
            <rect x={x0} y={y - 4} width={Math.max(0, width)} height={9} fill={NUTRIENTS[key].color} />
            {top ? (
              <text x={x0} y={y + 24} fontFamily={SANS} fontSize={11} fill={FAINT} style={NUM}>
                {top}
              </text>
            ) : null}
          </g>
        );
      })}

      <line x1={40} y1={520} x2={920} y2={520} stroke={RULE} strokeWidth={1} />
      {label('BUILDING BLOCKS', 40, 548)}
      {wrap(blockLine(plate), 108).slice(0, 2).map((line, i) => (
        <text key={line} x={40} y={574 + i * 20} fontFamily={SANS} fontSize={14} fill={check.complete ? TEAL : INK}>
          {line}
        </text>
      ))}
      <text x={40} y={620} fontFamily={SANS} fontSize={12} fill={FAINT} style={NUM}>
        {axisNote('protein')}
      </text>
    </g>
  );
}

/* --------------------------------------------------------------- the egg plate */

function eggPlate(selected: EggPartId | null): ReactElement {
  const shape = (partId: EggPartId): ReactElement | null => {
    const part = eggPart(partId);
    const on = selected === partId;
    const stroke = on ? TEAL : RULE;
    const weight = on ? 2.4 : 1;
    switch (partId) {
      case 'shell':
        return (
          <path
            d={`${eggOutlinePath(1)}${eggOutlinePath(EGG.shellInner)}`}
            fillRule="evenodd"
            fill={part.color}
            stroke={stroke}
            strokeWidth={weight}
          />
        );
      case 'white':
        return <path d={eggOutlinePath(EGG.shellInner)} fill={part.color} stroke={stroke} strokeWidth={weight} />;
      case 'chalaza':
        return (
          <g
            stroke={part.color}
            strokeWidth={EGG.chalazaR * 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          >
            {CHALAZA_CORDS.map((c, i) => (
              <polyline key={i} points={c.map((p) => `${p.x},${p.y}`).join(' ')} opacity={on ? 1 : 0.85} />
            ))}
          </g>
        );
      case 'yolk':
        return <circle cx={EGG.cx} cy={EGG.cy} r={EGG.yolkR} fill={part.color} stroke={stroke} strokeWidth={weight} />;
      case 'air':
        return <path d={airCellPath()} fill={part.color} stroke={stroke} strokeWidth={weight} />;
      default:
        return null;
    }
  };

  return (
    <g>
      {frame(EGG.view.w, EGG.view.h)}
      {label('ONE EGG, IN SECTION', 34, 44)}
      {EGG_PAINT_ORDER.map((partId) => (
        <g key={partId}>{shape(partId)}</g>
      ))}
      {EGG_PARTS.map((part) => {
        const leader = leaderFor(part);
        const on = selected === part.id;
        return (
          <g key={part.id}>
            <polyline
              data-leader={part.id}
              points={`${part.anchor.x},${part.anchor.y} ${leader.elbow.x},${leader.elbow.y} ${leader.text.x},${leader.elbow.y}`}
              fill="none"
              stroke={on ? TEAL : FAINT}
              strokeWidth={on ? 1.4 : 0.8}
            />
            <circle cx={part.anchor.x} cy={part.anchor.y} r={on ? 3.4 : 2.2} fill={on ? TEAL : FAINT} />
            <text
              x={leader.text.x}
              y={leader.text.y}
              textAnchor={leader.anchorEnd}
              fontFamily={SERIF}
              fontSize={17}
              fill={on ? TEAL : INK}
            >
              {part.label}
            </text>
          </g>
        );
      })}
      <line x1={34} y1={EGG.view.h - 60} x2={EGG.view.w - 34} y2={EGG.view.h - 60} stroke={RULE} strokeWidth={1} />
      <text x={34} y={EGG.view.h - 36} fontFamily={SANS} fontSize={12} fill={FAINT}>
        the shell is drawn about six times thicker than a real one, so that you can see it
      </text>
    </g>
  );
}

/* -------------------------------------------------------------- the curd plate */

function curdPlate(stage: number): ReactElement {
  const state = CURD_STATES[Math.max(0, Math.min(CURD_STATES.length - 1, stage))];
  const bundles = micelles(state.set);
  return (
    <g>
      {frame(CURD_VIEW.w, CURD_VIEW.h)}
      {label('CASEIN IN MILK', 34, 44)}
      <text x={34} y={82} fontFamily={SERIF} fontSize={22} fill={INK}>
        {state.title}
      </text>
      <line x1={34} y1={98} x2={CURD_VIEW.w - 34} y2={98} stroke={RULE} strokeWidth={1} />
      {bundles.map((m, i) => (
        <g key={i}>
          <circle cx={m.x} cy={m.y} r={17} fill={RAISED} stroke={OCHRE} strokeWidth={1.2} />
          {Array.from({ length: m.charge }, (_, c) => {
            const angle = (c / 3) * Math.PI * 2 - Math.PI / 2;
            return (
              <g key={c}>
                <line
                  x1={m.x + 17 * Math.cos(angle)}
                  y1={m.y + 17 * Math.sin(angle)}
                  x2={m.x + 25 * Math.cos(angle)}
                  y2={m.y + 25 * Math.sin(angle)}
                  stroke={TEAL}
                  strokeWidth={1.2}
                />
                <line
                  x1={m.x + 22 * Math.cos(angle) - 3}
                  y1={m.y + 22 * Math.sin(angle)}
                  x2={m.x + 22 * Math.cos(angle) + 3}
                  y2={m.y + 22 * Math.sin(angle)}
                  stroke={TEAL}
                  strokeWidth={1.2}
                />
              </g>
            );
          })}
        </g>
      ))}
      <line x1={34} y1={CURD_VIEW.h - 76} x2={CURD_VIEW.w - 34} y2={CURD_VIEW.h - 76} stroke={RULE} strokeWidth={1} />
      <text x={34} y={CURD_VIEW.h - 50} fontFamily={SANS} fontSize={14} fill={INK}>
        {state.line}
      </text>
      <text x={34} y={CURD_VIEW.h - 28} fontFamily={SANS} fontSize={12} fill={FAINT} style={NUM}>
        {`${bundles.length} bundles drawn · ${bundles[0].charge} charges left on each`}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ the bench */

export function FoodScienceGame(): ReactElement {
  const [bench, setBench] = useState<Bench>('plate');
  const [plate, setPlate] = useState<Plate>({});
  const [part, setPart] = useState<EggPartId | null>(null);
  const [stage, setStage] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const lines = useMemo(() => plateLines(plate), [plate]);
  const check = useMemo(() => blockCheck(plate), [plate]);
  const totals = plateTotals(plate);

  const put = (foodId: string): void => {
    const next = serve(plate, foodId);
    setPlate(next);
    const added = servingsOn(next).find((s) => s.food.id === foodId);
    if (added) say(`${added.food.singular}. ${added.food.fact}`);
  };

  const takeBack = (foodId: string): void => setPlate(serve(plate, foodId, -1));

  const pickPart = (id: EggPartId): void => {
    setPart(id);
    const found = eggPart(id);
    say(`${found.label}. ${found.what}`);
  };

  const pickStage = (i: number): void => {
    setStage(i);
    say(`${CURD_STATES[i].title}. ${CURD_STATES[i].line}`);
  };

  const readAloud = (): void => {
    if (bench === 'plate') say(lines.join(' '));
    else if (bench === 'egg') say(EGG_PARTS.map((p) => `${p.label}. ${p.what}`).join(' '));
    else say(CURD_STEPS.map((s) => `${s.title}. ${s.line}`).join(' '));
  };

  const printTitle =
    bench === 'plate' ? 'A plate, and what it supplies'
      : bench === 'egg' ? 'One egg, in section'
        : 'Milk into curd';
  const printLine =
    bench === 'plate' ? plateSummary(plate)
      : bench === 'egg' ? EGG_PARTS.map((p) => p.label).join(' · ')
        : CURD_STATES[stage].line;

  const savePicture = async (): Promise<void> => {
    const svg = svgRef.current;
    if (!svg) return;
    await exportPlate(svg, { title: printTitle, lines: [printLine] }, `food-science-${bench}`);
  };

  const readout =
    bench === 'plate'
      ? `${plateSize(plate)} on the plate · ${round1(totals.protein)} g protein`
      : bench === 'egg'
        ? `${EGG_PARTS.length} parts`
        : `${CURD_STATES[stage].title.toLowerCase()}`;

  const stageLabel =
    bench === 'plate' ? plateSummary(plate) : bench === 'egg' ? 'An egg cut in half, with every part named' : `Casein bundles: ${CURD_STATES[stage].title}`;

  return (
    <section className="bench" aria-labelledby="food-science-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{FOOD_SCIENCE_META.eyebrow}</p>
          <h2 id="food-science-title" className="bench__title">{FOOD_SCIENCE_META.title}</h2>
          <p className="bench__note">{FOOD_SCIENCE_META.note}</p>
        </div>
        <p className="bench__readout">{readout}</p>
      </div>

      <div className="bench__stage">
        {bench === 'plate' ? (
          <svg ref={svgRef} viewBox={`0 0 ${PLATE_VIEW.w} ${PLATE_VIEW.h}`} role="img" aria-label={stageLabel}>
            {platePlate(plate)}
          </svg>
        ) : bench === 'egg' ? (
          <svg ref={svgRef} viewBox={`0 0 ${EGG.view.w} ${EGG.view.h}`} role="img" aria-label={stageLabel}>
            {eggPlate(part)}
          </svg>
        ) : (
          <svg ref={svgRef} viewBox={`0 0 ${CURD_VIEW.w} ${CURD_VIEW.h}`} role="img" aria-label={stageLabel}>
            {curdPlate(stage)}
          </svg>
        )}
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">The bench</p>
        <div className="bench__row">
          {BENCHES.map((b) => (
            <button
              key={b.key}
              type="button"
              className={`bench-part${bench === b.key ? ' is-set' : ''}`}
              aria-pressed={bench === b.key}
              onClick={() => {
                setBench(b.key);
                say(b.note);
              }}
            >
              {b.title}
            </button>
          ))}
        </div>

        {bench === 'plate' ? (
          <>
            {FOOD_GROUPS.map((group) => (
              <div key={group.key} style={{ width: '100%' }}>
                <p className="bench__tray-label">{group.title}</p>
                <div className="bench__row">
                  {foodsInGroup(group.key).map((f) => {
                    const count = plate[f.id] ?? 0;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        className={`bench-part${count > 0 ? ' is-set' : ''}`}
                        onClick={() => put(f.id)}
                        aria-label={`Put ${f.singular} on the plate. ${f.serving}. ${count} so far`}
                      >
                        <span aria-hidden="true">{f.glyph}</span> {f.singular}{' '}
                        <span style={NUM}>{count > 0 ? count : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {servingsOn(plate).length ? (
              <>
                <p className="bench__tray-label">Take one back off</p>
                <div className="bench__row">
                  {servingsOn(plate).map((s) => (
                    <button
                      key={s.food.id}
                      type="button"
                      className="bench-part"
                      onClick={() => takeBack(s.food.id)}
                      aria-label={`Take one ${s.food.singular} back off the plate`}
                    >
                      <span aria-hidden="true">{s.food.glyph}</span> {s.food.singular}{' '}
                      <span style={NUM}>{s.servings}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <p className="bench__tray-label">What the plate supplies</p>
            <div className="bench__row">
              {NUTRIENT_KEYS.map((key: NutrientKey) => (
                <button
                  key={key}
                  type="button"
                  className="bench-part bench-part--wide"
                  onClick={() => say(`${NUTRIENTS[key].name}, about ${round1(totals[key])} ${NUTRIENTS[key].unit}. ${NUTRIENTS[key].does}`)}
                  aria-label={`${NUTRIENTS[key].name}, about ${round1(totals[key])} ${NUTRIENTS[key].unit}`}
                >
                  <span style={{ color: NUTRIENTS[key].color }} aria-hidden="true">&#9632;</span>{' '}
                  {NUTRIENTS[key].name} <span style={NUM}>{`${round1(totals[key])} ${NUTRIENTS[key].unit}`}</span>
                </button>
              ))}
            </div>

            <p className="bench__tray-label">Building blocks</p>
            <div className="bench__row">
              <button type="button" className="bench-part bench-part--wide" onClick={() => say(blockLine(plate))}>
                {blockLine(plate)}
              </button>
            </div>
            {check.missing.length ? (
              <div className="bench__row">
                {check.missing.map((a) => (
                  <button key={a} type="button" className="bench-part" onClick={() => say(`${AMINOS[a].name}. ${AMINOS[a].note}`)}>
                    {AMINOS[a].name}
                  </button>
                ))}
              </div>
            ) : null}
          </>
        ) : null}

        {bench === 'egg' ? (
          <>
            <p className="bench__tray-label">The parts, outside in</p>
            <div className="bench__row">
              {EGG_PARTS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`bench-part${part === p.id ? ' is-set' : ''}`}
                  aria-pressed={part === p.id}
                  onClick={() => pickPart(p.id)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {part ? (
              <div className="bench__row">
                <p className="bench__tray-label">{eggPart(part).what}</p>
              </div>
            ) : null}
            <p className="bench__tray-label">The float test, which measures the air cell</p>
            <div className="bench__row">
              {EGG_FLOAT_TEST.map((line) => (
                <button
                  key={line}
                  type="button"
                  className="bench-part bench-part--wide"
                  onClick={() => say(line)}
                >
                  {line}
                </button>
              ))}
            </div>
          </>
        ) : null}

        {bench === 'curd' ? (
          <>
            <p className="bench__tray-label">Milk, acid, curd</p>
            <div className="bench__row">
              {CURD_STATES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  className={`bench-part${stage === i ? ' is-set' : ''}`}
                  aria-pressed={stage === i}
                  onClick={() => pickStage(i)}
                >
                  {s.title}
                </button>
              ))}
            </div>
            <p className="bench__tray-label">Why it happens</p>
            <div className="bench__row">
              {CURD_STEPS.map((s) => (
                <button
                  key={s.title}
                  type="button"
                  className="bench-part bench-part--wide"
                  onClick={() => say(`${s.title}. ${s.line}`)}
                >
                  <strong>{s.title}.</strong> {s.line}
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={readAloud}>
          Read this out
        </button>
        <button type="button" className="bench-btn" onClick={() => void savePicture()}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>
          Print
        </button>
        <button type="button" className="bench-btn" onClick={() => setPlate(clearPlate())}>
          Clear the plate
        </button>
      </div>

      {bench === 'plate' && servingsOn(plate).length ? (
        <div className="bench__shelf">
          <p className="bench__shelf-title">What this plate supplies</p>
          <ul className="bench__shelf-list">
            {lines.slice(1).map((line) => (
              <li className="bench__kept" key={line}>
                <span className="bench__kept-meta" style={NUM}>{line}</span>
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

export default FoodScienceGame;
