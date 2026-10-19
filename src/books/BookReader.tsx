import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Book, BookPage } from './types';
import { GrownUps } from '../learn/GrownUps';
import { StoryFigure } from '../components/StoryFigure';

/**
 * The picture-book reader: words set inside the picture.
 *
 * The old reader put the painting on the left and a paragraph on the right,
 * which is a textbook layout; the parent pointed at Julia Donaldson, where the
 * words live in the art. Every page here names the calm `zone` its painting
 * left open (the art prompt asks for it), and the words are laid over that
 * zone on a soft paper wash so they stay readable whatever the painting does.
 *
 * Words are app text, never lettered into the image: a misspelling inside a
 * painting cannot be corrected, and app text can be selected, enlarged and
 * read by a screen reader.
 *
 * Page turns are buttons and arrow keys only, and a page turn is instant —
 * the standing rule is no motion.
 */

export interface BookReaderProps {
  readonly book: Book;
  /** 0-based; `pages.length` is the end screen. */
  readonly page: number;
  readonly onPage: (page: number) => void;
  readonly backHref: string;
  readonly backLabel: string;
  readonly onFinished?: (slug: string) => void;
}

const BASE = import.meta.env.BASE_URL;

export function artSrc(slug: string, page: number | 'cover'): string {
  const name = page === 'cover' ? 'cover' : `page-${page + 1}`;
  return `${BASE}art/books/${slug}/${name}.webp`;
}

/** Marks the refrain wherever it occurs, so a child can join in on it. */
function withRefrain(text: string, refrain: string | undefined) {
  if (!refrain) return text;
  const at = text.toLowerCase().indexOf(refrain.toLowerCase().replace(/[.!?]$/, ''));
  if (at === -1) return text;
  const len = refrain.replace(/[.!?]$/, '').length;
  return (
    <>
      {text.slice(0, at)}
      <mark className="refrain">{text.slice(at, at + len)}</mark>
      {text.slice(at + len)}
    </>
  );
}

function Paragraphs({ page, refrain }: { readonly page: BookPage; readonly refrain?: string }) {
  return (
    <>
      {page.text.split(/\n\n+/).map((para, i) => (
        <p key={i}>{withRefrain(para, refrain)}</p>
      ))}
    </>
  );
}

export function BookReader({ book, page, onPage, backHref, backLabel, onFinished }: BookReaderProps) {
  const count = book.pages.length;
  const atEnd = page >= count;
  const current = atEnd ? null : book.pages[page];
  const finishedRef = useRef<string | null>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (atEnd && finishedRef.current !== book.slug) {
      finishedRef.current = book.slug;
      onFinished?.(book.slug);
    }
    if (!atEnd) finishedRef.current = null;
  }, [atEnd, book.slug, onFinished]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('dialog[open]') || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
      if (e.key === 'ArrowRight' && page < count) onPage(page + 1);
      if (e.key === 'ArrowLeft' && page > 0) onPage(page - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [page, count, onPage]);

  // Keep focus on Next across page turns so a keyboard reader never loses it.
  useLayoutEffect(() => {
    if (document.activeElement === document.body) nextRef.current?.focus({ preventScroll: true });
  }, [page]);

  return (
    <main id="main-content" className="book" aria-label={`Reading ${book.title}`}>
      <header className="book__bar">
        <a className="lc-top__back" href={backHref}>
          <span aria-hidden="true">←</span> {backLabel}
        </a>
        <h1 className="book__title">{book.title}</h1>
        <GrownUps note={book.note} title={book.title} />
      </header>

      {current ? (
        <article className={`spread spread--${current.zone}${current.big ? ' spread--big' : ''}`} aria-label={`Page ${page + 1} of ${count}`}>
          {current.figureId ? (
            <div className="spread__figure">
              <StoryFigure figureId={current.figureId} />
            </div>
          ) : (
            <img className="spread__art" src={artSrc(book.slug, page)} alt={current.alt} width={1152} height={896} draggable={false} />
          )}
          <div className="spread__words">
            <Paragraphs page={current} refrain={book.refrain} />
          </div>
        </article>
      ) : (
        <EndScreen book={book} onRestart={() => onPage(0)} backHref={backHref} backLabel={backLabel} />
      )}

      <nav className="book__nav" aria-label="Turn the page">
        <button type="button" className="btn btn--big page-btn" disabled={page === 0} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <span aria-hidden="true">←</span>
        </button>
        <span className="book__count" aria-hidden="true">
          {atEnd ? 'The end' : `${page + 1} / ${count}`}
        </span>
        <button
          ref={nextRef}
          type="button"
          className="btn btn--primary btn--big page-btn"
          disabled={atEnd}
          onClick={() => onPage(page + 1)}
          aria-label={page === count - 1 ? 'Finish the book' : 'Next page'}
        >
          <span aria-hidden="true">→</span>
        </button>
      </nav>
    </main>
  );
}

function EndScreen({ book, onRestart, backHref, backLabel }: { readonly book: Book; readonly onRestart: () => void; readonly backHref: string; readonly backLabel: string }) {
  return (
    <section className="book-end" aria-labelledby="book-end-title">
      <img className="book-end__art" src={artSrc(book.slug, 'cover')} alt="" width={1152} height={896} />
      <div className="book-end__body">
        <h2 id="book-end-title" className="book-end__title">The end</h2>
        {book.tryThis ? (
          <div className="try-this">
            <h3 className="try-this__title">Try this: {book.tryThis.title}</h3>
            <ol className="try-this__steps">
              {book.tryThis.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            {book.tryThis.safety ? <p className="try-this__safety"><b>Safety:</b> {book.tryThis.safety}</p> : null}
          </div>
        ) : null}
        <div className="book-end__actions">
          <button type="button" className="btn" onClick={onRestart}>
            Read it again
          </button>
          <a className="btn btn--primary" href={backHref}>
            {backLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export default BookReader;
