import type { ReactNode } from 'react';
import type { GrownUpNote } from '../notes/types';
import { GrownUps } from './GrownUps';
import { HomeLink, PartNav } from './PartNav';
import type { Part } from './catalog';

/**
 * The frame every hub and listing page shares: the part navigation, a back
 * link, a title, and the grown-ups button and the Everything index in the
 * same top-right place (advisor q7 ruling 3: Everything is a grown-up's
 * utility, so it sits beside For grown-ups rather than among the parts).
 */
export interface PageProps {
  readonly title: string;
  readonly back?: { readonly href: string; readonly label: string } | null;
  readonly note: GrownUpNote;
  /** One line for the grown-ups panel, ahead of the note's own "what to expect". */
  readonly expect?: string;
  /**
   * Which part's tab is lit in the navigation. Omit on a single item (an
   * activity, a play idea, a situation): those carry Home and Back instead of
   * the strip (advisor q7 ruling 3).
   */
  readonly part?: Part | 'home' | null;
  /** A short line under the title. */
  readonly lede?: string;
  readonly children: ReactNode;
}

export function Page({ title, back, note, expect, part, lede, children }: PageProps) {
  return (
    <main id="main-content" className="lc-page" tabIndex={-1}>
      {part !== undefined ? <PartNav current={part} /> : null}
      <header className="lc-top">
        {part === undefined && back ? <HomeLink /> : null}
        {back ? (
          <a className="lc-top__back" href={back.href}>
            <span aria-hidden="true">←</span> {back.label}
          </a>
        ) : null}
        <h1 className="lc-top__title">{title}</h1>
        <div className="lc-top__tools">
          <EverythingLink />
          <GrownUps note={expect ? { ...note, expect: `${expect} ${note.expect}` } : note} title={title} />
        </div>
      </header>
      {lede ? <p className="lc-lede">{lede}</p> : null}
      {children}
    </main>
  );
}

export function EverythingLink() {
  return (
    <a className="everything-link" href="#/all" aria-label="Everything: search the whole centre">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path d="m15 15 5 5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
      <span className="everything-link__label">Everything</span>
    </a>
  );
}

export interface CardProps {
  readonly href: string;
  readonly title: string;
  readonly hook?: string;
  readonly art?: string;
  /** A drawn picture when there is no art yet; never an emoji. */
  readonly glyph?: ReactNode;
  readonly tone: Part;
  readonly tag?: string;
  readonly tick?: string | null;
  /** The catalogue key of the item it opens, so Back can return focus to it. */
  readonly itemKey?: string;
}

export function Card({ href, title, hook, art, glyph, tone, tag, tick, itemKey }: CardProps) {
  return (
    <a className={`card card--${tone}`} href={href} data-key={itemKey}>
      <span className="card__art" aria-hidden="true">
        {art ? (
          <img
            src={art}
            alt=""
            loading="lazy"
            decoding="async"
            width={560}
            height={436}
            onError={(e) => {
              // Art not generated yet: hide the broken image and let the tinted ground show.
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span className="card__glyph">{glyph}</span>
        )}
      </span>
      <span className="card__body">
        <span className="card__title">{title}</span>
        {hook ? <span className="card__hook">{hook}</span> : null}
        {tag ? <span className="card__tag">{tag}</span> : null}
      </span>
      {tick ? <span className="card__tick">{tick}</span> : null}
    </a>
  );
}

/** A group of cards under a heading, every card shown: no paging (advisor q7 ruling 2). */
export function CardGroup({ id, title, line, children }: { readonly id: string; readonly title: string; readonly line?: string; readonly children: ReactNode }) {
  return (
    <section className="hub__group" aria-labelledby={`grp-${id}`} id={`g-${id}`}>
      <div className="hub__group-head">
        <h2 id={`grp-${id}`} className="hub__group-title">{title}</h2>
        {line ? <p className="hub__group-line">{line}</p> : null}
      </div>
      <div className="cards">{children}</div>
    </section>
  );
}

/** Jump links to each group on a long hub page. */
export function GroupJumps({ groups }: { readonly groups: ReadonlyArray<{ readonly id: string; readonly title: string; readonly n?: number }> }) {
  return (
    <nav className="jumps" aria-label="Jump to a group">
      {groups.map((g) => (
        <a key={g.id} className="jumps__link" href={`#g-${g.id}`} onClick={(e) => jump(e, `g-${g.id}`)}>
          {g.title}
          {g.n !== undefined ? <span className="jumps__n">{g.n}</span> : null}
        </a>
      ))}
    </nav>
  );
}

/**
 * In-page jumps are not routes: the delegated router only handles `#/...`
 * links, and an ordinary `#g-x` hash would replace the route in the address
 * bar. So scroll by hand and leave the address alone.
 */
export function jump(e: { preventDefault: () => void }, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  if (el instanceof HTMLDetailsElement) el.open = true;
  el.scrollIntoView({ block: 'start' });
  const h = el.querySelector<HTMLElement>('h2, h3');
  if (h) {
    h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  }
}
