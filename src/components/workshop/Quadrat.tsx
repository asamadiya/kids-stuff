import { useMemo, useRef, useState, type ReactElement } from 'react';
import { drawer } from '../../workshop/drawer';
import { pluck, step } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';
import { ALL_INGREDIENTS } from '../../loom/ingredients';
import {
  CATEGORY_COLORS,
  EMPTY_PLAN,
  PALETTE,
  PLAN_COLS,
  PLAN_ROWS,
  QUADRAT_META,
  SHAPE_KEYS,
  STAMPS,
  STAMP_KEYS,
  WEATHER,
  WEATHER_KEYS,
  abundance,
  addCategory,
  applySplit,
  bump,
  carryForward,
  catalogue,
  categoryLabel,
  cellCol,
  cellRow,
  changeSummary,
  clearCell,
  colorName,
  composeSheet,
  composeSite,
  formatDate,
  gate,
  isoDate,
  latestSite,
  makeCategory,
  markCorner,
  planIsSquared,
  planSummary,
  resolvedSeries,
  seriesKeys,
  setPlace,
  shapePath,
  sheetSignature,
  sheetSummary,
  sheetsInOrder,
  stampCell,
  totalMarks,
  type Category,
  type GlyphSpec,
  type Lineage,
  type LogSheet,
  type QuadratRecord,
  type ShapeKey,
  type SitePlan,
  type StampKind,
  type WeatherKey,
} from '../../workshop/quadrat';

const store = drawer<QuadratRecord>('quadrat');

type Phase = 'plan' | 'count' | 'change';
type Tool = StampKind | 'corner' | 'erase';
type Panel = 'none' | 'make' | 'split';

/* ------------------------------------------------------------ drawing parts */

function strokeGlyph(spec: GlyphSpec, x: number, y: number, size: number, color: string, weight = 1.4): ReactElement {
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
      {spec.paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </g>
  );
}

function markGlyph(cat: Category, cx: number, cy: number, r: number): ReactElement {
  if (cat.shape) {
    return <path d={shapePath(cat.shape, cx, cy, r)} fill={cat.color} fillRule="evenodd" />;
  }
  return (
    <text
      x={cx}
      y={cy}
      fontSize={r * 1.9}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily="Inter, system-ui, sans-serif"
    >
      {cat.mark}
    </text>
  );
}

function planDrawing(plan: SitePlan, ox: number, oy: number, w: number, h: number, detail: boolean): ReactElement {
  const cw = w / PLAN_COLS;
  const ch = h / PLAN_ROWS;
  const cx = (cell: number): number => ox + (cellCol(cell) + 0.5) * cw;
  const cy = (cell: number): number => oy + (cellRow(cell) + 0.5) * ch;
  const size = Math.min(cw, ch) * (detail ? 0.66 : 0.58);
  const points = plan.corners.map((cell) => `${cx(cell)},${cy(cell)}`).join(' ');
  return (
    <g>
      <rect x={ox} y={oy} width={w} height={h} fill={PALETTE.raised} stroke={PALETTE.rule} strokeWidth={1} />
      {Array.from({ length: PLAN_COLS - 1 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={ox + (i + 1) * cw}
          y1={oy}
          x2={ox + (i + 1) * cw}
          y2={oy + h}
          stroke={PALETTE.rule}
          strokeWidth={0.7}
        />
      ))}
      {Array.from({ length: PLAN_ROWS - 1 }, (_, i) => (
        <line
          key={`h${i}`}
          x1={ox}
          y1={oy + (i + 1) * ch}
          x2={ox + w}
          y2={oy + (i + 1) * ch}
          stroke={PALETTE.rule}
          strokeWidth={0.7}
        />
      ))}
      {Object.keys(plan.stamps).map((k) => {
        const cell = Number(k);
        const kind = plan.stamps[k];
        return (
          <g key={k}>{strokeGlyph(STAMPS[kind], cx(cell) - size / 2, cy(cell) - size / 2, size, PALETTE.ink, detail ? 1.5 : 1.1)}</g>
        );
      })}
      {plan.corners.length >= 2 ? (
        plan.corners.length === 4 ? (
          <polygon points={points} fill="none" stroke={PALETTE.teal} strokeWidth={detail ? 2.6 : 1.8} />
        ) : (
          <polyline points={points} fill="none" stroke={PALETTE.teal} strokeWidth={detail ? 2.6 : 1.8} />
        )
      ) : null}
      {plan.corners.map((cell) => (
        <circle key={cell} cx={cx(cell)} cy={cy(cell)} r={detail ? 5 : 3.2} fill={PALETTE.terracotta} />
      ))}
    </g>
  );
}

function gateMarks(count: number, x: number, y: number, h: number, color: string, maxGroups: number): ReactElement {
  const groups = gate(count);
  const shown = groups.slice(0, maxGroups);
  const sp = h * 0.3;
  const advance = sp * 3 + h * 0.5 + 8;
  return (
    <g stroke={color} strokeWidth={1.8} strokeLinecap="round">
      {shown.map((group, gi) => {
        const gx = x + gi * advance;
        return (
          <g key={gi}>
            {Array.from({ length: group.bars }, (_, b) => (
              <line key={b} x1={gx + b * sp} y1={y} x2={gx + b * sp} y2={y + h} />
            ))}
            {group.slash ? <line x1={gx - sp * 0.5} y1={y + h} x2={gx + sp * 3.5} y2={y} /> : null}
          </g>
        );
      })}
      {groups.length > maxGroups ? (
        <text
          x={x + maxGroups * advance + 2}
          y={y + h * 0.82}
          fontSize={h * 0.8}
          fill={PALETTE.faint}
          stroke="none"
          fontFamily="Inter, system-ui, sans-serif"
        >
          &#8230;
        </text>
      ) : null}
    </g>
  );
}

const frame = (h: number): ReactElement => (
  <g>
    <rect x={0} y={0} width={960} height={h} fill={PALETTE.paper} />
    <rect x={16} y={16} width={928} height={h - 32} fill="none" stroke={PALETTE.rule} strokeWidth={1} />
  </g>
);

const label = (text: string, x: number, y: number, anchor: 'start' | 'end' | 'middle' = 'start'): ReactElement => (
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

/* ------------------------------------------------------------- the plates */

function planPlate(plan: SitePlan): ReactElement {
  const drawn = Object.keys(plan.stamps).length;
  return (
    <g>
      {frame(600)}
      {label('SITE PLAN', 40, 54)}
      <text x={40} y={90} fontFamily="Literata, Georgia, serif" fontSize={24} fill={PALETTE.ink}>
        One square of ground
      </text>
      <line x1={40} y1={106} x2={920} y2={106} stroke={PALETTE.rule} strokeWidth={1} />
      {planDrawing(plan, 156, 126, 648, 432, true)}
      <line x1={40} y1={572} x2={920} y2={572} stroke={PALETTE.rule} strokeWidth={1} />
      <text
        x={40}
        y={584}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${drawn} drawn · ${plan.corners.length} of 4 corners`}
      </text>
      <text
        x={920}
        y={584}
        textAnchor="end"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {plan.placed ? `${plan.lat.toFixed(3)}, ${plan.lng.toFixed(3)}` : 'place not fixed'}
      </text>
    </g>
  );
}

interface SheetView {
  readonly date: string;
  readonly weather: WeatherKey;
  readonly plan: SitePlan;
  readonly categories: readonly Category[];
  readonly counts: Readonly<Record<string, number>>;
  readonly ordinal: number;
}

function sheetPlate(view: SheetView): ReactElement {
  const { categories, counts } = view;
  const total = totalMarks(counts);
  const n = Math.max(1, categories.length);
  const rowH = Math.min(56, 410 / n);
  const ranked = abundance(counts, categories.map((c) => c.key)).filter((r) => r.count > 0).slice(0, 5);
  const byKey = new Map(categories.map((c) => [c.key, c]));
  return (
    <g>
      {frame(640)}
      {label('FIELD SHEET', 40, 54)}
      <text
        x={40}
        y={92}
        fontFamily="Literata, Georgia, serif"
        fontSize={26}
        fill={PALETTE.ink}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {formatDate(view.date)}
      </text>
      {strokeGlyph(WEATHER[view.weather], 858, 42, 42, PALETTE.ink, 1.6)}
      {label(WEATHER[view.weather].label.toUpperCase(), 879, 100, 'middle')}
      <line x1={40} y1={116} x2={920} y2={116} stroke={PALETTE.rule} strokeWidth={1} />

      {planDrawing(view.plan, 40, 140, 210, 140, false)}
      {label('THE SQUARE', 40, 300)}
      <text
        x={40}
        y={358}
        fontFamily="Literata, Georgia, serif"
        fontSize={40}
        fill={PALETTE.ink}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {total}
      </text>
      {label('MARKS TODAY', 40, 378)}
      {label('SHARE OF ALL MARKS', 40, 420)}
      {ranked.map((r, i) => {
        const cat = byKey.get(r.key);
        const ry = 432 + i * 24;
        return cat ? (
          <g key={r.key}>
            {markGlyph(cat, 52, ry + 8, 7)}
            <rect x={68} y={ry + 2} width={Math.max(1, r.share * 160)} height={12} fill={cat.color} />
            <text
              x={250}
              y={ry + 12}
              textAnchor="end"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={12}
              fill={PALETTE.faint}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {r.count}
            </text>
          </g>
        ) : null;
      })}

      <line x1={270} y1={140} x2={270} y2={560} stroke={PALETTE.rule} strokeWidth={1} />
      {categories.map((cat, i) => {
        const top = 150 + i * rowH;
        const mid = top + rowH / 2;
        const barH = Math.min(26, rowH * 0.46);
        const count = Math.max(0, counts[cat.key] ?? 0);
        return (
          <g key={cat.key}>
            <line x1={290} y1={top + rowH} x2={916} y2={top + rowH} stroke={PALETTE.rule} strokeWidth={0.7} />
            {markGlyph(cat, 306, mid, Math.min(13, rowH * 0.26))}
            <text
              x={330}
              y={mid + 5}
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={Math.min(16, rowH * 0.32)}
              fill={PALETTE.ink}
            >
              {categoryLabel(cat).slice(0, 16)}
            </text>
            {gateMarks(count, 470, mid - barH / 2, barH, cat.color, 8)}
            <text
              x={916}
              y={mid + 7}
              textAnchor="end"
              fontFamily="Literata, Georgia, serif"
              fontSize={Math.min(22, rowH * 0.42)}
              fill={PALETTE.ink}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {count}
            </text>
          </g>
        );
      })}

      <line x1={40} y1={578} x2={920} y2={578} stroke={PALETTE.rule} strokeWidth={1} />
      <text
        x={40}
        y={602}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${sheetSignature(view)} · sheet ${view.ordinal}`}
      </text>
      <text
        x={920}
        y={602}
        textAnchor="end"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${categories.length} kinds · ${total} marks`}
      </text>
    </g>
  );
}

interface ChangeView {
  readonly sheets: readonly LogSheet[];
  readonly keys: readonly string[];
  readonly cats: ReadonlyMap<string, Category>;
  readonly lineages: readonly Lineage[];
}

function changePlate(view: ChangeView): ReactElement {
  const { sheets, keys, cats, lineages } = view;
  const runs = keys.map((k) => resolvedSeries(sheets, k, lineages));
  const peak = Math.max(1, ...runs.map((r) => r.peak));
  const cols = keys.length <= 2 ? Math.max(1, keys.length) : keys.length <= 9 ? 3 : 4;
  const rows = Math.max(1, Math.ceil(keys.length / cols));
  const areaX = 40;
  const areaY = 128;
  const pw = 880 / cols;
  const ph = 432 / rows;
  const first = sheets.length ? sheets[0].date : '';
  const last = sheets.length ? sheets[sheets.length - 1].date : '';
  return (
    <g>
      {frame(640)}
      {label('CHANGE OVER TIME', 40, 54)}
      <text
        x={40}
        y={92}
        fontFamily="Literata, Georgia, serif"
        fontSize={22}
        fill={PALETTE.ink}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${sheets.length} visits · ${formatDate(first)} to ${formatDate(last)}`}
      </text>
      <line x1={40} y1={110} x2={920} y2={110} stroke={PALETTE.rule} strokeWidth={1} />

      {runs.map((run, i) => {
        const cat = cats.get(run.key);
        if (!cat) return null;
        const px = areaX + (i % cols) * pw;
        const py = areaY + Math.floor(i / cols) * ph;
        const x0 = px + 16;
        const x1 = px + pw - 16;
        const yTop = py + 36;
        const yBot = py + ph - 28;
        const at = (j: number): number =>
          run.points.length === 1 ? (x0 + x1) / 2 : x0 + (j * (x1 - x0)) / (run.points.length - 1);
        const height = (c: number): number => yBot - (c / peak) * (yBot - yTop);
        const line = run.points.map((p, j) => `${at(j)},${height(p.count)}`).join(' ');
        const seamAt = run.seam ? run.points.findIndex((p) => p.date >= (run.seam ?? '')) : -1;
        const lastCount = run.points.length ? run.points[run.points.length - 1].count : 0;
        return (
          <g key={run.key}>
            <rect x={px + 4} y={py + 4} width={pw - 8} height={ph - 8} fill="none" stroke={PALETTE.rule} strokeWidth={0.7} />
            {markGlyph(cat, px + 20, py + 22, 7)}
            <text x={px + 36} y={py + 26} fontFamily="Inter, system-ui, sans-serif" fontSize={11} fill={PALETTE.ink}>
              {categoryLabel(cat).slice(0, 15)}
            </text>
            <text
              x={px + pw - 16}
              y={py + 26}
              textAnchor="end"
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={12}
              fill={PALETTE.ink}
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {lastCount}
            </text>
            <line x1={x0} y1={yBot} x2={x1} y2={yBot} stroke={PALETTE.rule} strokeWidth={1} />
            {run.points.map((_, j) => (
              <line key={j} x1={at(j)} y1={yBot} x2={at(j)} y2={yBot + 4} stroke={PALETTE.rule} strokeWidth={0.7} />
            ))}
            {seamAt >= 0 ? (
              <g>
                <line
                  x1={at(seamAt)}
                  y1={yTop - 6}
                  x2={at(seamAt)}
                  y2={yBot}
                  stroke={PALETTE.faint}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
                {run.children.map((childKey, ci) => {
                  const child = cats.get(childKey);
                  return child ? (
                    <g key={childKey}>{markGlyph(child, at(seamAt) + 12 + ci * 14, yTop + 2, 5)}</g>
                  ) : null;
                })}
              </g>
            ) : null}
            {run.points.length > 1 ? (
              <polyline points={line} fill="none" stroke={cat.color} strokeWidth={1.8} strokeLinejoin="round" />
            ) : null}
            {run.points.map((p, j) => (
              <circle key={j} cx={at(j)} cy={height(p.count)} r={2.4} fill={cat.color} />
            ))}
          </g>
        );
      })}

      <line x1={40} y1={578} x2={920} y2={578} stroke={PALETTE.rule} strokeWidth={1} />
      <text
        x={40}
        y={602}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`every panel measured to the same height · tallest count ${peak}`}
      </text>
      <text
        x={920}
        y={602}
        textAnchor="end"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={13}
        fill={PALETTE.faint}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {`${keys.length} kinds followed`}
      </text>
    </g>
  );
}

/* ------------------------------------------------------------- the bench */

export function Quadrat(): ReactElement {
  const boot = useMemo(() => {
    const held = store.list();
    const site = latestSite(held);
    return { held, site, sheets: sheetsInOrder(held) };
  }, []);

  const svgRef = useRef<SVGSVGElement>(null);
  const [records, setRecords] = useState<readonly QuadratRecord[]>(boot.held);
  const [phase, setPhase] = useState<Phase>(boot.site ? 'count' : 'plan');
  const [plan, setPlan] = useState<SitePlan>(boot.site ? boot.site.plan : EMPTY_PLAN);
  const [tool, setTool] = useState<Tool>('tree');
  const [categories, setCategories] = useState<readonly Category[]>(carryForward(boot.site, boot.sheets));
  const [lineages, setLineages] = useState<readonly Lineage[]>(boot.site ? boot.site.lineages : []);
  const [selected, setSelected] = useState<string | null>(() => {
    const carried = carryForward(boot.site, boot.sheets);
    return carried.length ? carried[0].key : null;
  });
  const [weather, setWeather] = useState<WeatherKey | null>(null);
  const [counts, setCounts] = useState<Readonly<Record<string, number>>>({});
  const [panel, setPanel] = useState<Panel>('none');
  const [draftColor, setDraftColor] = useState<string>(CATEGORY_COLORS[0].hex);
  const [draftShape, setDraftShape] = useState<ShapeKey>('circle');
  const [splitPicks, setSplitPicks] = useState<readonly Category[]>([]);

  const today = isoDate(new Date());
  const sheets = useMemo(() => sheetsInOrder(records), [records]);
  const known = useMemo(() => catalogue(sheets, categories), [sheets, categories]);
  const keys = useMemo(() => seriesKeys(categories, lineages), [categories, lineages]);
  const total = totalMarks(counts);
  const chosen = categories.find((c) => c.key === selected) ?? null;

  const draftSheet: SheetView = {
    date: today,
    weather: weather ?? 'sun',
    plan,
    categories,
    counts,
    ordinal: sheets.length + 1,
  };

  const persistSite = (nextPlan: SitePlan, nextCats: readonly Category[], nextLins: readonly Lineage[]): void => {
    const existing = latestSite(store.list());
    if (existing) store.remove(existing.id);
    store.add(composeSite({ plan: nextPlan, categories: nextCats, lineages: nextLins }));
  };

  const tapCell = (cell: number): void => {
    if (tool === 'corner') {
      setPlan(markCorner(plan, cell));
      pluck(step(4), 0.2);
      return;
    }
    if (tool === 'erase') {
      setPlan(clearCell(plan, cell));
      return;
    }
    setPlan(stampCell(plan, cell, tool));
    pluck(step(-3), 0.2);
  };

  const useOurPlace = (): void => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setPlan((p) => setPlace(p, pos.coords.latitude, pos.coords.longitude)),
      () => undefined,
      { enableHighAccuracy: false, timeout: 8000 },
    );
  };

  const keepSquare = (): void => {
    persistSite(plan, categories, lineages);
    setRecords(store.list());
    setPhase('count');
    say('The square is kept. Now count what is inside it.');
  };

  const pickWeather = (w: WeatherKey): void => {
    setWeather(w);
    say(WEATHER[w].label);
    pluck(step(2), 0.3);
  };

  const pickCategory = (cat: Category): void => {
    setSelected(cat.key);
    say(categoryLabel(cat));
  };

  const stampOne = (): void => {
    if (!selected) return;
    const next = bump(counts, selected, 1);
    setCounts(next);
    const value = next[selected];
    pluck(step(value % 5 === 0 ? -8 : ((value % 5) - 1) * 2), value % 5 === 0 ? 0.5 : 0.25);
    say(String(value));
  };

  const takeOneBack = (): void => {
    if (!selected) return;
    setCounts(bump(counts, selected, -1));
  };

  const addFromThing = (mark: string, name: string): void => {
    const cat = makeCategory({ mark, name, color: draftColor });
    if (panel === 'split') {
      setSplitPicks(splitPicks.some((c) => c.key === cat.key) ? splitPicks : [...splitPicks, cat]);
      return;
    }
    setCategories(addCategory(categories, cat));
    setSelected(cat.key);
    say(name);
  };

  const addFromShape = (): void => {
    const cat = makeCategory({ shape: draftShape, color: draftColor });
    if (panel === 'split') {
      setSplitPicks(splitPicks.some((c) => c.key === cat.key) ? splitPicks : [...splitPicks, cat]);
      return;
    }
    setCategories(addCategory(categories, cat));
    setSelected(cat.key);
    say(categoryLabel(cat));
  };

  const doSplit = (): void => {
    if (!chosen || splitPicks.length < 2) return;
    const result = applySplit(categories, lineages, chosen.key, splitPicks, today);
    setCategories(result.categories);
    setLineages(result.lineages);
    setSelected(result.categories.length ? result.categories[result.categories.length - 1].key : null);
    setSplitPicks([]);
    setPanel('none');
    say(`${categoryLabel(chosen)} is now ${splitPicks.length} kinds.`);
  };

  const keepSheet = (): void => {
    if (!weather || total === 0) return;
    store.add(composeSheet({ date: today, weather, plan, categories, counts, lineages }));
    persistSite(plan, categories, lineages);
    const held = store.list();
    setRecords(held);
    setCounts({});
    setWeather(null);
    setPanel('none');
    if (sheetsInOrder(held).length >= 2) setPhase('change');
    say('Sheet kept in the book.');
  };

  const reset = (): void => {
    if (phase === 'plan') {
      setPlan(boot.site ? boot.site.plan : EMPTY_PLAN);
      return;
    }
    setCounts({});
    setWeather(null);
    setPanel('none');
    setSplitPicks([]);
  };

  const primary = (): void => {
    if (phase === 'plan') keepSquare();
    else if (phase === 'count') keepSheet();
    else setPhase('count');
  };

  const savePicture = async (): Promise<void> => {
    const svg = svgRef.current;
    if (!svg) return;
    if (phase === 'plan') {
      await exportPlate(
        svg,
        { title: 'Site plan', lines: [planSummary(plan)] },
        `quadrat-site-plan-${today}`,
      );
      return;
    }
    if (phase === 'change') {
      await exportPlate(
        svg,
        { title: 'The quadrat, change over time', lines: [changeSummary(sheets, lineages)] },
        `quadrat-change-${today}`,
      );
      return;
    }
    await exportPlate(
      svg,
      {
        title: `Field sheet ${sheetSignature(draftSheet)}`,
        lines: [formatDate(today), sheetSummary(draftSheet)],
      },
      `quadrat-${today}-${sheetSignature(draftSheet)}`,
    );
  };

  const readout = (): string => {
    if (phase === 'plan') return `${plan.corners.length} of 4 corners`;
    if (phase === 'change') return `${sheets.length} visits`;
    return `${total} marks today`;
  };

  const stageLabel = (): string => {
    if (phase === 'plan') return planSummary(plan);
    if (phase === 'change') return changeSummary(sheets, lineages);
    return weather ? sheetSummary(draftSheet) : 'Field sheet. Choose today’s weather, then count.';
  };

  const printTitle =
    phase === 'plan' ? 'Site plan' : phase === 'change' ? 'The quadrat, change over time' : `Field sheet ${sheetSignature(draftSheet)}`;
  const printLine =
    phase === 'plan' ? planSummary(plan) : phase === 'change' ? changeSummary(sheets, lineages) : sheetSummary(draftSheet);

  const primaryLabel = phase === 'plan' ? 'Keep this square' : phase === 'count' ? 'Keep this sheet' : 'Count again';
  const primaryOff = phase === 'plan' ? !planIsSquared(plan) : phase === 'count' ? !weather || total === 0 : false;

  return (
    <section className="bench" aria-labelledby="quadrat-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{QUADRAT_META.eyebrow}</p>
          <h2 id="quadrat-title" className="bench__title">
            {QUADRAT_META.title}
          </h2>
          <p className="bench__note">{QUADRAT_META.note}</p>
        </div>
        <p className="bench__readout">{readout()}</p>
      </div>

      <div className="bench__stage">
        {phase === 'plan' ? (
          <svg ref={svgRef} viewBox="0 0 960 600" role="img" aria-label={stageLabel()}>
            {planPlate(plan)}
          </svg>
        ) : phase === 'change' ? (
          <svg ref={svgRef} viewBox="0 0 960 640" role="img" aria-label={stageLabel()}>
            {changePlate({ sheets, keys, cats: known, lineages })}
          </svg>
        ) : (
          <svg ref={svgRef} viewBox="0 0 960 640" role="img" aria-label={stageLabel()}>
            {sheetPlate(draftSheet)}
          </svg>
        )}
      </div>

      <div className="bench__tray">
        {boot.site || sheets.length ? (
          <>
            <p className="bench__tray-label">The book</p>
            <div className="bench__row">
              <button
                type="button"
                className={`bench-part${phase === 'count' ? ' is-set' : ''}`}
                onClick={() => setPhase('count')}
              >
                Count today
              </button>
              <button
                type="button"
                className={`bench-part${phase === 'plan' ? ' is-set' : ''}`}
                onClick={() => setPhase('plan')}
              >
                The square
              </button>
              <button
                type="button"
                className={`bench-part${phase === 'change' ? ' is-set' : ''}`}
                onClick={() => setPhase('change')}
                disabled={sheets.length < 2}
              >
                What changed
              </button>
            </div>
          </>
        ) : null}

        {phase === 'plan' ? (
          <>
            <p className="bench__tray-label">Draw your patch of ground</p>
            <div className="bench__row">
              {STAMP_KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`bench-part${tool === k ? ' is-set' : ''}`}
                  onClick={() => {
                    setTool(k);
                    say(STAMPS[k].label);
                  }}
                  aria-pressed={tool === k}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    {strokeGlyph(STAMPS[k], 0, 0, 24, PALETTE.ink, 1.4)}
                  </svg>{' '}
                  {STAMPS[k].label}
                </button>
              ))}
              <button
                type="button"
                className={`bench-part${tool === 'corner' ? ' is-set' : ''}`}
                onClick={() => {
                  setTool('corner');
                  say('Mark the four corners of your square');
                }}
                aria-pressed={tool === 'corner'}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 10V4h6M20 14v6h-6" fill="none" stroke={PALETTE.teal} strokeWidth={2} strokeLinecap="round" />
                </svg>{' '}
                Corner
              </button>
              <button
                type="button"
                className={`bench-part${tool === 'erase' ? ' is-set' : ''}`}
                onClick={() => setTool('erase')}
                aria-pressed={tool === 'erase'}
              >
                Rub out
              </button>
              <button type="button" className="bench-part" onClick={useOurPlace}>
                Use where we are
              </button>
            </div>

            <p className="bench__tray-label">The ground, square by square</p>
            {Array.from({ length: PLAN_ROWS }, (_, r) => (
              <div className="bench__row" key={r}>
                {Array.from({ length: PLAN_COLS }, (_, c) => {
                  const cell = r * PLAN_COLS + c;
                  const held = plan.stamps[String(cell)];
                  const isCorner = plan.corners.includes(cell);
                  const what = held ? STAMPS[held].label : isCorner ? 'a corner' : 'empty';
                  return (
                    <button
                      key={cell}
                      type="button"
                      className={`bench-part${held || isCorner ? ' is-set' : ''}`}
                      onClick={() => tapCell(cell)}
                      aria-label={`Row ${r + 1}, square ${c + 1}: ${what}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                        {held ? strokeGlyph(STAMPS[held], 0, 0, 24, PALETTE.ink, 1.5) : null}
                        {isCorner ? <circle cx={12} cy={12} r={4} fill={PALETTE.terracotta} /> : null}
                      </svg>
                    </button>
                  );
                })}
              </div>
            ))}
          </>
        ) : null}

        {phase === 'count' ? (
          <>
            <p className="bench__tray-label">Today&#8217;s weather</p>
            <div className="bench__row">
              {WEATHER_KEYS.map((w) => (
                <button
                  key={w}
                  type="button"
                  className={`bench-part${weather === w ? ' is-set' : ''}`}
                  onClick={() => pickWeather(w)}
                  aria-pressed={weather === w}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
                    {strokeGlyph(WEATHER[w], 0, 0, 24, PALETTE.ink, 1.5)}
                  </svg>{' '}
                  {WEATHER[w].label}
                </button>
              ))}
            </div>

            <p className="bench__tray-label">The kinds you count</p>
            <div className="bench__row">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`bench-part${selected === cat.key ? ' is-set' : ''}`}
                  onClick={() => pickCategory(cat)}
                  aria-pressed={selected === cat.key}
                  aria-label={`Count ${categoryLabel(cat)}, ${counts[cat.key] ?? 0} so far`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                    {markGlyph(cat, 12, 12, 9)}
                  </svg>{' '}
                  {categoryLabel(cat)} <span style={{ fontVariantNumeric: 'tabular-nums' }}>{counts[cat.key] ?? 0}</span>
                </button>
              ))}
              <button
                type="button"
                className={`bench-part${panel === 'make' ? ' is-set' : ''}`}
                onClick={() => {
                  setPanel(panel === 'make' ? 'none' : 'make');
                  setSplitPicks([]);
                }}
              >
                Make a new kind
              </button>
              <button
                type="button"
                className={`bench-part${panel === 'split' ? ' is-set' : ''}`}
                onClick={() => {
                  setPanel(panel === 'split' ? 'none' : 'split');
                  setSplitPicks([]);
                }}
                disabled={!chosen}
              >
                {chosen ? `Split ${categoryLabel(chosen)} in two` : 'Split a kind in two'}
              </button>
            </div>

            <p className="bench__tray-label">
              {chosen ? `Stamp one mark for ${categoryLabel(chosen)}` : 'Choose a kind, then stamp'}
            </p>
            <div className="bench__row">
              <button
                type="button"
                className="bench-part bench-part--wide"
                onClick={stampOne}
                disabled={!chosen}
                aria-label={chosen ? `Stamp one mark for ${categoryLabel(chosen)}` : 'Stamp one mark'}
              >
                <svg width="120" height="26" viewBox="0 0 120 26" aria-hidden="true">
                  {chosen ? gateMarks(Math.min(10, counts[chosen.key] ?? 0), 6, 3, 20, chosen.color, 2) : null}
                </svg>{' '}
                Stamp one
              </button>
              <button type="button" className="bench-part" onClick={takeOneBack} disabled={!chosen}>
                Take one back
              </button>
            </div>

            {panel !== 'none' ? (
              <>
                <p className="bench__tray-label">
                  {panel === 'split' && chosen
                    ? `${categoryLabel(chosen)} becomes these kinds (choose two or more)`
                    : 'Pick a colour, then a drawn thing or a shape'}
                </p>
                <div className="bench__row">
                  {CATEGORY_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      className={`bench-part${draftColor === c.hex ? ' is-set' : ''}`}
                      onClick={() => setDraftColor(c.hex)}
                      aria-label={`Colour: ${c.name}`}
                      aria-pressed={draftColor === c.hex}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                        <rect x={3} y={3} width={18} height={18} fill={c.hex} />
                      </svg>
                    </button>
                  ))}
                  {SHAPE_KEYS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`bench-part${draftShape === s ? ' is-set' : ''}`}
                      onClick={() => setDraftShape(s)}
                      aria-label={`Shape: ${s}`}
                      aria-pressed={draftShape === s}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={shapePath(s, 12, 12, 8)} fill={draftColor} fillRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                  <button type="button" className="bench-part" onClick={addFromShape}>
                    {`Add the ${colorName(draftColor)} ${draftShape}`}
                  </button>
                </div>
                <div className="bench__row">
                  {ALL_INGREDIENTS.map((thing) => (
                    <button
                      key={`${thing.emoji}-${thing.label}`}
                      type="button"
                      className="bench-part"
                      onClick={() => addFromThing(thing.emoji, thing.label)}
                      aria-label={panel === 'split' ? `Split into ${thing.label}` : `Count ${thing.label}`}
                    >
                      <span aria-hidden="true">{thing.emoji}</span>
                    </button>
                  ))}
                </div>
                {panel === 'split' ? (
                  <div className="bench__row">
                    {splitPicks.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        className="bench-part is-set"
                        onClick={() => setSplitPicks(splitPicks.filter((p) => p.key !== c.key))}
                        aria-label={`Take ${categoryLabel(c)} out of the split`}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                          {markGlyph(c, 12, 12, 9)}
                        </svg>{' '}
                        {categoryLabel(c)}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="bench-part bench-part--wide"
                      onClick={doSplit}
                      disabled={splitPicks.length < 2}
                    >
                      {chosen ? `Split ${categoryLabel(chosen)} into ${splitPicks.length} kinds` : 'Split'}
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </>
        ) : null}

        {phase === 'change' ? (
          <>
            <p className="bench__tray-label">Every kind, every visit, measured the same way</p>
            <div className="bench__row">
              {keys.map((k) => {
                const cat = known.get(k);
                if (!cat) return null;
                const run = resolvedSeries(sheets, k, lineages);
                const arrow = run.change > 0 ? 'more than at the start' : run.change < 0 ? 'fewer than at the start' : 'the same as at the start';
                return (
                  <button
                    key={k}
                    type="button"
                    className="bench-part"
                    onClick={() => say(`${categoryLabel(cat)}: ${run.points.length ? run.points[run.points.length - 1].count : 0}, ${arrow}`)}
                    aria-label={`${categoryLabel(cat)}: ${arrow}, highest ${run.peak}`}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                      {markGlyph(cat, 12, 12, 9)}
                    </svg>{' '}
                    {categoryLabel(cat)}{' '}
                    <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {run.change > 0 ? `+${run.change}` : run.change}
                    </span>
                  </button>
                );
              })}
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
        <button type="button" className="bench-btn" onClick={reset}>
          Start again
        </button>
      </div>

      {sheets.length ? (
        <div className="bench__shelf">
          <p className="bench__shelf-title">The run so far</p>
          <ul className="bench__shelf-list">
            {sheets
              .slice()
              .reverse()
              .map((sheet) => (
                <li className="bench__kept" key={sheet.id}>
                  <span className="bench__kept-name">{sheetSignature(sheet)}</span>
                  <span className="bench__kept-meta" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {`${formatDate(sheet.date)} · ${totalMarks(sheet.counts)} marks · ${WEATHER[sheet.weather].label}`}
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

export default Quadrat;
