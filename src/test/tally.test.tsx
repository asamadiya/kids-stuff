import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import CountWithRikkiGame from '../components/CountWithRikkiGame';
import { COUNT_ROUNDS, getCountOptions } from '../games/count-with-rikki';

afterEach(cleanup);

/**
 * The tally is a claim about the child's work, so it must be true: it counts
 * correct answers, not taps. (It previously incremented on any answer, which
 * made every number on screen meaningless.)
 */
describe('the tally counts correct answers, not taps', () => {
  const answer = COUNT_ROUNDS[0].count;
  const wrong = getCountOptions(0).find((o) => o !== answer)!;

  const tally = () => within(screen.getByLabelText(/\d+ correct/)).getByText(/^\d+$/).textContent;

  it('does not credit a wrong answer', async () => {
    const user = userEvent.setup();
    render(<CountWithRikkiGame />);
    expect(tally()).toBe('0');
    await user.click(screen.getByRole('button', { name: String(wrong) }));
    expect(tally()).toBe('0');
  });

  it('credits a correct answer', async () => {
    const user = userEvent.setup();
    render(<CountWithRikkiGame />);
    await user.click(screen.getByRole('button', { name: String(answer) }));
    expect(tally()).toBe('1');
  });

  it('shows no star stickers anywhere in the exercise', () => {
    render(<CountWithRikkiGame />);
    expect(document.body.textContent).not.toMatch(/[★☆]/);
  });
});
