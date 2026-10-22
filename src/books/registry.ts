import type { Book, Shelf, ShelfId } from './types';

/**
 * Every picture book, collected from src/books/data/*.ts by Vite at build
 * time, so adding a book is adding one file. The order inside a shelf is the
 * slate order in SLATE below; a book not in SLATE goes to the end of its shelf.
 */
// `!./data/_*` lets a book be drafted as `_slug.ts` without entering the shelf.
const modules = import.meta.glob<{ book: Book }>(['./data/*.ts', '!./data/_*.ts'], { eager: true });

/** Books whose module failed to load are skipped by `import.meta.glob` at build
 *  time only if the file is excluded; a syntax error fails the build loudly, which
 *  is what we want once authoring is over. */

/** The advisor's slate order (RULINGS-4-slate). */
export const SLATE: readonly string[] = [
  'i-was-still-building-that', 'this-dinosaur-is-mine', 'i-want-nanna-too', 'can-i-join-the-game',
  'the-chase-stops-here', 'that-wasnt-the-rule', 'build-beside-me', 'who-left-the-shoes-there',
  'the-monkey-and-the-crocodile', 'the-quails-lift-the-net', 'make-this-line-shorter',
  'a-hill-for-an-umbrella', 'the-pumpkin-that-rolled-home',
  'first-the-dust-then-the-diyas', 'watch-for-the-bubbles', 'the-kite-needs-some-wind', 'a-little-of-everything',
  'may-i-put-colour-here', 'a-rakhi-for-both-of-us',
  'will-this-clay-boat-float', 'one-block-can-balance-two', 'a-tiny-dinosaur-a-huge-shadow', 'the-bean-in-the-dark',
  'aryabhata-and-the-powers-of-ten', 'bose-measures-a-growing-plant', 'raman-and-the-blue-sea',
];

const rank = (slug: string) => {
  const i = SLATE.indexOf(slug);
  return i === -1 ? SLATE.length : i;
};

export const BOOKS: readonly Book[] = Object.values(modules)
  .map((m) => m.book)
  .sort((a, b) => rank(a.slug) - rank(b.slug) || a.title.localeCompare(b.title));

export function getBook(slug: string): Book | undefined {
  return BOOKS.find((b) => b.slug === slug);
}

export function booksOn(shelf: ShelfId): readonly Book[] {
  return BOOKS.filter((b) => b.shelf === shelf);
}

export const SHELVES: readonly Shelf[] = [
  {
    id: 'family',
    title: 'Family & Friends',
    line: 'Arjun, his little sister Mia, and their friends Zoe and Ben — real squabbles, and what to do next.',
    note: {
      what: 'Picture books about a five-year-old, his two-year-old sister and two friends, beside short "Try a situation" exercises built from the same moments.',
      expect: 'He will usually take Arjun’s side first. That is fine — the books are written so the adult in the story protects what Arjun cares about before anyone asks him to do anything.',
      practising: 'Naming a feeling, setting a boundary in words, joining play without taking it over, stopping when asked, and asking an adult for help.',
      ask: '"What did Arjun say instead of grabbing?" — then try the line yourselves the next time it comes up.',
      next: 'Pick one line from a book ("You said stop. I stopped.") and use the same words at home for a week.',
      honest: 'Reading about stopping is not stopping. Expect reminders, not instant self-control; the books give you shared words to use in the moment.',
    },
  },
  {
    id: 'tales',
    title: 'Tales from India',
    line: 'Panchatantra, Jataka, Birbal, a Krishna story and a Bengali folk tale, retold for reading aloud.',
    note: {
      what: 'Traditional tales, told simply and labelled as tales — not history.',
      expect: 'Tricks and escapes land well at five. The Krishna story is told as the story people tell, without claiming it happened.',
      practising: 'Following a plot with a problem and a clever turn; listening to an older story; noticing who helped whom.',
      ask: '"What would you have done instead?"',
      next: 'Retell one tale at dinner with him telling the next bit each time you pause.',
      honest: 'These are retellings, shortened for a five-year-old; the originals are longer and sometimes harsher.',
    },
  },
  {
    id: 'festivals',
    title: 'Festivals at Home',
    line: 'Deepavali, Sankranti and Pongal, Ugadi, Holi with friends, and Rakhi, as this family does them.',
    note: {
      what: 'One family’s way of keeping each festival — the cleaning, the colour, the kites, the threads — not a lesson about the festival.',
      expect: 'He will compare it with what your family does. Let the differences be the conversation.',
      practising: 'Family routines, helping, and the boundaries that make a celebration safe (asking before colour, adults with flames).',
      ask: '"What do we do that Arjun’s family doesn’t?"',
      next: 'Give him one real job in your next festival preparation, start to finish.',
      honest: 'Every family keeps these days differently. These books show one Telugu–Tamil family in the Bay Area: Nanna’s Telugu days, Amma’s Tamil days, and the community Holi they go to with friends. They are not the right way, and not how every Telugu or Tamil family does it.',
    },
  },
  {
    id: 'how',
    title: 'How Things Work',
    line: 'Floating, balancing, shadows and seeds — each book pairs with a Science game and something to try.',
    note: {
      what: 'Picture books where Arjun tries something, it fails, he changes one thing and it works. Each pairs with a Science game.',
      expect: 'He may want to try it before you finish the book. Let him — the book will wait.',
      practising: 'Changing one thing at a time and watching what happens; the science idea named in each book.',
      ask: '"What did he change?"',
      next: 'Do the Try-this card at the end. It needs things you have at home.',
      honest: 'A book can only show the result. The real lesson is the water tray, the beam or the torch.',
    },
  },
  {
    id: 'people',
    title: 'People & Discoveries',
    line: 'Aryabhata, Jagadish Chandra Bose and C. V. Raman — and the longer read-alouds about thinkers everywhere.',
    note: {
      what: 'True stories about Indian scientists, and links to longer read-aloud accounts of thinkers around the world.',
      expect: 'The ideas (place value, measuring tiny changes, why the sea is blue) are bigger than the stories. Expect "why?" questions you will need to look up together.',
      practising: 'That ideas have people behind them, and that people find things out by measuring and testing.',
      ask: '"How did he find out?"',
      next: 'Look up one of these people together and find one more true fact.',
      honest: 'These are simplified. Where the book shows a modern diagram it says so, and it never puts invented words in a real person’s mouth.',
    },
  },
];

export function getShelf(id: string): Shelf | undefined {
  return SHELVES.find((s) => s.id === id);
}
