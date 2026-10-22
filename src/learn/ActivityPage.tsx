import { useEffect } from 'react';
import { Page, jump } from './Page';
import { getActivity } from '../make/activities';
import { markRead } from './screens';
import { ENTRIES } from './catalog';
import { MakeFigure } from '../make/figures';
import { altText } from './alt';

const BASE = import.meta.env.BASE_URL;

/**
 * One Make & Do card. Everything happens off the screen; this is the recipe.
 *
 * It opens with the first step's picture and one line, so a five-year-old
 * sees what he is going to do before any adult text (final review finding
 * 6); the safety line follows straight after, where it cannot be missed; the
 * grown-up's trial run folds away under "Before you start"; then what you
 * need, the steps with a picture each, what to notice and the question.
 */
export function ActivityPage({ id, back }: { readonly id: string; readonly back: { readonly href: string; readonly label: string } }) {
  const a = getActivity(id)!;
  const pair = a.pairsWith ? ENTRIES.find((e) => e.key === `book/${a.pairsWith}` || e.key === `maths/${a.pairsWith}` || e.key === `science/${a.pairsWith}`) : undefined;
  useEffect(() => markRead(`make/${a.id}`), [a.id]);
  // The picture at the top is the first step, so he sees at once what he is going to do.
  const lead = 0;
  const leadFigure = a.steps[lead].figure;
  return (
    <Page title={a.title} back={back} note={a.note} expect={`${a.span ?? `${a.minutes} minutes`} · ${a.hook}`}>
      <div className="activity__lead">
        {leadFigure ? (
          <div className="activity__figure">
            <MakeFigure id={leadFigure} label={a.steps[lead].art} />
          </div>
        ) : (
          <img src={`${BASE}art/make/${a.id}/step-${lead + 1}.webp`} alt={altText(a.steps[lead].art)} width={1152} height={896} />
        )}
        <div>
          <p className="activity__invite">{a.hook}</p>
          <p className="activity__when">{a.span ?? `About ${a.minutes} minutes`}</p>
          <nav className="activity__jumps" aria-label="On this page">
            <a className="jumps__link" href="#need" onClick={(e) => jump(e, 'need')}>
              What you need
            </a>
            <a className="jumps__link" href="#steps" onClick={(e) => jump(e, 'steps')}>
              Steps
            </a>
          </nav>
        </div>
      </div>
      {a.note.safety ? (
        <p className="activity__safety">
          <b>Safety</b> {a.note.safety}
        </p>
      ) : null}
      {a.trial ? (
        <details className="activity__prep">
          <summary>Before you start: try it yourself first</summary>
          <p className="activity__trial">{a.trial}</p>
        </details>
      ) : null}
      <section className="activity__need" id="need" aria-labelledby="need-h">
        <h2 id="need-h">You need</h2>
        <ul>
          {a.need.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
      <h2 id="steps" className="visually-hidden">
        Steps
      </h2>
      <ol className="activity__steps">
        {a.steps.map((s, i) => (
          <li key={s.text} className="activity__step">
            {s.figure ? (
              <div className="activity__figure">
                <MakeFigure id={s.figure} label={s.art} />
              </div>
            ) : (
              <img src={`${BASE}art/make/${a.id}/step-${i + 1}.webp`} alt={altText(s.art)} loading="lazy" width={1152} height={896} />
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
      ) : a.noPair ? (
        <p className="activity__pair">
          <b>On screen</b> <span className="activity__pair-kind">{a.noPair}</span>
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
