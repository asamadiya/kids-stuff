import { Fragment, useEffect, useMemo, useState } from 'react';
import { Card, CardGroup, GroupJumps, Page } from '../learn/Page';
import { useStored } from '../learn/scroll';
import { stop as stopReading } from '../audio/readAloud';
import { cardSrc } from '../learn/catalog';
import type { GrownUpNote } from '../notes/types';
import type { Lang, Pair, Said } from './types';
import { LANG_NAME, LANG_PARENT } from './types';
import { LANG_BOOKS, MOMENTS, RHYMES, WHEN_LABEL, WORDS, getLangBook, getMoment, getRhyme } from './index';
import { Voice } from './Voice';
import { Recorder } from './Recorder';
import { pickRound } from './deck';
import { GUIDE } from './guide';
import { allScripts, clearAll, clipKey, commitImport, exportAll, onVoicesChange, readImport, voicesChanged } from './voices';
import { altText } from '../learn/alt';

const BASE = import.meta.env.BASE_URL;

/**
 * Telugu & Tamil (advisor q8 ruling E): a parent–child talking resource.
 * One language at a time, chosen by the toggle and remembered; script beside
 * the picture; romanisation and meaning behind "For the grown-up"; the
 * parents' recorded voices on child screens, play only.
 */

export const LANGS_NOTE: GrownUpNote = {
  what: 'Things to say and sing in Telugu and Tamil, for Nanna and Amma to use with the children every day: short routine and play moments, traditional rhymes, two shared picture books, a few picture words, and a guide for this family.',
  expect: 'Pick Telugu or Tamil at the top; the page shows that language only. The script is beside each picture, and "For the grown-up" opens the romanisation and meaning. The speaker buttons play YOUR recordings: record them once under Record voices. With no recording, the line says "Say it together", and a "Computer voice" button reads it instead (on a rhyme "Computer voice: the words": it speaks the rhyme, it does not sing it), with the reader you chose at the top.',
  practising: 'Hearing and using Telugu and Tamil in real moments with the people who speak them, which is what keeps a heritage language alive. Recognising the scripts in passing.',
  ask: 'Use the phrases during the day, not as a quiz: say Nanna’s line at bath time, sing the rhyme at bedtime.',
  next: 'Read the guide once: what helps, what to do when he answers in English, and how Mia fits in.',
  honest: 'A screen cannot teach a language; people talking and playing with him can. This part is a set of prompts and your own voices to make that easier. Telugu and Tamil spellings and spoken forms were checked against dictionaries and written by research, but a fluent family member should look them over: households say things differently.',
};

/** The chosen language, remembered for the session. Defaults to whichever parent the child is with is unknown, so Telugu first. */
function useLang(): [Lang, (l: Lang) => void] {
  const [lang, set] = useStored<Lang>('langs/lang', 'te');
  // Switching language changes every line on the screen: stop what is reading.
  return [lang, (l: Lang) => { stopReading(); set(l); }];
}

function LangToggle({ lang, onLang }: { readonly lang: Lang; readonly onLang: (l: Lang) => void }) {
  return (
    <div className="langtoggle" role="group" aria-label="Language">
      {(['te', 'ta'] as const).map((l) => (
        <button key={l} type="button" className={`langtoggle__btn langtoggle__btn--${l}${lang === l ? ' is-on' : ''}`} aria-pressed={lang === l} onClick={() => onLang(l)}>
          <span className="langtoggle__name">{LANG_NAME[l]}</span>
          <span className="langtoggle__who">with {LANG_PARENT[l]}</span>
        </button>
      ))}
    </div>
  );
}

/** One line: script large, a voice button, and the grown-up's aid folded away. */
function Line({ id, lang, said, big = false, sung = false }: { readonly id: string; readonly lang: Lang; readonly said: Said; readonly big?: boolean; readonly sung?: boolean }) {
  return (
    <div className={`line line--${lang}${big ? ' line--big' : ''}`}>
      <p className="line__script" lang={lang}>
        {said.script}
      </p>
      <Voice id={id} lang={lang} script={said.script} label={said.means} computerLabel={sung ? 'Computer voice: the words' : undefined} />
      <details className="line__aid">
        <summary>For the grown-up</summary>
        <p className="line__roman">{said.roman}</p>
        <p className="line__means">“{said.means}”</p>
        {said.note ? <p className="line__note">{said.note}</p> : null}
      </details>
    </div>
  );
}

/* ---------------------------------------------------------------- hub --- */

export function LangsHub() {
  const [lang, setLang] = useLang();
  const whens = useMemo(() => [...new Set(MOMENTS.map((m) => m.when))], []);
  const rhymes = RHYMES.filter((r) => r.lang === lang);
  return (
    <Page title="Telugu & Tamil" back={null} part="langs" note={LANGS_NOTE} expect="Things to say and sing with Amma and Nanna.">
      <LangToggle lang={lang} onLang={setLang} />
      <nav className="langs__adult" aria-label="For Amma and Nanna">
        <a className="btn btn--quiet" href="#/langs/guide">
          How to keep two languages going
        </a>
        <a className="btn btn--quiet" href="#/langs/record">
          Record your voices
        </a>
      </nav>
      <GroupJumps
        groups={[
          { id: 'say', title: 'Say it together', n: MOMENTS.length },
          { id: 'sing', title: 'Sing', n: rhymes.length },
          { id: 'read', title: 'Read together', n: LANG_BOOKS.length },
          { id: 'words', title: 'Words', n: WORDS.length },
        ]}
      />
      <CardGroup id="say" title="Say it together" line={`Little things ${LANG_PARENT[lang]} says every day, and what he can say back.`}>
        {whens.flatMap((w) =>
          MOMENTS.filter((m) => m.when === w).map((m) => (
            <Card key={m.id} href={`#/langs/say/${m.id}`} title={m.title} hook={m.grownUp[0]?.[lang].script ?? m.hook} art={cardSrc(`langs/say/${m.id}`)} tone="langs" tag={WHEN_LABEL[m.when]} itemKey={`langs/say/${m.id}`} />
          )),
        )}
      </CardGroup>
      <CardGroup id="sing" title="Sing" line={`Old ${LANG_NAME[lang]} rhymes ${LANG_PARENT[lang]} can sing, with actions.`}>
        {rhymes.map((r) => (
          <Card key={r.id} href={`#/langs/rhyme/${r.id}`} title={r.title.script} hook={r.title.means} art={cardSrc(`langs/rhyme/${r.id}`)} tone="langs" tag={LANG_NAME[r.lang]} itemKey={`langs/rhyme/${r.id}`} />
        ))}
      </CardGroup>
      <CardGroup id="read" title="Read together" line="Picture books told in Telugu and in Tamil.">
        {LANG_BOOKS.map((b) => (
          <Card key={b.id} href={`#/langs/book/${b.id}/1`} title={b.title[lang].script} hook={b.hook} art={cardSrc(`langs/book/${b.id}`)} tone="langs" itemKey={`langs/book/${b.id}`} />
        ))}
      </CardGroup>
      <CardGroup id="words" title="Words" line="Picture words from the moments and books, and a listening game.">
        <Card href="#/langs/words" title="Words and listening" hook={`${WORDS.length} picture words in ${LANG_NAME[lang]}`} art={cardSrc('langs/words')} tone="langs" itemKey="langs/words" />
      </CardGroup>
    </Page>
  );
}

/* ------------------------------------------------------------- moment --- */

export function MomentPage({ id, back }: { readonly id: string; readonly back: { href: string; label: string } }) {
  const [lang, setLang] = useLang();
  const m = getMoment(id)!;
  return (
    <Page title={m.title} back={back} note={m.note} expect={m.hook}>
      <LangToggle lang={lang} onLang={setLang} />
      <div className="moment">
        <figure className="moment__picture">
          <img src={`${BASE}art/langs/${m.id}.webp`} alt={altText(m.picture)} width={1152} height={896} />
        </figure>
        <div className="moment__lines">
          <h2 className="moment__who">{LANG_PARENT[lang]} says</h2>
          {m.grownUp.map((p, i) => (
            <Line key={i} id={`${m.id}.g${i}`} lang={lang} said={p[lang]} big={i === 0} />
          ))}
          {m.child.map((p, i) => {
            // Each child line is labelled by its own speaker: Mia's "Anna!" is
            // not something Arjun can say. One heading per run of speakers.
            const first = i === 0 || (p.by ?? '') !== (m.child[i - 1].by ?? '');
            return (
              <Fragment key={i}>
                {first ? <h2 className="moment__who">{p.by ? `${p.by} can say` : 'He can say'}</h2> : null}
                <Line id={`${m.id}.c${i}`} lang={lang} said={p[lang]} />
              </Fragment>
            );
          })}
        </div>
      </div>
      <Sources sources={m.sources} />
    </Page>
  );
}

/* -------------------------------------------------------------- rhyme --- */

export function RhymePage({ id, back }: { readonly id: string; readonly back: { href: string; label: string } }) {
  const r = getRhyme(id)!;
  return (
    <Page title={r.title.script} back={back} note={r.note} expect={`${LANG_NAME[r.lang]} rhyme · ${r.title.means}`}>
      <div className="moment">
        <figure className="moment__picture">
          <img src={`${BASE}art/langs/${r.id}.webp`} alt={altText(r.picture)} width={1152} height={896} />
        </figure>
        <div className="moment__lines">
          <Line id={`${r.id}.title`} lang={r.lang} said={r.title} big sung />
          {r.lines.map((l, i) => (
            <Line key={i} id={`${r.id}.l${i}`} lang={r.lang} said={l} sung />
          ))}
          {r.actions ? (
            <p className="rhyme__actions">
              <b>Actions</b> {r.actions}
            </p>
          ) : null}
        </div>
      </div>
      <p className="sources">
        <b>Where it comes from</b> {r.origin}
      </p>
      <Sources sources={r.sources} />
    </Page>
  );
}

/* --------------------------------------------------------------- book --- */

export function LangBookPage({ id, page, back, onPage }: { readonly id: string; readonly page: number; readonly back: { href: string; label: string }; readonly onPage: (p: number) => void }) {
  const [lang, setLang] = useLang();
  const b = getLangBook(id)!;
  const n = b.pages.length;
  const at = Math.min(page, n - 1);
  const pg = b.pages[at];
  return (
    <Page title={b.title[lang].script} back={back} note={b.note} expect={b.hook}>
      <LangToggle lang={lang} onLang={setLang} />
      <div className="langbook">
        <figure className="langbook__picture">
          <img src={`${BASE}art/langs/${b.id}/page-${at + 1}.webp`} alt={altText(pg.picture)} width={1152} height={896} />
        </figure>
        <Line id={`${b.id}.p${at}`} lang={lang} said={pg[lang]} big />
      </div>
      <nav className="book__nav" aria-label="Turn the page">
        <button type="button" className="btn btn--big page-btn" disabled={at === 0} onClick={() => onPage(at - 1)} aria-label="Previous page">
          <span aria-hidden="true">←</span>
        </button>
        <span className="book__count" aria-hidden="true">
          {at + 1} / {n}
        </span>
        <button type="button" className="btn btn--big btn--primary page-btn" disabled={at === n - 1} onClick={() => onPage(at + 1)} aria-label="Next page">
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </Page>
  );
}

/* -------------------------------------------------------------- words --- */

const WORDS_NOTE: GrownUpNote = {
  what: 'Picture words taken from the moments and books, in the language you chose, with your recordings, and a listening game: hear a word, find its picture.',
  expect: 'The listening game plays your recordings once you have three words recorded; until then a computer voice reads the word, marked as one. Two-year-olds can point; five-year-olds can play it alone.',
  practising: 'Recognising spoken words in each language, and the scripts in passing.',
  ask: 'After the game, use two of the words at dinner.',
  next: 'Record a few more words he asks for; the most useful words are the ones he wants.',
  honest: 'Recognising a word on a screen is not using it. Words stick when they are said in real moments with the people who speak them. The computer voice is a stand-in: it is not Amma or Nanna, and its pronunciation has not been checked by a fluent speaker.',
};

export function WordsPage() {
  const [lang, setLang] = useLang();
  const [have, setHave] = useState<Map<string, string>>(new Map());
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    const load = () => allScripts().then(setHave).catch(() => setHave(new Map()));
    load();
    return onVoicesChange(load);
  }, []);
  const recorded = useMemo(() => WORDS.filter((w) => have.get(clipKey(w.id, lang)) === w[lang].script), [have, lang]);
  // Family recordings when there are enough; otherwise every word, read by the
  // computer voice where a recording is missing (advisor a9 point 4).
  const deck = recorded.length >= 3 ? recorded : WORDS;
  const deckKey = deck.map((w) => w.id).join(',') + lang;
  useEffect(() => {
    setRound(0);
    setPicked(null);
  }, [deckKey]);
  const game = pickRound(deck, round);
  return (
    <Page title="Words" back={{ href: '#/langs', label: 'Telugu & Tamil' }} note={WORDS_NOTE} expect="Picture words and a listening game.">
      <LangToggle lang={lang} onLang={setLang} />
      <section className="listen" aria-labelledby="listen-h">
        <h2 id="listen-h">Listen and find</h2>
        {recorded.length < 3 ? (
          <p className="listen__note">
            Fewer than three words have a family recording, so a computer voice reads the word. Record words in {LANG_NAME[lang]} under <a href="#/langs/record">Record voices</a> and the game uses your voices instead.
          </p>
        ) : null}
        {game ? (
          <>
            <div className="listen__ask">
              <Voice id={game.target.id} lang={lang} script={game.target[lang].script} label="the word to find" />
              <span>Which picture?</span>
            </div>
            <div className="listen__choices">
              {game.choices.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  className={`listen__choice${picked === w.id ? (w.id === game.target.id ? ' is-right' : ' is-wrong') : ''}`}
                  onClick={() => setPicked(w.id)}
                  aria-label={w[lang].means}
                >
                  <img src={`${BASE}art/langs/words/${w.id}.webp`} alt="" width={240} height={187} />
                  {picked && w.id === game.target.id ? <span className="listen__script" lang={lang}>{w[lang].script}</span> : null}
                </button>
              ))}
            </div>
            {picked ? (
              <button type="button" className="btn btn--primary" onClick={() => { stopReading(); setPicked(null); setRound(round + 1); }}>
                Another one
              </button>
            ) : null}
          </>
        ) : null}
      </section>
      <div className="words">
        {WORDS.map((w) => (
          <div key={w.id} className="word">
            <img src={`${BASE}art/langs/words/${w.id}.webp`} alt={w[lang].means} width={240} height={187} loading="lazy" />
            <Line id={w.id} lang={lang} said={w[lang]} />
          </div>
        ))}
      </div>
    </Page>
  );
}

/* -------------------------------------------------------------- guide --- */

export function LangGuide() {
  return (
    <Page title="Keeping two languages going" back={{ href: '#/langs', label: 'Telugu & Tamil' }} note={GUIDE.note} expect="A guide for Amma and Nanna.">
      <GroupJumps groups={GUIDE.sections.map((s, i) => ({ id: `guide-${i}`, title: s.title }))} />
      <article className="guide">
        {GUIDE.sections.map((s, i) => (
          <section key={s.title} id={`g-guide-${i}`} className="guide__section">
            <h2>{s.title}</h2>
            {s.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
        <Sources sources={GUIDE.sources} />
      </article>
    </Page>
  );
}

/* ------------------------------------------------------------- record --- */

const RECORD_NOTE: GrownUpNote = {
  what: 'Where Nanna records the Telugu and Amma records the Tamil (or a grandparent does), one line at a time, so the speaker buttons play your voices.',
  expect: 'Press Record, say the line, press Stop, listen, then Save. Saving over a recording asks first. Recordings stay on this device only; nothing is uploaded.',
  practising: 'Nothing for him: this page is for you.',
  ask: 'Record the moments you actually use first. Ten lines you say every day are worth more than a hundred you never will.',
  next: 'Save a copy with "Save all to a file" now and then, and load it on another device with "Load from a file".',
  honest: 'Clearing this browser’s site data, or using another device, loses the recordings unless you saved a copy. They are not backed up anywhere. If a line’s words are corrected in a later version of this app, its old recording stops playing and the line here says to record it again.',
};

export function RecordPage() {
  const [lang, setLang] = useLang();
  const [who, setWho] = useStored<string>('langs/who', '');
  const [unlocked, setUnlocked] = useState(false);
  const [msg, setMsg] = useState('');
  /** Words first: the listening game needs three of them recorded, and they are quickest to do. */
  const sections = useMemo(
    () => [
      { id: 'words', title: 'Words', items: WORDS.map((w) => ({ id: w.id, group: '', said: w as Pair })) },
      {
        id: 'say',
        title: 'Say it together',
        items: MOMENTS.flatMap((m) => [
          ...m.grownUp.map((p, i) => ({ id: `${m.id}.g${i}`, group: m.title, said: p })),
          ...m.child.map((p, i) => ({ id: `${m.id}.c${i}`, group: m.title, said: p })),
        ]),
      },
      {
        id: 'sing',
        title: 'Sing',
        items: RHYMES.filter((r) => r.lang === lang).flatMap((r) => [
          { id: `${r.id}.title`, group: r.title.means, said: { te: r.title, ta: r.title } as Pair },
          ...r.lines.map((l, i) => ({ id: `${r.id}.l${i}`, group: r.title.means, said: { te: l, ta: l } as Pair })),
        ]),
      },
      {
        id: 'read',
        title: 'Read together',
        items: LANG_BOOKS.flatMap((b) => b.pages.map((p, i) => ({ id: `${b.id}.p${i}`, group: b.title[lang].means, said: { te: p.te, ta: p.ta } as Pair }))),
      },
    ],
    [lang],
  );
  if (!unlocked) {
    return (
      <Page title="Record voices" back={{ href: '#/langs', label: 'Telugu & Tamil' }} note={RECORD_NOTE} expect="For grown-ups only.">
        <div className="gate">
          <p>This page records and replaces voices. Hold the button for two seconds to open it.</p>
          <HoldButton onDone={() => setUnlocked(true)} />
        </div>
      </Page>
    );
  }
  return (
    <Page title="Record voices" back={{ href: '#/langs', label: 'Telugu & Tamil' }} note={RECORD_NOTE} expect="For grown-ups only.">
      <LangToggle lang={lang} onLang={setLang} />
      <label className="record__who">
        Who is recording?{' '}
        <input value={who} onChange={(e) => setWho(e.target.value)} placeholder={LANG_PARENT[lang]} />
      </label>
      <div className="record__tools">
        <button
          type="button"
          className="btn"
          onClick={async () => {
            try {
              const blob = await exportAll();
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'learning-center-voices.json';
              a.click();
              window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            } catch {
              setMsg('The recordings could not be read from this browser, so no file was made.');
            }
          }}
        >
          Save all to a file
        </button>
        <label className="btn">
          Load from a file
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = '';
              if (!f) return;
              try {
                const pending = await readImport(f);
                const n = pending.clips.length;
                const r = pending.replaces.length;
                const ask = r
                  ? `Load ${n} recordings? ${r} of them will replace recordings already on this device.`
                  : `Load ${n} recordings?`;
                if (!window.confirm(ask)) return setMsg('Nothing was loaded.');
                setMsg(`Loaded ${await commitImport(pending)} recordings.`);
              } catch (err) {
                setMsg(err instanceof Error ? err.message : 'That file could not be read, so nothing was loaded.');
              }
            }}
          />
        </label>
        <button
          type="button"
          className="btn btn--quiet"
          onClick={async () => {
            if (!window.confirm('Delete every recording on this device?')) return;
            try {
              await clearAll();
            } catch {
              return setMsg('The recordings could not be deleted. Try again.');
            }
            voicesChanged();
            setMsg('All recordings deleted.');
          }}
        >
          Delete all
        </button>
        <span className="record__msg" role="status">{msg}</span>
      </div>
      <GroupJumps groups={sections.map((x) => ({ id: `rec-${x.id}`, title: x.title, n: x.items.length }))} />
      {sections.map((x) => (
        <details key={x.id + lang} id={`g-rec-${x.id}`} className="record__section" open={x.id === 'words'}>
          <summary>
            <h2>{x.title}</h2> <span className="record__count">{x.items.length} lines</span>
          </summary>
          <ul className="record__list">
            {x.items.map((it) => (
              <li key={it.id + lang} className="record__item">
                <div>
                  {it.group ? <span className="record__group">{it.group}</span> : null}
                  <p className="line__script" lang={lang}>
                    {it.said[lang].script}
                  </p>
                  <p className="line__roman">{it.said[lang].roman}</p>
                </div>
                <Recorder id={it.id} lang={lang} who={who || LANG_PARENT[lang]} script={it.said[lang].script} text={it.said[lang].roman} />
              </li>
            ))}
          </ul>
        </details>
      ))}
    </Page>
  );
}

/** Press and hold for two seconds: easy for a grown-up, unlikely by accident for a child. */
function HoldButton({ onDone }: { readonly onDone: () => void }) {
  const [t, setT] = useState<number | null>(null);
  useEffect(() => {
    if (t === null) return;
    const id = window.setTimeout(onDone, 2000);
    return () => window.clearTimeout(id);
  }, [t, onDone]);
  return (
    <button
      type="button"
      className={`btn btn--big hold${t !== null ? ' is-holding' : ''}`}
      onPointerDown={() => setT(Date.now())}
      onPointerUp={() => setT(null)}
      onPointerLeave={() => setT(null)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setT(Date.now())}
      onKeyUp={() => setT(null)}
    >
      Hold to open
    </button>
  );
}

function Sources({ sources }: { readonly sources: ReadonlyArray<{ label: string; url: string }> }) {
  if (!sources.length) return null;
  return (
    <p className="sources">
      <b>Sources</b>{' '}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i ? '; ' : ''}
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}
