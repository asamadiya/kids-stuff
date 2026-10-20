import { useEffect } from 'react';
import { Page } from './Page';
import { getActivity } from '../make/activities';
import { markRead } from './screens';

const BASE = import.meta.env.BASE_URL;

/**
 * One Make & Do card. Everything happens off the screen; this is the recipe:
 * what you need, the steps with a picture each, what to notice, the question,
 * and the safety line, which sits at the top where it cannot be scrolled past.
 */
export function ActivityPage({ id }: { readonly id: string }) {
  const a = getActivity(id)!;
  useEffect(() => markRead(`make/${a.id}`), [a.id]);
  return (
    <Page title={a.title} back={{ href: '#/make', label: 'Make & Do' }} note={a.note} band="make" expect={`${a.span ?? `${a.minutes} minutes`} · ${a.hook}`}>
      {a.note.safety ? (
        <p className="activity__safety">
          <b>Safety</b> {a.note.safety}
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
            <img src={`${BASE}art/make/${a.id}/step-${i + 1}.webp`} alt={s.art} loading="lazy" width={1152} height={896} />
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
    </Page>
  );
}

export default ActivityPage;
