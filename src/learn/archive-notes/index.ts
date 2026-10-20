import type { ArchiveEntry } from './types';
import { ENTRIES as E00 } from './batch-00';
import { ENTRIES as E01 } from './batch-01';
import { ENTRIES as E02 } from './batch-02';
import { ENTRIES as E03 } from './batch-03';
import { ENTRIES as E04 } from './batch-04';
import { ENTRIES as E05 } from './batch-05';
import { ENTRIES as E06 } from './batch-06';
import { ENTRIES as E07 } from './batch-07';
import { ENTRIES as E08 } from './batch-08';
import { ENTRIES as E09 } from './batch-09';

export * from './types';

/** One entry per archive read-aloud slug; src/test/library.test.ts holds the coverage. */
export const ARCHIVE_ENTRIES: Readonly<Record<string, ArchiveEntry>> = {
  ...E00, ...E01, ...E02, ...E03, ...E04, ...E05, ...E06, ...E07, ...E08, ...E09,
};
