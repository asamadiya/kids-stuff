import { n } from '../shared';
import { MaterialDef } from './materials';
import type { CinematicDefsProps, DirectionalLight, EnvironmentLight, PracticalLight } from './types';

/**
 * The scene's authored lighting + material `<defs>`. Unlike a fixed global
 * lighting result, this emits *only* what the scene authored: one filter per
 * material, a fill and a contact-ambient gradient from the rig, a rim gradient
 * only when a rim is authored, and one glow per practical. Nothing is drawn;
 * there is no full-frame wash and no CSS filter. Depth treatments are owned by
 * {@link DepthLayer}, which generates and references its own SVG filter, so no
 * unreferenced depth defs are minted here.
 */
export function CinematicDefs({ id, seed, lighting, materials }: CinematicDefsProps) {
  const { fill, rim, practicals } = lighting;

  return (
    <>
      {materials.map((material) => (
        <MaterialDef
          key={material.id}
          domId={id(material.id)}
          material={material}
          light={lighting.key}
          seed={seed}
        />
      ))}

      <FillLight domId={id('fill-light')} fill={fill} />
      <ContactAo domId={id('contact-ao')} fill={fill} />

      {rim ? <RimLight domId={id('rim-light')} rim={rim} /> : null}

      {practicals.map((practical) => (
        <PracticalGlow key={practical.id} domId={id(practical.id)} practical={practical} />
      ))}
    </>
  );
}

function RimLight({ domId, rim }: { readonly domId: string; readonly rim: DirectionalLight }) {
  // A rim light is a 3D directional light projected into the picture plane: its
  // horizontal reach shrinks with elevation (cos) and a high light biases the
  // separation band upward (−sin), so azimuth AND elevation both steer the band.
  const az = (rim.azimuth * Math.PI) / 180;
  const el = (rim.elevation * Math.PI) / 180;
  const dirX = Math.cos(az) * Math.cos(el);
  const dirY = Math.sin(az) * Math.cos(el) - Math.sin(el);
  return (
    <linearGradient
      id={domId}
      x1={n(0.5 - dirX * 0.5)}
      y1={n(0.5 - dirY * 0.5)}
      x2={n(0.5 + dirX * 0.5)}
      y2={n(0.5 + dirY * 0.5)}
    >
      <stop offset="0" stopColor={rim.color} stopOpacity={n(rim.intensity)} />
      <stop offset="1" stopColor={rim.color} stopOpacity="0" />
    </linearGradient>
  );
}

function FillLight({ domId, fill }: { readonly domId: string; readonly fill: EnvironmentLight }) {
  return (
    <radialGradient id={domId} cx="50%" cy="38%" r="65%">
      <stop offset="0" stopColor={fill.color} stopOpacity={n(fill.intensity)} />
      <stop offset="1" stopColor={fill.color} stopOpacity="0" />
    </radialGradient>
  );
}

function ContactAo({ domId, fill }: { readonly domId: string; readonly fill: EnvironmentLight }) {
  // Grounding ambient occlusion; its depth tracks the scene fill intensity.
  return (
    <radialGradient id={domId} cx="50%" cy="50%" r="50%">
      <stop offset="0" stopColor="#120f1c" stopOpacity={n(0.35 + fill.intensity * 0.35)} />
      <stop offset="1" stopColor="#120f1c" stopOpacity="0" />
    </radialGradient>
  );
}

function PracticalGlow({
  domId,
  practical,
}: {
  readonly domId: string;
  readonly practical: PracticalLight;
}) {
  // Positioned in scene space so the practical's authored x/y/radius place and
  // size the glow, rather than a fixed object-bounding-box gradient.
  return (
    <radialGradient
      id={domId}
      gradientUnits="userSpaceOnUse"
      cx={n(practical.x)}
      cy={n(practical.y)}
      r={n(practical.radius)}
    >
      <stop offset="0" stopColor={practical.color} stopOpacity={n(practical.intensity)} />
      <stop offset="0.6" stopColor={practical.color} stopOpacity={n(practical.intensity * 0.4)} />
      <stop offset="1" stopColor={practical.color} stopOpacity="0" />
    </radialGradient>
  );
}
