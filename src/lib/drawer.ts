/**
 * A drawer in the workshop: a small, versioned rack of things the child has
 * made, kept in `localStorage`. Access is wrapped because an opaque origin or
 * a private window can make storage throw on read.
 */
export interface Kept {
  readonly id: string;
  readonly made: string;
}

const storage = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export interface Drawer<T extends Kept> {
  list(): T[];
  add(item: Omit<T, 'id' | 'made'> & Partial<Kept>): T;
  remove(id: string): void;
  clear(): void;
}

/** Monotonic-ish id without pulling in a dependency. */
let seq = 0;
const mintId = (): string => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

export function drawer<T extends Kept>(name: string, version = 1): Drawer<T> {
  const key = `ks.workshop.${name}.v${version}`;
  const read = (): T[] => {
    const s = storage();
    if (!s) return [];
    try {
      const raw = s.getItem(key);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  };
  const write = (items: readonly T[]): void => {
    const s = storage();
    if (!s) return;
    try {
      s.setItem(key, JSON.stringify(items.slice(-200)));
    } catch {
      /* a full or unavailable quota must never break the tool */
    }
  };
  return {
    list: read,
    add(item) {
      const full = { ...item, id: item.id ?? mintId(), made: item.made ?? new Date().toISOString() } as T;
      write([...read(), full]);
      return full;
    },
    remove(id) {
      write(read().filter((i) => i.id !== id));
    },
    clear() {
      write([]);
    },
  };
}
