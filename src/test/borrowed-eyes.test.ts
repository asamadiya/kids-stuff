import { describe, expect, it } from 'vitest';
import {
  BORROWED_EYES_META, CHIPS, CHIP_IDS, MOMENTS,
  allSlots, bothSentences, chipAt, chipById, chipClause, chipWord, coneIn, coverageLine,
  coveredCount, earlierChip, eyeFor, eyeLineIn, hiddenFrom, listOf, momentById, momentComplete,
  nextNotch, notchAngle, plateChips, plateLines, readingFor, seesIn, sentenceFor, sightFrom,
  slotKey, spotsIn, turnBetween, visibleFrom, wrapWords,
} from '../sel/borrowed-eyes';
import type { ChipId, Eye, Figure, Placed } from '../sel/borrowed-eyes';

/** Every string carried by the content, so prose can be checked in bulk. */
function strings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

function keysDeep(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(keysDeep);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => [k, ...keysDeep(v)]);
  }
  return [];
}

const CONTENT = { meta: BORROWED_EYES_META, moments: MOMENTS, chips: CHIPS };

describe('borrowed eyes — the plate', () => {
  it('names itself', () => {
    expect(BORROWED_EYES_META.id).toBe('borrowed-eyes');
    expect(BORROWED_EYES_META.title).toBe('Borrowed Eyes');
    expect(BORROWED_EYES_META.eyebrow.trim().length).toBeGreaterThan(0);
    expect(BORROWED_EYES_META.note.trim().length).toBeGreaterThan(0);
  });

  it('ships four to six moments, each with the child’s own position first', () => {
    expect(MOMENTS.length).toBeGreaterThanOrEqual(4);
    expect(MOMENTS.length).toBeLessThanOrEqual(6);
    for (const m of MOMENTS) {
      expect(m.views.length).toBeGreaterThanOrEqual(2);
      expect(m.views[0].id).toBe('yours');
      expect(new Set(m.views.map((v) => v.id)).size).toBe(m.views.length);
    }
    expect(new Set(MOMENTS.map((m) => m.id)).size).toBe(MOMENTS.length);
  });

  it('gives the moment ONE picture, which is what makes "the same second" true', () => {
    // The two views used to carry an imageId each, and the two paintings were
    // of different rooms — different rug, furniture, game and child count —
    // while the copy claimed they were one second seen twice. The field now
    // lives on the moment, so a second unrelated painting is unrepresentable
    // and the claim is enforced by the compiler rather than by a person.
    const ids: string[] = [];
    for (const m of MOMENTS) {
      expect(m.imageId).toMatch(/^borrowed-eyes-[a-z0-9-]+$/);
      ids.push(m.imageId);
      expect('imageId' in (m.views[0] as object)).toBe(false);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every position its own words and its own eye height', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        for (const field of [v.whose, v.from, v.said]) {
          expect(field.trim().length).toBeGreaterThan(0);
        }
      }
      // What differs between the views is where you stood and what the room
      // let you see from there — not which painting you were shown. What is
      // visible from each position is computed from the moment's plan, so it
      // cannot contradict the picture.
      for (const key of ['whose', 'from', 'said'] as const) {
        const values = m.views.map((v) => v[key]);
        expect(new Set(values).size).toBe(values.length);
      }
    }
  });
});

describe('borrowed eyes — nothing is scored', () => {
  it('carries no field that could hold a correct answer', () => {
    for (const key of keysDeep(MOMENTS).concat(keysDeep(CHIPS))) {
      expect(key).not.toMatch(/answer|correct|expected|truth|score|points|weight|grade|best/i);
    }
  });

  it('never stores a chip id as content, so no chip can be the real reason', () => {
    const chipIds: readonly string[] = CHIP_IDS;
    for (const s of strings(MOMENTS)) expect(chipIds).not.toContain(s);
  });

  it('gives each chip exactly a drawing, a word and a clause', () => {
    expect(CHIPS.length).toBe(6);
    expect(new Set(CHIPS.map((c) => c.id)).size).toBe(6);
    expect([...CHIP_IDS].sort()).toEqual(CHIPS.map((c) => c.id).sort());
    for (const c of CHIPS) expect(Object.keys(c).sort()).toEqual(['clause', 'id', 'word']);
  });

  it('says nothing praising or moralising anywhere in the content', () => {
    for (const s of strings(CONTENT)) {
      expect(s).not.toMatch(/great|well done|good job|correct|wrong|naughty/i);
      expect(s).not.toMatch(/\b(kind|unkind|mean|nice|rude|selfish|should|better|best|bad|right)\b/i);
    }
  });

  it('reads out coverage, never a ratio of right to wrong', () => {
    expect(allSlots()).toHaveLength(MOMENTS.reduce((n, m) => n + m.views.length, 0));
    expect(coverageLine({})).toBe(`you have stood in 0 of the ${allSlots().length} positions`);
    const one: Placed = { [slotKey(MOMENTS[0].id, 'yours')]: 'join' };
    expect(coverageLine(one)).toContain(`1 of the ${allSlots().length}`);
    expect(coverageLine(one)).not.toMatch(/right|wrong|correct|score/i);
  });

  it('counts only positions that exist', () => {
    const placed: Placed = { 'not-a-moment/not-a-view': 'help', [slotKey('tower', 'mia')]: 'join' };
    expect(coveredCount(placed)).toBe(1);
  });
});

describe('borrowed eyes — ambiguity is left standing', () => {
  it('draws several moments so that neither position settles them', () => {
    const open = MOMENTS.filter((m) => m.unresolved);
    expect(open.length).toBeGreaterThanOrEqual(2);
    expect(open.length).toBeLessThan(MOMENTS.length);
  });

  it('lets both chips contradict each other and the picture', () => {
    const m = momentById('tower');
    const placed: Placed = {
      [slotKey('tower', 'yours')]: 'own',
      [slotKey('tower', 'mia')]: 'join',
    };
    expect(momentComplete(m, placed)).toBe(true);
    expect(chipAt(placed, 'tower', 'yours')).toBe('own');
    expect(chipAt(placed, 'tower', 'mia')).toBe('join');
    // contradiction is stored as given; nothing reconciles or flags it
    const lines = plateLines(m, placed);
    expect(lines).toHaveLength(4);
    for (const l of lines) expect(l).not.toMatch(/but|however|really|actually/i);
  });

  it('every chip may be placed on every position', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        for (const c of CHIPS) {
          const line = readingFor(m, v, c);
          expect(line.startsWith(v.from)).toBe(true);
          expect(line.endsWith('.')).toBe(true);
        }
      }
    }
  });
});

describe('borrowed eyes — the two readings', () => {
  it('states both sentences, in the order the moment carries them', () => {
    const m = momentById('tower');
    expect(bothSentences(m)).toEqual([
      'From where you stood, her hand came down on the roof.',
      'From where Mia knelt, she was putting a piece on.',
    ]);
  });

  it('joins the two sentences with no conjunction that judges', () => {
    for (const m of MOMENTS) {
      const both = bothSentences(m).join(' ');
      expect(both).not.toMatch(/\b(but|although|though|even so|instead)\b/i);
      expect(bothSentences(m)).toEqual(m.views.map(sentenceFor));
    }
  });

  it('bends the chip to the person it is placed on', () => {
    const own = chipById('own');
    expect(chipClause(own, momentById('tower').other)).toBe('she wanted it for herself');
    expect(chipClause(own, momentById('story').other)).toBe('he wanted it for himself');
    expect(chipWord(own, momentById('queue').other)).toBe('wanted it for himself');
  });

  it('leaves no placeholder unresolved in anything read aloud', () => {
    for (const m of MOMENTS) {
      for (const c of CHIPS) {
        expect(chipWord(c, m.other)).not.toContain('{');
        expect(chipClause(c, m.other)).not.toContain('{');
        for (const v of m.views) expect(readingFor(m, v, c)).not.toContain('{');
      }
    }
  });

  it('is deterministic: the same placement makes the same plate every time', () => {
    const m = momentById('crayon');
    const placed: Placed = {
      [slotKey('crayon', 'yours')]: 'copy',
      [slotKey('crayon', 'mia')]: 'join',
    };
    expect(plateLines(m, placed)).toEqual(plateLines(m, placed));
    expect(plateLines(m, placed).slice(0, 2)).toEqual(bothSentences(m));
    expect(plateChips(m, placed)).toEqual([
      { viewId: 'yours', chip: 'copy' },
      { viewId: 'mia', chip: 'join' },
    ]);
  });

  it('keeps a half-placed moment half-placed', () => {
    const m = momentById('circle');
    const placed: Placed = { [slotKey('circle', 'yours')]: 'unseen' };
    expect(momentComplete(m, placed)).toBe(false);
    expect(plateLines(m, placed)).toHaveLength(3);
    expect(plateChips(m, placed)).toHaveLength(1);
  });
});

describe('borrowed eyes — a second run', () => {
  it('sets the earlier chip beside the new one, with nothing said about it', () => {
    const before = plateChips(momentById('tower'), {
      [slotKey('tower', 'yours')]: 'own',
      [slotKey('tower', 'mia')]: 'help',
    });
    expect(earlierChip(before, 'yours')).toBe('own');
    expect(earlierChip(before, 'mia')).toBe('help');
    expect(earlierChip(before, 'nobody')).toBeNull();
    expect(earlierChip([], 'yours')).toBeNull();
  });

  it('knows every chip it is handed back', () => {
    for (const id of CHIP_IDS) expect(chipById(id).id).toBe(id);
    expect(() => chipById('nope' as ChipId)).toThrow();
    expect(() => momentById('nope')).toThrow();
  });
});

describe('borrowed eyes — the plan is the authority', () => {
  /**
   * FAILS IF REVERTED: put `imageId` back on a view and this fails. Two plates
   * per moment is how "the same second, drawn twice" became two rooms with
   * different rugs, furniture, games and child counts.
   */
  it('gives a view no field that could hold a second painting', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        expect(Object.keys(v).sort()).toEqual(['from', 'id', 'said', 'whose']);
        for (const key of Object.keys(v)) {
          expect(key, `${m.id}/${v.id}.${key}`)
            .not.toMatch(/image|img|panel|plate|picture|png|alt|src|photo/i);
        }
      }
      expect(Object.keys(m)).toContain('imageId');
      expect(m.alt.length).toBeGreaterThan(60);
    }
  });

  /**
   * FAILS IF REVERTED: write "four children" into an alt or a `said` again and
   * this fails. The old `circle` prose claimed four in both views over five
   * drawn children. A count may only be spoken by a sentence that counted it.
   */
  it('writes no count anywhere in the prose, so a count can only be one the plan made', () => {
    const NUMBER = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|both|\d+)\b/i;
    // Scoped to the strings that make a claim about what is in the room. A
    // title is not one of those: "The one outside the circle" names a person.
    for (const m of MOMENTS) {
      expect(NUMBER.test(m.alt), `${m.id}.alt`).toBe(false);
      for (const v of m.views) {
        expect(NUMBER.test(v.said), `${m.id}/${v.id}.said`).toBe(false);
        expect(NUMBER.test(v.whose), `${m.id}/${v.id}.whose`).toBe(false);
        expect(NUMBER.test(v.from), `${m.id}/${v.id}.from`).toBe(false);
      }
      for (const f of m.plan.figures) expect(NUMBER.test(f.label), `${m.id}/${f.id}`).toBe(false);
    }
    // and the generated sentence does carry a count, measured off the plan
    const circle = momentById('circle');
    expect(eyeLineIn(circle, circle.views[0]))
      .toContain(`of the ${circle.plan.figures.length - 1} things`);
  });

  it('sets every figure inside the plan, with a width, a height and a kind', () => {
    for (const m of MOMENTS) {
      expect(m.plan.figures.length).toBeGreaterThanOrEqual(4);
      expect(new Set(m.plan.figures.map((f) => f.id)).size).toBe(m.plan.figures.length);
      for (const f of m.plan.figures) {
        expect(f.x, `${m.id}/${f.id}`).toBeGreaterThanOrEqual(0);
        expect(f.x, `${m.id}/${f.id}`).toBeLessThanOrEqual(m.plan.across);
        expect(f.y, `${m.id}/${f.id}`).toBeGreaterThanOrEqual(0);
        expect(f.y, `${m.id}/${f.id}`).toBeLessThanOrEqual(m.plan.deep);
        expect(f.across, `${m.id}/${f.id}`).toBeGreaterThan(0);
        expect(f.top, `${m.id}/${f.id}`).toBeGreaterThan(0);
        expect(['child', 'grown-up', 'small one', 'thing']).toContain(f.kind);
        expect(f.label).not.toContain(',');
      }
    }
  });

  it('stands each eye on the figure it belongs to, one eye per view', () => {
    for (const m of MOMENTS) {
      expect(m.plan.eyes.map((e) => e.viewId)).toEqual(m.views.map((v) => v.id));
      for (const e of m.plan.eyes) {
        const self = m.plan.figures.find((f) => f.id === e.self) as Figure;
        expect(self, `${m.id}/${e.viewId}`).toBeDefined();
        expect(e.x).toBe(self.x);
        expect(e.y).toBe(self.y);
        expect(e.height).toBeGreaterThan(40);
        expect(e.height).toBeLessThanOrEqual(self.top);
        expect(e.halfAngle).toBeGreaterThan(20);
        expect(e.halfAngle).toBeLessThan(120);
        expect(eyeFor(m.plan, e.viewId)).toBe(e);
      }
      // the two positions are genuinely different heights, which is the parallax
      const [a, b] = m.plan.eyes;
      expect(Math.abs(a.height - b.height), m.id).toBeGreaterThanOrEqual(6);
    }
  });

  it('never reports that anyone can see themselves', () => {
    for (const m of MOMENTS) {
      for (const e of m.plan.eyes) {
        const seen = sightFrom(m.plan, e).map((s) => s.figure.id);
        expect(seen).not.toContain(e.self);
        expect(seen).toHaveLength(m.plan.figures.length - 1);
      }
    }
  });

  /**
   * FAILS IF REVERTED: drop the height term from the occlusion test — go back to
   * "anything on the line hides anything behind it" — and this fails, because a
   * standing eye would stop seeing over a seated one. Parallax IS the module,
   * and this is the claim the two paintings were supposed to be making.
   */
  it('lets a standing position and a sitting one disagree about the same thing', () => {
    const circle = momentById('circle');
    const nell = eyeFor(circle.plan, 'nell');
    const yours = eyeFor(circle.plan, 'yours');
    const game = (e: Eye) => sightFrom(circle.plan, e).find((s) => s.figure.id === 'game');
    // Nell stands back behind a ring of seated backs, so the game on the floor
    // is covered; Leo sits inside the ring with nothing between him and it.
    expect(game(nell)?.inFront).toBe(true);
    expect(game(nell)?.behind?.id).toBe('kid-b');
    expect(game(yours)?.inFront).toBe(true);
    expect(game(yours)?.behind).toBeNull();
    // the same standing eye still sees every seated child over every other
    expect(sightFrom(circle.plan, nell).filter((s) => s.figure.kind === 'child' && s.behind))
      .toHaveLength(0);
    // and it runs the other way too: the low eye is the covered one here
    const story = momentById('story');
    expect(sightFrom(story.plan, eyeFor(story.plan, 'yours'))
      .find((s) => s.figure.id === 'mia')?.behind?.id).toBe('dad');
    expect(sightFrom(story.plan, eyeFor(story.plan, 'dad'))
      .find((s) => s.figure.id === 'mia')?.behind).toBeNull();
  });

  it('clears the view when the eye rises above what stands in the way', () => {
    const circle = momentById('circle');
    const nell = eyeFor(circle.plan, 'nell');
    const gameFrom = (e: Eye) => sightFrom(circle.plan, e).find((s) => s.figure.id === 'game');
    expect(gameFrom(nell)?.behind).not.toBeNull();
    expect(gameFrom({ ...nell, height: 400 })?.behind).toBeNull();
    expect(gameFrom({ ...nell, height: 20 })?.behind).not.toBeNull();
  });

  it('turns the cone with the face, so what is not in front stops being in front', () => {
    const tower = momentById('tower');
    const mia = eyeFor(tower.plan, 'mia');
    const inFront = (e: Eye) => sightFrom(tower.plan, e).filter((s) => s.inFront).map((s) => s.figure.id);
    expect(inFront(mia)).toContain('tower');
    expect(inFront({ ...mia, facing: mia.facing + 180 })).not.toContain('tower');
    expect(turnBetween(170, -170)).toBe(20);
    expect(turnBetween(-170, 170)).toBe(-20);
    expect(turnBetween(10, 10)).toBe(0);
  });

  /**
   * FAILS IF REVERTED: hand-type a `sees` string onto a view again and it can
   * say anything. Generated, it can only name figures the plan holds, and it
   * cannot tell the viewer they can see themselves.
   */
  it('generates the seeing sentence out of the plan, naming only figures in it', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        const line = seesIn(m, v);
        const said = line.toLowerCase();
        const eye = eyeFor(m.plan, v.id);
        expect(line.startsWith('From here you can see ')).toBe(true);
        expect(line.trim().endsWith('.')).toBe(true);
        for (const s of visibleFrom(m.plan, eye)) expect(said).toContain(s.figure.label.toLowerCase());
        for (const s of hiddenFrom(m.plan, eye)) {
          expect(said).toContain(s.figure.label.toLowerCase());
          expect(said).toContain(`behind ${s.behind?.label.toLowerCase()}`);
        }
        const self = m.plan.figures.find((f) => f.id === eye.self) as Figure;
        expect(said, `${m.id}/${v.id}`).not.toContain(self.label.toLowerCase());
      }
    }
    // every moment has at least one position where something stands in the way
    const covering = MOMENTS.filter(
      (m) => m.plan.eyes.some((e) => hiddenFrom(m.plan, e).length > 0),
    );
    expect(covering.length).toBeGreaterThanOrEqual(3);
  });

  it('reads the eye height off the eye, and counts what stands taller every time', () => {
    for (const m of MOMENTS) {
      for (const v of m.views) {
        const eye = eyeFor(m.plan, v.id);
        const line = eyeLineIn(m, v);
        expect(line).toContain(`${eye.height} centimetres above the floor`);
        const taller = m.plan.figures.filter((f) => f.id !== eye.self && f.top > eye.height).length;
        expect(line).toContain(`${taller} of the ${m.plan.figures.length - 1} things`);
        expect(line.toLowerCase()).toContain(eye.stance);
      }
    }
  });

  it('joins a list without losing a part or gaining a comma', () => {
    expect(listOf([])).toBe('nothing');
    expect(listOf(['the game'])).toBe('the game');
    expect(listOf(['a', 'b'])).toBe('a and b');
    expect(listOf(['a', 'b', 'c'])).toBe('a, b and c');
  });

  it('scales the plan onto a drawing box with one scale for both axes', () => {
    const m = momentById('circle');
    const spots = spotsIn(m.plan, 360, 300);
    expect(spots).toHaveLength(m.plan.figures.length);
    for (const s of spots) {
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.x).toBeLessThanOrEqual(360);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.y).toBeLessThanOrEqual(300);
      expect(s.r).toBeGreaterThan(0);
    }
    // one scale, so the plan stays a map: distances keep their ratio
    const k = Math.min(360 / m.plan.across, 300 / m.plan.deep);
    const drawn = Math.hypot(spots[0].x - spots[1].x, spots[0].y - spots[1].y);
    const real = Math.hypot(
      m.plan.figures[0].x - m.plan.figures[1].x,
      m.plan.figures[0].y - m.plan.figures[1].y,
    );
    expect(drawn).toBeCloseTo(real * k, 6);
    const cone = coneIn(m.plan, eyeFor(m.plan, 'nell'), 360, 300);
    expect(cone.left).not.toEqual(cone.right);
    expect(cone.x).toBeCloseTo(eyeFor(m.plan, 'nell').x * k, 6);
  });
});

describe('borrowed eyes — the dial and the plate', () => {
  it('wraps round the notches', () => {
    expect(nextNotch(0, 2)).toBe(1);
    expect(nextNotch(1, 2)).toBe(0);
    expect(nextNotch(2, 3)).toBe(0);
    expect(nextNotch(0, 0)).toBe(0);
  });

  it('spreads the notches symmetrically about the middle', () => {
    expect(notchAngle(0, 1)).toBe(0);
    expect(notchAngle(0, 2)).toBe(-notchAngle(1, 2));
    expect(notchAngle(1, 3)).toBe(0);
    expect(notchAngle(0, 3)).toBeLessThan(notchAngle(2, 3));
  });

  it('wraps sentences without losing or reordering a word', () => {
    const text = bothSentences(momentById('queue'))[1];
    const lines = wrapWords(text, 30);
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(30);
    expect(lines.join(' ')).toBe(text);
    expect(wrapWords('', 20)).toEqual([]);
    expect(wrapWords('extraordinarily-long-single-word', 8)).toEqual(['extraordinarily-long-single-word']);
  });
});
