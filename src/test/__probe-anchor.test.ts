import { describe, it, expect } from 'vitest';

const wait = () => new Promise<void>((r) => setTimeout(r, 30));

describe('jsdom capabilities', () => {
  it('anchor click pushes history', async () => {
    window.history.replaceState(null, '', '#/');
    const a = document.createElement('a');
    a.href = '#/shelf';
    document.body.appendChild(a);
    const before = window.history.length;
    const seen: string[] = [];
    const onHash = () => seen.push(window.location.hash);
    window.addEventListener('hashchange', onHash);
    a.click();
    await wait();
    console.log(
      'hash after click',
      window.location.hash,
      'len',
      before,
      '->',
      window.history.length,
      'events',
      seen,
    );
    window.history.back();
    await wait();
    console.log('after back', window.location.hash);
    window.history.forward();
    await wait();
    console.log('after forward', window.location.hash);
    window.removeEventListener('hashchange', onHash);
    expect(true).toBe(true);
  });

  it('replaceState does not add an entry', async () => {
    window.history.replaceState(null, '', '#/');
    const l0 = window.history.length;
    window.history.pushState(null, '', '#/timeline');
    const l1 = window.history.length;
    window.history.replaceState(null, '', '#/map');
    const l2 = window.history.length;
    console.log('lengths', l0, l1, l2);
    window.history.back();
    await wait();
    console.log('back from replaced ->', window.location.hash);
    expect(true).toBe(true);
  });
});
