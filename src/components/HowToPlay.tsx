import { parentNote } from './parentNotes';

export interface HowToPlayProps {
  readonly id: string;
}

/**
 * How to play, stated before the thing rather than inferred from it.
 *
 * The workshop instruments were the specific complaint: The Quadrat renders 36
 * controls against 82 words of text, so a first-time user was expected to
 * deduce the whole interaction from the widgets. Steps are numbered, in order,
 * and each names the actual control you touch.
 *
 * This sits ABOVE the instrument and is open by default, unlike the parent
 * note. It is the one thing you need before you can start, and hiding it
 * behind a disclosure is what produced the complaint in the first place.
 */
export function HowToPlay({ id }: HowToPlayProps) {
  const note = parentNote(id);
  if (!note?.how?.length) return null;
  return (
    <section className="howto" aria-labelledby={`howto-${id}`}>
      <h3 id={`howto-${id}`} className="howto__title">How to play</h3>
      <ol className="howto__steps">
        {note.how.map((step: string) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {(note.skills?.length ?? 0) > 0 && (
        <p className="howto__skills">
          <span className="howto__skills-label">Builds</span>
          {note.skills?.join(' · ')}
        </p>
      )}
    </section>
  );
}

export default HowToPlay;
