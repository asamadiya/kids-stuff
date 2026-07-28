import type { Story } from '../types';

export interface StoryImageProps {
  readonly story: Story;
  /** 0-based page index, or 'cover' for the library cover art. */
  readonly page: number | 'cover';
  readonly alt: string;
}

/**
 * One story illustration, served as a WebP derivative from public/art/<slug>/.
 *
 * The masters are 1152x896 PNGs of about 1.5 MB. Serving them directly meant
 * the home page pulled 40.7 MB across 36 requests — measured live — and a full
 * scroll of all 215 tiles pulled roughly 300 MB, because a tile that renders at
 * 261 px was being handed a 1152 px master. Lazy loading was already correct;
 * the file size was the defect.
 *
 * Covers therefore take a 560-wide derivative: the grid is capped at
 * `--page-max: 1180px`, so a tile never exceeds ~250 CSS px, which 560 covers
 * at DPR 2. Reader pages keep the master's dimensions and change only format —
 * the reader renders at 1088x816 on desktop and asks for ~1560 device px on a
 * DPR-2 tablet, so there is nothing to downscale there.
 *
 * Run `python3 scripts/encode-art.py` after adding or redrawing any art.
 */
export function StoryImage({ story, page, alt }: StoryImageProps) {
  const isCover = page === 'cover';
  const file = isCover ? `cover-${COVER_WIDTH}` : `page-${page + 1}`;
  const src = `${import.meta.env.BASE_URL}art/${story.slug}/${file}.webp`;
  return (
    <img
      className="story-image"
      src={src}
      alt={alt}
      width={isCover ? COVER_WIDTH : 1152}
      height={isCover ? COVER_HEIGHT : 896}
      loading={isCover ? 'lazy' : 'eager'}
      decoding="async"
      draggable={false}
    />
  );
}

/** Kept in step with scripts/encode-art.py, which is asserted in the tests. */
export const COVER_WIDTH = 560;
export const COVER_HEIGHT = 436;

export default StoryImage;
