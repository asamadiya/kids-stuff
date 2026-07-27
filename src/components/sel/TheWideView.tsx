import { useMemo, useRef, useState } from 'react';
import { ROOMS, THE_WIDE_VIEW_META, coverage, filedLine } from '../../sel/the-wide-view';
import type { Figure, Room } from '../../sel/the-wide-view';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface Marked extends Kept {
  readonly room: string;
  readonly figure: string;
  readonly moment: string;
}
const notes = drawer<Marked>('the-wide-view-notes');
const looked = drawer<Marked>('the-wide-view-looked');

const PAPER = '#f4f0e6', INK = '#22211b', FAINT = '#6b6757', RULE = '#ddd6c4', TERRA = '#9e4b27';
const BASE = import.meta.env.BASE_URL;

export function TheWideView() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [open, setOpen] = useState<Figure | null>(null);
  const [seen, setSeen] = useState<string[]>(() => looked.list().map((m) => `${m.room}:${m.figure}`));
  const [filed, setFiled] = useState<Marked[]>(() => notes.list());
  const svgRef = useRef<SVGSVGElement>(null);

  const room: Room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const seenHere = useMemo(
    () => room.figures.filter((f) => seen.includes(`${room.id}:${f.id}`)).map((f) => f.id),
    [room, seen],
  );
  const filedHere = filed.filter((m) => m.room === room.id);

  const look = (f: Figure) => {
    setOpen(f);
    const key = `${room.id}:${f.id}`;
    if (!seen.includes(key)) {
      setSeen((s) => [...s, key]);
      looked.add({ room: room.id, figure: f.id, moment: f.moment });
    }
    say(f.moment);
  };

  const file = (f: Figure) => {
    if (filedHere.some((m) => m.figure === f.id)) return;
    notes.add({ room: room.id, figure: f.id, moment: f.moment });
    setFiled(notes.list());
    say('Marked.');
  };

  return (
    <section className="bench" aria-labelledby="the-wide-view-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{THE_WIDE_VIEW_META.eyebrow}</p>
          <h2 id="the-wide-view-title" className="bench__title">{THE_WIDE_VIEW_META.title}</h2>
          <p className="bench__note">{THE_WIDE_VIEW_META.note}</p>
        </div>
        <p className="bench__readout">{coverage(room, seenHere)}</p>
      </div>

      <div className="bench__stage">
        <div style={{ position: 'relative', width: '100%', maxWidth: '46rem' }}>
          <img
            src={`${BASE}games/sel/${room.plate}.png`}
            alt={`${room.place}. Many people, each one doing something different.`}
            style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${RULE}` }}
          />
          {room.figures.map((f) => {
            const isSeen = seenHere.includes(f.id);
            const isFiled = filedHere.some((m) => m.figure === f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => look(f)}
                aria-label={`Look at the person ${Math.round(f.x * 100)} percent across`}
                aria-pressed={open?.id === f.id}
                style={{
                  position: 'absolute',
                  left: `calc(${f.x * 100}% - 22px)`,
                  top: `calc(${f.y * 100}% - 22px)`,
                  width: 44, height: 44, borderRadius: '50%',
                  border: `1.5px solid ${isFiled ? TERRA : isSeen ? INK : 'rgba(34,33,27,0.28)'}`,
                  background: isSeen ? 'rgba(244,240,230,0.22)' : 'rgba(244,240,230,0.10)',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>
      </div>

      {open && (
        <div className="bench__tray">
          <p className="bench__tray-label">This one</p>
          <p className="bench__note" style={{ flexBasis: '100%' }}>{open.moment}</p>
          <button type="button" className="bench-btn" onClick={() => say(open.moment)}>Read it out</button>
          <button
            type="button"
            className={`bench-part${filedHere.some((m) => m.figure === open.id) ? ' is-set' : ''}`}
            onClick={() => file(open)}
          >
            Mark: this one needs something
          </button>
          <button type="button" className="bench-btn" onClick={() => setOpen(null)}>Close</button>
        </div>
      )}

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">Another room</p>
        {ROOMS.map((r) => (
          <button key={r.id} type="button" className={`bench-part${r.id === room.id ? ' is-set' : ''}`}
            onClick={() => { setRoomId(r.id); setOpen(null); say(r.place); }}>{r.place}</button>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary"
          onClick={() => { if (svgRef.current) void exportPlate(svgRef.current, { title: room.place, lines: [coverage(room, seenHere), filedLine(room, filedHere.map((m) => m.figure))] }, 'wide-view'); }}>
          Save my field notes
        </button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
      </div>

      <div className="bench__shelf">
        <p className="bench__shelf-title">Field notes</p>
        <p className="bench__kept-meta">{filedLine(room, filedHere.map((m) => m.figure))}</p>
        <ul className="bench__shelf-list">
          {filedHere.map((m) => (
            <li key={m.id} className="bench__kept">
              <span className="bench__kept-meta">{m.moment}</span>
              <button type="button" className="bench-btn" aria-label="Take this note off"
                onClick={() => { notes.remove(m.id); setFiled(notes.list()); }}>×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* the exported plate: ruled paper carrying his notes, not the photograph */}
      <svg ref={svgRef} viewBox="0 0 720 460" style={{ display: 'none' }} aria-hidden="true">
        <rect x="0" y="0" width="720" height="460" fill={PAPER} />
        <text x="28" y="44" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>FIELD NOTES</text>
        <text x="28" y="76" fontFamily="Literata, Georgia, serif" fontSize="22" fill={INK}>{room.place}</text>
        <line x1="28" y1="96" x2="692" y2="96" stroke={RULE} strokeWidth="1" />
        <text x="28" y="122" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>{coverage(room, seenHere)}</text>
        {filedHere.slice(0, 8).map((m, i) => (
          <g key={m.id}>
            <circle cx="34" cy={154 + i * 34} r="3.5" fill={TERRA} />
            <text x="50" y={159 + i * 34} fontFamily="Inter, sans-serif" fontSize="13" fill={INK}>
              {m.moment.length > 78 ? `${m.moment.slice(0, 78)}…` : m.moment}
            </text>
          </g>
        ))}
      </svg>

      <div className="plate-print">
        <p className="plate-print__title">{room.place}</p>
        <p className="plate-print__line">{coverage(room, seenHere)}</p>
        {filedHere.map((m) => <p key={m.id} className="plate-print__line">{m.moment}</p>)}
      </div>
    </section>
  );
}

export default TheWideView;
