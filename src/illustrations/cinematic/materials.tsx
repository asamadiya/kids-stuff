import { n } from '../shared';
import type { DirectionalLight, MaterialInstance, MaterialPreset } from './types';

/**
 * Reusable material recipes. Each {@link MaterialInstance} is realised as a
 * scene-namespaced SVG `<filter>` that layers authored value passes
 * (base / shadow / highlight) with a preset-specific surface response before
 * texture — metal and stone read the scene key light for their specular /
 * diffuse pass, so the same recipe relights per scene instead of baking one
 * fixed lighting result. Every field of the instance changes the emitted def.
 */

/** Project the scene key direction into filter-space light coordinates. */
const keyLightPoint = (
  key: DirectionalLight,
  reach = 220,
): { readonly x: number; readonly y: number; readonly z: number } => {
  const az = (key.azimuth * Math.PI) / 180;
  const el = (key.elevation * Math.PI) / 180;
  return {
    x: n(Math.cos(az) * Math.cos(el) * reach),
    y: n(-Math.sin(az) * Math.cos(el) * reach),
    z: n(Math.sin(el) * reach + 60),
  };
};

interface HeadProps {
  readonly material: MaterialInstance;
  readonly light: DirectionalLight;
  readonly seed: number;
}

/** Preset-specific surface pass. Produces a filter result named `surface`. */
function SurfacePass({ material, light, seed }: HeadProps) {
  const { preset, textureScale, roughness } = material;
  const freqX = n(0.008 + 0.05 * textureScale);
  const freqY = n(0.008 + 0.05 * textureScale);
  const octaves = Math.max(1, Math.min(4, Math.round(1 + roughness * 3)));
  const lp = keyLightPoint(light);

  switch (preset) {
    case 'metal':
      return (
        <>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${n(freqX * 0.6)} ${n(freqY * 0.6)}`}
            numOctaves={octaves}
            seed={seed + 17}
            result="noise"
          />
          <feSpecularLighting
            in="noise"
            surfaceScale={n(1.4 + roughness * 2)}
            specularConstant={n(0.9 * light.intensity)}
            specularExponent={n(6 + (1 - roughness) * 34)}
            lightingColor={light.color}
            result="surface"
          >
            <fePointLight x={lp.x} y={lp.y} z={lp.z} />
          </feSpecularLighting>
        </>
      );
    case 'stone':
      return (
        <>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${n(freqX * 0.9)} ${n(freqY * 1.4)}`}
            numOctaves={octaves}
            seed={seed + 3}
            result="noise"
          />
          <feDiffuseLighting
            in="noise"
            surfaceScale={n(2 + roughness * 3)}
            diffuseConstant={n(0.85 * light.intensity)}
            lightingColor={light.color}
            result="surface"
          >
            <feDistantLight azimuth={light.azimuth} elevation={light.elevation} />
          </feDiffuseLighting>
        </>
      );
    case 'timber':
      return (
        <>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${n(freqX * 0.4)} ${n(freqY * 2.2)}`}
            numOctaves={octaves}
            seed={seed + 5}
            result="grain"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="grain"
            scale={n(1 + roughness * 3)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="surface"
          />
        </>
      );
    case 'cloth':
      return (
        <>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${n(freqX * 0.9)} ${n(freqY * 3)}`}
            numOctaves={octaves}
            seed={seed + 31}
            result="weave"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="weave"
            scale={n(1.4 + roughness * 3)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="surface"
          />
        </>
      );
    case 'water':
      return (
        <>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${n(freqX * 0.5)} ${n(freqY * 1.1)}`}
            numOctaves={octaves}
            seed={seed + 23}
            result="ripple"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="ripple"
            scale={n(2 + roughness * 4)}
            xChannelSelector="R"
            yChannelSelector="G"
            result="surface"
          />
        </>
      );
    case 'skin':
    default:
      return (
        <>
          <feGaussianBlur in="SourceGraphic" stdDeviation={n(0.4 + roughness * 1.2)} result="soft" />
          <feSpecularLighting
            in="soft"
            surfaceScale={n(1 + roughness)}
            specularConstant={n(0.4 * light.intensity)}
            specularExponent={n(8 + (1 - roughness) * 20)}
            lightingColor={light.color}
            result="surface"
          >
            <fePointLight x={lp.x} y={lp.y} z={lp.z} />
          </feSpecularLighting>
        </>
      );
  }
}

const usesSourceGraphicSurface = (preset: MaterialPreset): boolean =>
  preset === 'timber' || preset === 'cloth' || preset === 'water';

/**
 * One material `<filter>`, namespaced to the scene. Layers a base tint, an
 * authored shadow, the preset surface pass and a highlight over the source
 * geometry so a filter alone never reads as a flat procedural wash.
 */
export function MaterialDef({
  domId,
  material,
  light,
  seed,
}: {
  readonly domId: string;
  readonly material: MaterialInstance;
  readonly light: DirectionalLight;
  readonly seed: number;
}) {
  const { base, shadow, highlight } = material;
  // Displacement presets warp the SourceGraphic; lighting presets add a pass.
  const surfaceBlend = usesSourceGraphicSurface(material.preset) ? 'normal' : 'screen';

  return (
    <filter id={domId} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="linearRGB">
      <SurfacePass material={material} light={light} seed={seed} />

      <feFlood floodColor={base} floodOpacity="0.18" result="baseFlood" />
      <feComposite in="baseFlood" in2="SourceAlpha" operator="in" result="baseTint" />

      <feFlood floodColor={shadow} floodOpacity="0.4" result="shadowFlood" />
      <feComposite in="shadowFlood" in2="SourceAlpha" operator="in" result="shadowClip" />

      <feFlood floodColor={highlight} floodOpacity="0.32" result="hiFlood" />
      <feComposite in="hiFlood" in2="SourceAlpha" operator="in" result="hiEdge" />

      <feComposite in="surface" in2="SourceAlpha" operator="in" result="surfaceClip" />

      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="baseTint" />
        <feMergeNode in="shadowClip" />
        <feMergeNode in={surfaceBlend === 'screen' ? 'surfaceClip' : 'surface'} />
        <feMergeNode in="hiEdge" />
      </feMerge>
    </filter>
  );
}
