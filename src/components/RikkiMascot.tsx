export interface RikkiMascotProps {
  readonly className?: string;
}

/**
 * Rikki, a red panda (Ailurus fulgens), drawn as a plate in the same hand as
 * the rest of the guide. This is a colophon mark: it says whose field guide
 * this is. It does not speak, greet, congratulate, or narrate.
 */
export function RikkiMascot({ className = '' }: RikkiMascotProps) {
  return (
    <figure className={`rikki${className ? ` ${className}` : ''}`}>
      <img
        className="rikki__plate"
        src={`${import.meta.env.BASE_URL}games/colophon.png`}
        alt="Colophon: a red panda"
        width={640}
        height={498}
        loading="lazy"
      />
      <figcaption className="rikki__caption">Ailurus fulgens</figcaption>
    </figure>
  );
}

export default RikkiMascot;
