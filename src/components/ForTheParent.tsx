import { parentNote } from './parentNotes';

export interface ForTheParentProps {
  /** The exercise or tool id whose note to show. */
  readonly id: string;
}

/**
 * The note for the adult, folded away under the exercise.
 *
 * Closed by default and marked as being for the grown-up, so it does not read
 * as instructions to the child. It is a `<details>` rather than app state: it
 * costs nothing, survives without JavaScript, and cannot get out of step with
 * a route.
 */
export function ForTheParent({ id }: ForTheParentProps) {
  const note = parentNote(id);
  if (!note) return null;
  return (
    <details className="parent-note">
      <summary className="parent-note__summary">For the parent</summary>
      <div className="parent-note__body">
        <p className="parent-note__what">{note.what}</p>
        <dl className="parent-note__fields">
          <div>
            <dt>Practising</dt>
            <dd>{note.practising}</dd>
          </div>
          <div>
            <dt>Ask him</dt>
            <dd>{note.ask}</dd>
          </div>
          <div>
            <dt>Honestly</dt>
            <dd>{note.honest}</dd>
          </div>
        </dl>
      </div>
    </details>
  );
}

export default ForTheParent;
