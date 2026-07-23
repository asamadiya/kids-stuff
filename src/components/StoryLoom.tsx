import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ALL_INGREDIENTS,
  INGREDIENTS,
  toThing,
} from '../loom/ingredients';
import type { Thing } from '../loom/ingredients';
import { MIN_THINGS, weaveStory } from '../loom/weave';
import '../styles/loom.css';

const MAX_THINGS = 8;

export interface StoryLoomProps {
  readonly onExit: () => void;
}

/** A playful "give me 3+ things and I'll weave a bedtime tale" screen. */
export function StoryLoom({ onExit }: StoryLoomProps) {
  const [things, setThings] = useState<Thing[]>([]);
  const [custom, setCustom] = useState('');
  const [variant, setVariant] = useState(0);
  const [telling, setTelling] = useState(false);

  const has = (t: Thing) => things.some((x) => x.label === t.label);
  const add = (t: Thing) => {
    if (has(t) || things.length >= MAX_THINGS || !t.label) return;
    setThings((cur) => [...cur, t]);
  };
  const remove = (label: string) => setThings((cur) => cur.filter((t) => t.label !== label));

  const surprise = () => {
    const n = 3 + Math.floor(Math.random() * 3); // 3–5
    const pool = [...ALL_INGREDIENTS];
    const picked: Thing[] = [];
    while (picked.length < n && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(i, 1)[0]);
    }
    setThings(picked);
    setTelling(false);
  };

  const addCustom = () => {
    const t = toThing(custom);
    if (t.label) add(t);
    setCustom('');
  };

  const ready = things.length >= MIN_THINGS;
  const story = useMemo(
    () => (telling && ready ? weaveStory(things, variant) : null),
    [telling, ready, things, variant],
  );

  return (
    <main id="main-content" className="loom" aria-label="Make a story" tabIndex={-1}>
      <header className="loom__top">
        <button type="button" className="loom__back" onClick={onExit}>
          <span aria-hidden="true">&#8249;</span> Back to stories
        </button>
        <h1 className="loom__title">The Story Loom</h1>
      </header>

      {!telling ? (
        <>
          <p className="loom__lede">
            Drop <strong>three or more things</strong> into the pot, and I&rsquo;ll weave
            you a bedtime tale that has every one of them in it.
          </p>

          <section className="loom__pot" aria-label="Your things">
            <div className="loom__pot-row">
              <span className="loom__pot-emoji" aria-hidden="true">🧺</span>
              <ul className="loom__chips" role="list">
                <AnimatePresence mode="popLayout">
                  {things.map((t) => (
                    <motion.li
                      key={t.label}
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      className="loom__chip"
                    >
                      <span aria-hidden="true">{t.emoji}</span>
                      {t.label}
                      <button
                        type="button"
                        className="loom__chip-x"
                        aria-label={`Remove ${t.label}`}
                        onClick={() => remove(t.label)}
                      >
                        &times;
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
                {things.length === 0 ? (
                  <li className="loom__chips-empty">Tap some things below…</li>
                ) : null}
              </ul>
            </div>
            <div className="loom__actions">
              <button type="button" className="loom__surprise" onClick={surprise}>
                🎲 Surprise me
              </button>
              <button
                type="button"
                className="loom__weave"
                disabled={!ready}
                onClick={() => {
                  setVariant(0);
                  setTelling(true);
                }}
              >
                ✨ Weave the story
                {!ready ? (
                  <span className="loom__weave-hint"> ({MIN_THINGS - things.length} more)</span>
                ) : null}
              </button>
            </div>
          </section>

          <div className="loom__custom">
            <input
              className="loom__input"
              value={custom}
              placeholder="…or type your own thing"
              maxLength={24}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustom();
              }}
            />
            <button type="button" className="loom__add" onClick={addCustom} disabled={!custom.trim()}>
              Add
            </button>
          </div>

          {INGREDIENTS.map((grp) => (
            <section key={grp.kind} className="loom__group" aria-label={grp.title}>
              <h2 className="loom__group-title">{grp.title}</h2>
              <div className="loom__palette">
                {grp.items.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    className={`loom__pick${has(t) ? ' is-picked' : ''}`}
                    aria-pressed={has(t)}
                    onClick={() => (has(t) ? remove(t.label) : add(t))}
                  >
                    <span className="loom__pick-emoji" aria-hidden="true">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </>
      ) : (
        <section className="loom__story" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.article
              key={variant}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="loom__story-title">{story?.title}</h2>
              {story?.paragraphs.map((p, i) => (
                <p key={i} className="loom__story-p">
                  {p}
                </p>
              ))}
            </motion.article>
          </AnimatePresence>

          <div className="loom__story-actions">
            <button type="button" className="loom__again" onClick={() => setVariant((v) => v + 1)}>
              🔄 Tell it another way
            </button>
            <button type="button" className="loom__edit" onClick={() => setTelling(false)}>
              ✏️ Change the things
            </button>
            <button
              type="button"
              className="loom__reset"
              onClick={() => {
                setThings([]);
                setTelling(false);
              }}
            >
              🧺 Start over
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

export default StoryLoom;
