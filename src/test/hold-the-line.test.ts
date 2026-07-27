import { describe, it, expect } from 'vitest';
import {
  CHIPS, EMPTY_PICK, GLYPHS, HOLDTHELINE_META, SCENARIOS, SLOT_LABELS,
  allPicks, chipById, chipsFor, coverage, forceOf, heldLabel, isComplete, lineOf,
  maxStrength, nextKindOf, outcomeOf, panelFor, plateLines, plateTitle, readout,
  scenarioById, strengthOf, strongestPick, wordsFor, wrapText,
} from '../sel/hold-the-line';
import type { ChipId, Pick, Scenario, SlotKind } from '../sel/hold-the-line';

const SLOTS: readonly SlotKind[] = ['name', 'ask', 'next'];
const idsOf = (s: Scenario, slot: SlotKind): readonly ChipId[] =>
  slot === 'name' ? s.names : slot === 'ask' ? s.asks : s.nexts;

/** Every string of content in the module, so the whole corpus can be swept. */
const corpus = (): string[] => {
  const out: string[] = [Object.values(HOLDTHELINE_META).join(' '), ...Object.values(SLOT_LABELS)];
  for (const c of CHIPS) out.push(c.words);
  for (const s of SCENARIOS) {
    out.push(s.where);
    for (const p of [s.setup, s.stops, s.goesOn, s.left]) out.push(p.alt, p.says);
    for (const w of Object.values(s.lines ?? {})) out.push(w);
    for (const slot of SLOTS) for (const id of idsOf(s, slot)) out.push(wordsFor(s, id));
  }
  return out;
};

describe('the shape of the exercise', () => {
  it('is named and described without asking him how anyone feels', () => {
    expect(HOLDTHELINE_META.id).toBe('hold-the-line');
    expect(HOLDTHELINE_META.title).toBe('Hold the Line');
    expect(HOLDTHELINE_META.eyebrow.split(/\s+/).length).toBeLessThanOrEqual(3);
    expect(HOLDTHELINE_META.note.length).toBeGreaterThan(20);
    for (const s of corpus()) expect(s).not.toMatch(/how (does|do) (he|she|they) feel/i);
  });

  it('ships a complete set of places, each one findable by id', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(4);
    expect(SCENARIOS.length).toBeLessThanOrEqual(6);
    expect(new Set(SCENARIOS.map((s) => s.id)).size).toBe(SCENARIOS.length);
    for (const s of SCENARIOS) expect(scenarioById(s.id)).toBe(s);
    expect(scenarioById('nowhere')).toBeUndefined();
  });

  it('gives every place a setup and all three drawn reactions, with real alt text', () => {
    const seen = new Set<string>();
    for (const s of SCENARIOS) {
      for (const p of [s.setup, s.stops, s.goesOn, s.left]) {
        expect(p.panel.startsWith('hold-the-line-'), p.panel).toBe(true);
        expect(seen.has(p.panel), p.panel).toBe(false);
        seen.add(p.panel);
        expect(p.alt.split(/\s+/).length).toBeGreaterThan(6);
        expect(p.says.trim().length).toBeGreaterThan(10);
      }
    }
    expect(seen.size).toBe(SCENARIOS.length * 4);
  });

  it('carries no field that could hold a right answer', () => {
    const allowed = new Set([
      'id', 'where', 'setup', 'names', 'asks', 'nexts', 'lines', 'weights',
      'yieldsAt', 'stops', 'goesOn', 'left',
    ]);
    for (const s of SCENARIOS) {
      for (const k of Object.keys(s)) expect(allowed.has(k), `${s.id}.${k}`).toBe(true);
      expect(Object.keys(s)).not.toContain('correct');
      expect(Object.keys(s)).not.toContain('best');
      expect(Object.keys(s)).not.toContain('answer');
    }
    for (const c of CHIPS) {
      expect(Object.keys(c).sort()).toEqual(['force', 'glyph', 'id', 'next', 'slot', 'words']);
    }
  });
});

describe('the chips', () => {
  it('are unique, wordless marks with drawable glyphs', () => {
    expect(new Set(CHIPS.map((c) => c.id)).size).toBe(CHIPS.length);
    for (const c of CHIPS) {
      expect(GLYPHS[c.glyph], c.id).toBeDefined();
      expect(GLYPHS[c.glyph].length).toBeGreaterThan(0);
      for (const d of GLYPHS[c.glyph]) expect(d).toMatch(/^M/);
    }
  });

  it('only the third slot says what comes after, and it says one of three things', () => {
    for (const c of CHIPS) {
      if (c.slot === 'next') expect(['escalate', 'exit', 'stay']).toContain(c.next);
      else expect(c.next).toBeNull();
    }
    expect(CHIPS.filter((c) => c.next === 'exit').length).toBeGreaterThanOrEqual(2);
  });

  it('lands in every place with words, either its own or the ones that place uses', () => {
    for (const s of SCENARIOS) {
      for (const slot of SLOTS) {
        for (const id of idsOf(s, slot)) {
          const chip = chipById(id);
          expect(chip, `${s.id}/${id}`).toBeDefined();
          expect(chip!.slot).toBe(slot);
          const words = wordsFor(s, id);
          expect(words.length, `${s.id}/${id}`).toBeGreaterThan(2);
          expect(words).toBe(wordsFor(s, id));
        }
      }
      for (const slot of SLOTS) {
        expect(chipsFor(s, slot).length, `${s.id}/${slot}`).toBeGreaterThanOrEqual(3);
        expect(chipsFor(s, slot).map((c) => c.id)).toEqual([...idsOf(s, slot)]);
      }
    }
  });

  it('never overrides words or weight for a chip that place does not offer', () => {
    for (const s of SCENARIOS) {
      const offered = new Set<ChipId>([...s.names, ...s.asks, ...s.nexts]);
      for (const k of Object.keys(s.lines ?? {})) expect(offered.has(k as ChipId), `${s.id}/${k}`).toBe(true);
      for (const k of Object.keys(s.weights ?? {})) expect(offered.has(k as ChipId), `${s.id}/${k}`).toBe(true);
    }
  });
});

describe('building a line', () => {
  const s0 = SCENARIOS[0];
  const pick: Pick = { name: s0.names[0], ask: s0.asks[0], next: s0.nexts[0] };

  it('is not a line until all three parts are in the frame', () => {
    expect(isComplete(EMPTY_PICK)).toBe(false);
    expect(isComplete({ ...pick, next: null })).toBe(false);
    expect(isComplete(pick)).toBe(true);
    expect(outcomeOf(s0, { ...pick, ask: null })).toBeNull();
  });

  it('reads back in the order it was framed, whatever order it was filled', () => {
    expect(lineOf(s0, pick)).toBe(
      [wordsFor(s0, pick.name!), wordsFor(s0, pick.ask!), wordsFor(s0, pick.next!)].join(' '),
    );
    expect(lineOf(s0, EMPTY_PICK)).toBe('');
  });

  it('draws the same reaction every time for the same line', () => {
    for (const s of SCENARIOS) {
      for (const p of allPicks(s)) {
        const first = outcomeOf(s, p);
        expect(outcomeOf(s, p)).toBe(first);
        expect(['stops', 'goes-on', 'left']).toContain(first);
        expect(panelFor(s, first!)).toBe(
          first === 'stops' ? s.stops : first === 'goes-on' ? s.goesOn : s.left,
        );
      }
    }
  });
});

describe('what follows the line', () => {
  it('leaves real room in every place: some lines stop them, some do not', () => {
    for (const s of SCENARIOS) {
      const outcomes = allPicks(s).map((p) => outcomeOf(s, p));
      expect(outcomes.includes('stops'), `${s.id} has no line that stops them`).toBe(true);
      expect(outcomes.includes('goes-on'), `${s.id} has no line they walk through`).toBe(true);
      expect(outcomes.includes('left'), `${s.id} has no way out`).toBe(true);
    }
  });

  it('treats leaving as its own road, never measured against pushing', () => {
    for (const s of SCENARIOS) {
      for (const p of allPicks(s)) {
        if (nextKindOf(p) === 'exit') {
          expect(outcomeOf(s, p), `${s.id}/${p.next}`).toBe('left');
          // the same exit lands the same way however strong the first two parts were
          const loud: Pick = { name: s.names[0], ask: s.asks[0], next: p.next };
          expect(outcomeOf(s, loud)).toBe('left');
        }
      }
      const exits = s.nexts.filter((id) => chipById(id)?.next === 'exit');
      expect(exits.length, `${s.id} needs a way out`).toBeGreaterThanOrEqual(1);
    }
  });

  it('lets a soft, polite line fail — asking nicely is not a lever', () => {
    const failures = SCENARIOS.filter((s) =>
      allPicks(s).some((p) => nextKindOf(p) !== 'exit' && outcomeOf(s, p) === 'goes-on'),
    );
    expect(failures.length).toBe(SCENARIOS.length);
    const dino = scenarioById('dino')!;
    const polite: Pick = { name: 'n-mine', ask: 'a-put-down', next: 'x-thats-all' };
    expect(strengthOf(dino, polite)).toBeLessThan(dino.yieldsAt);
    expect(outcomeOf(dino, polite)).toBe('goes-on');
  });

  it('keeps one place where only the whole line moves the other person', () => {
    const hard = SCENARIOS.filter((s) => s.yieldsAt >= maxStrength(s));
    expect(hard.length).toBeGreaterThanOrEqual(1);
    for (const s of hard) {
      const stopping = allPicks(s).filter((p) => outcomeOf(s, p) === 'stops');
      for (const p of stopping) expect(strengthOf(s, p)).toBe(maxStrength(s));
    }
  });
});

describe('the tease, which is authored the other way round', () => {
  const tease = scenarioById('tease')!;

  it('makes agreeing the strongest line the place allows', () => {
    expect(strongestPick(tease).name).toBe('n-true');
    expect(forceOf(tease, 'n-true')).toBeGreaterThan(forceOf(tease, 'n-not-true'));
    expect(wordsFor(tease, 'n-true')).toBe('Yes, it does.');
  });

  it('lets denial fail outright — no line built on it ever stops them', () => {
    const denials = allPicks(tease).filter((p) => p.name === 'n-not-true');
    expect(denials.length).toBeGreaterThan(0);
    for (const p of denials) expect(outcomeOf(tease, p)).not.toBe('stops');
    const strongestDenial = Math.max(...denials.map((p) => strengthOf(tease, p)));
    expect(strongestDenial).toBeLessThan(tease.yieldsAt);
  });

  it('still lets agreeing be walked through if the rest of the line is thin', () => {
    const agreeing = allPicks(tease).filter((p) => p.name === 'n-true');
    const results = new Set(agreeing.map((p) => outcomeOf(tease, p)));
    expect(results.has('stops')).toBe(true);
    expect(results.size).toBeGreaterThan(1);
  });

  it('weighs a chip only where that place says so', () => {
    expect(forceOf(tease, 'n-not-true')).toBe(0);
    expect(forceOf(scenarioById('swap')!, 'n-not-true')).toBe(chipById('n-not-true')!.force);
  });
});

describe('nothing is scored and nothing is praised', () => {
  it('holds no praise, blame or moral gloss anywhere in the content', () => {
    for (const s of corpus()) {
      expect(s, s).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
      expect(s, s).not.toMatch(/\b(nice|kind|rude|bad|proud|brave|should have|better than)\b/i);
      expect(s, s).not.toMatch(/\b(you win|you lose|try again|point|score|star)\b/i);
    }
  });

  it('states what happened in the second person, past tense, as world-state', () => {
    for (const s of SCENARIOS) {
      for (const p of [s.stops, s.goesOn, s.left]) {
        expect(p.says).toMatch(/\.$/);
        expect(p.says).not.toMatch(/\?/);
      }
      expect(s.left.says).toMatch(/^You /);
    }
  });

  it('reads out coverage, never a ratio of right to anything', () => {
    expect(coverage([]).done).toBe(0);
    expect(coverage([]).total).toBe(SCENARIOS.length);
    expect(coverage(['dino', 'dino', 'tease']).done).toBe(2);
    expect(coverage(['not-a-place']).done).toBe(0);
    const text = readout(['dino', 'tease']);
    expect(text).toBe(`you have said your line out loud in 2 of ${SCENARIOS.length} places`);
    expect(text).not.toMatch(/correct|right|score|out of \d+ correct/i);
  });
});

describe('the plate he can put on a wall', () => {
  const s = scenarioById('controller')!;
  const p: Pick = { name: 'n-my-turn', ask: 'a-give-back', next: 'x-get-adult' };

  it('records what he built, what happened, and how long he held it', () => {
    const out = outcomeOf(s, p)!;
    const lines = plateLines(s, p, out, 2400);
    expect(lines[0]).toContain(s.where);
    expect(lines[1]).toBe(`You said: ${lineOf(s, p)}`);
    expect(lines[2]).toBe(panelFor(s, out).says);
    expect(lines[3]).toBe('held for 2.4 seconds');
    expect(plateTitle(s)).toBe(`Hold the Line — ${s.where}`);
    for (const l of lines) expect(l).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
  });

  it('measures a held button in seconds and never below zero', () => {
    expect(heldLabel(0)).toBe('held for 0.0 seconds');
    expect(heldLabel(-500)).toBe('held for 0.0 seconds');
    expect(heldLabel(10500)).toBe('held for 10.5 seconds');
  });
});

describe('setting words on paper', () => {
  it('keeps every word, in order, inside the width it was given', () => {
    const text = 'That is mine and it is not finished. Please put it down.';
    const rows = wrapText(text, 20);
    expect(rows.join(' ')).toBe(text);
    for (const r of rows) expect(r.length).toBeLessThanOrEqual(20);
  });

  it('survives an empty line and a word longer than the measure', () => {
    expect(wrapText('   ', 10)).toEqual([]);
    expect(wrapText('antidisestablishmentarianism', 8)).toEqual(['antidisestablishmentarianism']);
  });

  it('sets every line of every place without losing a word', () => {
    for (const s of SCENARIOS) {
      for (const p of allPicks(s)) {
        const text = lineOf(s, p);
        expect(wrapText(text, 74).join(' ')).toBe(text);
      }
    }
  });
});
