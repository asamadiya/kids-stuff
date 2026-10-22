/**
 * Print every catalogue entry's key and master picture as JSON, for
 * scripts/art/cards.py. Run under vite-node so import.meta.glob resolves:
 *
 *   npx vite-node scripts/art/catalog-manifest.ts
 */
import { ENTRIES, PARTS, directory, cardId } from '../../src/learn/catalog';

const seen = new Map<string, string>();
for (const e of ENTRIES) if (e.art) seen.set(cardId(e.key), e.art);
for (const { groups } of directory()) for (const g of groups) for (const e of g.entries) if (e.art) seen.set(cardId(e.key), e.art);
for (const p of PARTS) seen.set(cardId(`hub/${p.id}`), p.art.replace(/\.webp$/, '.png'));
process.stdout.write(JSON.stringify([...seen].map(([id, art]) => ({ id, art }))));
