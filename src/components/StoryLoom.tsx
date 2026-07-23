import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ALL_INGREDIENTS,
  INGREDIENTS,
  toThing,
} from '../loom/ingredients';
import type { Thing } from '../loom/ingredients';
import { MIN_THINGS, weaveStory } from '../loom/weave';
import type { WovenStory } from '../loom/weave';
import { aiEnabled, aiStory, getMe, loginUrl, signOut } from '../loom/ai';
import type { AiUser } from '../loom/ai';
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

  // Optional AI mode (only if the app was built with a proxy URL).
  const [ai, setAi] = useState<AiUser>({ signedIn: false });
  const [useAi, setUseAi] = useState(true);
  const [aiResult, setAiResult] = useState<WovenStory | null>(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (aiEnabled()) getMe().then(setAi);
  }, []);

  const has = (t: Thing) => things.some((x) => x.label === t.label);
  const add = (t: Thing) => {
    if (has(t) || things.length >= MAX_THINGS || !t.label) return;
    setThings((cur) => [...cur, t]);
  };
  const remove = (label: string) => setThings((cur) => cur.filter((t) => t.label !== label));

  const surprise = () => {
    const n = 3 + Math.floor(Math.random() * 3);
    const pool = [...ALL_INGREDIENTS];
    const picked: Thing[] = [];
    while (picked.length < n && pool.length) picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    setThings(picked);
    setTelling(false);
  };

  const addCustom = () => {
    const t = toThing(custom);
    if (t.label) add(t);
    setCustom('');
  };

  const ready = things.length >= MIN_THINGS;
  const aiOn = aiEnabled() && ai.signedIn && useAi;

  const proceduralStory = useMemo(
    () => (telling && ready && !aiResult ? weaveStory(things, variant) : null),
    [telling, ready, aiResult, things, variant],
  );
  const story = aiResult ?? proceduralStory;

  const weave = async () => {
    setNote('');
    if (aiOn) {
      setBusy(true);
      try {
        const s = await aiStory(things);
        setAiResult(s);
        setTelling(true);
      } catch {
        setAiResult(null);
        setVariant(0);
        setTelling(true);
        setNote('The AI helper was sleepy, so the Loom wove this one. ✨');
      } finally {
        setBusy(false);
      }
      return;
    }
    setAiResult(null);
    setVariant(0);
    setTelling(true);
  };

  const again = async () => {
    setNote('');
    if (aiResult) {
      setBusy(true);
      try {
        setAiResult(await aiStory(things));
      } catch {
        setNote('Could not reach the AI helper this time. ✨');
      } finally {
        setBusy(false);
      }
      return;
    }
    setVariant((v) => v + 1);
  };

  const backToPicker = () => {
    setTelling(false);
    setAiResult(null);
  };

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

          {aiEnabled() ? (
            <div className="loom__ai">
              {ai.signedIn ? (
                <>
                  <label className="loom__ai-toggle">
                    <input
                      type="checkbox"
                      checked={useAi}
                      onChange={(e) => setUseAi(e.target.checked)}
                    />
                    🪄 Use AI stories
                  </label>
                  <span className="loom__ai-who">
                    signed in as {ai.login}
                    <button
                      type="button"
                      className="loom__ai-out"
                      onClick={() => signOut().then(() => setAi({ signedIn: false }))}
                    >
                      sign out
                    </button>
                  </span>
                </>
              ) : (
                <a className="loom__ai-in" href={loginUrl()}>
                  🪄 Sign in with GitHub for AI-written stories
                </a>
              )}
            </div>
          ) : null}

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
              <button type="button" className="loom__weave" disabled={!ready || busy} onClick={weave}>
                {busy ? '✨ Weaving…' : '✨ Weave the story'}
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
              key={(aiResult ? 'ai' : 'w') + variant}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="loom__story-badge">{aiResult ? '✨ written by AI' : '🧵 woven by the Loom'}</p>
              <h2 className="loom__story-title">{story?.title}</h2>
              {story?.paragraphs.map((p, i) => (
                <p key={i} className="loom__story-p">
                  {p}
                </p>
              ))}
            </motion.article>
          </AnimatePresence>

          {note ? <p className="loom__ai-note">{note}</p> : null}

          <div className="loom__story-actions">
            <button type="button" className="loom__again" onClick={again} disabled={busy}>
              {busy ? '…' : '🔄 Tell it another way'}
            </button>
            <button type="button" className="loom__edit" onClick={backToPicker}>
              ✏️ Change the things
            </button>
            <button
              type="button"
              className="loom__reset"
              onClick={() => {
                setThings([]);
                backToPicker();
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
