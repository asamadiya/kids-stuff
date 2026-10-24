import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { clipUrl, getPlaying, getReader, play, playUrl, resetForTests, setReader, stop, textKey } from '../audio/readAloud';
import type { Manifest } from '../audio/readAloud';
import { ReadAloud } from '../audio/ReadAloud';
import { ReaderSwitch } from '../audio/ReaderSwitch';

/**
 * Read-aloud (advisor a9): pressed, never automatic; one clip at a time; a
 * second press stops; a missing clip says so and plays nothing; Mom voice by
 * default, Dad voice by choice, remembered.
 */

class FakeAudio {
  static made: FakeAudio[] = [];
  src = '';
  paused = true;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor() {
    FakeAudio.made.push(this);
  }
  play() {
    this.paused = false;
    return Promise.resolve();
  }
  pause() {
    this.paused = true;
  }
  removeAttribute(name: string) {
    if (name === 'src') this.src = '';
  }
  load() {}
  end() {
    this.paused = true;
    this.onended?.();
  }
}
const make = () => new FakeAudio() as unknown as HTMLAudioElement;
const last = () => FakeAudio.made[FakeAudio.made.length - 1];
const tick = () => new Promise((r) => setTimeout(r, 0));

const M: Manifest = {
  mom: { en: { 'Hello there.': 'aaaa', 'Second line.': 'bbbb' }, te: { 'రా': 'cccc' } },
  dad: { en: { 'Hello there.': 'dddd' } },
};

beforeEach(() => {
  FakeAudio.made = [];
  window.localStorage.clear();
  setReader('mom');
  resetForTests(M);
  vi.stubGlobal('Audio', FakeAudio);
});
afterEach(() => {
  cleanup();
  stop();
  vi.unstubAllGlobals();
});

describe('the clip table', () => {
  it('finds a line by its normalised words, per reader and language', () => {
    expect(clipUrl(M, 'mom', 'en', '  Hello   there. ')).toMatch(/audio\/mom\/aaaa\.mp3$/);
    expect(clipUrl(M, 'dad', 'en', 'Hello there.')).toMatch(/audio\/dad\/dddd\.mp3$/);
    expect(clipUrl(M, 'dad', 'en', 'Second line.')).toBeNull();
    expect(clipUrl(M, 'mom', 'te', 'రా')).toMatch(/cccc/);
    expect(textKey('a\n\n b')).toBe('a b');
  });
});

describe('the player', () => {
  it('plays a sequence in order and is idle at the end', async () => {
    const done = play('x', ['Hello there.', 'Second line.'], 'en', make);
    await tick();
    expect(getPlaying()?.id).toBe('x');
    expect(last().src).toMatch(/aaaa/);
    last().end();
    await tick();
    expect(last().src).toMatch(/bbbb/);
    last().end();
    expect(await done).toBe('played');
    expect(getPlaying()).toBeNull();
  });

  it('plays nothing when any line of the sequence has no clip for this reader', async () => {
    setReader('dad');
    expect(await play('x', ['Hello there.', 'Second line.'], 'en', make)).toBe('missing');
    expect(FakeAudio.made).toHaveLength(0);
    expect(getPlaying()).toBeNull();
  });

  it('starting another line stops the first: one clip at a time', async () => {
    const first = play('a', ['Hello there.'], 'en', make);
    await tick();
    const a = last();
    const second = play('b', ['Second line.'], 'en', make);
    await tick();
    expect(a.paused).toBe(true);
    expect(await first).toBe('stopped');
    expect(getPlaying()?.id).toBe('b');
    last().end();
    expect(await second).toBe('played');
  });

  it('a family recording and a computer clip share the one player', async () => {
    const own = playUrl('own', 'blob:x', make);
    await tick();
    const a = last();
    void play('b', ['Hello there.'], 'en', make);
    await tick();
    expect(a.paused).toBe(true);
    expect(await own).toBe('stopped');
  });

  it('a failed manifest load reports failure and leaves nothing playing', async () => {
    resetForTests(null);
    vi.stubGlobal('fetch', () => Promise.resolve({ ok: false, status: 404 }));
    expect(await play('x', ['Hello there.'], 'en', make)).toBe('failed');
    expect(getPlaying()).toBeNull();
  });
});

describe('the reader', () => {
  it('is Mom voice by default and remembers Dad voice', () => {
    window.localStorage.clear();
    expect(getReader()).toBe('mom');
    setReader('dad');
    expect(window.localStorage.getItem('rlc/reader')).toBe('dad');
  });

  it('switching the reader stops what is playing', async () => {
    void play('x', ['Hello there.'], 'en', make);
    await tick();
    setReader('dad');
    expect(getPlaying()).toBeNull();
    expect(last().paused).toBe(true);
  });

  it('the switch shows the choice as a radio pair, Mom checked', () => {
    render(<ReaderSwitch />);
    expect(screen.getByRole('radio', { name: /mom/i }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('radio', { name: /dad/i }));
    expect(getReader()).toBe('dad');
    expect(screen.getByRole('radio', { name: /dad/i }).getAttribute('aria-checked')).toBe('true');
  });
});

describe('the button', () => {
  it('never plays until pressed, becomes Stop while playing, and stops on a second press', async () => {
    render(<ReadAloud id="p1" texts={['Hello there.']} />);
    expect(FakeAudio.made).toHaveLength(0);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /read it to me/i }));
      await tick();
    });
    const stopBtn = screen.getByRole('button', { name: /stop/i });
    expect(stopBtn.getAttribute('aria-pressed')).toBe('true');
    await act(async () => {
      fireEvent.click(stopBtn);
      await tick();
    });
    expect(getPlaying()).toBeNull();
    expect(screen.getByRole('button', { name: /read it to me/i })).toBeTruthy();
  });

  it('says so, in words, when there is no clip', async () => {
    setReader('dad');
    render(<ReadAloud id="p1" texts={['Second line.']} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /read it to me/i }));
      await tick();
    });
    expect(screen.getByRole('status').textContent).toMatch(/no recording of this yet/i);
  });
});
