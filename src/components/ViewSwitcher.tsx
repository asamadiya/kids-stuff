import { motion } from 'framer-motion';

export type ViewKind = 'shelf' | 'timeline' | 'map' | 'topic' | 'place';

interface ViewDef {
  readonly key: ViewKind;
  readonly label: string;
  readonly icon: string;
}

const VIEWS: readonly ViewDef[] = [
  { key: 'shelf', label: 'Shelf', icon: '▦' },
  { key: 'timeline', label: 'Timeline', icon: '⏳' },
  { key: 'map', label: 'Map', icon: '◉' },
  { key: 'topic', label: 'By topic', icon: '✦' },
  { key: 'place', label: 'By place', icon: '⚑' },
];

export interface ViewSwitcherProps {
  readonly value: ViewKind;
  readonly onChange: (v: ViewKind) => void;
}

/** A segmented control; the active pill slides between options via a shared layoutId. */
export function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="viewswitch" role="tablist" aria-label="Choose a way to explore">
      {VIEWS.map((v) => {
        const active = v.key === value;
        return (
          <button
            key={v.key}
            role="tab"
            aria-selected={active}
            className={`viewswitch__btn${active ? ' is-active' : ''}`}
            onClick={() => onChange(v.key)}
          >
            {active ? (
              <motion.span
                layoutId="viewswitch-pill"
                className="viewswitch__pill"
                transition={{ type: 'spring', stiffness: 520, damping: 40 }}
              />
            ) : null}
            <span className="viewswitch__label">
              <span aria-hidden="true" className="viewswitch__icon">
                {v.icon}
              </span>
              {v.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default ViewSwitcher;
