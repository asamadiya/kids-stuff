export interface CoverImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
  readonly motionEnabled?: boolean;
}

const BASE_URL: string = import.meta.env.BASE_URL ?? '/';

function resolveAssetUrl(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${base}${path.replace(/^\/+/, '')}`;
}

export function CoverImage({
  src,
  alt,
  className,
  width = 1200,
  height = 800,
  motionEnabled = false,
}: CoverImageProps) {
  return (
    <img
      className={className}
      src={resolveAssetUrl(src)}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
      data-motion={motionEnabled ? 'on' : 'off'}
    />
  );
}

export default CoverImage;
