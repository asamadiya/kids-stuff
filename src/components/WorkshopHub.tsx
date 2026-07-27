import { useState } from 'react';
import type { ComponentType } from 'react';
import { StoryLoom } from './StoryLoom';
import '../styles/workshop.css';

const BASE = import.meta.env.BASE_URL;

export interface WorkshopHubProps {
  readonly onExit: () => void;
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
const TOOLS: readonly ToolEntry[] = [];

const LOOM: ToolMeta = {
  id: 'story-loom',
  title: 'The Story Loom',
  eyebrow: 'Compose',
  note: 'Name three or more things; the Loom composes an adventure that uses every one of them.',
};

export function WorkshopHub({ onExit }: WorkshopHubProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = TOOLS.find((t) => t.meta.id === activeId) ?? null;
  const back = () => setActiveId(null);

  if (activeId === LOOM.id) return <StoryLoom onExit={back} />;

  return (
    <main id="main-content" className="workshop" aria-label="Workshop" tabIndex={-1}>
      {active ? (
        <>
          <button type="button" className="workshop__back" onClick={back}>
            <span aria-hidden="true">&larr;</span> All tools
          </button>
          <active.Component />
        </>
      ) : (
        <>
          <button type="button" className="workshop__back" onClick={onExit}>
            <span aria-hidden="true">&larr;</span> Contents
          </button>
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
              <button
                key={meta.id}
                type="button"
                className="tool-card"
                onClick={() => setActiveId(meta.id)}
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
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default WorkshopHub;
