import type { LangBook, Moment, Rhyme, Word } from './types';

export * from './types';

/**
 * Collected at build time, one file per group, as with Make & Do and Play:
 * src/languages/moments/*.ts export MOMENTS, rhymes/*.ts export RHYMES,
 * books/*.ts export BOOK, words.ts exports WORDS. A leading underscore keeps
 * a draft out.
 */
const m = import.meta.glob<{ MOMENTS: readonly Moment[] }>(['./moments/*.ts', '!./moments/_*.ts'], { eager: true });
const r = import.meta.glob<{ RHYMES: readonly Rhyme[] }>(['./rhymes/*.ts', '!./rhymes/_*.ts'], { eager: true });
const b = import.meta.glob<{ BOOK: LangBook }>(['./books/*.ts', '!./books/_*.ts'], { eager: true });
const w = import.meta.glob<{ WORDS: readonly Word[] }>('./words.ts', { eager: true });

const sorted = <T,>(mods: Record<string, T>) => Object.keys(mods).sort().map((k) => mods[k]);

export const MOMENTS: readonly Moment[] = sorted(m).flatMap((x) => x.MOMENTS);
export const RHYMES: readonly Rhyme[] = sorted(r).flatMap((x) => x.RHYMES);
export const LANG_BOOKS: readonly LangBook[] = sorted(b).map((x) => x.BOOK);
export const WORDS: readonly Word[] = sorted(w).flatMap((x) => x.WORDS);

export const WHEN_LABEL: Record<Moment['when'], string> = {
  morning: 'Morning',
  meals: 'Eating together',
  ready: 'Getting ready',
  play: 'Playing',
  outside: 'Outside',
  bedtime: 'Bedtime',
  mia: 'With Mia',
  grandparents: 'With Nanamma, Tatayya, Paati and Thatha',
};

export const getMoment = (id: string) => MOMENTS.find((x) => x.id === id);
export const getRhyme = (id: string) => RHYMES.find((x) => x.id === id);
export const getLangBook = (id: string) => LANG_BOOKS.find((x) => x.id === id);
