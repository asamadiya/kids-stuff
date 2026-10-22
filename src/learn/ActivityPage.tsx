import { useEffect } from 'react';
import { Page } from './Page';
import { getActivity } from '../make/activities';
import { markRead } from './screens';
import { ENTRIES } from './catalog';
import { MakeFigure } from '../make/figures';

const BASE = import.meta.env.BASE_URL;

/**
 * One Make & Do card. Everything happens off the screen; this is the recipe:
 * what you need, the steps with a picture each, what to notice, the question,
 * and the safety line, which sits at the top where it cannot be scrolled past.
 */
export function ActivityPage({ id }: { readonly id: string }) {
  const a = getActivity(id)!;
  const pair = a.pairsWith ? ENTRIES.find((e) => e.key === `book/${a.pairsWith}` || e.key === `maths/${a.pairsWith}` || e.key === `science/${a.pairsWith}`) : undefined;
  useEffect(() => markRead(`make/${a.id}`), [a.id]);
  return (
    <Page title={a.title} back={{ href: '#/make', label: 'Make & Do' }} note={a.note} expect={`${a.span ?? `${a.minutes} minutes`} · ${a.hook}`}>
      {a.note.safety ? (
        <p className="activity__safety">
          <b>Safety</b> {a.note.safety}
        </p>
      ) : null}
      {a.trial ? (
        <p className="activity__trial">
          <b>Try it first</b> {a.trial}
        </p>
      ) : null}
      <section className="activity__need" aria-labelledby="need">
        <h2 id="need">You need</h2>
        <ul>
          {a.need.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
      <ol className="activity__steps">
        {a.steps.map((s, i) => (
          <li key={s.text} className="activity__step">
            {s.figure ? (
              <div className="activity__figure">
                <MakeFigure id={s.figure} label={s.art} />
              </div>
            ) : (
              <img src={`${BASE}art/make/${a.id}/step-${i + 1}.webp`} alt={s.art} loading="lazy" width={1152} height={896} />
            )}
            <p>
              <span className="activity__n" aria-hidden="true">{i + 1}</span>
              {s.text}
            </p>
          </li>
        ))}
      </ol>
      <section className="activity__end">
        <p>
          <b>Notice</b> {a.notice}
        </p>
        <p>
          <b>Ask</b> {a.ask}
        </p>
      </section>
      {pair ? (
        <p className="activity__pair">
          <b>On screen</b>{' '}
          <a href={pair.href}>
            {pair.title}
          </a>{' '}
          <span className="activity__pair-kind">({pair.kind.toLowerCase()} on the same idea)</span>
        </p>
      ) : null}
      {a.sources?.length ? (
        <p className="sources">
          <b>Adapted from</b>{' '}
          {a.sources.map((s, i) => (
            <span key={s.url}>
              {i ? '; ' : ''}
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </Page>
  );
}

export default ActivityPage;
