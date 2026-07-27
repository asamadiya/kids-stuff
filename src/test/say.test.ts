import { afterEach, describe, expect, it, vi } from 'vitest';
import { canSpeak, currentVoice, say, stopSpeaking } from '../workshop/say';

/**
 * The "robotic and weird" report came from three separate faults, so these
 * guard all three: no voice was selected, the voice list arrives late and was
 * read once while empty, and cancel-then-speak in one task clips the start.
 *
 * Audio quality itself is not unit-testable. What is testable is that the
 * ranking never picks the synthetic fallback while any alternative exists, and
 * that a late-arriving list is honoured — which is the whole drift surface.
 */

interface StubVoice {
  name: string;
  lang: string;
  localService: boolean;
}

function voice(name: string, lang = 'en-GB', localService = true): StubVoice {
  return { name, lang, localService };
}

function install(voices: StubVoice[], opts: { populateLate?: boolean } = {}) {
  let current = opts.populateLate ? [] : voices;
  const spoken: SpeechSynthesisUtterance[] = [];
  const listeners: Record<string, (() => void)[]> = {};
  const synth = {
    getVoices: () => current,
    speak: (u: SpeechSynthesisUtterance) => spoken.push(u),
    cancel: vi.fn(),
    addEventListener: (ev: string, fn: () => void) => {
      (listeners[ev] ||= []).push(fn);
    },
  };
  vi.stubGlobal('window', { speechSynthesis: synth });
  vi.stubGlobal('speechSynthesis', synth);
  class Utterance {
    voice: unknown = null;
    rate = 1;
    pitch = 1;
    lang = '';
    constructor(public text: string) {}
  }
  vi.stubGlobal('SpeechSynthesisUtterance', Utterance);
  vi.stubGlobal('document', { documentElement: { lang: 'en' } });
  return {
    spoken,
    arrive: () => {
      current = voices;
      for (const fn of listeners['voiceschanged'] ?? []) fn();
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('choosing a voice', () => {
  it('never picks the synthetic fallback while any alternative exists', () => {
    install([voice('eSpeak English'), voice('Daniel')]);
    expect(currentVoice()?.name).toBe('Daniel');
  });

  it('prefers a named good voice over everything else', () => {
    install([voice('Daniel'), voice('Google UK English Female'), voice('Albert')]);
    expect(currentVoice()?.name).toBe('Google UK English Female');
  });

  it('prefers a network voice over a local one when neither is named', () => {
    install([voice('Local Bill', 'en-GB', true), voice('Cloud Nell', 'en-GB', false)]);
    expect(currentVoice()?.name).toBe('Cloud Nell');
  });

  it('falls back to the synthetic voice only when it is all there is', () => {
    install([voice('eSpeak English')]);
    expect(currentVoice()?.name).toBe('eSpeak English');
  });

  it('resolves nothing while the list is empty', () => {
    install([], { populateLate: true });
    expect(currentVoice()).toBeNull();
  });
});

describe('the late voice list', () => {
  it('is honoured once voiceschanged fires, rather than being locked out', () => {
    const s = install([voice('eSpeak English'), voice('Samantha')], { populateLate: true });
    // Chrome returns [] on the first read; an eager one-shot pick would cache null
    // and the platform default would speak forever after.
    expect(currentVoice()).toBeNull();
    s.arrive();
    expect(currentVoice()?.name).toBe('Samantha');
  });
});

describe('speaking', () => {
  it('yields before speaking so Chrome does not clip the opening word', () => {
    vi.useFakeTimers();
    const s = install([voice('Samantha')]);
    say('Put your finger on the loudest place.');
    expect(s.spoken).toHaveLength(0);
    vi.runAllTimers();
    expect(s.spoken).toHaveLength(1);
    expect(s.spoken[0].voice).toMatchObject({ name: 'Samantha' });
    expect(s.spoken[0].rate).toBe(0.9);
  });

  it('is a no-op for empty text', () => {
    vi.useFakeTimers();
    const s = install([voice('Samantha')]);
    say('   ');
    vi.runAllTimers();
    expect(s.spoken).toHaveLength(0);
  });

  it('still speaks when no voice resolves, rather than throwing', () => {
    vi.useFakeTimers();
    const s = install([], { populateLate: true });
    say('hello');
    vi.runAllTimers();
    expect(s.spoken).toHaveLength(1);
    expect(s.spoken[0].voice).toBeNull();
  });

  it('reports capability and stops cleanly', () => {
    install([voice('Samantha')]);
    expect(canSpeak()).toBe(true);
    expect(() => stopSpeaking()).not.toThrow();
  });
});
