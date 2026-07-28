import { useMemo, useState } from 'react';
import {
  CLOSING_LINE,
  ROOMS,
  THE_WIDE_VIEW_META,
  accountOf,
  canReturn,
  complementOf,
  cropFrame,
  keptLine,
  markRect,
  recallOrder,
  sentenceFor,
  shapeOf,
} from '../../sel/the-wide-view';
import type { Person, Room } from '../../sel/the-wide-view';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { say } from '../../workshop/say';

/**
 * Three beats: look, say who stayed with you, see the room again.
 *
 * The interface never draws a marker on top of a coordinate any more. Every
 * card is a rectangle cut out of the plate by `cropFrame`, so if a box were
 * wrong the card would be a picture of a bookshelf and anyone would see it on
 * the first screen. The old version drew eight transparent circles over a
 * painting, and seven of them were sitting on nobody.
 *
 * Nothing here is counted against a total, nothing is marked right, and there
 * is no button for filing a child as needing something.
 */

interface Run extends Kept {
  readonly room: string;
  readonly kept: number;
  readonly shape: string;
}
const runs = drawer<Run>('the-wide-view-runs');

const RULE = '#ddd6c4', TERRA = '#9e4b27', FAINT = '#6b6757';
const BASE = import.meta.env.BASE_URL;

/** One person, cut out of the plate. The caption and the accessible name are one string. */
function CropCard({
  person, room, sentence, chosen, onPick,
}: {
  person: Person; room: Room; sentence: string; chosen: boolean; onPick: () => void;
}) {
  const f = cropFrame(person, room, 132, 168);
  return (
    <button
      type="button"
      onClick={onPick}
      aria-pressed={chosen}
      aria-label={sentence}
      style={{
        display: 'block', padding: 'var(--space-2)', width: '9.5rem',
        background: chosen ? 'var(--accent-quiet)' : 'var(--paper-raised)',
        border: `1.5px solid ${chosen ? 'var(--teal)' : RULE}`,
        borderRadius: 3, cursor: 'pointer', textAlign: 'left',
      }}
    >
      <span
        style={{
          display: 'block', position: 'relative', overflow: 'hidden',
          width: f.frameW, height: f.frameH, margin: '0 auto',
          border: `1px solid ${RULE}`, borderRadius: 2, background: 'var(--paper)',
        }}
      >
        <img
          src={`${BASE}games/sel/${room.plate}.png`}
          alt=""
          width={f.imgW}
          height={f.imgH}
          style={{ position: 'absolute', left: f.offsetX, top: f.offsetY, maxWidth: 'none' }}
        />
      </span>
      <span
        aria-hidden="true"
        style={{
          display: 'block', marginTop: 'var(--space-2)', fontFamily: 'var(--font-sans)',
          fontSize: 'var(--step--2)', lineHeight: 1.35, color: 'var(--ink-soft)',
        }}
      >
        {sentence}
      </span>
    </button>
  );
}

export function TheWideView() {
  const [roomId, setRoomId] = useState<string>(ROOMS[0].id);
  const [beat, setBeat] = useState<'glance' | 'recall' | 'return'>('glance');
  const [kept, setKept] = useState<string[]>([]);

  const room: Room = ROOMS.find((r) => r.id === roomId) ?? ROOMS[0];
  const strip = useMemo(() => recallOrder(room), [room]);
  const rest = useMemo(() => complementOf(room, kept), [room, kept]);
  const shape = useMemo(() => shapeOf(room, kept), [room, kept]);
  const mine = useMemo(() => accountOf(room, kept), [room, kept]);
  const theirs = useMemo(() => accountOf(room, rest), [room, rest]);

  const restart = (id: string) => {
    setRoomId(id);
    setBeat('glance');
    setKept([]);
  };

  const pick = (p: Person) => {
    const on = kept.includes(p.id);
    setKept((k) => (on ? k.filter((x) => x !== p.id) : [...k, p.id]));
    if (!on) say(sentenceFor(p));
  };

  const openReturn = () => {
    setBeat('return');
    runs.add({ room: room.id, kept: kept.length, shape: shape.feature ?? 'none' });
    say(shape.line);
  };

  return (
    <section className="bench" aria-labelledby="the-wide-view-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{THE_WIDE_VIEW_META.eyebrow}</p>
          <h2 id="the-wide-view-title" className="bench__title">{THE_WIDE_VIEW_META.title}</h2>
          <p className="bench__note">{THE_WIDE_VIEW_META.note}</p>
        </div>
      </div>

      {beat === 'glance' && (
        <>
          <div className="bench__stage">
            <div style={{ position: 'relative', width: '100%', maxWidth: '54rem', margin: '0 auto' }}>
              <img
                src={`${BASE}games/sel/${room.plate}.png`}
                alt={`${room.place}. Many people, each one doing something different.`}
                style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${RULE}` }}
              />
            </div>
          </div>
          <div className="bench__actions">
            <button
              type="button"
              className="bench-btn bench-btn--primary"
              onClick={() => { setBeat('recall'); say('Which of these stayed with you?'); }}
            >
              I have looked
            </button>
          </div>
        </>
      )}

      {beat === 'recall' && (
        <>
          <div className="bench__stage">
            <p className="bench__note" style={{ marginTop: 0 }}>
              Which of these stayed with you? Every one of them was in the room.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
              {strip.map((p) => (
                <CropCard
                  key={p.id}
                  person={p}
                  room={room}
                  sentence={sentenceFor(p)}
                  chosen={kept.includes(p.id)}
                  onPick={() => pick(p)}
                />
              ))}
            </div>
          </div>
          <p className="bench__readout">{keptLine(kept)}</p>
          <div className="bench__actions">
            <button
              type="button"
              className="bench-btn bench-btn--primary"
              disabled={!canReturn(room, kept)}
              aria-disabled={!canReturn(room, kept)}
              onClick={openReturn}
            >
              Show me the room again
            </button>
            <button type="button" className="bench-btn" onClick={() => { setBeat('glance'); setKept([]); }}>
              Look at it again
            </button>
          </div>
          {!canReturn(room, kept) && (
            <p className="bench__kept-meta" style={{ marginTop: 'var(--space-3)' }}>
              Keep some of them, but not all of them.
            </p>
          )}
        </>
      )}

      {beat === 'return' && (
        <>
          <div className="bench__stage">
            <div style={{ position: 'relative', width: '100%', maxWidth: '54rem', margin: '0 auto' }}>
              <img
                src={`${BASE}games/sel/${room.plate}.png`}
                alt={`${room.place}. Many people, each one doing something different.`}
                style={{ display: 'block', width: '100%', height: 'auto', border: `1px solid ${RULE}` }}
              />
              {room.people.map((p) => {
                const on = kept.includes(p.id);
                return (
                  <span
                    key={p.id}
                    aria-hidden="true"
                    style={{
                      position: 'absolute', ...markRect(p),
                      border: on ? `2px solid ${TERRA}` : `1px dashed ${FAINT}`,
                      background: on ? 'transparent' : 'rgba(244,240,230,0.55)',
                      borderRadius: 2,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <p className="bench__readout">{shape.line}</p>

          <div className="bench__tray">
            <p className="bench__tray-label">The room from the ones you kept</p>
            <ul className="bench__shelf-list" style={{ marginTop: 0 }}>
              {mine.map((line) => (
                <li key={line} className="bench__kept"><span className="bench__kept-meta">{line}</span></li>
              ))}
            </ul>
            <button type="button" className="bench-btn" onClick={() => say(mine.join(' '))}>Read this one out</button>
          </div>

          <div className="bench__tray">
            <p className="bench__tray-label">The room from the ones you did not</p>
            <ul className="bench__shelf-list" style={{ marginTop: 0 }}>
              {theirs.map((line) => (
                <li key={line} className="bench__kept"><span className="bench__kept-meta">{line}</span></li>
              ))}
            </ul>
            <button type="button" className="bench-btn" onClick={() => say(theirs.join(' '))}>Read this one out</button>
          </div>

          <p className="bench__note">{CLOSING_LINE}</p>

          <div className="bench__actions">
            <button type="button" className="bench-btn bench-btn--primary" onClick={() => restart(room.id)}>
              Look at this room again
            </button>
          </div>
        </>
      )}

      <div className="bench__tray" style={{ marginTop: 'var(--space-4)' }}>
        <p className="bench__tray-label">Another room</p>
        {ROOMS.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`bench-part${r.id === room.id ? ' is-set' : ''}`}
            onClick={() => { restart(r.id); say(r.place); }}
          >
            {r.place}
          </button>
        ))}
      </div>
    </section>
  );
}

export default TheWideView;
