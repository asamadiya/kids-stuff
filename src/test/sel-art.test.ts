import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every picture an exercise can reach must exist on disk.
 *
 * Panel ids are often built from a per-module prefix — `` `${P}-swap-setup` `` —
 * so a scan for plain quoted strings silently misses whole scenarios. This
 * resolves the prefix constants before checking, which is how four missing
 * panels in Hold the Line went unnoticed until a browser rendered them.
 */
describe('every referenced picture exists', () => {
  const have = new Set(
    readdirSync('public/games/sel').filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4)),
  );

  const referenced = (): { file: string; slug: string }[] => {
    const out: { file: string; slug: string }[] = [];
    for (const file of readdirSync('src/sel').filter((f) => f.endsWith('.ts'))) {
      const src = readFileSync(join('src/sel', file), 'utf8');
      const consts = new Map<string, string>();
      for (const m of src.matchAll(/const\s+(\w+)\s*=\s*'([a-z0-9-]+)'/g)) consts.set(m[1], m[2]);
      for (const m of src.matchAll(/`\$\{(\w+)\}([a-z0-9-]+)`/g)) {
        const base = consts.get(m[1]);
        if (base) out.push({ file, slug: base + m[2] });
      }
      const stem = file.slice(0, -3);
      for (const m of src.matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)+)'/g)) {
        if (m[1].startsWith(`${stem}-`)) out.push({ file, slug: m[1] });
      }
    }
    return out;
  };

  it('resolves prefixed panel ids and finds every file', () => {
    const missing = referenced().filter((r) => !have.has(r.slug));
    expect(missing.map((r) => `${r.file} -> ${r.slug}`)).toEqual([]);
  });

  it('checks a meaningful number of pictures', () => {
    expect(referenced().length).toBeGreaterThan(100);
  });
});
