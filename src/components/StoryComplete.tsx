import type { Story, StoryDomain } from '../types';

/**
 * One warm, grown-up-and-child conversation prompt per learning domain. These
 * are completion-screen talk-starters authored for the reader UI — they never
 * duplicate or rewrite the story prose, and each stays true to its domain.
 */
const CONVERSATION_PROMPT: Record<StoryDomain, string> = {
  measurement:
    'Before you drift off, wonder together: what else could we measure tomorrow, and what could we use to count it?',
  patterns:
    'Snuggle in and wonder together: what patterns can you spot around your room right now \u2014 in the blanket, the floor, or the shelf?',
  sound:
    'As you settle down, try it together: whisper a word very softly, then say it a little louder. What made the sound change?',
  wind:
    'Before sleep, wonder together: where did you notice the wind today, even though the wind itself stayed invisible?',
  'plant-growth':
    'As you close your eyes, imagine together: what do you think a little seed is doing right now, down in the dark, quiet soil?',
  shadows:
    'Tomorrow in the sunshine, try it together: can you make your shadow wave, jump, or stretch tall and small?',
  navigation:
    'Before you sleep, wonder together: if we needed to find our way home in the dark, what could we look for to guide us?',
  'simple-machines':
    'Tomorrow, look around together: what heavy thing could we move more easily with a ramp, a wheel, or a little pulley?',
};

export interface StoryCompleteProps {
  readonly story: Story;
  /** Reserved motion hook. No animation in this task. */
  readonly motionEnabled?: boolean;
}

export function StoryComplete({ story }: StoryCompleteProps) {
  return (
    <section
      className="story-complete"
      aria-label={`You finished ${story.title}`}
    >
      <p className="story-complete__kicker" aria-hidden="true">
        &#10022;
      </p>
      <h1 className="story-complete__heading">The End</h1>
      <p className="story-complete__story">
        You read &ldquo;{story.title}&rdquo;.
      </p>

      <dl className="story-complete__notes">
        <div className="story-complete__note">
          <dt className="story-complete__note-label">What you discovered</dt>
          <dd className="story-complete__note-body">{story.learningTakeaway}</dd>
        </div>
        <div className="story-complete__note">
          <dt className="story-complete__note-label">A little heart skill</dt>
          <dd className="story-complete__note-body">{story.heartTakeaway}</dd>
        </div>
        <div className="story-complete__note story-complete__note--grownup">
          <dt className="story-complete__note-label">For the grown-up</dt>
          <dd className="story-complete__note-body">{story.grownUpFact}</dd>
        </div>
      </dl>

      <p className="story-complete__prompt">
        <span className="story-complete__prompt-label">
          Talk about it together
        </span>
        <span className="story-complete__prompt-body">
          {CONVERSATION_PROMPT[story.domain]}
        </span>
      </p>
    </section>
  );
}

export default StoryComplete;
