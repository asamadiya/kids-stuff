import { storyFigure } from './figures';

export interface StoryFigureProps {
  readonly figureId: string;
}

/**
 * A diagram page's picture.
 *
 * Sits in the same slot as `StoryImage`, so the reader's layout, page
 * turning and focus handling are untouched. An unknown id renders nothing
 * rather than throwing: a missing diagram should cost a picture, not the
 * whole story — and the registry test fails the build long before a reader
 * could hit it.
 */
export function StoryFigure({ figureId }: StoryFigureProps) {
  const spec = storyFigure(figureId);
  if (!spec) return null;
  return (
    <div className="story-figure">
      {spec.render()}
      <p className="story-figure__caption">{spec.caption}</p>
    </div>
  );
}

export default StoryFigure;
