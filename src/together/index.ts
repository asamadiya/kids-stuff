import type { PlayIdea, PlayGroupId } from './types';
import { PLAY_GROUPS } from './types';

export * from './types';

/**
 * Every idea, collected from src/together/ideas/*.ts at build time, so adding
 * a group's ideas is adding one file. Each file exports `IDEAS`. Order: the
 * group order of PLAY_GROUPS, then the order inside each file.
 */
const modules = import.meta.glob<{ IDEAS: readonly PlayIdea[] }>(['./ideas/*.ts', '!./ideas/_*.ts'], { eager: true });

const order = (g: PlayGroupId) => PLAY_GROUPS.findIndex((x) => x.id === g);

export const IDEAS: readonly PlayIdea[] = Object.keys(modules)
  .sort()
  .flatMap((k) => modules[k].IDEAS)
  .map((idea, i) => ({ idea, i }))
  .sort((a, b) => order(a.idea.group) - order(b.idea.group) || a.i - b.i)
  .map((x) => x.idea);

export function getIdea(id: string): PlayIdea | undefined {
  return IDEAS.find((x) => x.id === id);
}

export function ideasIn(group: PlayGroupId): readonly PlayIdea[] {
  return IDEAS.filter((x) => x.group === group);
}

export const MIA_LABEL: Record<PlayIdea['mia']['way'], string> = {
  joins: 'Mia joins in',
  alongside: 'Mia plays alongside',
  apart: 'Just you and him',
};

export const WHERE_LABEL: Record<PlayIdea['where'], string> = { indoors: 'Indoors', outdoors: 'Outdoors', either: 'Indoors or out' };
