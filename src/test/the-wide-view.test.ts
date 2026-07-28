import { createElement } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  CLOSING_LINE,
  FEATURES,
  MIN_Z,
  NO_SHAPE,
  ROOMS,
  SEAL,
  THE_WIDE_VIEW_META,
  TOTAL_PEOPLE,
  accountOf,
  areaOf,
  canReturn,
  centreOf,
  complementOf,
  cropFrame,
  featureValues,
  keptLine,
  markRect,
  recallOrder,
  roomById,
  sentenceFor,
  shapeOf,
} from '../sel/the-wide-view';
import type { Person, Room } from '../sel/the-wide-view';
import TheWideView from '../components/sel/TheWideView';

afterEach(cleanup);

const sha = (b: Parameters<ReturnType<typeof createHash>['update']>[0]): string =>
  createHash('sha256').update(b).digest('hex');

const distanceFromMiddle = (p: Person): number => {
  const [cx, cy] = centreOf(p);
  return Math.hypot(cx - 0.5, cy - 0.5);
};

const DATA_FILE = 'src/sel/the-wide-view.data.ts';
const SENTINEL = '// ---- sealed body: every line below is hashed into SEAL.body ----';

/* ------------------------------------------------------------- provenance -- */

/**
 * The check whose absence let the old version ship. The data had no
 * relationship of any kind to the pictures, and art in this repo does get
 * redrawn after the data is written — `borrowed-eyes-circle-nell.png` and the
 * four `hold-the-line-swap-*.png` already carry later mtimes than their
 * siblings. Redraw a plate now and this goes red.
 */
describe('the census is sealed to the plates it was taken from', () => {
  it('fails if any plate is redrawn without re-deriving the census', () => {
    const drift: string[] = [];
    for (const room of ROOMS) {
      const bytes = readFileSync(join('public/games/sel', `${room.plate}.png`));
      const actual = sha(bytes);
      if (actual !== SEAL.plates[room.id]) drift.push(`${room.id}: plate is ${actual}, seal says ${SEAL.plates[room.id]}`);
      if (actual !== room.plateSha) drift.push(`${room.id}: plate is ${actual}, room record says ${room.plateSha}`);
    }
    expect(drift, 'regenerate: node scripts/derive-wide-view.mjs').toEqual([]);
  });

  it('fails if a coordinate in the generated file was moved by hand', () => {
    const src = readFileSync(DATA_FILE, 'utf8');
    const at = src.indexOf(SENTINEL);
    expect(at, 'the sentinel line is missing from the generated file').toBeGreaterThan(0);
    const body = src.slice(at + SENTINEL.length);
    expect(sha(body), 'regenerate, do not hand-edit').toBe(SEAL.body);
  });

  it('reads the plate size out of the PNG rather than trusting a typed number', () => {
    for (const room of ROOMS) {
      const bytes = readFileSync(join('public/games/sel', `${room.plate}.png`));
      expect(bytes.readUInt32BE(16), room.id).toBe(room.plateWidth);
      expect(bytes.readUInt32BE(20), room.id).toBe(room.plateHeight);
    }
  });
});

/* ---------------------------------------------------- the contact sheet -- */

/**
 * Everything the sheet shows, as data. `scripts/derive-wide-view.mjs --sheet`
 * renders this and nothing else, so the audit does no arithmetic of its own and
 * cannot drift from the product: the cards on the sheet are cut by exactly the
 * numbers the application cuts by.
 */
const artifact = {
  base: '../public/games/sel/',
  rooms: ROOMS.map((room) => ({
    id: room.id,
    place: room.place,
    plate: room.plate,
    plateSha: room.plateSha,
    people: room.people.map((p) => ({
      id: p.id,
      box: p.box,
      pose: p.pose,
      facing: p.facing,
      adult: p.adult,
      sentence: sentenceFor(p),
      frame: cropFrame(p, room, 132, 168),
    })),
  })),
};
const artifactJson = `${JSON.stringify(artifact, null, 2)}\n`;

describe('the crops are rendered, and the result of having looked is frozen', () => {
  it('writes the contact sheet input on every run', () => {
    mkdirSync('artifacts', { recursive: true });
    writeFileSync('artifacts/wide-view.json', artifactJson);
    expect(artifact.rooms.reduce((n, r) => n + r.people.length, 0)).toBe(TOTAL_PEOPLE);
  });

  /**
   * Move one box, change one pose, or reword the sentence template, and the
   * approval goes stale. That is the point: the sheet was looked at once by a
   * person, and this makes the looking diffable rather than aspirational.
   */
  it('fails when a box or a sentence changes after the sheet was approved', () => {
    expect(
      sha(artifactJson),
      'render the sheet (node scripts/derive-wide-view.mjs --sheet), LOOK at it, then --approve',
    ).toBe(SEAL.looked);
  });

  it('cuts a frame big enough to recognise a person in', () => {
    for (const room of ROOMS) {
      for (const p of room.people) {
        const at = `${room.id}/${p.id}`;
        // Enough of the painting to carry a face and a posture.
        expect((p.box[2] - p.box[0]) * room.plateWidth, at).toBeGreaterThanOrEqual(40);
        expect((p.box[3] - p.box[1]) * room.plateHeight, at).toBeGreaterThanOrEqual(60);
        const f = cropFrame(p, room, 132, 168);
        expect(f.frameW, at).toBeGreaterThanOrEqual(30);
        expect(f.frameH, at).toBeGreaterThanOrEqual(30);
        expect(f.frameW, at).toBeLessThanOrEqual(132);
        expect(f.frameH, at).toBeLessThanOrEqual(168);
        // The frame shows the box and only the box.
        expect(Math.abs(f.frameW / f.imgW - (p.box[2] - p.box[0])), at).toBeLessThan(0.01);
        expect(Math.abs(f.frameH / f.imgH - (p.box[3] - p.box[1])), at).toBeLessThan(0.01);
        expect(f.offsetX, at).toBeLessThanOrEqual(0);
        expect(f.offsetY, at).toBeLessThanOrEqual(0);
      }
    }
  });
});

/* ------------------------------------------------------------- the boxes -- */

describe('every person is a rectangle, and the rectangle is the only claim made', () => {
  /**
   * Renamed from "places every figure inside the plate", which asserted
   * `0 < x < 1` — a statement about the unit square that a marker sitting on
   * bare carpet passed cleanly. This asserts what it can: the box is a
   * well-formed rectangle within the picture. That a rectangle contains a
   * *person* is settled by the seal above plus the contact sheet, not by
   * arithmetic on numbers that never meet a pixel.
   */
  it('is a well-formed rectangle within the picture, which is all arithmetic can say', () => {
    for (const room of ROOMS) {
      for (const p of room.people) {
        const [x0, y0, x1, y1] = p.box;
        expect(x1, `${room.id}/${p.id}`).toBeGreaterThan(x0);
        expect(y1, `${room.id}/${p.id}`).toBeGreaterThan(y0);
        expect(x0).toBeGreaterThanOrEqual(0);
        expect(y0).toBeGreaterThanOrEqual(0);
        expect(x1).toBeLessThanOrEqual(1);
        expect(y1).toBeLessThanOrEqual(1);
      }
    }
  });

  it('carries a body-sized rectangle, not a dot and not the whole room', () => {
    for (const room of ROOMS) {
      for (const p of room.people) {
        const a = areaOf(p);
        expect(a, `${room.id}/${p.id} is too small to be a body`).toBeGreaterThan(0.0009);
        expect(a, `${room.id}/${p.id} is most of the room`).toBeLessThan(0.2);
      }
    }
  });

  it('gives every person a distinct id and a distinct place to stand', () => {
    for (const room of ROOMS) {
      const ids = room.people.map((p) => p.id);
      expect(new Set(ids).size, room.id).toBe(ids.length);
      const centres = room.people.map(centreOf);
      for (let i = 0; i < centres.length; i += 1) {
        for (let j = i + 1; j < centres.length; j += 1) {
          const d = Math.hypot(centres[i][0] - centres[j][0], centres[i][1] - centres[j][1]);
          expect(d, `${room.id} ${ids[i]}/${ids[j]}`).toBeGreaterThan(0.02);
        }
      }
    }
  });

  it('draws the mark over the box, so a wrong box is a visibly wrong rectangle', () => {
    const p = ROOMS[0].people[0];
    const r = markRect(p);
    expect(r.left).toBe(`${p.box[0] * 100}%`);
    expect(r.width).toBe(`${(p.box[2] - p.box[0]) * 100}%`);
  });
});

/* -------------------------------------------------------- no quota, ever -- */

/**
 * The old suite required `figures.length >= 6` per room and `TOTAL_FIGURES > 35`.
 * That is a quota on content applied to content that has to be *observed*: the
 * carpet plate does not contain a child with a shoe off, but the file had to
 * produce eight entries, so eight were written. Rosters sat at 8/7/7/6/6/6
 * against a floor of 6, which is what a quota being filled looks like.
 *
 * The roster is now whatever is in the picture — 13/16/13/10/15/12 — and this
 * guard keeps any floor from coming back. It reads every source file that
 * touches this exercise, including itself: the line that defines the pattern is
 * tagged so the guard cannot pass merely by matching its own text.
 *
 * It deliberately does not police exercises that are not this one. Borrowed
 * Eyes carries `plan.figures.length >= 4`, which is the same shape of mistake,
 * but that file belongs to another module and breaking it from here would be a
 * worse outcome than reporting it.
 */
describe('nothing about this exercise may demand that a room be crowded', () => {
  const TAG = 'no-roster-floor';
  const min = '(?:toBeGreaterThan|toBeGreaterThanOrEqual|>=?)\\s*\\(?\\s*\\d'; // no-roster-floor
  const quota = new RegExp(`(?:\\b(?:people|figures)\\.length\\b|\\bTOTAL_(?:PEOPLE|FIGURES)\\b)[^;\\n]*${min}`); // no-roster-floor

  const sources = (): { file: string; text: string }[] => {
    const out: { file: string; text: string }[] = [];
    for (const [dir, match] of [['src/test', /\.tsx?$/], ['src/sel', /\.ts$/], ['src/components/sel', /\.tsx$/]] as const) {
      for (const file of readdirSync(dir).filter((f) => match.test(f))) {
        const text = readFileSync(join(dir, file), 'utf8');
        // Only files that are about this exercise.
        if (!/the-wide-view|TOTAL_PEOPLE/.test(text)) continue;
        out.push({ file: join(dir, file), text: text.split('\n').filter((l) => !l.includes(TAG)).join('\n') });
      }
    }
    return out;
  };

  it('has no minimum-roster assertion in any file that touches this exercise', () => {
    const scanned = sources();
    expect(scanned.map((s) => s.file), 'the guard must at least be reading its own suite').toContain('src/test/the-wide-view.test.ts');
    const offenders = scanned.filter((s) => quota.test(s.text)).map((s) => s.file);
    expect(offenders, 'a floor on the roster is what invented the shoe').toEqual([]);
  });

  it('proves the guard can actually fire', () => {
    expect(quota.test('expect(r.people.length).toBeGreaterThanOrEqual(6);')).toBe(true); // no-roster-floor
    expect(quota.test('expect(TOTAL_FIGURES).toBeGreaterThan(35);')).toBe(true); // no-roster-floor
    expect(quota.test('expect(room.people.length).toBe(13);')).toBe(false); // no-roster-floor
  });

  it('lets the roster be whatever the picture holds', () => {
    const sizes = ROOMS.map((r) => r.people.length);
    expect(new Set(sizes).size, 'six rooms all the same size would be a quota by another name').toBeGreaterThan(1);
    expect(TOTAL_PEOPLE).toBe(sizes.reduce((a, b) => a + b, 0));
  });
});

/* ---------------------------------------------------------- the sentence -- */

describe('the sentence is generated, and generated prose is fenced harder than typed prose', () => {
  const every = ROOMS.flatMap((r) => r.people.map((p) => ({ room: r.id, p, s: sentenceFor(p) })));

  it('says something about every single person', () => {
    expect(every).toHaveLength(TOTAL_PEOPLE);
    for (const { room, p, s } of every) expect(s.length, `${room}/${p.id}`).toBeGreaterThan(20);
  });

  it('never uses a feeling word', () => {
    const feelings = /\b(happy|sad|angry|scared|excited|proud|shy|calm|lonely|upset|worried|jealous|cross)\b/i;
    for (const { room, p, s } of every) expect(feelings.test(s), `${room}/${p.id}: ${s}`).toBe(false);
  });

  it('never guesses at an intention', () => {
    const intent = /\b(wanted|wants|tried|trying|meant|hoped|decided|about to|because)\b/i;
    for (const { room, p, s } of every) expect(intent.test(s), `${room}/${p.id}: ${s}`).toBe(false);
  });

  it('never pities anyone', () => {
    const pity = /\b(needs|needy|lonely|left out|on (his|her|their) own|nobody|no one|alone)\b/i;
    for (const { room, p, s } of every) expect(pity.test(s), `${room}/${p.id}: ${s}`).toBe(false);
  });

  it('never praises or moralises', () => {
    const bad = /\b(great|well done|good job|kind|naughty|should|correct|wrong)\b/i;
    for (const { room, p, s } of every) expect(bad.test(s), `${room}/${p.id}: ${s}`).toBe(false);
    expect(bad.test(NO_SHAPE)).toBe(false);
    expect(bad.test(CLOSING_LINE)).toBe(false);
  });

  it('invents no name and no relationship', () => {
    for (const { room, p, s } of every) {
      expect(s.startsWith('A grown-up ') || s.startsWith('A child '), `${room}/${p.id}: ${s}`).toBe(true);
      expect(/\b(mum|mom|dad|teacher|his|her|their|friend|brother|sister)\b/i.test(s), s).toBe(false);
    }
  });

  it('says out loud when the picture cannot settle a posture', () => {
    const hidden = every.filter((e) => e.p.pose === 'part-hidden');
    expect(hidden.length, 'some figures are cut off by tables in these plates').toBeGreaterThan(0);
    for (const { s } of hidden) expect(s).toContain('half out of sight');
  });

  it('is assembled from the box, so moving a box moves the words', () => {
    const room = ROOMS[0];
    const p = room.people.find((x) => centreOf(x)[0] < 1 / 3 && centreOf(x)[1] < 0.5);
    expect(p, 'the carpet plate has someone at the back left').toBeTruthy();
    expect(sentenceFor(p as Person)).toContain('at the back on the left');
  });
});

/* ----------------------------------------------------------- the accounts -- */

describe('two accounts of one room, both true, neither complete', () => {
  const room = ROOMS[0];
  const kept = room.people.slice(0, 4).map((p) => p.id);

  it('puts every person in exactly one of the two accounts', () => {
    const mine = accountOf(room, kept);
    const rest = complementOf(room, kept);
    const theirs = accountOf(room, rest);
    expect(mine).toHaveLength(kept.length);
    expect(theirs).toHaveLength(room.people.length - kept.length);
    expect(new Set([...kept, ...rest]).size).toBe(room.people.length);
    expect(kept.some((id) => rest.includes(id))).toBe(false);
  });

  it('reads people out in the order they stand in the room, not the order he tapped', () => {
    const back = [...kept].reverse();
    expect(accountOf(room, back)).toEqual(accountOf(room, kept));
  });

  it('closes flat, without ranking the two', () => {
    expect(CLOSING_LINE).toBe('Both of these happened. You saw the first one.');
    expect(/better|worse|missed|should/i.test(CLOSING_LINE)).toBe(false);
  });
});

/* --------------------------------------------------------------- the shape -- */

describe('the one interpretive line, and its refusal', () => {
  it('refuses when kept and the rest are matched on every feature', () => {
    // A room built so the two halves have identical feature distributions:
    // mirrored positions, equal areas, equal spacing, same adult flag.
    const mirrored: Room = {
      id: 'matched',
      plate: 'x',
      plateSha: 'x',
      plateWidth: 900,
      plateHeight: 700,
      place: 'A room with no pattern in it',
      people: [0, 1, 2, 3].map((i) => ({
        id: `p${i}`,
        box: [0.1 + i * 0.2, 0.4, 0.16 + i * 0.2, 0.6] as const,
        pose: 'stand' as const,
        facing: 'towards' as const,
        adult: i % 2 === 0,
      })),
    };
    // Alternating people: same spacing, same size, one adult each side, and
    // centre-distances that pair up across the middle.
    expect(shapeOf(mirrored, ['p0', 'p3']).feature).toBeNull();
    expect(shapeOf(mirrored, ['p0', 'p3']).line).toBe(NO_SHAPE);
  });

  it('refuses on a degenerate selection, so no closing line can be earned by tapping nothing or everything', () => {
    for (const room of ROOMS) {
      expect(shapeOf(room, []).feature, room.id).toBeNull();
      expect(shapeOf(room, room.people.map((p) => p.id)).feature, room.id).toBeNull();
      expect(canReturn(room, []), room.id).toBe(false);
      expect(canReturn(room, room.people.map((p) => p.id)), room.id).toBe(false);
      expect(canReturn(room, [room.people[0].id]), room.id).toBe(true);
    }
  });

  /**
   * MIN_Z is not a taste, and this pins it from both sides. Random samples must
   * almost always be refused; every deliberately shaped sample must be spoken
   * about. Drop MIN_Z and the first half goes red because it starts narrating
   * noise; raise it to 2.6 and the second half goes red because it goes quiet
   * on a sample that really is centred.
   */
  it('refuses random samples and speaks about shaped ones, which is what fixes MIN_Z', () => {
    let seed = 20260728;
    const next = (): number => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    let spoke = 0;
    let total = 0;
    for (let trial = 0; trial < 4000; trial += 1) {
      const room = ROOMS[trial % ROOMS.length];
      const kept = room.people.filter(() => next() < 0.5).map((p) => p.id);
      if (!canReturn(room, kept)) continue;
      total += 1;
      if (shapeOf(room, kept).feature !== null) spoke += 1;
    }
    expect(total).toBeGreaterThan(3000);
    const refused = 1 - spoke / total;
    expect(refused, `MIN_Z=${MIN_Z} refuses only ${(refused * 100).toFixed(1)}% of random samples`)
      .toBeGreaterThan(0.95);

    const quiet: string[] = [];
    for (const room of ROOMS) {
      const central = [...room.people]
        .sort((a, b) => distanceFromMiddle(a) - distanceFromMiddle(b))
        .slice(0, 4)
        .map((p) => p.id);
      if (shapeOf(room, central).feature === null) quiet.push(`${room.id}: the four most central`);
      const grownUps = room.people.filter((p) => p.adult).map((p) => p.id);
      if (canReturn(room, grownUps) && shapeOf(room, grownUps).feature === null) {
        quiet.push(`${room.id}: every grown-up`);
      }
    }
    expect(quiet, `MIN_Z=${MIN_Z} is too high — it refuses samples that really do have a shape`).toEqual([]);
  });

  it('speaks when the sample really does have a shape', () => {
    const room = ROOMS.find((r) => r.people.some((p) => p.adult)) as Room;
    const grownUps = room.people.filter((p) => p.adult).map((p) => p.id);
    expect(shapeOf(room, grownUps).feature).toBe('adult');
    expect(shapeOf(room, grownUps).line).toContain('mostly grown-ups');

    const middle = [...ROOMS[0].people]
      .sort((a, b) => distanceFromMiddle(a) - distanceFromMiddle(b))
      .slice(0, 4)
      .map((p) => p.id);
    expect(shapeOf(ROOMS[0], middle).line).toContain('near the middle of the room');
  });

  it('reads every feature off the boxes and nothing else', () => {
    for (const room of ROOMS) {
      for (const f of FEATURES) {
        const values = featureValues(room, f);
        expect(values, `${room.id}/${f}`).toHaveLength(room.people.length);
        for (const v of values) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

/* ------------------------------------------------------------- the readout -- */

describe('the readout counts what he kept and never what he missed', () => {
  it('states the number he kept with nothing to compare it against', () => {
    expect(keptLine([])).toMatch(/not marked anybody/i);
    expect(keptLine(['a'])).toBe('You kept 1 person.');
    expect(keptLine(['a', 'b'])).toBe('You kept 2 people.');
  });

  it('has no coverage counter left in it', () => {
    const src = readFileSync('src/sel/the-wide-view.ts', 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    expect(/of the \$\{|\bcoverage\b/.test(src), 'the "N of the 8 people here" readout is gone').toBe(false);
  });

  it('finds a room by id, and meta is wired', () => {
    expect(roomById(ROOMS[1].id)?.place).toBe(ROOMS[1].place);
    expect(roomById('nowhere')).toBeUndefined();
    expect(THE_WIDE_VIEW_META.id).toBe('the-wide-view');
  });

  it('deals the strip in an order the plate did not choose', () => {
    for (const room of ROOMS) {
      const order = recallOrder(room);
      expect(order.map((p) => p.id).sort()).toEqual(room.people.map((p) => p.id).sort());
      expect(order.map((p) => p.id)).not.toEqual(room.people.map((p) => p.id));
      expect(recallOrder(room).map((p) => p.id)).toEqual(order.map((p) => p.id));
    }
  });
});

/* ----------------------------------------------------------- the interface -- */

describe('the interface cuts people out instead of pointing at coordinates', () => {
  /**
   * The old label was ``Look at the person ${Math.round(f.x * 100)} percent
   * across``: a screen-reader user was read a percentage, because the app knew
   * a coordinate and nothing whatever about who was standing there. Asserting
   * the accessible name is string-identical to the caption makes that label
   * unrepresentable.
   */
  it('gives every card an accessible name identical to its caption', () => {
    render(createElement(TheWideView));
    fireEvent.click(screen.getByRole('button', { name: 'I have looked' }));
    const room = ROOMS[0];
    for (const p of room.people) {
      const button = screen.getByRole('button', { name: sentenceFor(p) });
      expect(button.textContent).toBe(sentenceFor(p));
    }
  });

  it('shows the plate with nothing drawn on it during the glance', () => {
    const { container } = render(createElement(TheWideView));
    expect(screen.getByRole('button', { name: 'I have looked' })).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('holds the return shut until he has kept some but not all', () => {
    render(createElement(TheWideView));
    fireEvent.click(screen.getByRole('button', { name: 'I have looked' }));
    expect(screen.getByRole('button', { name: 'Show me the room again' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: sentenceFor(ROOMS[0].people[0]) }));
    expect(screen.getByRole('button', { name: 'Show me the room again' })).toBeEnabled();
    for (const p of ROOMS[0].people.slice(1)) {
      fireEvent.click(screen.getByRole('button', { name: sentenceFor(p) }));
    }
    expect(screen.getByRole('button', { name: 'Show me the room again' })).toBeDisabled();
  });

  it('marks the ones he kept and the ones he did not, and both accounts are on the page', () => {
    render(createElement(TheWideView));
    fireEvent.click(screen.getByRole('button', { name: 'I have looked' }));
    const room = ROOMS[0];
    const kept = room.people.slice(0, 3);
    for (const p of kept) fireEvent.click(screen.getByRole('button', { name: sentenceFor(p) }));
    fireEvent.click(screen.getByRole('button', { name: 'Show me the room again' }));
    expect(screen.getByText('The room from the ones you kept')).toBeInTheDocument();
    expect(screen.getByText('The room from the ones you did not')).toBeInTheDocument();
    expect(screen.getByText(CLOSING_LINE)).toBeInTheDocument();
    // A generated line for every person, in both accounts together.
    for (const p of room.people) expect(screen.getAllByText(sentenceFor(p)).length).toBeGreaterThan(0);
  });

  it('has no coverage counter and nothing that files a child as needing something', () => {
    const src = readFileSync('src/components/sel/TheWideView.tsx', 'utf8');
    expect(/needs something|of the \$\{|percent across/.test(src)).toBe(false);
    expect(/aria-label=\{`/.test(src), 'a templated label is how the percentage got in').toBe(false);
  });
});
