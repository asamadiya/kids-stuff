import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Recorder } from '../languages/Recorder';

/**
 * Astra round 3, the blocker: leaving the recorder must never leave the
 * microphone on. Each fake track records whether it was stopped.
 */

interface FakeTrack { stopped: boolean; stop(): void }
const tracks: FakeTrack[] = [];
let answer: (s: MediaStream) => void = () => {};
let recorders: FakeRecorder[] = [];

class FakeRecorder {
  state: 'inactive' | 'recording' = 'inactive';
  mimeType = 'audio/webm';
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  constructor(readonly stream: MediaStream) {
    recorders.push(this);
  }
  static isTypeSupported = () => true;
  start() {
    this.state = 'recording';
  }
  stop() {
    this.state = 'inactive';
    this.ondataavailable?.({ data: new Blob(['x'], { type: 'audio/webm' }) });
    this.onstop?.();
  }
}

const stream = (): MediaStream => {
  const t: FakeTrack = { stopped: false, stop() { this.stopped = true; } };
  tracks.push(t);
  return { getTracks: () => [t] } as unknown as MediaStream;
};

beforeEach(() => {
  tracks.length = 0;
  recorders = [];
  vi.stubGlobal('MediaRecorder', FakeRecorder);
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia: () => new Promise<MediaStream>((res) => { answer = res; }) },
  });
  URL.createObjectURL = () => 'blob:x';
  URL.revokeObjectURL = () => {};
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const live = () => tracks.filter((t) => !t.stopped).length;

describe('recorder releases the microphone', () => {
  it('stops the tracks when the recorder is unmounted mid-recording', async () => {
    const { unmount } = render(<Recorder id="a" lang="te" who="Nanna" text="raa" />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    await act(async () => answer(stream()));
    expect(screen.getByRole('button', { name: /stop/i })).toBeTruthy();
    expect(live()).toBe(1);
    unmount();
    expect(live()).toBe(0);
  });

  it('stops a stream that arrives after the recorder has gone', async () => {
    const { unmount } = render(<Recorder id="a" lang="te" who="Nanna" text="raa" />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    unmount();
    await act(async () => answer(stream()));
    expect(tracks).toHaveLength(1);
    expect(live()).toBe(0);
    expect(recorders).toHaveLength(0);
  });

  it('stops the tracks when the page is hidden', async () => {
    render(<Recorder id="a" lang="te" who="Nanna" text="raa" />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    await act(async () => answer(stream()));
    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });
    expect(live()).toBe(0);
  });

  it('lets only one line record at a time', async () => {
    render(
      <>
        <Recorder id="a" lang="te" who="Nanna" text="raa" />
        <Recorder id="b" lang="te" who="Nanna" text="po" />
      </>,
    );
    const [first, second] = screen.getAllByRole('button', { name: /record/i });
    fireEvent.click(first);
    await act(async () => answer(stream()));
    fireEvent.click(second);
    await act(async () => answer(stream()));
    expect(tracks).toHaveLength(2);
    expect(tracks[0].stopped).toBe(true);
    expect(live()).toBe(1);
  });

  it('stops the tracks when Stop is pressed and offers the take for review', async () => {
    render(<Recorder id="a" lang="te" who="Nanna" text="raa" />);
    fireEvent.click(screen.getByRole('button', { name: /record/i }));
    await act(async () => answer(stream()));
    fireEvent.click(screen.getByRole('button', { name: /stop/i }));
    expect(live()).toBe(0);
    expect(screen.getByRole('button', { name: /save/i })).toBeTruthy();
  });
});

describe('import checks the whole file before writing', () => {
  const entry = (key: string, extra: Record<string, unknown> = {}) => ({ key, type: 'audio/webm', who: 'Nanna', at: 1, data: btoa('abc'), ...extra });
  const file = (clips: unknown[]) => JSON.stringify({ kind: 'rlc-voices', version: 1, clips });

  it('accepts every kind of recording id the app makes', async () => {
    const { parseImport } = await import('../languages/voices');
    const ids = ['up-sleepyhead.g0:te', 'te-chandamama-raave.l3:te', 'come-here.p0:ta', 'w-amma:ta', 'ta-nila-nila-odi-vaa.title:ta'];
    expect(parseImport(file(ids.map((k) => entry(k)))).map((c) => c.key)).toEqual(ids);
  });

  it('rejects the whole file when any entry is damaged', async () => {
    const { parseImport } = await import('../languages/voices');
    expect(() => parseImport(file([entry('w-amma:ta'), entry('w-nanna:te', { data: 42 })]))).toThrow(/Recording 2/);
    expect(() => parseImport(file([entry('w-amma:ta'), entry('w-amma:ta')]))).toThrow(/Recording 2/);
    expect(() => parseImport(file([entry('../evil:ta')]))).toThrow(/Recording 1/);
    expect(() => parseImport('{"kind":"other"}')).toThrow(/not a saved set/);
    expect(() => parseImport('not json')).toThrow(/not a saved set/);
  });
});
