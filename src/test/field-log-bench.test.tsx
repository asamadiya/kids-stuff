import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FieldLog from '../components/workshop/FieldLog';
import { clockLabel, isoDate, shortestShadow, type ShadowReading } from '../workshop/field-log';

vi.mock('../workshop/say', () => ({
  say: vi.fn(),
  canSpeak: () => true,
  stopSpeaking: vi.fn(),
}));
vi.mock('../workshop/tone', () => ({ pluck: vi.fn(), step: () => 440 }));

const today = isoDate(new Date());

// The shadow bench is driven with roughly ninety clicks. userEvent's default
// inter-event delay makes that the slowest test in the suite and, under load,
// a flaky one; the delay buys nothing here because nothing is time-dependent.
const setup = () => userEvent.setup({ delay: null });

beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

const logAFind = async (name: string, times = 1): Promise<void> => {
  const user = setup();
  await user.click(screen.getByRole('button', { name }));
  for (let i = 1; i < times; i += 1) await user.click(screen.getByRole('button', { name: 'One more' }));
  await user.click(screen.getByRole('button', { name: 'Keep this find' }));
};

describe('the field log bench', () => {
  it('opens on the finds and offers the three benches', () => {
    render(<FieldLog />);
    expect(screen.getByRole('heading', { name: 'The Field Log' })).toBeInTheDocument();
    for (const name of ['What I found', 'One thing, week by week', 'A stick and its shadow']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Keep this find' })).toBeDisabled();
  });

  it('records the thing, where, how many and what it was doing', async () => {
    const user = setup();
    render(<FieldLog />);
    await user.click(screen.getByRole('button', { name: 'snail' }));
    await user.click(screen.getByRole('button', { name: /On a wall/ }));
    await user.click(screen.getByRole('button', { name: 'One more' }));
    await user.click(screen.getByRole('button', { name: 'Carrying something' }));
    await user.click(screen.getByRole('button', { name: 'Keep this find' }));

    const kept = JSON.parse(window.localStorage.getItem('ks.workshop.field-log.v1') ?? '[]');
    expect(kept).toHaveLength(1);
    expect(kept[0]).toMatchObject({
      kind: 'find', what: 'snail', habitat: 'wall', count: 2, doing: 'carrying', date: today,
    });
  });

  it('carries the tally across sessions, which is the reason to go back out', async () => {
    render(<FieldLog />);
    await logAFind('ant', 3);
    cleanup();

    // A new mount is a new session: it reads the drawer, not React state.
    render(<FieldLog />);
    await logAFind('ant', 2);
    expect(screen.getByText('1 day out')).toBeInTheDocument();
    const stage = screen.getByRole('img');
    expect(stage.getAttribute('aria-label')).toContain('5 things counted');
    expect(stage.getAttribute('aria-label')).toContain('ant, 5 across 2 entries');
  });

  it('agrees its counts with its words, and does not print a date range of one day', async () => {
    // "1 days out", "12 in 1" and "28 July 2026 to 28 July 2026" all shipped
    // in the first draft of this plate.
    const user = setup();
    const { container } = render(<FieldLog />);
    await logAFind('ant', 12);
    const plate = container.querySelector('svg')!.textContent ?? '';
    expect(plate).not.toMatch(/\b1 days\b/);
    expect(plate).not.toMatch(/\b1 entries\b/);
    expect(plate).toContain('1 day out');
    expect(plate).toContain('12 in 1 entry');
    expect(plate).not.toMatch(/(\d+ \w+ \d{4}) to \1/);

    await user.click(screen.getByRole('button', { name: 'snail' }));
    await user.click(screen.getByRole('button', { name: 'Keep this find' }));
    const two = container.querySelector('svg')!.textContent ?? '';
    expect(two).toContain('2 kinds');
    expect(two).not.toMatch(/\b1 entries\b/);
  });

  it('says what was kept, because he does not read fluently', async () => {
    const { say } = await import('../workshop/say');
    render(<FieldLog />);
    await logAFind('spider');
    expect(vi.mocked(say)).toHaveBeenCalledWith(expect.stringContaining('spider: 1'));
  });
});

describe('following one thing over weeks', () => {
  it('works the growth out from the measurements rather than being told it', async () => {
    const user = setup();
    render(<FieldLog />);
    await user.click(screen.getByRole('button', { name: 'One thing, week by week' }));
    await user.type(screen.getByLabelText('The name of the thing you are following'), 'bean pot');
    await user.click(screen.getByRole('button', { name: /In leaf, rung 3 of 6/ }));
    await user.click(screen.getByRole('button', { name: 'Taller by 100 millimetres' }));
    await user.click(screen.getByRole('button', { name: 'Keep this measurement' }));

    const kept = JSON.parse(window.localStorage.getItem('ks.workshop.field-log.v1') ?? '[]');
    expect(kept[0]).toMatchObject({ kind: 'watch', subject: 'bean pot', stage: 'leaf', heightMm: 100 });
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('Come back and measure it again');
  });
});

describe('the stick, the shadow and where on the Earth he is', () => {
  /**
   * The gate that fails if local noon is reverted to "the middle reading" or to
   * "twelve o'clock". The readings below are deliberately lopsided: the
   * shortest shadow is the fifth of seven, so it is neither the middle entry
   * nor the one at twelve. The plate is then read back out of the DOM and the
   * enlarged marker has to sit on that reading.
   */
  const READINGS: readonly (readonly [number, number])[] = [
    [9, 900], [10, 700], [11, 600], [12, 500], [13, 400], [15, 800], [17, 1400],
  ];

  const enter = async (): Promise<void> => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'A stick and its shadow' }));
    let current = 500; // the shadow stepper's starting value
    for (const [hour, mm] of READINGS) {
      await user.click(screen.getByRole('button', { name: clockLabel(hour * 60) }));
      let delta = mm - current;
      const nudge = async (by: number): Promise<void> => {
        await user.click(screen.getByRole('button', {
          name: `Shadow ${by > 0 ? 'longer' : 'shorter'} by ${Math.abs(by)} millimetres`,
        }));
      };
      while (delta >= 100) { await nudge(100); delta -= 100; }
      while (delta <= -100) { await nudge(-100); delta += 100; }
      while (delta >= 10) { await nudge(10); delta -= 10; }
      while (delta <= -10) { await nudge(-10); delta += 10; }
      current = mm;
      await user.click(screen.getByRole('button', { name: /^Write down/ }));
    }
  };

  it('marks local noon on the shortest shadow, not on the middle reading or on the clock', async () => {
    const { container } = render(<FieldLog />);
    await enter();

    const readings: ShadowReading[] = READINGS.map(([h, mm]) => ({ minutes: h * 60, shadowMm: mm }));
    const noon = shortestShadow(readings)!;
    expect(noon).toEqual({ minutes: 13 * 60, shadowMm: 400 });
    // Neither the middle entry nor twelve o'clock, so an implementation that
    // guessed either would disagree with the marker below.
    expect(readings[Math.floor(readings.length / 2)]).not.toEqual(noon);
    expect(noon.minutes).not.toBe(12 * 60);

    const svg = container.querySelector('svg')!;
    const circles = [...svg.querySelectorAll('circle')];
    expect(circles).toHaveLength(readings.length);
    const marked = circles.findIndex((c) => c.getAttribute('r') === '5');
    expect(marked).toBe(readings.findIndex((r) => r.minutes === noon.minutes));

    const noonText = [...svg.querySelectorAll('text')].filter((t) => t.textContent === 'local noon');
    expect(noonText).toHaveLength(1);
    expect(noonText[0].getAttribute('x')).toBe(circles[marked].getAttribute('cx'));
  }, 20000);

  it('reads back the sun\'s height and a latitude taken from it', async () => {
    render(<FieldLog />);
    await enter();
    const words = screen.getByRole('img').getAttribute('aria-label') ?? '';
    expect(words).toContain('Shortest shadow 400 mm at 1:00 pm');
    // atan(1000 / 400) = 68.2 degrees, worked out on a calculator, not here.
    expect(words).toMatch(/the sun was 68\.2 degrees up/);
    expect(words).toMatch(/degrees north/);
  });

  it('keeps the whole day of readings in the drawer', async () => {
    const user = setup();
    render(<FieldLog />);
    await enter();
    await user.click(screen.getByRole('button', { name: 'Keep this day of readings' }));
    const kept = JSON.parse(window.localStorage.getItem('ks.workshop.field-log.v1') ?? '[]');
    expect(kept).toHaveLength(1);
    expect(kept[0].kind).toBe('shadow');
    expect(kept[0].readings).toHaveLength(READINGS.length);
    expect(kept[0].stickMm).toBe(1000);
  }, 20000);

  it('will not keep a day with no readings on it', () => {
    render(<FieldLog />);
    const user = setup();
    return user.click(screen.getByRole('button', { name: 'A stick and its shadow' })).then(() => {
      expect(screen.getByRole('button', { name: 'Keep this day of readings' })).toBeDisabled();
    });
  });
});
