import { describe, expect, it } from 'vitest';
import {
  DOING,
  DOING_KEYS,
  FIELD_LOG_META,
  HABITATS,
  HABITAT_KEYS,
  PHASES,
  SHADOW_METHOD,
  STAGES,
  STAGE_LABEL,
  clockLabel,
  composeFind,
  composeShadow,
  composeWatch,
  dayOfYear,
  daysBetween,
  declinationDeg,
  findSummary,
  inOrder,
  latitudeFromNoon,
  logSignature,
  logSummary,
  namesSeen,
  noonShadowDirection,
  shadowRatio,
  shadowReadout,
  shadowSummary,
  shortestShadow,
  stageMove,
  subjectsWatched,
  tally,
  tallySummary,
  visitDates,
  watchSeries,
  watchSummary,
  type FieldRecord,
  type ShadowReading,
} from '../workshop/field-log';

let seq = 0;
const kept = (partial: Omit<FieldRecord, 'id' | 'made'>, made?: string): FieldRecord => ({
  ...partial,
  id: `r${seq += 1}`,
  made: made ?? `${partial.date}T09:00:00.000Z`,
});

const find = (date: string, what: string, count: number, habitat: 'ground' | 'tree' | 'wall' | 'water' | 'air' | 'litter' = 'ground'): FieldRecord =>
  kept(composeFind({ date, what, habitat, count, doing: 'moving' }));

/* ------------------------------------------------------------------- shape */

describe('the field log', () => {
  it('is well formed and names its three benches', () => {
    expect(FIELD_LOG_META.id).toBe('field-log');
    expect(FIELD_LOG_META.eyebrow.split(' ').length).toBeLessThanOrEqual(3);
    expect(PHASES.map((p) => p.key)).toEqual(['find', 'watch', 'shadow']);
  });

  it('offers a closed list of places and of things a creature can be doing', () => {
    expect(HABITAT_KEYS).toHaveLength(6);
    for (const k of HABITAT_KEYS) {
      expect(HABITATS[k].label.length, k).toBeGreaterThan(3);
      expect(HABITATS[k].paths.length, k).toBeGreaterThan(0);
    }
    expect(DOING_KEYS).toHaveLength(8);
    for (const k of DOING_KEYS) expect(DOING[k].length, k).toBeGreaterThan(3);
  });

  it('records the four things a find is made of', () => {
    const r = find('2026-07-04', 'ant', 12, 'litter');
    expect(r.what).toBe('ant');
    expect(r.habitat).toBe('litter');
    expect(r.count).toBe(12);
    expect(r.doing).toBe('moving');
    expect(findSummary(r)).toContain('ant: 12');
    expect(findSummary(r)).toContain('under a stone');
  });

  it('never appends letters to a name he typed, because it cannot know the plural', () => {
    const one = find('2026-07-04', 'fly', 1, 'air');
    const many = find('2026-07-04', 'fly', 6, 'air');
    expect(findSummary(one)).toContain('fly: 1');
    expect(findSummary(many)).toContain('fly: 6');
    expect(findSummary(many)).not.toContain('flys');
    expect(findSummary(find('2026-07-04', 'butterfly', 3, 'air'))).not.toContain('butterflys');
  });

  it('never records less than one of a thing found', () => {
    expect(kept(composeFind({ date: '2026-07-04', what: 'snail', habitat: 'wall', count: 0, doing: null })).count).toBe(1);
    expect(kept(composeFind({ date: '2026-07-04', what: '  crow  ', habitat: 'air', count: 2, doing: null })).what).toBe('crow');
  });

  it('gives an entry a serial derived from everything on it', () => {
    const a = find('2026-07-04', 'ant', 12);
    const b = find('2026-07-04', 'ant', 12);
    const c = find('2026-07-04', 'ant', 13);
    expect(logSignature(a)).toBe(logSignature(b));
    expect(logSignature(a)).not.toBe(logSignature(c));
    expect(logSignature(a)).toMatch(/^F-[0-9A-Z]{5}$/);
  });
});

/* ---------------------------------------------------- the tally across visits */

describe('the tally is what only exists because he went back out', () => {
  const book: FieldRecord[] = [
    find('2026-05-02', 'ant', 12, 'litter'),
    find('2026-05-02', 'snail', 3, 'wall'),
    find('2026-05-19', 'ant', 20, 'ground'),
    find('2026-06-07', 'snail', 1, 'wall'),
    find('2026-06-07', 'crow', 2, 'air'),
  ];

  it('adds every visit together rather than showing only the last one', () => {
    const rows = tally(book);
    expect(rows.map((r) => r.what)).toEqual(['ant', 'snail', 'crow']);
    const ant = rows[0];
    expect(ant.total).toBe(32);
    expect(ant.times).toBe(2);
    expect(ant.most).toBe(20);
    expect(ant.first).toBe('2026-05-02');
    expect(ant.last).toBe('2026-05-19');
    expect(ant.habitats).toEqual(['litter', 'ground']);
  });

  it('counts the days out, not the entries', () => {
    expect(visitDates(book)).toEqual(['2026-05-02', '2026-05-19', '2026-06-07']);
    expect(tallySummary(book)).toContain('3 days out');
    expect(tallySummary(book)).toContain('38 things counted');
    expect(logSummary(book)).toContain('5 entries');
  });

  it('offers back the names he has already used, so returning is one tap', () => {
    expect(namesSeen(book)).toEqual(['ant', 'crow', 'snail']);
    expect(tallySummary([])).toBe('Nothing written down yet.');
    expect(logSummary([])).toMatch(/^The log is empty/);
  });

  it('reads the book in date order however it was written down', () => {
    const shuffled = [book[3], book[0], book[4], book[2], book[1]];
    expect(inOrder(shuffled, 'find').map((r) => r.date)).toEqual([
      '2026-05-02', '2026-05-02', '2026-05-19', '2026-06-07', '2026-06-07',
    ]);
  });
});

/* -------------------------------------------------- one thing, week by week */

describe('following one thing is arithmetic, not an impression', () => {
  const beans: FieldRecord[] = [
    kept(composeWatch({ date: '2026-04-01', subject: 'bean pot', stage: 'bare', heightMm: 0 })),
    kept(composeWatch({ date: '2026-04-08', subject: 'bean pot', stage: 'leaf', heightMm: 42 })),
    kept(composeWatch({ date: '2026-04-13', subject: 'bean pot', stage: 'flower', heightMm: 84 })),
  ];

  it('works out growth per day from the measurements and the dates', () => {
    const series = watchSeries(beans, 'bean pot');
    expect(series.days).toBe(12);
    expect(series.grewMm).toBe(84);
    expect(series.mmPerDay).toBe(7);
    expect(watchSummary(series)).toContain('7 mm a day');
  });

  it('reports every move up the ladder with the days it took', () => {
    const series = watchSeries(beans, 'bean pot');
    expect(series.moves).toHaveLength(2);
    expect(series.moves[0]).toMatchObject({ from: 'bare', to: 'leaf', rungs: 2, days: 7 });
    expect(series.moves[1]).toMatchObject({ from: 'leaf', to: 'flower', rungs: 1, days: 5 });
  });

  it('treats a move back down the ladder as an observation, because a plum flowers before it leafs', () => {
    const plum = [
      kept(composeWatch({ date: '2026-02-20', subject: 'plum', stage: 'flower', heightMm: 3000 })),
      kept(composeWatch({ date: '2026-03-20', subject: 'plum', stage: 'leaf', heightMm: 3010 })),
    ];
    const series = watchSeries(plum, 'plum');
    expect(series.moves[0].rungs).toBe(-1);
    expect(stageMove('flower', 'leaf')).toBe(-1);
    expect(watchSummary(series)).toContain('in leaf');
  });

  it('asks him back rather than reporting a trend from one visit', () => {
    const one = watchSeries([beans[0]], 'bean pot');
    expect(one.days).toBe(0);
    expect(one.mmPerDay).toBe(0);
    expect(watchSummary(one)).toContain('Come back and measure it again');
    expect(watchSummary(watchSeries([], 'nothing'))).toBe('Nothing followed yet.');
  });

  it('keeps subjects apart', () => {
    const mixed = [...beans, kept(composeWatch({ date: '2026-04-08', subject: 'oak by the gate', stage: 'bud', heightMm: 6000 }))];
    expect(subjectsWatched(mixed)).toEqual(['bean pot', 'oak by the gate']);
    expect(watchSeries(mixed, 'oak by the gate').points).toHaveLength(1);
  });

  it('counts days the way a calendar does', () => {
    expect(daysBetween('2026-04-01', '2026-04-13')).toBe(12);
    expect(daysBetween('2026-02-27', '2026-03-01')).toBe(2);
    expect(daysBetween('2024-02-27', '2024-03-01')).toBe(3);
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('names every rung of the ladder', () => {
    expect(STAGES).toHaveLength(6);
    for (const s of STAGES) expect(STAGE_LABEL[s].length, s).toBeGreaterThan(2);
  });
});

/* ---------------------------------------------------------- a stick and the sun */

describe('the stick measures the sun, and the sun gives the latitude', () => {
  /**
   * These are the gates that fail if the astronomy is reverted to something
   * typed in. Each is fed a fact that is true independently of this code:
   *
   *   - A shadow the same length as the stick means the sun is 45 degrees up.
   *     That is the definition of a tangent, not something this module decides.
   *   - The sun stands over the equator at the equinoxes and over 23.44 degrees
   *     at the solstices. Measured facts about the Earth's tilt.
   *   - At an equinox, the noon sun's height is exactly 90 degrees less your
   *     latitude, because the declination term is zero. So a shadow generated
   *     from a hand-computed altitude has to give back the latitude it came
   *     from.
   */
  it('reads 45 degrees when the shadow is exactly as long as the stick', () => {
    const read = shadowReadout(kept(composeShadow({
      date: '2026-06-21', stickMm: 1000, readings: [{ minutes: 720, shadowMm: 1000 }],
    })));
    expect(read.noonAltitude).toBe(45);
    expect(shadowRatio(1000, 1000)).toBe(1);
    expect(shadowRatio(1000, 2500)).toBe(2.5);
  });

  it('puts the sun over the equator at the equinoxes and over the tropics at the solstices', () => {
    expect(Math.abs(declinationDeg('2026-03-20'))).toBeLessThan(0.6);
    expect(Math.abs(declinationDeg('2026-09-22'))).toBeLessThan(0.6);
    expect(declinationDeg('2026-06-21')).toBeCloseTo(23.44, 1);
    expect(declinationDeg('2026-12-21')).toBeCloseTo(-23.44, 1);
  });

  it('numbers the days of the year the way a calendar does', () => {
    expect(dayOfYear('2026-01-01')).toBe(1);
    expect(dayOfYear('2026-03-20')).toBe(79);
    expect(dayOfYear('2026-06-21')).toBe(172);
    expect(dayOfYear('2026-12-31')).toBe(365);
    expect(dayOfYear('2024-12-31')).toBe(366);
  });

  it('gives back the latitude the shadow was generated from, at the equinox', () => {
    // At an equinox the noon altitude is 90 - latitude. Hand-computed, not
    // taken from this module: 90 - 37.77 = 52.23 degrees for the Bay Area.
    const latitude = 37.77;
    const altitude = 52.23;
    const stickMm = 1000;
    const shadowMm = Math.round(stickMm / Math.tan((altitude * Math.PI) / 180));
    const read = shadowReadout(kept(composeShadow({
      date: '2026-03-20', stickMm, readings: [{ minutes: 733, shadowMm }],
    })));
    expect(read.noonAltitude).toBeCloseTo(altitude, 0);
    expect(read.latitude).toBeGreaterThan(latitude - 1);
    expect(read.latitude).toBeLessThan(latitude + 1);
  });

  it('gives back the same latitude in June and in December, from very different shadows', () => {
    const latitude = 37.77;
    const stickMm = 1000;
    const cases: readonly { date: string; altitude: number }[] = [
      // 90 - 37.77 + 23.44 and 90 - 37.77 - 23.44, worked out by hand.
      { date: '2026-06-21', altitude: 75.67 },
      { date: '2026-12-21', altitude: 28.79 },
    ];
    const shadows: number[] = [];
    for (const c of cases) {
      const shadowMm = Math.round(stickMm / Math.tan((c.altitude * Math.PI) / 180));
      shadows.push(shadowMm);
      const read = shadowReadout(kept(composeShadow({
        date: c.date, stickMm, readings: [{ minutes: 720, shadowMm }],
      })));
      expect(read.latitude, c.date).toBeGreaterThan(latitude - 1);
      expect(read.latitude, c.date).toBeLessThan(latitude + 1);
    }
    // The whole point of going back in winter: the same stick, a shadow seven
    // times longer.
    expect(shadows[1] / shadows[0]).toBeGreaterThan(6);
    expect(latitudeFromNoon(52.23, '2026-03-20')).toBeCloseTo(37.4, 0);
  });

  it('finds local noon by taking the shortest shadow, not the middle reading', () => {
    // Daylight saving and the width of a time zone push solar noon away from
    // the clock. An implementation that returns the middle reading passes on
    // symmetric data and fails here, which is why the data is not symmetric.
    const readings: readonly ShadowReading[] = [
      { minutes: 8 * 60, shadowMm: 2400 },
      { minutes: 9 * 60, shadowMm: 1700 },
      { minutes: 10 * 60, shadowMm: 1200 },
      { minutes: 11 * 60, shadowMm: 900 },
      { minutes: 13 * 60 + 10, shadowMm: 690 },
      { minutes: 15 * 60, shadowMm: 1150 },
      { minutes: 17 * 60, shadowMm: 2600 },
    ];
    const noon = shortestShadow(readings);
    expect(noon).toEqual({ minutes: 790, shadowMm: 690 });
    expect(readings[Math.floor(readings.length / 2)]).not.toEqual(noon);
    expect(shortestShadow([])).toBeNull();
  });

  it('breaks a tie for the shortest shadow by taking the earlier reading', () => {
    expect(shortestShadow([
      { minutes: 700, shadowMm: 500 },
      { minutes: 600, shadowMm: 500 },
    ])).toEqual({ minutes: 600, shadowMm: 500 });
  });

  it('sorts the readings by the clock however they were entered', () => {
    const record = kept(composeShadow({
      date: '2026-06-21',
      stickMm: 900,
      readings: [{ minutes: 780, shadowMm: 300 }, { minutes: 600, shadowMm: 800 }],
    }));
    expect(record.readings.map((r) => r.minutes)).toEqual([600, 780]);
  });

  it('points the noon shadow away from the sun', () => {
    expect(noonShadowDirection(37.77, 23.44)).toBe('north');
    expect(noonShadowDirection(10, 23.44)).toBe('south');
  });

  it('says it all in words, with the numbers he measured', () => {
    const record = kept(composeShadow({
      date: '2026-06-21',
      stickMm: 1000,
      readings: [
        { minutes: 9 * 60, shadowMm: 1600 },
        { minutes: 13 * 60 + 10, shadowMm: 255 },
        { minutes: 17 * 60, shadowMm: 1800 },
      ],
    }));
    const words = shadowSummary(record);
    expect(words).toContain('Stick 1000 mm');
    expect(words).toContain('1:10 pm');
    expect(words).toContain('degrees north');
    expect(words).toContain('pointed north');
    expect(shadowSummary(kept(composeShadow({ date: '2026-06-21', stickMm: 900, readings: [] }))))
      .toMatch(/no readings yet/);
  });

  it('writes the clock the way a clock is written', () => {
    expect(clockLabel(0)).toBe('12:00 am');
    expect(clockLabel(9 * 60 + 5)).toBe('9:05 am');
    expect(clockLabel(12 * 60)).toBe('12:00 pm');
    expect(clockLabel(13 * 60 + 10)).toBe('1:10 pm');
  });

  it('states the method as five steps he can carry out with a stick', () => {
    expect(SHADOW_METHOD.length).toBeGreaterThanOrEqual(5);
    expect(SHADOW_METHOD.join(' ')).toMatch(/shortest shadow/i);
    expect(SHADOW_METHOD.join(' ')).toMatch(/north/i);
  });
});

describe('nothing outdoors is scored or praised either', () => {
  it('keeps no score and no marking anywhere in the module', async () => {
    const { readFileSync } = await import('node:fs');
    const source = readFileSync('src/workshop/field-log.ts', 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    expect(source).not.toMatch(/\bscore\b/i);
    expect(source).not.toMatch(/\bwell done\b/i);
  });

  it('judges nothing it reads back, over every entry it can produce', () => {
    const judgement = /\b(good|bad|healthy|naughty|should|ought|must|better|worse|best|worst|great|well done|nice)\b/i;
    const said: string[] = [];
    for (const habitat of HABITAT_KEYS) {
      for (const doing of DOING_KEYS) {
        said.push(findSummary(kept(composeFind({ date: '2026-05-02', what: 'beetle', habitat, count: 4, doing }))));
      }
    }
    for (const stage of STAGES) {
      const series = watchSeries(
        [
          kept(composeWatch({ date: '2026-04-01', subject: 'oak', stage: 'bare', heightMm: 10 })),
          kept(composeWatch({ date: '2026-04-15', subject: 'oak', stage, heightMm: 80 })),
        ],
        'oak',
      );
      said.push(watchSummary(series));
    }
    for (const date of ['2026-03-20', '2026-06-21', '2026-12-21']) {
      said.push(shadowSummary(kept(composeShadow({
        date, stickMm: 1000, readings: [{ minutes: 660, shadowMm: 900 }, { minutes: 780, shadowMm: 400 }],
      }))));
    }
    expect(said.filter((s) => judgement.test(s))).toEqual([]);
  });

  it('never exclaims in anything it reads back', () => {
    const book = [
      find('2026-05-02', 'ant', 12),
      kept(composeWatch({ date: '2026-05-02', subject: 'oak', stage: 'leaf', heightMm: 4000 })),
      kept(composeShadow({ date: '2026-05-02', stickMm: 900, readings: [{ minutes: 720, shadowMm: 700 }] })),
    ];
    const words = [
      tallySummary(book),
      logSummary(book),
      findSummary(book[0]),
      watchSummary(watchSeries(book, 'oak')),
      shadowSummary(book[2]),
    ];
    for (const w of words) expect(w).not.toMatch(/!/);
  });
});
