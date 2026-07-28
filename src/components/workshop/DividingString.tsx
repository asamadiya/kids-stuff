import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BASE_HZ, COARSE_STEP, DIVIDING_STRING_META, FINE_STEP, MAX_LENGTH, MIN_LENGTH, SIMPLE_RATIOS,
  addNote, beatsPerSecond, bestFraction, cardLines, cardSummary, clampLength, closestRatio,
  combinedWave, describePosition, describeStud, dropLastNote, fractionText, frequencyAt, makeStud,
  movePosition, nearestRatio, phraseInWords, phraseStops, pinStud, plankMark, prunePhrase,
  readingText, repeatAfter, spokenFraction, unpinStud,
} from '../../workshop/dividing-string';
import type { Stud } from '../../workshop/dividing-string';
import { drawer } from '../../workshop/drawer';
import type { Kept } from '../../workshop/drawer';
import { audioAvailable, drone, pluck } from '../../workshop/tone';
import { say } from '../../workshop/say';
import { exportPlate, printPlate } from '../../workshop/plate';

interface KeptString extends Kept {
  readonly studs: readonly Stud[];
  readonly phrase: readonly string[];
}
const shelf = drawer<KeptString>('dividing-string');

/* Paper, ink and hairlines. Colour identifies; it never decorates. */
const PAPER = '#f4f0e6';
const RAISED = '#fbf9f4';
const SUNKEN = '#eae4d5';
const INK = '#22211b';
const FAINT = '#6b6757';
const RULE = '#ddd6c4';
const TERRA = '#9e4b27';
const OCHRE = '#8a6416';
const TEAL = '#2a5957';
const SLATE = '#3c566f';

const VIEW_W = 760;
const VIEW_H = 540;
const X0 = 64;
const X1 = 704;
const SPAN = X1 - X0;
const STRING_Y = 118;

/* The bar that draws the current fraction. */
const BAR_X = 64;
const BAR_Y = 232;
const BAR_W = 220;
const BAR_H = 36;

/* The window the two notes are drawn in, measured in turns of the open string. */
const WAVE_X = 380;
const WAVE_W = 324;
const WAVE_Y = 262;
const WAVE_A = 34;
const TURNS = 6;

/* One note of the replayed phrase, and how long the tool may sound unattended. */
const NOTE_MS = 460;
const IDLE_MS = 25000;

const xAt = (p: number): number => X0 + clampLength(p) * SPAN;
const num2 = (n: number): string => n.toFixed(1);

export function DividingString() {
  const [position, setPosition] = useState(0.75);
  const [studs, setStuds] = useState<readonly Stud[]>([]);
  const [phrase, setPhrase] = useState<readonly string[]>([]);
  const [playhead, setPlayhead] = useState(-1);
  const [dragging, setDragging] = useState(false);
  // Starts ON. The instrument's entire claim — that pitch is the reciprocal of
  // length — is something you HEAR, and it was hidden behind a toggle sitting
  // fourth in the actions row. A first-timer dragged the bridge, heard nothing
  // and concluded the thing was broken.
  const [sound, setSound] = useState(true);
  const [kept, setKept] = useState<readonly KeptString[]>(() => shelf.list());
  const [canSound] = useState(() => audioAvailable());
  const svgRef = useRef<SVGSVGElement>(null);

  const openRef = useRef<(() => void) | null>(null);
  const stoppedRef = useRef<(() => void) | null>(null);
  const timersRef = useRef<number[]>([]);
  const idleRef = useRef<number | null>(null);

  /* ------------------------------------------------------------------ sound */

  const clearTimers = useCallback(() => {
    for (const t of timersRef.current) window.clearTimeout(t);
    timersRef.current = [];
  }, []);

  const silenceStopped = useCallback(() => {
    stoppedRef.current?.();
    stoppedRef.current = null;
  }, []);

  /** Everything off: both oscillators, every pending note, and the idle watch. */
  const hush = useCallback(() => {
    clearTimers();
    silenceStopped();
    openRef.current?.();
    openRef.current = null;
    if (idleRef.current !== null) {
      window.clearTimeout(idleRef.current);
      idleRef.current = null;
    }
    setPlayhead(-1);
    setSound(false);
  }, [clearTimers, silenceStopped]);

  /* A tool left alone must fall silent by itself, and must never leak on unmount. */
  useEffect(() => hush, [hush]);

  const touch = useCallback(() => {
    if (idleRef.current !== null) window.clearTimeout(idleRef.current);
    idleRef.current = window.setTimeout(hush, IDLE_MS);
  }, [hush]);

  const soundStopped = useCallback(
    (p: number) => {
      silenceStopped();
      stoppedRef.current = drone(frequencyAt(BASE_HZ, p), 'triangle');
    },
    [silenceStopped],
  );

  /* ---------------------------------------------------------------- reading */

  const locked = useMemo(() => nearestRatio(position), [position]);
  const shown = useMemo(
    () => (locked ? { num: locked.num, den: locked.den } : bestFraction(position)),
    [locked, position],
  );
  const notes = useMemo(() => phraseStops(phrase, studs), [phrase, studs]);
  const lines = useMemo(
    () => cardLines({ studs, phrase, base: BASE_HZ }),
    [studs, phrase],
  );
  const wobble = useMemo(
    () => Math.round(beatsPerSecond(BASE_HZ, position, closestRatio(position))),
    [position],
  );
  const trace = useMemo(() => {
    const wave = combinedWave(1 / clampLength(position), 241, TURNS);
    const last = wave.length - 1;
    return wave
      .map((y, i) => `${num2(WAVE_X + (i / last) * WAVE_W)},${num2(WAVE_Y - y * WAVE_A)}`)
      .join(' ');
  }, [position]);

  /* ---------------------------------------------------------------- working */

  /** Settling the bridge: this is the only place a new stopped tone is started. */
  const commit = useCallback(
    (next: number) => {
      const p = clampLength(next);
      setPosition(p);
      if (sound) {
        soundStopped(p);
        touch();
      }
      const stop = nearestRatio(p);
      say(stop ? `${spokenFraction(stop)}. ${stop.name}.` : `about ${spokenFraction(bestFraction(p))}`);
    },
    [sound, soundStopped, touch],
  );

  const positionFrom = useCallback((clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const box = svg.getBoundingClientRect();
    if (!box.width) return 0;
    return clampLength(((clientX - box.left) / box.width * VIEW_W - X0) / SPAN);
  }, []);

  const onBridgeKey = (e: React.KeyboardEvent<HTMLButtonElement>): void => {
    const step = e.shiftKey ? COARSE_STEP : FINE_STEP;
    let next: number | null = null;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = movePosition(position, -step);
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = movePosition(position, step);
    else if (e.key === 'Home') next = MIN_LENGTH;
    else if (e.key === 'End') next = MAX_LENGTH;
    if (next === null) return;
    e.preventDefault();
    commit(next);
  };

  const toggleSound = (): void => {
    if (!canSound) return;
    if (sound) {
      hush();
      return;
    }
    openRef.current = drone(BASE_HZ, 'sine');
    setSound(true);
    soundStopped(position);
    touch();
  };

  const pin = (): void => {
    const stud = makeStud(position);
    const next = pinStud(studs, stud);
    if (next === studs) {
      say(studs.some((s) => s.key === stud.key) ? 'that one is already on the rack' : 'the rack is full');
      return;
    }
    setStuds(next);
    if (sound) pluck(frequencyAt(BASE_HZ, stud.position), 0.5);
    say(`pinned ${spokenFraction(stud)}${stud.name ? `, ${stud.name}` : ''}`);
  };

  const unpin = (key: string): void => {
    const next = unpinStud(studs, key);
    setStuds(next);
    setPhrase((p) => prunePhrase(p, next));
  };

  const tapStud = (s: Stud): void => {
    setPhrase((p) => addNote(p, s.key));
    if (sound) {
      pluck(frequencyAt(BASE_HZ, s.position), 0.5);
      touch();
    }
    say(spokenFraction(s));
  };

  /** Replay is visual first: the dots light in order whether or not there is sound. */
  const playPhrase = (): void => {
    if (!notes.length) return;
    clearTimers();
    silenceStopped();
    setPlayhead(-1);
    notes.forEach((s, i) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setPlayhead(i);
          if (sound) pluck(frequencyAt(BASE_HZ, s.position), 0.5);
        }, i * NOTE_MS),
      );
    });
    timersRef.current.push(
      window.setTimeout(() => setPlayhead(-1), notes.length * NOTE_MS + 320),
    );
    if (sound) touch();
  };

  const keep = (): void => {
    if (!studs.length) return;
    shelf.add({ studs, phrase });
    setKept(shelf.list());
    say('kept on the shelf');
  };

  const load = (k: KeptString): void => {
    setStuds(k.studs);
    setPhrase(prunePhrase(k.phrase, k.studs));
    setPlayhead(-1);
    say('loaded');
  };

  const startAgain = (): void => {
    hush();
    setStuds([]);
    setPhrase([]);
    setPosition(0.75);
  };

  const savePicture = (): void => {
    if (!svgRef.current) return;
    void exportPlate(svgRef.current, { title: DIVIDING_STRING_META.title, lines }, 'dividing-string');
  };

  /* ---------------------------------------------------------------- drawing */

  const bx = xAt(position);
  const cell = BAR_W / shown.den;
  const stampColor = locked ? TEAL : OCHRE;
  const trueMark = BAR_X + clampLength(position) * BAR_W;
  const repeatX = locked ? WAVE_X + (repeatAfter(locked) / TURNS) * WAVE_W : 0;
  const hz = Math.round(frequencyAt(BASE_HZ, position));

  return (
    <section className="bench" aria-labelledby="dividing-string-title">
      <div className="bench__head">
        <div>
          <p className="bench__eyebrow">{DIVIDING_STRING_META.eyebrow}</p>
          <h2 id="dividing-string-title" className="bench__title">{DIVIDING_STRING_META.title}</h2>
          <p className="bench__note">{DIVIDING_STRING_META.note}</p>
        </div>
        <p className="bench__readout">{readingText(position)}</p>
      </div>

      <div className="bench__stage">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label={`${describePosition(position)} ${cardSummary({ studs, phrase, base: BASE_HZ })}`}
        >
          <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill={PAPER} />

          {/* ---------------------------------------------------- the string */}
          <text x={X0} y="38" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            THE STRING
          </text>
          <text x={(X0 + X1) / 2} y="60" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="12" fill={FAINT}>
            the whole string
          </text>
          <line x1={X0} y1="70" x2={X1} y2="70" stroke={RULE} strokeWidth="1" />
          <line x1={X0} y1="64" x2={X0} y2="76" stroke={RULE} strokeWidth="1" />
          <line x1={X1} y1="64" x2={X1} y2="76" stroke={RULE} strokeWidth="1" />

          {/* the simple divisions, faint, so they can be hunted for */}
          {SIMPLE_RATIOS.map((s) => {
            const x = xAt(s.position);
            const on = locked !== null && locked.num === s.num && locked.den === s.den;
            return (
              <g key={`${s.num}-${s.den}`}>
                <text
                  x={x} y="98" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10"
                  fill={on ? TEAL : FAINT} style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {fractionText(s)}
                </text>
                <line x1={x} y1="104" x2={x} y2={STRING_Y} stroke={on ? TEAL : RULE} strokeWidth={on ? 1.8 : 1} />
              </g>
            );
          })}

          {/* the string itself: what sounds, and what the bridge has damped */}
          <line x1={X0} y1={STRING_Y} x2={bx} y2={STRING_Y} stroke={INK} strokeWidth="2.6" />
          <line
            x1={bx} y1={STRING_Y} x2={X1} y2={STRING_Y}
            stroke={RULE} strokeWidth="1.4" strokeDasharray="4 4"
          />
          <rect x={X0 - 5} y={STRING_Y - 16} width="5" height="32" fill={INK} />
          <rect x={X1} y={STRING_Y - 16} width="5" height="32" fill={INK} />

          {/* the movable bridge */}
          <path
            d={`M${num2(bx)} ${STRING_Y}L${num2(bx - 12)} ${STRING_Y + 30}L${num2(bx + 12)} ${STRING_Y + 30}Z`}
            fill={locked ? TEAL : PAPER} stroke={locked ? TEAL : INK} strokeWidth="1.5"
          />
          <line x1={bx} y1={STRING_Y + 30} x2={bx} y2="160" stroke={stampColor} strokeWidth="1" />

          {/* the sounding length, braced and named */}
          <line x1={X0} y1="166" x2={bx} y2="166" stroke={stampColor} strokeWidth="1.4" />
          <line x1={X0} y1="160" x2={X0} y2="172" stroke={stampColor} strokeWidth="1.4" />
          <line x1={bx} y1="160" x2={bx} y2="172" stroke={stampColor} strokeWidth="1.4" />
          <text
            x={(X0 + bx) / 2} y="188" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="13"
            fill={INK} style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {locked ? fractionText(locked) : `about ${fractionText(shown)}`}
          </text>
          <text
            x={X1} y="188" textAnchor="end" fontFamily="Inter, sans-serif" fontSize="12" fill={FAINT}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {hz} shakes a second
          </text>

          {/* ------------------------------------------------ the fraction */}
          <rect x="56" y="200" width="296" height="128" fill={SUNKEN} stroke={RULE} strokeWidth="1" />
          <text x={BAR_X} y="218" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            HOW MUCH OF THE STRING
          </text>
          {Array.from({ length: shown.den }, (_, i) => (
            <rect
              key={i} x={BAR_X + i * cell} y={BAR_Y} width={cell} height={BAR_H}
              fill={i < shown.num ? stampColor : RAISED}
              fillOpacity={i < shown.num ? 0.85 : 1}
              stroke={RULE} strokeWidth="0.8"
            />
          ))}
          <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} fill="none" stroke={INK} strokeWidth="1.2" />
          {!locked && (
            <g>
              <path
                d={`M${num2(trueMark - 5)} ${BAR_Y - 14}L${num2(trueMark + 5)} ${BAR_Y - 14}L${num2(trueMark)} ${BAR_Y - 5}Z`}
                fill={INK}
              />
              <line x1={trueMark} y1={BAR_Y - 4} x2={trueMark} y2={BAR_Y + BAR_H + 4} stroke={INK} strokeWidth="1.4" />
            </g>
          )}
          <text
            x="326" y="254" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fill={INK}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {shown.num}
          </text>
          <line x1="306" y1="262" x2="346" y2="262" stroke={INK} strokeWidth="1.4" />
          <text
            x="326" y="286" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="22" fill={INK}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {shown.den}
          </text>
          <text x={BAR_X} y="314" fontFamily="Inter, sans-serif" fontSize="14" fill={locked ? TEAL : FAINT}>
            {locked ? locked.name : 'between the simple places'}
          </text>

          {/* --------------------------------------- the two notes together */}
          <rect x="372" y="200" width="332" height="128" fill={SUNKEN} stroke={RULE} strokeWidth="1" />
          <text x={WAVE_X} y="218" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            THE TWO NOTES TOGETHER
          </text>
          <line x1={WAVE_X} y1={WAVE_Y} x2={WAVE_X + WAVE_W} y2={WAVE_Y} stroke={RULE} strokeWidth="1" />
          <polyline points={trace} fill="none" stroke={SLATE} strokeWidth="1.4" />
          {locked && repeatAfter(locked) <= TURNS && (
            <line x1={repeatX} y1="226" x2={repeatX} y2="300" stroke={TEAL} strokeWidth="1.2" strokeDasharray="4 3" />
          )}
          <text x={WAVE_X} y="314" fontFamily="Inter, sans-serif" fontSize="14" fill={locked ? TEAL : OCHRE}>
            {locked
              ? `the shape comes round every ${repeatAfter(locked)} ${repeatAfter(locked) === 1 ? 'turn' : 'turns'}`
              : `it never comes round — about ${wobble} ${wobble === 1 ? 'wobble' : 'wobbles'} a second`}
          </text>

          {/* -------------------------------------------------- the peg rack */}
          <text x={X0} y="356" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            THE PEG RACK
          </text>
          <line x1={X0} y1="404" x2={X1} y2="404" stroke={RULE} strokeWidth="1.5" />
          {studs.length === 0 && (
            <text x={X0} y="392" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
              Nothing pinned yet.
            </text>
          )}
          {studs.map((s) => {
            const x = xAt(s.position);
            return (
              <g key={s.key}>
                <line x1={x} y1="376" x2={x} y2="404" stroke={INK} strokeWidth="1" />
                <circle cx={x} cy="374" r="6" fill={TERRA} />
                <text
                  x={x} y="422" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="11" fill={FAINT}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {fractionText(s)}
                </text>
              </g>
            );
          })}

          {/* ---------------------------------------------------- the phrase */}
          <text x={X0} y="456" fontFamily="Inter, sans-serif" fontSize="13" letterSpacing="1.6" fill={FAINT}>
            THE PHRASE
          </text>
          <line x1={X0} y1="520" x2={X1} y2="520" stroke={RULE} strokeWidth="1.5" />
          {notes.length === 0 && (
            <text x={X0} y="500" fontFamily="Inter, sans-serif" fontSize="13" fill={FAINT}>
              Tap your studs to write one.
            </text>
          )}
          {notes.map((s, i) => {
            const x = X0 + ((i + 0.5) * SPAN) / notes.length;
            const y = 512 - ((s.ratio - 1) / 3) * 44;
            const on = i === playhead;
            return (
              <g key={`${s.key}-${i}`}>
                <line x1={x} y1={y} x2={x} y2="520" stroke={RULE} strokeWidth="1" />
                <circle cx={x} cy={y} r={on ? 8 : 5} fill={on ? TEAL : INK} />
              </g>
            );
          })}

          {/* the whole string band is draggable; drawn last so it catches the pointer */}
          <rect
            x={X0 - 16} y="84" width={SPAN + 32} height="112" fill="none" pointerEvents="all"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging(true);
              setPosition(positionFrom(e.clientX));
            }}
            onPointerMove={(e) => {
              if (dragging) setPosition(positionFrom(e.clientX));
            }}
            onPointerUp={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              setDragging(false);
              commit(positionFrom(e.clientX));
            }}
            onPointerCancel={() => setDragging(false)}
          />
        </svg>
      </div>

      <div className="bench__tray">
        <p className="bench__tray-label">The bridge — drag it along the string, or nudge it</p>
        <button
          type="button" className="bench-btn" aria-label="Move the bridge a long way towards the nut"
          onClick={() => commit(movePosition(position, -COARSE_STEP))}
        >
          &#9666;&#9666;
        </button>
        <button
          type="button" className="bench-btn" aria-label="Move the bridge a little towards the nut"
          onClick={() => commit(movePosition(position, -FINE_STEP))}
        >
          &#9666;
        </button>
        <button
          type="button"
          className={`bench-part bench-part--wide${locked ? ' is-set' : ''}`}
          role="slider"
          aria-label="The bridge on the string. Use the left and right arrow keys."
          aria-valuemin={Math.round(MIN_LENGTH * 100)}
          aria-valuemax={Math.round(MAX_LENGTH * 100)}
          aria-valuenow={Math.round(clampLength(position) * 100)}
          aria-valuetext={describePosition(position)}
          onKeyDown={onBridgeKey}
          onClick={() => commit(position)}
        >
          {readingText(position)}
        </button>
        <button
          type="button" className="bench-btn" aria-label="Move the bridge a little towards the tail"
          onClick={() => commit(movePosition(position, FINE_STEP))}
        >
          &#9656;
        </button>
        <button
          type="button" className="bench-btn" aria-label="Move the bridge a long way towards the tail"
          onClick={() => commit(movePosition(position, COARSE_STEP))}
        >
          &#9656;&#9656;
        </button>

        <p className="bench__tray-label">Your studs — tap one to write it into the phrase</p>
        {studs.length === 0 && (
          <p className="bench__note">
            Nothing pinned yet. Hunt for a place where the two notes lock, then pin it.
          </p>
        )}
        {studs.map((s) => (
          <span key={s.key} className="bench__figure">
            <span className="bench__row">
              <button
                type="button" className="bench-part is-set"
                aria-label={`Play ${describeStud(s)}, and write it into the phrase`}
                onClick={() => tapStud(s)}
              >
                {fractionText(s)}{s.name ? ` · ${s.name}` : ''}
              </button>
              <button
                type="button" className="bench-btn"
                aria-label={`Take ${spokenFraction(s)} off the rack`}
                onClick={() => unpin(s.key)}
              >
                &#215;
              </button>
            </span>
            <span className="bench__figure-caption">{plankMark(s)} mm</span>
          </span>
        ))}
      </div>

      <div className="bench__actions">
        <button type="button" className="bench-btn bench-btn--primary" onClick={pin}>
          Pin this division
        </button>
        <button
          type="button" className="bench-btn" aria-disabled={notes.length === 0}
          aria-label={`Play the phrase. ${phraseInWords(phrase, studs)}`}
          onClick={playPhrase}
        >
          Play the phrase
        </button>
        <button
          type="button" className="bench-btn" aria-disabled={phrase.length === 0}
          onClick={() => setPhrase(dropLastNote)}
        >
          Rub out the last note
        </button>
        <button
          type="button" className={`bench-btn${sound ? ' bench-part is-set' : ''}`}
          aria-pressed={sound} aria-disabled={!canSound} onClick={toggleSound}
        >
          {sound ? 'Stop the sound' : 'Sound the string'}
        </button>
        <button type="button" className="bench-btn" aria-disabled={studs.length === 0} onClick={keep}>
          Keep this string
        </button>
        <button type="button" className="bench-btn" onClick={savePicture}>Save as a picture</button>
        <button type="button" className="bench-btn" onClick={printPlate}>Print</button>
        <button type="button" className="bench-btn" onClick={startAgain}>Start again</button>
      </div>

      {!canSound && (
        <p className="bench__note">
          This browser will not make a sound. The wobble is drawn on the board instead.
        </p>
      )}

      <div className="bench__shelf">
        <p className="bench__shelf-title">Strings you tuned</p>
        <ul className="bench__shelf-list">
          {kept.length === 0 && <li className="bench__kept-meta">Nothing kept yet.</li>}
          {kept.slice(-8).reverse().map((k) => (
            <li key={k.id} className="bench__kept">
              <button type="button" className="bench-btn" onClick={() => load(k)}>
                <span className="bench__kept-name">{k.studs.map(fractionText).join(' ')}</span>{' '}
                <span className="bench__kept-meta">
                  {k.phrase.length} {k.phrase.length === 1 ? 'note' : 'notes'}
                </span>
              </button>
              <button
                type="button" className="bench-btn" aria-label="Discard this string"
                onClick={() => { shelf.remove(k.id); setKept(shelf.list()); }}
              >
                &#215;
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="plate-print">
        <p className="plate-print__title">{DIVIDING_STRING_META.title}</p>
        {lines.map((l) => <p key={l} className="plate-print__line">{l}</p>)}
      </div>
    </section>
  );
}

export default DividingString;
