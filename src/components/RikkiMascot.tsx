export interface RikkiMascotProps {
  readonly className?: string;
}

/** Rikki is a friendly red-panda learning guide drawn entirely with inline SVG. */
export function RikkiMascot({ className = '' }: RikkiMascotProps) {
  return (
    <svg
      className={`rikki${className ? ` ${className}` : ''}`}
      viewBox="0 0 220 220"
      role="img"
      aria-label="Rikki, your learning buddy"
    >
      <title>Rikki, your learning buddy</title>
      <path
        className="rikki__tail"
        d="M163 140c42 4 47 49 15 61-19 7-38-3-45-18 23 7 42-2 39-17-2-10-11-14-22-14z"
      />
      <path className="rikki__ear" d="M52 66C30 48 34 20 63 35l18 29z" />
      <path className="rikki__ear" d="M168 66c22-18 18-46-11-31l-18 29z" />
      <circle className="rikki__head" cx="110" cy="108" r="72" />
      <path
        className="rikki__mask"
        d="M54 91c15-30 40-39 56-18 16-21 41-12 56 18-9 41-28 61-56 61S63 132 54 91z"
      />
      <ellipse className="rikki__muzzle" cx="110" cy="127" rx="35" ry="27" />
      <circle className="rikki__eye" cx="83" cy="101" r="7" />
      <circle className="rikki__eye" cx="137" cy="101" r="7" />
      <circle className="rikki__shine" cx="81" cy="98" r="2.5" />
      <circle className="rikki__shine" cx="135" cy="98" r="2.5" />
      <path className="rikki__nose" d="M101 119q9-8 18 0-2 12-9 12t-9-12z" />
      <path className="rikki__smile" d="M110 131c0 11-14 14-20 5m20-5c0 11 14 14 20 5" />
      <path className="rikki__scarf" d="M64 157c25 15 67 15 92 0l8 24c-35 17-73 17-108 0z" />
      <path className="rikki__scarf-end" d="M137 174l27 9-13 31-25-28z" />
      <circle className="rikki__spark rikki__spark--one" cx="39" cy="111" r="5" />
      <path className="rikki__spark rikki__spark--two" d="M184 91l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" />
    </svg>
  );
}

export default RikkiMascot;
