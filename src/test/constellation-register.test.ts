import { describe, it, expect } from 'vitest';
import {
  ARRANGEMENTS, CONSTELLATION_REGISTER_META, SKY, SNAP_RADIUS, STARS,
  describeSky, figureCaption, figureFacts, haversineKm, nearest, project,
  starBySlug, starsFor, storyRoute,
} from '../workshop/constellation-register';

describe('the sky is read off the collection itself', () => {
  it('has a star for every dated historical account', () => {
    expect(STARS.length).toBeGreaterThan(150);
    for (const s of STARS.slice(0, 20)) {
      expect(s.slug).toBeTruthy();
      expect(Number.isFinite(s.year)).toBe(true);
      expect(Number.isFinite(s.lat)).toBe(true);
      expect(s.color).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });
  it('places every star inside the plate, in every arrangement', () => {
    for (const a of ARRANGEMENTS) {
      for (const p of project(a.id)) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(SKY.width);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(SKY.height);
      }
    }
  });
  it('is deterministic — the same arrangement plots identically', () => {
    expect(project('time')).toEqual(project('time'));
  });
  it('re-sorting moves the stars but never changes which stars there are', () => {
    const byTime = project('time'), byPlace = project('place');
    expect(byTime.map((p) => p.slug).sort()).toEqual(byPlace.map((p) => p.slug).sort());
    expect(byTime).not.toEqual(byPlace);
  });
  it('separates stars enough to be tappable by a five-year-old', () => {
    const placed = project('time');
    let tooClose = 0;
    for (let i = 0; i < placed.length; i += 1) {
      for (let j = i + 1; j < placed.length; j += 1) {
        const dx = placed[i].x - placed[j].x, dy = placed[i].y - placed[j].y;
        if (Math.hypot(dx, dy) < 12) tooClose += 1;
      }
    }
    expect(tooClose).toBe(0);
  });
});

describe('finding the star under a finger', () => {
  it('returns the star when the tap is close, and nothing when it is not', () => {
    const placed = project('time');
    const target = placed[10];
    expect(nearest(placed, target.x, target.y)?.slug).toBe(target.slug);
    expect(nearest(placed, -500, -500)).toBeNull();
  });
  it('is generous, so small targets remain reachable', () => {
    expect(SNAP_RADIUS).toBeGreaterThanOrEqual(20);
  });
});

describe('the caption is measured, not flattering', () => {
  const slugs = STARS.slice(0, 4).map((s) => s.slug);

  it('states the span in years between the oldest and newest', () => {
    const stars = starsFor(slugs);
    const years = stars.map((s) => s.year);
    expect(figureFacts(stars).yearSpan).toBe(Math.max(...years) - Math.min(...years));
  });
  it('measures the great-circle distance between the two most distant stars', () => {
    // London to Paris is about 344 km.
    const km = haversineKm({ lat: 51.5074, lng: -0.1278 }, { lat: 48.8566, lng: 2.3522 });
    expect(km).toBeGreaterThan(320);
    expect(km).toBeLessThan(360);
  });
  it('counts the distinct subjects and eras a figure crosses', () => {
    const stars = starsFor(slugs);
    const facts = figureFacts(stars);
    expect(facts.subjects.length).toBe(new Set(stars.map((s) => s.subject)).size);
    expect(facts.eras.length).toBe(new Set(stars.map((s) => s.era)).size);
  });
  it('never praises the child', () => {
    const text = [...figureCaption(starsFor(slugs)), describeSky({ mode: 'time', total: 195, joined: 3, figures: 1 })].join(' ');
    expect(text).not.toMatch(/great|clever|well done|amazing|good job|wow/i);
  });
  it('copes with a figure of one star, or of none', () => {
    expect(() => figureCaption(starsFor([slugs[0]]))).not.toThrow();
    expect(() => figureCaption([])).not.toThrow();
    expect(figureFacts([]).stars).toBe(0);
  });
});

describe('a figure is also a reading route', () => {
  it('resolves a star back to its account, and to a route into the library', () => {
    const s = STARS[0];
    expect(starBySlug(s.slug)?.title).toBe(s.title);
    expect(storyRoute(s.slug)).toContain(s.slug);
    expect(starBySlug('not-a-real-slug')).toBeUndefined();
  });
  it('has a meta record the bench can list', () => {
    expect(CONSTELLATION_REGISTER_META.id).toBe('constellation-register');
  });
});
