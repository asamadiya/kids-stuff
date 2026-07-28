#!/usr/bin/env node
/**
 * The Wide View — derivation, seal, and the contact sheet you have to look at.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The shipped version of this exercise had two authorities for one fact. An
 * image model decided who was in each room and where they stood; a human hand
 * in `src/sel/the-wide-view.ts` also decided it. Nothing arbitrated, so they
 * diverged completely: of forty markers across six plates, about four landed on
 * a person. "The teacher is holding the book open, reading" pointed at a
 * bookshelf. No child in the carpet plate has a shoe off, has a hand up, or
 * sits outside the ring — those were described, not drawn.
 *
 * So the observations now enter the application through exactly one door: this
 * script. The census below is a vision pass over the six PNGs, recorded once,
 * against a closed schema. It asks only for what a viewer can settle from
 * pixels:
 *
 *     box     [x0,y0,x1,y1] normalised, tight to the whole visible body
 *     pose    one of a CLOSED enum, never free prose
 *     facing  which way the head points, in the picture plane
 *     adult   true / false
 *
 * Nothing is recorded about intent, feeling, relationship or history, because
 * a picture cannot settle those and that is precisely the class of claim that
 * was invented. The read-aloud sentence is GENERATED from those four fields by
 * `sentenceFor` in `src/sel/the-wide-view.ts`, so there is no free text left in
 * the system to drift away from the picture.
 *
 * `pose: 'part-hidden'` is not a hedge, it is the honest value for a figure
 * whose lower body is behind a table: standing and sitting are both consistent
 * with the pixels, so the exercise says so out loud rather than guessing.
 *
 * WHAT THE SEAL DOES
 * ------------------
 *   SEAL.plates  sha256 of each PNG as it was when the census was taken.
 *                Art in this repo does get redrawn after the data is written —
 *                borrowed-eyes-circle-nell.png and four hold-the-line-swap-*.png
 *                already carry later mtimes than their siblings. Today the data
 *                has no relationship of any kind to the file. After this, a
 *                redrawn plate turns the suite red.
 *   SEAL.body    sha256 of everything below the sentinel line in the generated
 *                file, so a hand-edited coordinate turns the suite red.
 *   SEAL.looked  sha256 of `artifacts/wide-view.json` — every crop rectangle and
 *                every generated sentence — as they were when a person opened
 *                the contact sheet and looked at it. This is the result of
 *                having looked, made diffable. Change a box and it goes stale.
 *
 * THE LOOP
 * --------
 *     node scripts/derive-wide-view.mjs            # census -> data file
 *     npx vitest run src/test/the-wide-view.test.ts  # writes artifacts/wide-view.json
 *     node scripts/derive-wide-view.mjs --sheet    # cuts every crop, renders the sheet
 *     <open artifacts/wide-view-<room>.png and LOOK AT THEM>
 *     node scripts/derive-wide-view.mjs --approve  # freezes what you just saw
 *
 * The sheet is not a debug view. Its cards are the product surface: the app
 * cuts each person out of the plate rather than drawing a dot over them, so a
 * wrong box renders as a picture of a bookshelf — in the audit and in the
 * product, at a glance, on every run.
 */

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';
import { join } from 'node:path';

const PLATE_DIR = 'public/games/sel';
const DATA_FILE = 'src/sel/the-wide-view.data.ts';
const ARTIFACT = 'artifacts/wide-view.json';
const SHEET_HTML = 'artifacts/wide-view-contact.html';
const SENTINEL = '// ---- sealed body: every line below is hashed into SEAL.body ----';

/** The closed pose vocabulary. Adding a member is a deliberate act, here. */
const POSES = ['stand', 'sit-floor', 'sit-seat', 'kneel', 'crouch', 'climb', 'lie', 'part-hidden'];
const FACINGS = ['left', 'right', 'towards', 'away'];

/**
 * The census. One row per person: [box, pose, facing, adult].
 *
 * Taken by opening each plate at native resolution and again under a 1%
 * coordinate grid, quadrant by quadrant. Boxes are tight to the whole visible
 * body including a reaching arm, and stop where an occluder starts. Rows are in
 * no particular order; ids are assigned by position in this list and are stable.
 */
const CENSUS = [
  {
    id: 'carpet',
    place: 'The classroom carpet, story time',
    people: [
      { box: [0.207, 0.178, 0.277, 0.478], pose: 'stand', facing: 'right', adult: true },
      { box: [0.306, 0.178, 0.377, 0.370], pose: 'stand', facing: 'away', adult: true },
      { box: [0.278, 0.360, 0.336, 0.606], pose: 'stand', facing: 'right', adult: false },
      { box: [0.345, 0.322, 0.422, 0.492], pose: 'sit-floor', facing: 'towards', adult: false },
      { box: [0.492, 0.222, 0.578, 0.510], pose: 'sit-seat', facing: 'towards', adult: true },
      { box: [0.743, 0.240, 0.801, 0.390], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.616, 0.374, 0.708, 0.558], pose: 'kneel', facing: 'right', adult: false },
      { box: [0.728, 0.397, 0.789, 0.569], pose: 'kneel', facing: 'left', adult: false },
      { box: [0.802, 0.385, 0.858, 0.665], pose: 'stand', facing: 'left', adult: false },
      { box: [0.722, 0.542, 0.833, 0.727], pose: 'sit-floor', facing: 'left', adult: false },
      { box: [0.166, 0.509, 0.286, 0.730], pose: 'sit-floor', facing: 'right', adult: false },
      { box: [0.344, 0.616, 0.467, 0.823], pose: 'sit-floor', facing: 'away', adult: false },
      { box: [0.558, 0.656, 0.689, 0.823], pose: 'sit-floor', facing: 'right', adult: false },
    ],
  },
  {
    id: 'recess',
    place: 'The playground at recess',
    people: [
      { box: [0.085, 0.213, 0.146, 0.410], pose: 'stand', facing: 'right', adult: false },
      { box: [0.167, 0.183, 0.229, 0.338], pose: 'climb', facing: 'right', adult: false },
      { box: [0.245, 0.113, 0.315, 0.337], pose: 'climb', facing: 'right', adult: false },
      { box: [0.328, 0.203, 0.385, 0.397], pose: 'stand', facing: 'left', adult: false },
      { box: [0.525, 0.233, 0.585, 0.467], pose: 'stand', facing: 'right', adult: false },
      { box: [0.605, 0.243, 0.665, 0.470], pose: 'stand', facing: 'left', adult: false },
      { box: [0.755, 0.183, 0.805, 0.377], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.875, 0.223, 0.925, 0.427], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.125, 0.453, 0.192, 0.667], pose: 'stand', facing: 'right', adult: false },
      { box: [0.255, 0.453, 0.315, 0.667], pose: 'stand', facing: 'left', adult: false },
      { box: [0.405, 0.393, 0.472, 0.605], pose: 'stand', facing: 'left', adult: false },
      { box: [0.685, 0.513, 0.755, 0.640], pose: 'sit-floor', facing: 'towards', adult: false },
      { box: [0.828, 0.503, 0.935, 0.907], pose: 'stand', facing: 'left', adult: true },
      { box: [0.065, 0.713, 0.135, 0.937], pose: 'stand', facing: 'right', adult: false },
      { box: [0.184, 0.733, 0.255, 0.947], pose: 'stand', facing: 'right', adult: false },
      { box: [0.391, 0.657, 0.525, 0.907], pose: 'stand', facing: 'right', adult: false },
    ],
  },
  {
    id: 'party',
    place: 'A birthday party',
    people: [
      { box: [0.155, 0.303, 0.224, 0.615], pose: 'stand', facing: 'right', adult: false },
      { box: [0.104, 0.558, 0.212, 0.828], pose: 'stand', facing: 'left', adult: false },
      { box: [0.317, 0.387, 0.412, 0.548], pose: 'part-hidden', facing: 'right', adult: false },
      { box: [0.408, 0.385, 0.469, 0.525], pose: 'part-hidden', facing: 'right', adult: false },
      { box: [0.526, 0.207, 0.598, 0.535], pose: 'stand', facing: 'right', adult: true },
      { box: [0.598, 0.205, 0.655, 0.535], pose: 'stand', facing: 'right', adult: true },
      { box: [0.655, 0.211, 0.766, 0.425], pose: 'stand', facing: 'left', adult: true },
      { box: [0.649, 0.375, 0.714, 0.531], pose: 'part-hidden', facing: 'towards', adult: false },
      { box: [0.712, 0.402, 0.777, 0.548], pose: 'part-hidden', facing: 'left', adult: false },
      { box: [0.304, 0.545, 0.462, 0.771], pose: 'kneel', facing: 'right', adult: false },
      { box: [0.453, 0.525, 0.545, 0.798], pose: 'sit-floor', facing: 'left', adult: false },
      { box: [0.595, 0.605, 0.687, 0.827], pose: 'sit-floor', facing: 'right', adult: false },
      { box: [0.710, 0.555, 0.803, 0.798], pose: 'sit-floor', facing: 'left', adult: false },
    ],
  },
  {
    id: 'playdate',
    place: 'A play date at their house',
    people: [
      { box: [0.380, 0.249, 0.487, 0.538], pose: 'sit-seat', facing: 'towards', adult: true },
      { box: [0.285, 0.329, 0.367, 0.534], pose: 'sit-seat', facing: 'towards', adult: false },
      { box: [0.666, 0.191, 0.737, 0.443], pose: 'stand', facing: 'away', adult: true },
      { box: [0.828, 0.313, 0.937, 0.502], pose: 'sit-seat', facing: 'left', adult: true },
      { box: [0.518, 0.344, 0.600, 0.668], pose: 'stand', facing: 'right', adult: false },
      { box: [0.601, 0.354, 0.686, 0.668], pose: 'stand', facing: 'left', adult: false },
      { box: [0.737, 0.329, 0.794, 0.584], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.122, 0.529, 0.231, 0.761], pose: 'sit-floor', facing: 'right', adult: false },
      { box: [0.355, 0.551, 0.447, 0.736], pose: 'sit-floor', facing: 'left', adult: false },
      { box: [0.739, 0.559, 0.887, 0.802], pose: 'part-hidden', facing: 'left', adult: false },
    ],
  },
  {
    id: 'dinner',
    place: 'The dinner table',
    people: [
      { box: [0.064, 0.353, 0.128, 0.623], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.153, 0.255, 0.228, 0.619], pose: 'stand', facing: 'towards', adult: false },
      { box: [0.270, 0.201, 0.342, 0.425], pose: 'stand', facing: 'towards', adult: true },
      { box: [0.402, 0.164, 0.474, 0.375], pose: 'stand', facing: 'towards', adult: true },
      { box: [0.262, 0.319, 0.422, 0.810], pose: 'sit-seat', facing: 'right', adult: true },
      { box: [0.391, 0.307, 0.505, 0.535], pose: 'sit-seat', facing: 'right', adult: true },
      { box: [0.493, 0.262, 0.552, 0.440], pose: 'sit-seat', facing: 'towards', adult: true },
      { box: [0.566, 0.217, 0.638, 0.418], pose: 'sit-seat', facing: 'towards', adult: true },
      { box: [0.696, 0.264, 0.760, 0.369], pose: 'sit-seat', facing: 'towards', adult: false },
      { box: [0.781, 0.231, 0.849, 0.376], pose: 'part-hidden', facing: 'towards', adult: true },
      { box: [0.815, 0.267, 0.934, 0.745], pose: 'sit-seat', facing: 'left', adult: true },
      { box: [0.729, 0.364, 0.834, 0.530], pose: 'sit-seat', facing: 'left', adult: false },
      { box: [0.164, 0.548, 0.261, 0.760], pose: 'sit-seat', facing: 'towards', adult: false },
      { box: [0.521, 0.506, 0.640, 0.860], pose: 'sit-seat', facing: 'right', adult: false },
      { box: [0.696, 0.482, 0.807, 0.775], pose: 'sit-seat', facing: 'left', adult: false },
    ],
  },
  {
    id: 'museum',
    place: 'The museum hall',
    people: [
      { box: [0.056, 0.563, 0.128, 0.826], pose: 'stand', facing: 'right', adult: false },
      { box: [0.134, 0.652, 0.212, 0.836], pose: 'stand', facing: 'right', adult: false },
      { box: [0.255, 0.474, 0.364, 0.736], pose: 'sit-seat', facing: 'right', adult: true },
      { box: [0.422, 0.481, 0.487, 0.737], pose: 'stand', facing: 'right', adult: false },
      { box: [0.513, 0.417, 0.569, 0.651], pose: 'stand', facing: 'right', adult: false },
      { box: [0.574, 0.387, 0.630, 0.641], pose: 'stand', facing: 'left', adult: true },
      { box: [0.647, 0.390, 0.699, 0.644], pose: 'stand', facing: 'left', adult: true },
      { box: [0.501, 0.656, 0.613, 0.798], pose: 'crouch', facing: 'right', adult: false },
      { box: [0.602, 0.649, 0.683, 0.798], pose: 'crouch', facing: 'left', adult: false },
      { box: [0.712, 0.508, 0.803, 0.656], pose: 'crouch', facing: 'right', adult: false },
      { box: [0.812, 0.486, 0.920, 0.656], pose: 'kneel', facing: 'right', adult: false },
      { box: [0.653, 0.644, 0.953, 0.956], pose: 'lie', facing: 'left', adult: true },
    ],
  },
];

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

/** Width and height straight out of the PNG's IHDR, so no one types them. */
function plateFacts(id) {
  const file = join(PLATE_DIR, `the-wide-view-${id}.png`);
  const bytes = readFileSync(file);
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file} is not a PNG`);
  return { sha: sha(bytes), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function checkCensus() {
  const problems = [];
  for (const room of CENSUS) {
    if (room.people.length === 0) problems.push(`${room.id}: no people`);
    room.people.forEach((p, i) => {
      const [x0, y0, x1, y1] = p.box;
      const at = `${room.id}[${i}]`;
      if (!POSES.includes(p.pose)) problems.push(`${at}: pose ${p.pose} is not in the closed set`);
      if (!FACINGS.includes(p.facing)) problems.push(`${at}: facing ${p.facing} is not in the closed set`);
      if (!(x0 >= 0 && y0 >= 0 && x1 <= 1 && y1 <= 1)) problems.push(`${at}: box leaves the plate`);
      if (!(x1 > x0 && y1 > y0)) problems.push(`${at}: box is empty or inverted`);
      if (x1 - x0 < 0.02 || y1 - y0 < 0.02) problems.push(`${at}: box is too small to be a body`);
    });
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
}

const q = (s) => `'${s}'`;

function emit() {
  checkCensus();
  const rooms = CENSUS.map((room) => ({ ...room, facts: plateFacts(room.id) }));
  const plateLines = rooms.map((r) => `    ${r.id}: '${r.facts.sha}',`).join('\n');
  const looked = existingSeal()?.looked ?? '';

  const head = `/**
 * GENERATED by scripts/derive-wide-view.mjs — DO NOT EDIT BY HAND.
 *
 * A census of who is in each plate, taken from the plates. Regenerate with
 *   node scripts/derive-wide-view.mjs
 * then re-run the tests, re-render the contact sheet, look at it, and approve:
 *   npx vitest run src/test/the-wide-view.test.ts
 *   node scripts/derive-wide-view.mjs --sheet
 *   node scripts/derive-wide-view.mjs --approve
 *
 * Every sentence the exercise speaks is generated from these four fields. There
 * is no prose here to drift away from the picture, and no coordinate here that
 * a hand can move without turning the suite red.
 */

/** What a body is doing, as far as pixels can settle it. Closed on purpose. */
export type Pose = ${POSES.map(q).join(' | ')};

/** Which way the head points, in the plane of the picture. */
export type Facing = ${FACINGS.map(q).join(' | ')};

export interface Person {
  /** Position in the census, stable across regenerations. */
  readonly id: string;
  /** [x0, y0, x1, y1] as fractions of the plate, tight to the whole visible body. */
  readonly box: readonly [number, number, number, number];
  readonly pose: Pose;
  readonly facing: Facing;
  readonly adult: boolean;
}

export interface Room {
  readonly id: string;
  /** games/sel/<plate>.png */
  readonly plate: string;
  /** The plate as it was when the census was taken. */
  readonly plateSha: string;
  /** Straight out of the PNG header, so the crop maths cannot assume an aspect. */
  readonly plateWidth: number;
  readonly plateHeight: number;
  /** A caption for the room. The one authored string, and it names no person. */
  readonly place: string;
  /** However many people are in the picture. There is no floor and no quota. */
  readonly people: readonly Person[];
}

export const SEAL = {
  plates: {
${plateLines}
  } as Record<string, string>,
  /** sha256 of every line below the sentinel. */
  body: 'PENDING',
  /** sha256 of artifacts/wide-view.json at the moment a person looked at the sheet. */
  looked: '${looked}',
} as const;

${SENTINEL}`;

  const body = `

export const ROOMS: readonly Room[] = [
${rooms.map(roomLiteral).join('\n')}
] as const;

export const TOTAL_PEOPLE = ROOMS.reduce((n, r) => n + r.people.length, 0);
`;

  const out = `${head}${body}`.replace("body: 'PENDING'", `body: '${sha(body)}'`);
  writeFileSync(DATA_FILE, out);
  const n = rooms.reduce((a, r) => a + r.people.length, 0);
  console.log(`${DATA_FILE}: ${rooms.length} rooms, ${n} people`);
  for (const r of rooms) console.log(`  ${r.id.padEnd(9)} ${String(r.people.length).padStart(2)} people  ${r.facts.width}x${r.facts.height}  ${r.facts.sha.slice(0, 12)}`);
  if (!looked) console.log('\nSEAL.looked is empty: render the sheet, look at it, then --approve.');
}

function roomLiteral(room) {
  const people = room.people
    .map((p, i) => {
      const id = `p${String(i + 1).padStart(2, '0')}`;
      const box = p.box.map((v) => v.toFixed(3)).join(', ');
      return `      { id: '${id}', box: [${box}], pose: '${p.pose}', facing: '${p.facing}', adult: ${p.adult} },`;
    })
    .join('\n');
  return `  {
    id: '${room.id}',
    plate: 'the-wide-view-${room.id}',
    plateSha: '${room.facts.sha}',
    plateWidth: ${room.facts.width},
    plateHeight: ${room.facts.height},
    place: ${q(room.place)},
    people: [
${people}
    ],
  },`;
}

function existingSeal() {
  if (!existsSync(DATA_FILE)) return null;
  const src = readFileSync(DATA_FILE, 'utf8');
  const m = /looked: '([0-9a-f]*)'/.exec(src);
  return m ? { looked: m[1] } : null;
}

/* ------------------------------------------------- pixels, without a browser -- */

/**
 * A minimal decoder and encoder for the exact PNGs in this folder — 8-bit
 * palette, non-interlaced — so the contact sheet is a real picture on any
 * machine with node and nothing else. The alternative was a headless browser,
 * and a gate that says "look at this" must not be the first thing to stop
 * working when a shared library is missing.
 */
function decodePng(bytes) {
  if (bytes.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  const depth = bytes[24];
  const colour = bytes[25];
  if (depth !== 8 || colour !== 3 || bytes[28] !== 0) {
    throw new Error(`only 8-bit non-interlaced palette PNGs are handled here, got depth ${depth} colour ${colour}`);
  }
  let at = 8;
  let palette = null;
  const idat = [];
  while (at < bytes.length) {
    const len = bytes.readUInt32BE(at);
    const kind = bytes.toString('ascii', at + 4, at + 8);
    if (kind === 'PLTE') palette = bytes.subarray(at + 8, at + 8 + len);
    if (kind === 'IDAT') idat.push(bytes.subarray(at + 8, at + 8 + len));
    at += 12 + len;
    if (kind === 'IEND') break;
  }
  const raw = inflateSync(Buffer.concat(idat));
  const rgb = Buffer.alloc(width * height * 3);
  const line = Buffer.alloc(width);
  const prev = Buffer.alloc(width);
  let p = 0;
  for (let y = 0; y < height; y += 1) {
    const filter = raw[p];
    p += 1;
    for (let x = 0; x < width; x += 1) {
      const v = raw[p + x];
      const a = x >= 1 ? line[x - 1] : 0;
      const b = prev[x];
      const c = x >= 1 ? prev[x - 1] : 0;
      let out = v;
      if (filter === 1) out = v + a;
      else if (filter === 2) out = v + b;
      else if (filter === 3) out = v + ((a + b) >> 1);
      else if (filter === 4) {
        const q = a + b - c;
        const pa = Math.abs(q - a);
        const pb = Math.abs(q - b);
        const pc = Math.abs(q - c);
        out = v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
      }
      line[x] = out & 0xff;
    }
    p += width;
    for (let x = 0; x < width; x += 1) {
      const i = line[x] * 3;
      const o = (y * width + x) * 3;
      rgb[o] = palette[i];
      rgb[o + 1] = palette[i + 1];
      rgb[o + 2] = palette[i + 2];
    }
    line.copy(prev);
  }
  return { width, height, rgb };
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(kind, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(kind, 4, 'ascii');
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

function encodePng(img) {
  const raw = Buffer.alloc(img.height * (img.width * 3 + 1));
  for (let y = 0; y < img.height; y += 1) {
    raw[y * (img.width * 3 + 1)] = 0;
    img.rgb.copy(raw, y * (img.width * 3 + 1) + 1, y * img.width * 3, (y + 1) * img.width * 3);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(img.width, 0);
  ihdr.writeUInt32BE(img.height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 6 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function blank(w, h, fill) {
  const rgb = Buffer.alloc(w * h * 3);
  for (let i = 0; i < rgb.length; i += 3) {
    rgb[i] = fill[0];
    rgb[i + 1] = fill[1];
    rgb[i + 2] = fill[2];
  }
  return { width: w, height: h, rgb };
}

function fillRect(img, x0, y0, w, h, colour) {
  for (let y = Math.max(0, y0); y < Math.min(img.height, y0 + h); y += 1) {
    for (let x = Math.max(0, x0); x < Math.min(img.width, x0 + w); x += 1) {
      const o = (y * img.width + x) * 3;
      img.rgb[o] = colour[0];
      img.rgb[o + 1] = colour[1];
      img.rgb[o + 2] = colour[2];
    }
  }
}

/** Nearest neighbour from a source rectangle into a destination rectangle. */
function blit(dst, src, sx, sy, sw, sh, dx, dy, dw, dh) {
  for (let y = 0; y < dh; y += 1) {
    const yy = Math.min(src.height - 1, Math.max(0, sy + Math.floor((y * sh) / dh)));
    for (let x = 0; x < dw; x += 1) {
      const xx = Math.min(src.width - 1, Math.max(0, sx + Math.floor((x * sw) / dw)));
      const so = (yy * src.width + xx) * 3;
      const px = dx + x;
      const py = dy + y;
      if (px < 0 || py < 0 || px >= dst.width || py >= dst.height) continue;
      const di = (py * dst.width + px) * 3;
      dst.rgb[di] = src.rgb[so];
      dst.rgb[di + 1] = src.rgb[so + 1];
      dst.rgb[di + 2] = src.rgb[so + 2];
    }
  }
}

/** Just enough font to label a card `p07`. The sentences live in the HTML. */
const GLYPHS = {
  0: ['111', '101', '101', '101', '111'],
  1: ['010', '110', '010', '010', '111'],
  2: ['111', '001', '111', '100', '111'],
  3: ['111', '001', '111', '001', '111'],
  4: ['101', '101', '111', '001', '001'],
  5: ['111', '100', '111', '001', '111'],
  6: ['111', '100', '111', '101', '111'],
  7: ['111', '001', '010', '010', '010'],
  8: ['111', '101', '111', '101', '111'],
  9: ['111', '101', '111', '001', '111'],
  p: ['111', '101', '111', '100', '100'],
};

function label(img, text, x0, y0, colour, scale = 2) {
  let x = x0;
  for (const ch of text) {
    const g = GLYPHS[ch];
    if (g) {
      g.forEach((row, ry) => {
        [...row].forEach((on, rx) => {
          if (on === '1') fillRect(img, x + rx * scale, y0 + ry * scale, scale, scale, colour);
        });
      });
    }
    x += 4 * scale;
  }
}

const PAPER = [244, 240, 230];
const RULE = [185, 176, 154];
const TERRA = [158, 75, 39];

/** One PNG per room: every person, cut out, in a grid, with their census id. */
function contactPng(art) {
  const CARD = 158;
  const GAP = 10;
  const LABEL = 16;
  const written = [];
  for (const room of art.rooms) {
    const plate = decodePng(readFileSync(join(PLATE_DIR, `${room.plate}.png`)));
    const cols = Math.min(8, room.people.length);
    const rows = Math.ceil(room.people.length / cols);
    const sheet = blank(GAP + cols * (CARD + GAP), GAP + rows * (CARD + LABEL + GAP), PAPER);
    room.people.forEach((person, i) => {
      const f = person.frame;
      const cx = GAP + (i % cols) * (CARD + GAP);
      const cy = GAP + Math.floor(i / cols) * (CARD + LABEL + GAP);
      const dx = cx + Math.round((CARD - f.frameW) / 2);
      const dy = cy + Math.round((CARD - f.frameH) / 2);
      fillRect(sheet, cx, cy, CARD, CARD, [251, 249, 244]);
      blit(
        sheet,
        plate,
        Math.round((-f.offsetX * plate.width) / f.imgW),
        Math.round((-f.offsetY * plate.height) / f.imgH),
        Math.round((f.frameW * plate.width) / f.imgW),
        Math.round((f.frameH * plate.height) / f.imgH),
        dx, dy, f.frameW, f.frameH,
      );
      fillRect(sheet, dx - 1, dy - 1, f.frameW + 2, 1, RULE);
      fillRect(sheet, dx - 1, dy + f.frameH, f.frameW + 2, 1, RULE);
      fillRect(sheet, dx - 1, dy - 1, 1, f.frameH + 2, RULE);
      fillRect(sheet, dx + f.frameW, dy - 1, 1, f.frameH + 2, RULE);
      label(sheet, person.id, cx + 2, cy + CARD + 3, TERRA);
    });
    const out = `artifacts/wide-view-${room.id}.png`;
    writeFileSync(out, encodePng(sheet));
    written.push(out);
  }
  return written;
}

/* ------------------------------------------------------- the contact sheet -- */

/**
 * The sheet does no arithmetic of its own. Every rectangle and every sentence
 * on it comes out of `artifacts/wide-view.json`, which the test suite writes by
 * calling the same `cropFrame` and `sentenceFor` the application calls. If the
 * sheet were to compute its own crops it would be a second authority, which is
 * the fault this whole exercise exists to remove.
 */
function readArtifact() {
  if (!existsSync(ARTIFACT)) {
    console.error(`${ARTIFACT} is missing. Run: npx vitest run src/test/the-wide-view.test.ts`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(ARTIFACT, 'utf8'));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function sheetHtml(art) {
  const sections = art.rooms
    .map((room) => {
      const cards = room.people
        .map((p) => {
          const f = p.frame;
          return `<figure class="card">
  <div class="cut" style="width:${f.frameW}px;height:${f.frameH}px">
    <img src="${art.base}${room.plate}.png" width="${f.imgW}" height="${f.imgH}"
         style="left:${f.offsetX}px;top:${f.offsetY}px" alt="">
  </div>
  <figcaption><b>${esc(p.id)}</b> ${esc(p.sentence)}</figcaption>
</figure>`;
        })
        .join('\n');
      return `<section>
  <h2>${esc(room.place)} <span class="meta">${room.people.length} people &middot; ${esc(room.plate)}.png</span></h2>
  <div class="row">
${cards}
  </div>
</section>`;
    })
    .join('\n');

  return `<!doctype html><meta charset="utf-8"><title>The Wide View — every crop</title>
<style>
  body { background:#f4f0e6; color:#22211b; font-family:Inter,system-ui,sans-serif; margin:24px; }
  h1 { font-family:Literata,Georgia,serif; font-size:24px; font-weight:400; margin:0 0 4px; }
  h2 { font-family:Literata,Georgia,serif; font-size:17px; font-weight:400;
       margin:26px 0 10px; border-top:1px solid #ddd6c4; padding-top:10px; }
  .meta, .lede { color:#6b6757; font-size:11px; letter-spacing:0.04em; }
  .lede { margin:0 0 6px; }
  .row { display:flex; flex-wrap:wrap; gap:14px; align-items:flex-start; }
  .card { margin:0; width:150px; }
  .cut { position:relative; overflow:hidden; background:#fbf9f4; border:1px solid #b9b09a; border-radius:2px; }
  .cut img { position:absolute; max-width:none; }
  figcaption { font-size:10.5px; line-height:1.35; color:#4b4739; margin-top:5px; }
  figcaption b { color:#9e4b27; font-weight:600; }
</style>
<h1>The Wide View — every person, cut out of the plate</h1>
<p class="lede">Every card below is what the child is shown. If a card is a bookshelf, a
patch of carpet or half a chair, that box is wrong — fix the census in
scripts/derive-wide-view.mjs and regenerate.</p>
${sections}
`;
}

function sheet() {
  const art = readArtifact();
  mkdirSync('artifacts', { recursive: true });
  writeFileSync(SHEET_HTML, sheetHtml(art));
  const n = art.rooms.reduce((a, r) => a + r.people.length, 0);
  console.log(`${SHEET_HTML}: ${n} crops across ${art.rooms.length} rooms, with their sentences`);
  for (const file of contactPng(art)) console.log(`  ${file}`);
  console.log(`\nLOOK AT THEM. Every card must be a person. If one is a bookshelf, a patch of`);
  console.log(`carpet or half a chair, fix the census in this file and derive again.`);
  console.log(`Then: node scripts/derive-wide-view.mjs --approve`);
  console.log(`digest ${sha(readFileSync(ARTIFACT))}`);
}

/**
 * Freeze the result of having looked. The digest covers every crop rectangle
 * and every generated sentence, so any change to a box, a pose, or the sentence
 * template makes the approval stale and the suite red with "look again".
 *
 * It refuses if the artifact is older than the census: approving a sheet that
 * was cut from last week's boxes would freeze a look that never happened.
 */
function approve() {
  const art = readArtifact();
  const src = readFileSync(DATA_FILE, 'utf8');
  const stale = [];
  for (const room of art.rooms) {
    for (const person of room.people) {
      const box = person.box.map((v) => v.toFixed(3)).join(', ');
      if (!src.includes(`id: '${person.id}', box: [${box}]`)) stale.push(`${room.id}/${person.id}`);
    }
    if (!src.includes(`plateSha: '${room.plateSha}'`)) stale.push(`${room.id}: plate`);
  }
  if (stale.length) {
    console.error('The sheet was cut from boxes that are no longer in the data file:');
    console.error(`  ${stale.slice(0, 8).join(', ')}${stale.length > 8 ? ` and ${stale.length - 8} more` : ''}`);
    console.error('Run the tests and re-render the sheet, then look at it again.');
    process.exit(1);
  }
  const digest = sha(readFileSync(ARTIFACT));
  if (!/looked: '[0-9a-f]*'/.test(src)) {
    console.error(`${DATA_FILE} has no SEAL.looked field. Regenerate it first.`);
    process.exit(1);
  }
  writeFileSync(DATA_FILE, src.replace(/looked: '[0-9a-f]*'/, `looked: '${digest}'`));
  console.log(`approved ${digest}`);
}

const arg = process.argv[2] ?? '';
if (arg === '--sheet') sheet();
else if (arg === '--approve') approve();
else if (arg === '' || arg === '--derive') emit();
else {
  console.error('usage: derive-wide-view.mjs [--derive | --sheet | --approve]');
  process.exit(2);
}
