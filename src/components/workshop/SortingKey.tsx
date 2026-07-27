import { useMemo, useRef, useState } from 'react';
import {
  PLAIN_MARK, SORTINGKEY_META, SOURCE_STAMPS, TRAY_SIZES,
  averageRun, buildTray, cardsIn, couplets, describeKey, forkCount,
  group, layoutTree, longestRun, nodeAt, openGroups, pathKey, rackFor, splitAt,
} from '../../workshop/sorting-key';
import type { Card, KeyNode, Mark, Path, SourceId } from '../../workshop/sorting-key';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptKey extends Kept {
  readonly source: SourceId;
  readonly size: number;
  readonly root: KeyNode;
  readonly title: string;
}
const rack = drawer<KeptKey>('sorting-key');

const INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4', PAPER = '#f4f0e6';
const TEAL = '#2a5957', TERRA = '#9e4b27';

export function SortingKey() {
  const [source, setSource] = useState<SourceId>('accounts');
  const [size, setSize] = useState<number>(8);
  const [tray, setTray] = useState<Card[]>(() => buildTray('accounts', 8));
  const [root, setRoot] = useState<KeyNode>(() => group(buildTray('accounts', 8).map((c) => c.id)));
  const [side, setSide] = useState<Record<string, 'a' | 'b'>>({});
  const [mark, setMark] = useState<Mark>(PLAIN_MARK);
  const [kept, setKept] = useState<KeptKey[]>(() => rack.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const open = useMemo(() => openGroups(root), [root]);
  const workingPath: Path | null = open.length > 0 ? open[0] : null;
  const workingNode = workingPath ? nodeAt(root, workingPath) : null;
  const working = workingNode && workingNode.kind === 'group' ? workingNode.cards : [];
  const marks = useMemo(() => [...rackFor(source), PLAIN_MARK], [source]);
  const layout = useMemo(() => layoutTree(root), [root]);
  const sheet = useMemo(() => couplets(root), [root]);
  const byId = useMemo(() => new Map(tray.map((c) => [c.id, c])), [tray]);
  const label = (id: string) => byId.get(id)?.label ?? id;

  const fresh = (s: SourceId, n: number) => {
    const t = buildTray(s, n);
    setTray(t); setRoot(group(t.map((c) => c.id))); setSide({}); setMark(PLAIN_MARK);
  };

  const toggle = (id: string) => {
    setSide((s) => ({ ...s, [id]: s[id] === 'a' ? 'b' : 'a' }));
    say(label(id));
  };

  const aCards = working.filter((id) => (side[id] ?? 'a') === 'a');
  const bCards = working.filter((id) => (side[id] ?? 'a') === 'b');
  const canSplit = workingPath !== null && aCards.length > 0 && bCards.length > 0;

  const doSplit = () => {
    if (!workingPath || !canSplit) return;
    const next = splitAt(root, workingPath, mark, aCards, bCards);
    if (!next) return;
    setRoot(next); setSide({}); setMark(PLAIN_MARK);
    say(`${mark.a.word}, and ${mark.b.word}`);
  };

  const title = SOURCE_STAMPS.find((s) => s.id === source)?.title ?? 'a tray';
  const done = open.length === 0;
  const lines = [
    describeKey(root, title),
    `${forkCount(root)} questions; longest run ${longestRun(root)}; average run ${averageRun(root).toFixed(1)}`,
  ];

  // -------------------------------------------------------------- the plate
  const slotW = 96, rowH = 74;
  const W = Math.max(560, layout.spread * slotW + 80);
  const H = Math.max(260, (layout.depth + 1) * rowH + 90);

  return (
    <section className="bench" aria-labelledby="sorting-key-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{SORTINGKEY_META.eyebrow}</p>
          <h2 id="sorting-key-title" className="bench__title">{SORTINGKEY_META.title}</h2>
          <p className="bench__note">{SORTINGKEY_META.note}</p>
        </div>
        <p className="bench__readout">{cardsIn(root).length - open.length}/{cardsIn(root).length} told apart</p>
      </div>

      <div className="bench__stage">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img"
          aria-label={`A key to ${title}: ${forkCount(root)} questions, ${open.length} piles still to tell apart.`}>
          <rect x="0" y="0" width={W} height={H} fill={PAPER} />
          <text x="24" y="30" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            A KEY TO {title.toUpperCase()}
          </text>
          {layout.nodes.map((n) => {
            const x = 40 + n.x * slotW, y = 56 + n.depth * rowH;
            const parent = layout.nodes.find((p) => pathKey(p.path) === pathKey(n.path.slice(0, -1)));
            const px = parent ? 40 + parent.x * slotW : x, py = parent ? 56 + parent.depth * rowH : y;
            return (
              <g key={pathKey(n.path)}>
                {parent && (
                  <path d={`M ${px + 30} ${py + 26} V ${y - 6} H ${x + 30}`} fill="none" stroke={RULE} strokeWidth="1.2" />
                )}
                {n.kind === 'fork' && n.mark ? (
                  <>
                    <circle cx={x + 30} cy={y + 12} r="5" fill={INK} />
                    <text x={x + 42} y={y + 10} fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
                      {n.mark.a.word}
                    </text>
                    <text x={x + 42} y={y + 24} fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}>
                      {n.mark.b.word}
                    </text>
                  </>
                ) : (
                  <>
                    <rect x={x} y={y} width="60" height="34" fill="none"
                      stroke={n.kind === 'leaf' ? TEAL : TERRA} strokeWidth="1.2" />
                    <text x={x + 30} y={y + 22} textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill={INK}>
                      {n.kind === 'leaf' ? label(n.cardIds[0]).slice(0, 10) : `${n.cardIds.length} left`}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {!done && (
        <>
          <div className="bench__tray">
            <p className="bench__tray-label">
              Tap each card to put it on one side or the other. {aCards.length} here, {bCards.length} there.
            </p>
            {working.map((id) => {
              const card = byId.get(id);
              return (
                <button key={id} type="button"
                  className={`bench-part${(side[id] ?? 'a') === 'b' ? ' is-set' : ''}`}
                  onClick={() => toggle(id)}
                  aria-pressed={(side[id] ?? 'a') === 'b'}>
                  {card?.emoji ? `${card.emoji} ` : ''}{card?.label ?? id}
                </button>
              );
            })}
          </div>

          <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
            <p className="bench__tray-label">What tells the two sides apart?</p>
            {marks.map((m) => (
              <button key={`${m.a.glyph}-${m.b.glyph}`} type="button"
                className={`bench-part${m === mark ? ' is-set' : ''}`}
                onClick={() => { setMark(m); say(`${m.a.word} against ${m.b.word}`); }}>
                {m.a.word} / {m.b.word}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" aria-disabled={!canSplit} onClick={doSplit}>
          Split this pile
        </button>
        <button type="button" className="bench-btn"
          onClick={() => { const k = rack.add({ source, size, root, title }); setKept(rack.list()); say('kept'); void k; }}
          aria-disabled={forkCount(root) === 0}>
          Keep this key
        </button>
        <button type="button" className="bench-btn"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: `A key to ${title}`, lines }, 'sorting-key'); }}>
          Save as a picture
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={() => fresh(source, size)}>Start again</button>
      </div>

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">A different tray</p>
        {SOURCE_STAMPS.map((s) => (
          <button key={s.id} type="button" className={`bench-part${s.id === source ? ' is-set' : ''}`}
            onClick={() => { setSource(s.id); fresh(s.id, size); }}>{s.title}</button>
        ))}
        {TRAY_SIZES.map((n) => (
          <button key={n} type="button" className={`bench-part${n === size ? ' is-set' : ''}`}
            onClick={() => { setSize(n); fresh(source, n); }}>{n} cards</button>
        ))}
      </div>

      {sheet.length > 0 && (
        <div className="bench__shelf">
          <p className="bench__shelf-title">The key, as couplets</p>
          <ol className="bench__shelf-list" style={{ display: 'block' }}>
            {sheet.map((c) => (
              <li key={c.number} className="bench__kept-meta" style={{ display: 'block', marginTop: '0.35rem' }}>
                {c.number}a {c.leads[0].contrast.word} &rarr;{' '}
                {c.leads[0].to.kind === 'leaf' ? label(c.leads[0].to.cardId)
                  : c.leads[0].to.kind === 'fork' ? c.leads[0].to.number : `${c.leads[0].to.count} left`}
                {'  ·  '}
                {c.number}b {c.leads[1].contrast.word} &rarr;{' '}
                {c.leads[1].to.kind === 'leaf' ? label(c.leads[1].to.cardId)
                  : c.leads[1].to.kind === 'fork' ? c.leads[1].to.number : `${c.leads[1].to.count} left`}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Kept keys</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing kept yet.</li>}
          {kept.slice(-6).reverse().map((k) => (
            <li key={k.id} className="bench__kept">
              <button type="button" className="bench-btn"
                onClick={() => { setSource(k.source); setSize(k.size); setTray(buildTray(k.source, k.size)); setRoot(k.root); setSide({}); }}>
                <span className="bench__kept-name">{k.title}</span>{' '}
                <span className="bench__kept-meta">{forkCount(k.root)} questions</span>
              </button>
              <button type="button" className="bench-btn" aria-label="Discard"
                onClick={() => { rack.remove(k.id); setKept(rack.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">A key to {title}</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default SortingKey;
