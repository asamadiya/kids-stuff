import type { ReactNode } from 'react';
import { n } from '../shared';
import type { DepthName, DepthTreatment } from './types';

export interface DepthLayerProps {
  readonly depth: DepthName;
  /**
   * Optional scene-authored atmospheric treatment. When omitted the layer is a
   * plain, fully-opaque, unfiltered group — depth is composition, not a global
   * post-process. `opacity` becomes the SVG opacity attribute and `parallax` a
   * transform offset; `blur`/`saturation`/`contrast` are realised through an SVG
   * filter this layer *generates and references itself* (never a CSS `filter:`),
   * so a treatment alone applies its requested effect with no external wiring.
   */
  readonly treatment?: DepthTreatment;
  /**
   * Optional scene id-namespacer. When a treatment needs a filter, its id is
   * minted through this so filter ids stay collision-free across scenes.
   */
  readonly id?: (name: string) => string;
  readonly children: ReactNode;
  readonly className?: string;
}

const hasFilterFields = (t: DepthTreatment): boolean =>
  t.blur !== undefined || t.saturation !== undefined || t.contrast !== undefined;

/** Deterministic, id-safe signature of a treatment's filter fields. */
const fmt = (v: number | undefined): string =>
  v === undefined ? 'x' : String(n(v)).replace('.', 'p').replace('-', 'm');

/**
 * Wraps one depth band's selected geometry. A treatment affects only these
 * children, through SVG attributes and a generated SVG filter def: `opacity`
 * becomes the SVG opacity attribute, `parallax` a transform offset, and
 * blur/saturation/contrast an SVG `<filter>` this component emits and references
 * inline. No CSS filters are ever used, so the cover stripper never has to chase
 * a live blur, and a treatment can never be silently dropped for lack of an
 * external filter reference.
 */
export function DepthLayer({ depth, treatment, id, children, className }: DepthLayerProps) {
  const opacity = treatment?.opacity;
  const parallax = treatment?.parallax;

  const needsFilter = treatment !== undefined && hasFilterFields(treatment);
  const filterName = needsFilter
    ? `depth-${depth}-b${fmt(treatment!.blur)}s${fmt(treatment!.saturation)}c${fmt(treatment!.contrast)}`
    : undefined;
  const filterDomId = filterName ? (id ? id(filterName) : filterName) : undefined;

  return (
    <g
      data-depth={depth}
      className={className}
      opacity={opacity !== undefined ? n(opacity) : undefined}
      filter={filterDomId ? `url(#${filterDomId})` : undefined}
      transform={parallax !== undefined ? `translate(${n(parallax)} 0)` : undefined}
    >
      {needsFilter ? <DepthFilter domId={filterDomId!} treatment={treatment!} /> : null}
      {children}
    </g>
  );
}

function DepthFilter({
  domId,
  treatment,
}: {
  readonly domId: string;
  readonly treatment: DepthTreatment;
}) {
  const { blur, saturation, contrast } = treatment;
  return (
    <filter id={domId} x="-20%" y="-20%" width="140%" height="140%">
      {blur !== undefined ? <feGaussianBlur stdDeviation={n(blur)} /> : null}
      {saturation !== undefined ? (
        <feColorMatrix type="saturate" values={`${n(saturation)}`} />
      ) : null}
      {contrast !== undefined ? (
        <feComponentTransfer>
          <feFuncR type="linear" slope={n(contrast)} intercept={n((1 - contrast) / 2)} />
          <feFuncG type="linear" slope={n(contrast)} intercept={n((1 - contrast) / 2)} />
          <feFuncB type="linear" slope={n(contrast)} intercept={n((1 - contrast) / 2)} />
        </feComponentTransfer>
      ) : null}
    </filter>
  );
}
