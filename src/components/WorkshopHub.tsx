import { ForTheParent } from './ForTheParent';
import type { ComponentType } from 'react';
import { toHash } from '../App';
import { StoryLoom } from './StoryLoom';
import NumberMill from './workshop/NumberMill';
import Quadrat from './workshop/Quadrat';
import SortingKey from './workshop/SortingKey';
import TableOfMeasures from './workshop/TableOfMeasures';
import DividingString from './workshop/DividingString';
import ConstellationRegister from './workshop/ConstellationRegister';
import OrnamentLathe from './workshop/OrnamentLathe';
import { NUMBER_MILL_META } from '../workshop/number-mill';
import { QUADRAT_META } from '../workshop/quadrat';
import { SORTINGKEY_META } from '../workshop/sorting-key';
import { TABLE_OF_MEASURES_META } from '../workshop/table-of-measures';
import { DIVIDING_STRING_META } from '../workshop/dividing-string';
import { CONSTELLATION_REGISTER_META } from '../workshop/constellation-register';
import { ORNAMENT_LATHE_META } from '../workshop/ornament-lathe';
import '../styles/workshop.css';

const BASE = import.meta.env.BASE_URL;

/** The tool plates were buttons before they were links; workshop.css never
 *  suppressed the anchor underline that would otherwise cross every plate. */
const NO_UNDERLINE = { textDecoration: 'none' } as const;

export interface WorkshopHubProps {
  /** Which tool is open, read off the hash. `null` is the bench. */
  readonly activeId: string | null;
  /** The Loom leaves through a button of its own, so it is handed a callback. */
  readonly onLoomExit: () => void;
}

export interface ToolMeta {
  readonly id: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly note: string;
}

interface ToolEntry {
  readonly meta: ToolMeta;
  readonly Component: ComponentType;
}

/**
 * The workshop bench. Each tool is a way of making something that is his: the
 * guide supplies the instrument, he supplies the decision. Tools are listed as
 * plates, in the same hand as the rest of the guide.
 */
const TOOLS: readonly ToolEntry[] = [
  { meta: NUMBER_MILL_META, Component: NumberMill },
  { meta: QUADRAT_META, Component: Quadrat },
  { meta: SORTINGKEY_META, Component: SortingKey },
  { meta: TABLE_OF_MEASURES_META, Component: TableOfMeasures },
  { meta: DIVIDING_STRING_META, Component: DividingString },
  { meta: CONSTELLATION_REGISTER_META, Component: ConstellationRegister },
  { meta: ORNAMENT_LATHE_META, Component: OrnamentLathe },
];

const LOOM: ToolMeta = {
  id: 'story-loom',
  title: 'The Story Loom',
  eyebrow: 'Compose',
  note: 'Name three or more things; the Loom composes an adventure that uses every one of them.',
};

/**
 * The bench, in plate order: the Loom first, then the instruments. `App`
 * validates `#/make/<id>` against this list, so a tool cannot be addressable
 * without being on the bench, or on the bench without being addressable.
 */
export const WORKSHOP_TOOL_IDS: readonly string[] = [
  LOOM.id,
  ...TOOLS.map((t) => t.meta.id),
];

export function WorkshopHub({ activeId, onLoomExit }: WorkshopHubProps) {
  const active = TOOLS.find((t) => t.meta.id === activeId) ?? null;

  if (activeId === LOOM.id) return <StoryLoom onExit={onLoomExit} />;

  return (
    <main id="main-content" className="workshop" aria-label="Workshop" tabIndex={-1}>
      {active ? (
        <>
          <a className="workshop__back" style={NO_UNDERLINE} href={toHash({ kind: 'make' })}>
            <span aria-hidden="true">&larr;</span> All tools
          </a>
          <active.Component />
          <ForTheParent id={active.meta.id} />
        </>
      ) : (
        <>
          <a className="workshop__back" style={NO_UNDERLINE} href={toHash({ kind: 'index' })}>
            <span aria-hidden="true">&larr;</span> Contents
          </a>
          <header className="workshop__head">
            <div>
              <p className="workshop__eyebrow">Compose</p>
              <h1 className="workshop__title">Workshop</h1>
              <p className="workshop__lede">
                Instruments for making things. The guide supplies the instrument;
                what it makes is yours, and different every time.
              </p>
            </div>
          </header>

          <div className="tool-grid">
            {[LOOM, ...TOOLS.map((t) => t.meta)].map((meta) => (
              <a
                key={meta.id}
                className="tool-card"
                style={NO_UNDERLINE}
                href={toHash({ kind: 'tool', id: meta.id })}
                aria-label={`Open ${meta.title}`}
              >
                <span className="tool-card__pic">
                  <img
                    src={`${BASE}games/workshop/${meta.id}.png`}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                </span>
                <span className="tool-card__title">{meta.title}</span>
                <span className="tool-card__note">{meta.note}</span>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default WorkshopHub;
