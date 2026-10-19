/**
 * Speech, switched off.
 *
 * The parent called the browser voice "robotic and weird", and the developmental
 * advisor ruled (RULINGS-2): cut browser text-to-speech from the child-facing
 * experience; use short human-recorded clips on a speaker button instead, and
 * make every task understandable from its picture without audio.
 *
 * No recordings exist yet, so `say` is a deliberate no-op. The call sites in the
 * social exercises are kept: each marks a line that should have a recorded clip,
 * and when clips exist they plug in here without touching those twelve files.
 */
export function say(_text: string): void {
  /* intentionally silent — see above */
}

export function stopSaying(): void {
  /* nothing is ever playing */
}
