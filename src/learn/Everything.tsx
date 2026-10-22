import { useMemo } from 'react';
import { Page } from './Page';
import { useStored } from './scroll';
import { ENTRIES, PARTS, thumbSrc } from './catalog';
import type { Entry, EntryKind, Part } from './catalog';
import { FilterPanel } from './Filters';
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

type Time = 'any' | 'short' | 'medium' | 'long';
type Adult = 'any' | 'alone' | 'together';
const TIMES: ReadonlyArray<readonly [Time, string]> = [['any', 'Any length'], ['short', 'Up to 10 min'], ['medium', '10 to 20 min'], ['long', 'Longer']];
const ADULTS: ReadonlyArray<readonly [Adult, string]> = [['any', 'Anyone'], ['alone', 'He can do it alone'], ['together', 'With you']];

/** Minutes from an entry's time line ("5 min", "7 min read", "Hourly, one sunny day" has none). */
const minutesOf = (e: Entry) => Number(/^(\d+) min/.exec(e.time ?? '')?.[1] ?? NaN);
const fitsTime = (e: Entry, t: Time) => {
  if (t === 'any') return true;
  const m = minutesOf(e);
  if (Number.isNaN(m)) return t === 'long';
  return t === 'short' ? m <= 10 : t === 'medium' ? m > 10 && m <= 20 : m > 20;
};
/** Games and situations he can start alone; books, Make & Do and play need you. */
const fitsAdult = (e: Entry, a: Adult) => a === 'any' || (a === 'alone') === (e.kind === 'Maths game' || e.kind === 'Science game');

const KINDS: readonly EntryKind[] = ['Picture book', 'Longer read-aloud', 'Situation', 'Maths game', 'Science game', 'Make & Do', 'Play together'];

export function Everything() {
  const [q, setQ] = useStored<string>('all/q', '');
  const [part, setPart] = useStored<Part | 'any'>('all/part', 'any');
  const [kind, setKind] = useStored<EntryKind | 'any'>('all/kind', 'any');
  const [time, setTime] = useStored<Time>('all/time', 'any');
  const [adult, setAdult] = useStored<Adult>('all/adult', 'any');
  const [group, setGroup] = useStored<string>('all/group', 'any');
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  const list = useMemo(
    () =>
      ENTRIES.filter(
        (e) =>
          (part === 'any' || e.part === part) &&
          (kind === 'any' || e.kind === kind) &&
          (group === 'any' || e.groupTitle === group) &&
          fitsTime(e, time) &&
          fitsAdult(e, adult) &&
          terms.every((t) => e.search.includes(t) || e.title.toLowerCase().includes(t)),
      ),
    // terms is derived from q
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [q, part, kind, time, adult, group],
  );
  const active = (part !== 'any' ? 1 : 0) + (kind !== 'any' ? 1 : 0) + (group !== 'any' ? 1 : 0) + (time !== 'any' ? 1 : 0) + (adult !== 'any' ? 1 : 0);
  // Subjects and groups inside the chosen part (shelves, game groups, idea areas, library subjects).
  const groupsHere = part === 'any' ? [] : [...new Set(ENTRIES.filter((e) => e.part === part).map((e) => e.groupTitle))];
  const kindsHere = KINDS.filter((k) => ENTRIES.some((e) => e.kind === k && (part === 'any' || e.part === part)));
  return (
    <Page title="Everything" back={{ href: '#/', label: 'Home' }} part={null} note={NOTE} expect="A searchable list of the whole centre, for grown-ups.">
      <div className="index__controls">
        <label className="index__search">
          <span className="visually-hidden">Search everything</span>
          <input type="search" value={q} placeholder="Search: water, socks, Diwali, rainy day…" onChange={(e) => setQ(e.target.value)} autoComplete="off" enterKeyHint="search" />
        </label>
        <p className="index__count" aria-live="polite">
          {list.length === ENTRIES.length ? `All ${list.length}` : `${list.length} of ${ENTRIES.length}`}
          {active ? (
            <button type="button" className="filters__clear" onClick={() => { setPart('any'); setKind('any'); setGroup('any'); setTime('any'); setAdult('any'); }}>
              Clear filters
            </button>
          ) : null}
        </p>
      </div>
      <FilterPanel id="all" active={active}>
        <div className="filters" role="group" aria-label="Part">
          <button type="button" className={`chip${part === 'any' ? ' is-on' : ''}`} aria-pressed={part === 'any'} onClick={() => { setPart('any'); setKind('any'); setGroup('any'); }}>
            All parts
          </button>
          {PARTS.map((p) => (
            <button key={p.id} type="button" className={`chip chip--${p.id}${part === p.id ? ' is-on' : ''}`} aria-pressed={part === p.id} onClick={() => { setPart(p.id); setKind('any'); setGroup('any'); }}>
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
        {groupsHere.length > 1 ? (
          <div className="filters" role="group" aria-label="Subject">
            <button type="button" className={`chip${group === 'any' ? ' is-on' : ''}`} aria-pressed={group === 'any'} onClick={() => setGroup('any')}>
              Every subject
            </button>
            {groupsHere.map((g) => (
              <button key={g} type="button" className={`chip${group === g ? ' is-on' : ''}`} aria-pressed={group === g} onClick={() => setGroup(g)}>
                {g}
              </button>
            ))}
          </div>
        ) : (
          <p className="filters__hint">Choose a part to filter by subject.</p>
        )}
        <div className="filters" role="group" aria-label="Time">
          {TIMES.map(([v, label]) => (
            <button key={v} type="button" className={`chip${time === v ? ' is-on' : ''}`} aria-pressed={time === v} onClick={() => setTime(v)}>
              {label}
            </button>
          ))}
        </div>
        <div className="filters" role="group" aria-label="Who">
          {ADULTS.map(([v, label]) => (
            <button key={v} type="button" className={`chip${adult === v ? ' is-on' : ''}`} aria-pressed={adult === v} onClick={() => setAdult(v)}>
              {label}
            </button>
          ))}
        </div>
      </FilterPanel>
      <ul className="index">
        {list.map((e) => (
          <li key={e.key}>
            <a className={`index__row index__row--${e.part}`} href={e.href} data-key={e.key}>
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
