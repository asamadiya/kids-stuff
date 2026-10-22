import { PARTS } from './catalog';
import type { Part } from './catalog';

/**
 * The persistent way between the parts of the centre, on every listing page
 * (advisor q7 ruling 3): Home and the five parts in one row on a tablet, a
 * two-row, three-column strip on a phone — nothing hidden off the edge. Books
 * and games do not carry it; they keep a Back and a Home instead.
 */
export function PartNav({ current }: { readonly current: Part | 'home' | null }) {
  return (
    <nav className="partnav" aria-label="Parts of the Learning Center">
      <a className={`partnav__link partnav__link--home${current === 'home' ? ' is-current' : ''}`} href="#/" aria-current={current === 'home' ? 'page' : undefined}>
        <HomeGlyph />
        Home
      </a>
      {PARTS.map((p) => (
        <a
          key={p.id}
          className={`partnav__link partnav__link--${p.id}${current === p.id ? ' is-current' : ''}`}
          href={p.href}
          aria-current={current === p.id ? 'page' : undefined}
        >
          <span className="partnav__dot" aria-hidden="true" />
          {p.id === 'langs' ? (
            <>
              <span className="partnav__long">{p.name}</span>
              <span className="partnav__short">Telugu & Tamil</span>
            </>
          ) : p.id === 'together' ? (
            <>
              <span className="partnav__long">{p.name}</span>
              <span className="partnav__short">Play Together</span>
            </>
          ) : (
            p.name
          )}
        </a>
      ))}
    </nav>
  );
}

export function HomeGlyph() {
  return (
    <svg className="partnav__home" viewBox="0 0 24 24" aria-hidden="true" width="20" height="20">
      <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" fill="currentColor" />
    </svg>
  );
}

/** The small Home link books and games carry beside their Back. */
export function HomeLink() {
  return (
    <a className="home-link" href="#/" aria-label="Home">
      <HomeGlyph />
    </a>
  );
}

export default PartNav;
