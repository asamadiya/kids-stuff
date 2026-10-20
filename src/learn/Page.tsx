import type { ReactNode } from 'react';
import type { GrownUpNote } from '../notes/types';
import { GrownUps } from './GrownUps';

/**
 * The frame every hub and listing page shares: a back link, a title, the
 * grown-ups button in the same top-right place, a one-line "what to expect"
 * a grown-up can read without opening anything, and the block-print band.
 */
export interface PageProps {
  readonly title: string;
  readonly back?: { readonly href: string; readonly label: string } | null;
  readonly note: GrownUpNote;
  /** One line for the grown-ups panel, ahead of the note's own "what to expect". */
  readonly expect?: string;
  /** Retained for call sites; the decorative band was removed on the advisor's ruling. */
  readonly band?: 'stories' | 'maths' | 'science' | 'make';
  readonly children: ReactNode;
}

export function Page({ title, back, note, expect, children }: PageProps) {
  return (
    <main id="main-content" className="lc-page" tabIndex={-1}>
      <header className="lc-top">
        {back ? (
          <a className="lc-top__back" href={back.href}>
            <span aria-hidden="true">←</span> {back.label}
          </a>
        ) : null}
        <h1 className="lc-top__title">{title}</h1>
        <GrownUps note={expect ? { ...note, expect: `${expect} ${note.expect}` } : note} title={title} />
      </header>
      {children}
    </main>
  );
}

export interface CardProps {
  readonly href: string;
  readonly title: string;
  readonly hook?: string;
  readonly art?: string;
  /** A drawn picture when there is no art yet; never an emoji. */
  readonly glyph?: ReactNode;
  readonly tone: 'stories' | 'maths' | 'science' | 'make';
  readonly tag?: string;
  readonly tick?: string | null;
}

export function Card({ href, title, hook, art, glyph, tone, tag, tick }: CardProps) {
  return (
    <a className={`card card--${tone}`} href={href}>
      <span className="card__art" aria-hidden="true">
        {art ? (
          <img
            src={art}
            alt=""
            loading="lazy"
            decoding="async"
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
