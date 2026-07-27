import { describe, it, expect } from 'vitest';
import { ROOMS, THE_WIDE_VIEW_META, TOTAL_FIGURES, coverage, filedLine, roomById } from '../sel/the-wide-view';

describe('the room is full and nobody is the answer', () => {
  it('has several rooms, each crowded', () => {
    expect(ROOMS.length).toBeGreaterThanOrEqual(5);
    for (const r of ROOMS) expect(r.figures.length, r.id).toBeGreaterThanOrEqual(6);
    expect(TOTAL_FIGURES).toBeGreaterThan(35);
  });
  it('carries no field that could mark anyone as the one to find', () => {
    const banned = /"(answer|correct|target|right|best|score|needs|isNeedy)"/;
    expect(banned.test(JSON.stringify(ROOMS))).toBe(false);
  });
  it('describes people by posture and position, never by a feeling word', () => {
    const feelings = /\b(happy|sad|angry|scared|excited|proud|shy|calm|lonely|upset|worried|jealous|cross)\b/i;
    for (const r of ROOMS) for (const f of r.figures) {
      expect(feelings.test(f.moment), `${r.id}/${f.id}: ${f.moment}`).toBe(false);
    }
  });
  it('never praises or moralises', () => {
    const bad = /\b(great|well done|good job|kind|naughty|should|correct|wrong)\b/i;
    expect(bad.test(JSON.stringify(ROOMS))).toBe(false);
  });
  it('places every figure inside the plate', () => {
    for (const r of ROOMS) for (const f of r.figures) {
      expect(f.x).toBeGreaterThan(0); expect(f.x).toBeLessThan(1);
      expect(f.y).toBeGreaterThan(0); expect(f.y).toBeLessThan(1);
    }
  });
  it('gives every figure a distinct spot, so each can be tapped', () => {
    for (const r of ROOMS) {
      for (let i = 0; i < r.figures.length; i += 1) for (let j = i + 1; j < r.figures.length; j += 1) {
        const a = r.figures[i], b = r.figures[j];
        expect(Math.hypot(a.x - b.x, a.y - b.y), `${r.id} ${a.id}/${b.id}`).toBeGreaterThan(0.07);
      }
    }
  });
});

describe('the readout measures looking, not rightness', () => {
  const room = ROOMS[0];
  it('counts how much of the room has been looked at', () => {
    expect(coverage(room, [])).toContain(`0 of the ${room.figures.length}`);
    expect(coverage(room, [room.figures[0].id, room.figures[1].id])).toContain('2 of the');
  });
  it('never reports a ratio of right to wrong', () => {
    expect(coverage(room, [room.figures[0].id])).not.toMatch(/correct|right|score|point/i);
  });
  it('states what he marked without judging it', () => {
    expect(filedLine(room, [])).toMatch(/not marked anybody/i);
    expect(filedLine(room, ['a'])).toMatch(/1 person/);
    expect(filedLine(room, ['a', 'b'])).toMatch(/2 people/);
  });
  it('finds a room by id, and meta is wired', () => {
    expect(roomById(ROOMS[1].id)?.place).toBe(ROOMS[1].place);
    expect(roomById('nowhere')).toBeUndefined();
    expect(THE_WIDE_VIEW_META.id).toBe('the-wide-view');
  });
});
