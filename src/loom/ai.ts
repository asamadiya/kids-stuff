import type { Thing } from './ingredients';
import type { WovenStory } from './weave';

/**
 * Optional AI story mode. Off unless the app is built with VITE_AI_PROXY_URL
 * pointing at the deployed Cloudflare Worker (see proxy/). All calls go to that
 * worker with credentials so the httpOnly GitHub-session cookie rides along;
 * the browser never holds a token.
 */
const PROXY = (import.meta.env.VITE_AI_PROXY_URL as string | undefined)?.replace(/\/+$/, '');

export const aiEnabled = (): boolean => Boolean(PROXY);

export interface AiUser {
  readonly signedIn: boolean;
  readonly login?: string;
  readonly name?: string;
}

export function loginUrl(): string {
  return `${PROXY}/login`;
}

export async function getMe(): Promise<AiUser> {
  if (!PROXY) return { signedIn: false };
  try {
    const r = await fetch(`${PROXY}/me`, { credentials: 'include' });
    if (!r.ok) return { signedIn: false };
    return (await r.json()) as AiUser;
  } catch {
    return { signedIn: false };
  }
}

export async function signOut(): Promise<void> {
  if (!PROXY) return;
  try {
    await fetch(`${PROXY}/logout`, { method: 'POST', credentials: 'include' });
  } catch {
    /* ignore */
  }
}

/** Ask the proxy (→ the model) to weave a story. Throws on any failure so the
 *  caller can fall back to the offline weaver. */
export async function aiStory(things: readonly Thing[]): Promise<WovenStory> {
  if (!PROXY) throw new Error('AI not configured');
  const r = await fetch(`${PROXY}/story`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ things: things.map((t) => ({ label: t.label, emoji: t.emoji })) }),
  });
  if (!r.ok) throw new Error(`AI story failed (${r.status})`);
  const data = (await r.json()) as { story?: WovenStory };
  const story = data.story;
  if (!story || !Array.isArray(story.paragraphs) || story.paragraphs.length === 0) {
    throw new Error('AI story empty');
  }
  return { title: story.title || 'A Bedtime Tale', paragraphs: story.paragraphs };
}
