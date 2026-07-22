import type { Story } from '../types';

export interface StoryImageProps {
  readonly story: Story;
  /** 0-based page index, or 'cover' for the library cover art. */
  readonly page: number | 'cover';
  readonly alt: string;
  readonly motionEnabled?: boolean;
}

/** One story illustration as a pre-generated raster image from public/art/<slug>/. */
export function StoryImage({ story, page, alt, motionEnabled = false }: StoryImageProps) {
  const file = page === 'cover' ? 'cover' : `page-${page + 1}`;
  const src = `${import.meta.env.BASE_URL}art/${story.slug}/${file}.png`;
  return (
    <img
      className="story-image"
      src={src}
      alt={alt}
      width={1152}
      height={896}
      loading={page === 'cover' ? 'lazy' : 'eager'}
      decoding="async"
      draggable={false}
      data-motion={motionEnabled ? 'on' : 'off'}
    />
  );
}

export default StoryImage;
