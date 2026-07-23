import type { Thing } from './ingredients';
import type { WovenStory } from './weave';

/**
 * Optional AI story mode — calls GitHub Models directly from the browser (its
 * endpoint allows CORS), so no backend is needed. A grown-up pastes a GitHub
 * token once (stored only in this browser's localStorage); the child never sees
 * it. Any failure lets the caller fall back to the offline weaver.
 */
const ENDPOINT = 'https://models.github.ai/inference/chat/completions';
const LS_TOKEN = 'ks.ai.token';
const LS_MODEL = 'ks.ai.model';
export const DEFAULT_MODEL = 'openai/gpt-5';

const ls = (): Storage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const getToken = (): string => ls()?.getItem(LS_TOKEN) ?? '';
export const getModel = (): string => ls()?.getItem(LS_MODEL) || DEFAULT_MODEL;
export const aiConfigured = (): boolean => getToken().length > 0;

export function saveConfig(token: string, model: string): void {
  const s = ls();
  if (!s) return;
  s.setItem(LS_TOKEN, token.trim());
  s.setItem(LS_MODEL, (model.trim() || DEFAULT_MODEL));
}

export function clearConfig(): void {
  const s = ls();
  if (!s) return;
  s.removeItem(LS_TOKEN);
  s.removeItem(LS_MODEL);
}

function messages(things: readonly Thing[]) {
  const list = things.map((t) => `${t.label}${t.emoji ? ' ' + t.emoji : ''}`).join(', ');
  return [
    {
      role: 'system',
      content:
        'You are a gentle bedtime storyteller for a 4-5 year old child. Write a SHORT (120-200 words), warm, cozy, and completely calm story with simple short sentences. Nothing scary, sad, or loud. The story MUST include every one of the given things by name. End on a peaceful goodnight. Respond ONLY as strict JSON: {"title": string, "paragraphs": string[]} with 5-8 short paragraphs, the last ending with the word "Goodnight."',
    },
    { role: 'user', content: `Please weave a bedtime story that includes all of these: ${list}.` },
  ];
}

/** Ask GitHub Models to weave a story. Throws on any failure. */
export async function aiStory(things: readonly Thing[]): Promise<WovenStory> {
  const token = getToken();
  if (!token) throw new Error('No AI token set');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: getModel(),
      messages: messages(things),
      temperature: 0.9,
      max_tokens: 600,
    }),
  });
  if (!res.ok) {
    let detail = '';
    try {
      detail = (await res.text()).slice(0, 160);
    } catch {
      /* ignore */
    }
    throw new Error(`${res.status}${detail ? `: ${detail}` : ''}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content ?? '';
  let story: WovenStory;
  try {
    const parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, '')) as WovenStory;
    story = { title: parsed.title || 'A Bedtime Tale', paragraphs: parsed.paragraphs };
  } catch {
    const paras = content.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);
    story = { title: 'A Bedtime Tale', paragraphs: paras };
  }
  if (!Array.isArray(story.paragraphs) || story.paragraphs.length === 0) {
    throw new Error('AI story empty');
  }
  return story;
}
