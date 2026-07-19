import { useId } from 'react';

/**
 * The single, conspicuous motion control.
 *
 * When motion is allowed it renders one toggle button whose pressed state is
 * exposed via `aria-pressed`; the label and hint make both starting and
 * stopping motion obvious. When the device requests reduced motion the control
 * cannot be used at all — it is replaced by a short status message explaining
 * that the device setting is being honoured.
 */
export interface MotionToggleProps {
  readonly motionEnabled: boolean;
  readonly motionAllowed: boolean;
  readonly onToggle: () => void;
}

export function MotionToggle({
  motionEnabled,
  motionAllowed,
  onToggle,
}: MotionToggleProps) {
  const hintId = useId();

  if (!motionAllowed) {
    return (
      <p className="motion-toggle motion-toggle--locked" role="status">
        <span aria-hidden="true" className="motion-toggle__icon">
          {'\u263E'}
        </span>
        <span className="motion-toggle__locked-text">
          Motion is off to match your device&rsquo;s &ldquo;reduce motion&rdquo;
          setting.
        </span>
      </p>
    );
  }

  const label = motionEnabled ? 'Stop the gentle motion' : 'Make it move';
  const hint = motionEnabled
    ? 'The pictures are gently moving. Press to hold everything still.'
    : 'The pictures are still. Press to add slow, gentle motion.';

  return (
    <div className="motion-toggle">
      <button
        type="button"
        className="motion-toggle__btn"
        aria-pressed={motionEnabled}
        aria-describedby={hintId}
        onClick={onToggle}
      >
        <span aria-hidden="true" className="motion-toggle__icon">
          {motionEnabled ? '\u23F8' : '\u2735'}
        </span>
        {label}
      </button>
      <p id={hintId} className="motion-toggle__hint">
        {hint}
      </p>
    </div>
  );
}

export default MotionToggle;
