import { useEffect } from 'react';
import { Card, CardGroup, GroupJumps, Page } from '../learn/Page';
import { useStored } from '../learn/scroll';
import { FilterPanel } from '../learn/Filters';
import { cardSrc } from '../learn/catalog';
import type { GrownUpNote } from '../notes/types';
import { IDEAS, MIA_LABEL, PLAY_GROUPS, WHERE_LABEL, getIdea } from './index';
import type { PlayIdea } from './types';
import { altText } from '../learn/alt';
import { ReadAloud } from '../audio/ReadAloud';
import { ideaLead } from '../audio/lines';

const BASE = import.meta.env.BASE_URL;

const done = (id: string) => {
  try {
    return window.localStorage.getItem(`rlc/read/together/${id}`) === '1';
  } catch {
    return false;
  }
};
const markDone = (id: string) => {
  try {
    window.localStorage.setItem(`rlc/read/together/${id}`, '1');
  } catch {
    /* only costs the tick */
  }
};

export const TOGETHER_NOTE: GrownUpNote = {
  what: 'Fifty ways for a dad or a mum to play with a five-year-old using what is already in the house: rough and tumble, chase and freeze games, throwing and kicking, dens and pretend, Indian and family games with rules, music and moving, outdoor exploring, and quiet time and real jobs.',
  expect: 'Each card says where it works, how long a round lasts, what you need (most need nothing you would have to buy, and the few that do say so), how to start in three to five steps, how he can change the game, and how his little sister fits in. The filters at the top narrow it by place, energy, rough play, how much time you have, whether you need to get anything out, and whether Mia can join.',
  practising: 'Play itself: taking turns, leading and following, stopping on a signal, winning and losing, pretending, moving, and talking. Some cards name a specific skill; none of them is a lesson.',
  ask: 'Let him choose the card. "Which one shall we play?"',
  next: 'Play the same game again tomorrow and let him change one rule. Repetition is how a five-year-old owns a game.',
  honest: 'These were chosen from child-development research and traditional Indian games, and each card links its source. None of them works by itself; what matters is that you are in it with him. A game he does not want to play is not a game, so let him say no.',
  safety: 'Rough play: ask first, agree "Freeze" as the stop word and practise it once, and stop the moment either of you says it. Keep small parts, cords and water away from the two-year-old; the card says how.',
};

/**
 * The advisor's filters (q7 ruling 6): where, energy and contact for the
 * kind of play; time, nothing-to-get-out and Mia for whether it fits right
 * now. Each is independent; the counts say how many are left.
 */
type Filter = {
  where: 'any' | 'indoors' | 'outdoors';
  energy: 'any' | 'quiet' | 'active';
  contact: 'any' | 'none' | 'only';
  time: 0 | 5 | 15;
  mia: boolean;
  nothing: boolean;
};
const NO_FILTER: Filter = { where: 'any', energy: 'any', contact: 'any', time: 0, mia: false, nothing: false };

const fits = (x: PlayIdea, f: Filter) =>
  (f.where === 'any' || x.where === f.where || x.where === 'either') &&
  (f.energy === 'any' || x.energy === f.energy) &&
  (f.contact === 'any' || x.contact === (f.contact === 'only')) &&
  (f.time === 0 || x.minutes <= f.time) &&
  (!f.mia || x.mia.way === 'joins') &&
  (!f.nothing || x.need.length === 0);

export function TogetherHub() {
  const [stored, setF] = useStored<Filter>('together/filter', NO_FILTER);
  const f = { ...NO_FILTER, ...stored };
  const live = PLAY_GROUPS.map((g) => ({ ...g, list: IDEAS.filter((x) => x.group === g.id && fits(x, f)) })).filter((g) => g.list.length > 0);
  const shown = live.reduce((n, g) => n + g.list.length, 0);
  const active = (f.where !== 'any' ? 1 : 0) + (f.energy !== 'any' ? 1 : 0) + (f.contact !== 'any' ? 1 : 0) + (f.time ? 1 : 0) + (f.mia ? 1 : 0) + (f.nothing ? 1 : 0);
  const chip = <K extends keyof Filter>(k: K, v: Filter[K], label: string) => (
    <button type="button" className={`chip${f[k] === v ? ' is-on' : ''}`} aria-pressed={f[k] === v} onClick={() => setF({ ...f, [k]: v })}>
      {label}
    </button>
  );
  return (
    <Page
      title="Play with Dad & Mom"
      back={null}
      part="together"
      note={TOGETHER_NOTE}
      expect="Games for the two of you, away from the screen."
      lede={`${IDEAS.length} ways to play together, indoors and out, with things you already have.`}
    >
      <div className="hubbar">
        <FilterPanel id="together" active={active}>
      <div className="filters" role="group" aria-label="Narrow the list">
        <span className="filters__set" role="group" aria-label="Where">
          {chip('where', 'any', 'Anywhere')}
          {chip('where', 'indoors', 'Indoors')}
          {chip('where', 'outdoors', 'Outdoors')}
        </span>
        <span className="filters__set" role="group" aria-label="Energy">
          {chip('energy', 'any', 'Any energy')}
          {chip('energy', 'quiet', 'Quiet')}
          {chip('energy', 'active', 'Active')}
        </span>
        <span className="filters__set" role="group" aria-label="Contact">
          {chip('contact', 'any', 'Any play')}
          {chip('contact', 'none', 'No rough play')}
          {chip('contact', 'only', 'Rough play')}
        </span>
      </div>
      <div className="filters" role="group" aria-label="What fits right now">
        <span className="filters__set" role="group" aria-label="Time">
          {chip('time', 0, 'Any time')}
          {chip('time', 5, '5 minutes')}
          {chip('time', 15, '15 minutes')}
        </span>
        <button type="button" className={`chip${f.nothing ? ' is-on' : ''}`} aria-pressed={f.nothing} onClick={() => setF({ ...f, nothing: !f.nothing })}>
          Nothing to get out
        </button>
        <button type="button" className={`chip${f.mia ? ' is-on' : ''}`} aria-pressed={f.mia} onClick={() => setF({ ...f, mia: !f.mia })}>
          Mia can join
        </button>
      </div>
        </FilterPanel>
        <span className="filters__count hubbar__count" aria-live="polite">
          {shown === IDEAS.length ? `All ${shown}` : `${shown} of ${IDEAS.length}`}
          {shown !== IDEAS.length ? (
            <button type="button" className="filters__clear" onClick={() => setF(NO_FILTER)}>
              Show all
            </button>
          ) : null}
        </span>
      </div>
      <GroupJumps groups={live.map((g) => ({ id: g.id, title: g.title, n: g.list.length }))} />
      {live.map((g) => (
        <CardGroup key={g.id} id={g.id} title={g.title} line={g.line}>
          {g.list.map((x) => (
            <Card
              key={x.id}
              href={`#/together/${x.id}`}
              title={x.title}
              hook={x.hook}
              art={cardSrc(`together/${x.id}`)}
              tone="together"
              tag={`${x.minutes} min · ${WHERE_LABEL[x.where]}${x.contact ? ' · Rough play' : ''}${x.mia.way === 'apart' ? ' · Mia with another grown-up' : ''}`}
              tick={done(x.id) ? 'Played before' : null}
              itemKey={`together/${x.id}`}
            />
          ))}
        </CardGroup>
      ))}
      {shown === 0 ? <p className="lc-lede">Nothing fits all of those at once. Take one filter off.</p> : null}
    </Page>
  );
}

export function IdeaPage({ id, back }: { readonly id: string; readonly back: { readonly href: string; readonly label: string } }) {
  const x = getIdea(id)!;
  const group = PLAY_GROUPS.find((g) => g.id === x.group)!;
  useEffect(() => markDone(x.id), [x.id]);
  return (
    <Page title={x.title} back={back} note={x.note} expect={`${x.minutes} minutes · ${WHERE_LABEL[x.where]} · ${x.hook}`}>
      <div className="idea">
        <figure className="idea__picture">
          <img src={`${BASE}art/together/${x.id}.webp`} alt={altText(x.picture)} width={1152} height={896} />
          <figcaption className="idea__read">
            <p className="idea__hook">{x.hook}</p>
            <ReadAloud id={`together/${x.id}/lead`} texts={ideaLead(x)} />
          </figcaption>
        </figure>
        <div className="idea__side">
          <dl className="idea__facts">
            <div>
              <dt>Where</dt>
              <dd>{WHERE_LABEL[x.where]}</dd>
            </div>
            <div>
              <dt>Play time</dt>
              <dd>About {x.minutes} minutes</dd>
            </div>
            <div>
              <dt>Setup</dt>
              <dd>{x.setup}</dd>
            </div>
            <div>
              <dt>Who</dt>
              <dd>{x.players}</dd>
            </div>
            <div>
              <dt>Mia</dt>
              <dd>{MIA_LABEL[x.mia.way]}</dd>
            </div>
            <div>
              <dt>Kind</dt>
              <dd>
                {group.title}
                {x.contact ? ' · contact' : ''} · {x.energy === 'quiet' ? 'quiet' : 'active'}
              </dd>
            </div>
          </dl>
          {x.note.safety ? (
            <p className="activity__safety">
              <b>Safety</b> {x.note.safety}
            </p>
          ) : null}
          <section className="activity__need" aria-labelledby="need">
            <h2 id="need">You need</h2>
            {x.need.length ? (
              <ul>
                {x.need.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : (
              <p className="idea__nothing">Nothing but the two of you.</p>
            )}
            {x.exception ? <p className="idea__exception">{x.exception}</p> : null}
          </section>
        </div>
      </div>
      <section className="idea__how" aria-labelledby="how">
        <h2 id="how">How to play</h2>
        <ol className="idea__steps">
          {x.steps.map((s, i) => (
            <li key={s}>
              <span className="activity__n" aria-hidden="true">
                {i + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </section>
      <div className="idea__boxes">
        <section className="idea__box idea__box--his" aria-labelledby="his">
          <h2 id="his">His way</h2>
          <p>{x.hisWay}</p>
        </section>
        <section className={`idea__box idea__box--mia idea__box--${x.mia.way}`} aria-labelledby="mia">
          <h2 id="mia">{MIA_LABEL[x.mia.way]}</h2>
          <p>{x.mia.text}</p>
        </section>
        {x.tradition ? (
          <section className="idea__box idea__box--tradition" aria-labelledby="trad">
            <h2 id="trad">Where it comes from</h2>
            <p>{x.tradition}</p>
          </section>
        ) : null}
      </div>
      <p className="sources">
        <b>Source{x.sources.length > 1 ? 's' : ''}</b>{' '}
        {x.sources.map((s, i) => (
          <span key={s.url}>
            {i ? '; ' : ''}
            <a href={s.url} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </Page>
  );
}
