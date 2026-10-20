import type { ReactNode } from 'react';

/**
 * The shared pieces every board is built from. Using these, rather than each
 * board inventing its own buttons, is how the three-control rule holds:
 *
 * - `Piece` with `onTap` is tap-to-add/remove (or tap a source to add).
 * - `Choice` is tap-to-choose.
 * - `Piece` + `Slot` together are tap-to-build: tap a piece to pick it up
 *   (`picked`), then tap the slot where it goes.
 *
 * Every target is at least 64 CSS px square (see play.css), which is the
 * advisor's "finger accuracy must not be the challenge" made concrete.
 */

export type PieceTone = 'source' | 'placed' | 'fixed' | 'worked' | 'picked' | 'ghost';

export interface PieceProps {
  readonly label?: string;
  /** Drawn content instead of (or as well as) a label: an SVG, an emoji-free icon. */
  readonly children?: ReactNode;
  readonly tone?: PieceTone;
  readonly onTap?: () => void;
  readonly ariaLabel?: string;
  /** A colour token name from play.css, e.g. 'ones', 'tens', 'hundreds'. */
  readonly hue?: string;
  readonly wide?: boolean;
}

export function Piece({ label, children, tone = 'source', onTap, ariaLabel, hue, wide }: PieceProps) {
  const cls = `piece piece--${tone}${hue ? ` piece--${hue}` : ''}${wide ? ' piece--wide' : ''}`;
  if (!onTap) {
    return (
      <span className={cls} aria-label={ariaLabel ?? label} role={ariaLabel ? 'img' : undefined}>
        {children}
        {label ? <span className="piece__label">{label}</span> : null}
      </span>
    );
  }
  return (
    <button type="button" className={cls} onClick={onTap} aria-label={ariaLabel ?? label}>
      {children}
      {label ? <span className="piece__label">{label}</span> : null}
    </button>
  );
}

export interface SlotProps {
  readonly children?: ReactNode;
  readonly onTap?: () => void;
  readonly ariaLabel: string;
  /** A piece is picked up and this slot would accept it: show the target. */
  readonly ready?: boolean;
  readonly filled?: boolean;
  readonly wide?: boolean;
}

export function Slot({ children, onTap, ariaLabel, ready, filled, wide }: SlotProps) {
  const cls = `slot${ready ? ' is-ready' : ''}${filled ? ' is-filled' : ''}${wide ? ' slot--wide' : ''}`;
  if (!onTap) return <span className={cls} aria-label={ariaLabel}>{children}</span>;
  return (
    <button type="button" className={cls} onClick={onTap} aria-label={ariaLabel}>
      {children}
    </button>
  );
}

export interface ChoiceProps {
  readonly selected: boolean;
  readonly onTap: () => void;
  readonly children: ReactNode;
  readonly ariaLabel?: string;
  /** After Check: this is the right one / this one was chosen and is not. */
  readonly mark?: 'right' | 'wrong' | null;
  readonly disabled?: boolean;
}

export function Choice({ selected, onTap, children, ariaLabel, mark, disabled }: ChoiceProps) {
  return (
    <button
      type="button"
      className={`choice${selected ? ' is-selected' : ''}${mark ? ` is-${mark}` : ''}`}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={disabled ? undefined : onTap}
      aria-disabled={disabled || undefined}
    >
      {children}
    </button>
  );
}

export function Tray({ label, children }: { readonly label: string; readonly children: ReactNode }) {
  return (
    <div className="tray" role="group" aria-label={label}>
      <span className="tray__label">{label}</span>
      <div className="tray__items">{children}</div>
    </div>
  );
}

/** A stepper made of two big buttons — the only way a board takes a number. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 99,
  label,
  disabled,
}: {
  readonly value: number;
  readonly onChange: (n: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly label: string;
  readonly disabled?: boolean;
}) {
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button type="button" className="stepper__btn" aria-label={`${label}: one less`} disabled={disabled || value <= min} onClick={() => onChange(value - 1)}>
        −
      </button>
      <output className="stepper__value" aria-live="polite">{value}</output>
      <button type="button" className="stepper__btn" aria-label={`${label}: one more`} disabled={disabled || value >= max} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
