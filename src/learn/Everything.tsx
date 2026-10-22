import { useMemo } from 'react';
import { Page } from './Page';
import { useStored } from './scroll';
import { ENTRIES, PARTS, thumbSrc } from './catalog';
import type { EntryKind, Part } from './catalog';
import type { GrownUpNote } from '../notes/types';

/**
 * Everything: one searchable list of every item in the centre, the 193 Big
 * Library stories included, for a grown-up (advisor q7 ruling 4). Ungated.
 * Search runs over titles, descriptions, groups, materials and tags, so
 * "water", "rainy day", "Diwali" or "socks" find what uses them. Filters by
 * part and by kind; the query and filters survive Back.
 */

const NOTE: GrownUpNote = {
  what: 'Every book, read-aloud, situation, game, activity and play idea in the centre in one list, with a search box.',
  expect: `Type what you have or what you are in the mood for — "water", "rainy day", "socks", "Diwali", "shadows", "quiet" — and the list narrows as you type. ${ENTRIES.length} items in all.`,
  practising: 'Nothing for him; this page is for you.',
  ask: 'Use it to plan: pick a book, a game and something to make on the same idea, and do them across a week.',
  next: 'Each item has its own grown-ups note with what to expect.',
  honest: 'Search matches words, not meaning. If nothing comes up, try a simpler word.',
};

const KINDS: readonly EntryKind[] = ['Picture book', 'Longer read-aloud', 'Situation', 'Maths game', 'Science game', 'Make & Do', 'Play together'];

export function Everything() {
  const [q, setQ] = useStored<string>('all/q', '');
  const [part, setPart] = useStored<Part | 'any'>('all/part', 'any');
  const [kind, setKind] = useStored<EntryKind | 'any'>('all/kind', 'any');
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const list = useMemo(
    () =>
      ENTRIES.filter(
        (e) => (part === 'any' || e.part === part) && (kind === 'any' || e.kind === kind) && terms.every((t) => e.search.includes(t) || e.title.toLowerCase().includes(t)),
      ),
    // terms is derived from q
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, part, kind],
  );
  const kindsHere = KINDS.filter((k) => ENTRIES.some((e) => e.kind === k && (part === 'any' || e.part === part)));
  return (
    <Page title="Everything" back={{ href: '#/', label: 'Home' }} part={null} note={NOTE} expect="A searchable list of the whole centre, for grown-ups.">
      <div className="index__controls">
        <label className="index__search">
          <span className="visually-hidden">Search everything</span>
          <input type="search" value={q} placeholder="Search: water, socks, Diwali, rainy day…" onChange={(e) => setQ(e.target.value)} autoComplete="off" enterKeyHint="search" />
        </label>
        <div className="filters" role="group" aria-label="Part">
          <button type="button" className={`chip${part === 'any' ? ' is-on' : ''}`} aria-pressed={part === 'any'} onClick={() => { setPart('any'); setKind('any'); }}>
            All parts
          </button>
          {PARTS.map((p) => (
            <button key={p.id} type="button" className={`chip chip--${p.id}${part === p.id ? ' is-on' : ''}`} aria-pressed={part === p.id} onClick={() => { setPart(p.id); setKind('any'); }}>
              {p.name}
            </button>
          ))}
        </div>
        {kindsHere.length > 1 ? (
          <div className="filters" role="group" aria-label="Kind">
            <button type="button" className={`chip${kind === 'any' ? ' is-on' : ''}`} aria-pressed={kind === 'any'} onClick={() => setKind('any')}>
              Every kind
            </button>
            {kindsHere.map((k) => (
              <button key={k} type="button" className={`chip${kind === k ? ' is-on' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
                {k}
              </button>
            ))}
          </div>
        ) : null}
        <p className="index__count" aria-live="polite">
          {list.length === ENTRIES.length ? `All ${list.length}` : `${list.length} of ${ENTRIES.length}`}
        </p>
      </div>
      <ul className="index">
        {list.map((e) => (
          <li key={e.key}>
            <a className={`index__row index__row--${e.part}`} href={e.href}>
              {e.art ? <img className="index__thumb" src={thumbSrc(e.key)} alt="" width={80} height={62} loading="lazy" decoding="async" /> : <span className="index__thumb" />}
              <span className="index__main">
                <span className="index__title">{e.title}</span>
                <span className="index__hook">{e.hook}</span>
              </span>
              <span className="index__meta">
                <span className="index__kind">{e.kind}</span>
                <span>{e.groupTitle}</span>
                <span>{[e.time, e.where].filter(Boolean).join(' · ')}</span>
                <span>{e.adult}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      {list.length === 0 ? <p className="lc-lede">Nothing matches. Try one simpler word.</p> : null}
    </Page>
  );
}

export default Everything;
