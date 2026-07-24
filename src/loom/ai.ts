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
        'You are a fun, imaginative storyteller for a 5-year-old. Write a SHORT (150-260 words) EXCITING, wholesome ADVENTURE and weave in EVERY given thing BY ITS REAL NATURE — a tsunami is a giant wave, a storm is wild weather, a dog is a dog, a volcano is a volcano. NEVER turn a thing into a toy, a plush, or a pretend version. Vary the setting and plot every time: a trip with friends, a family excursion, a day at the park, a beach or forest or mountain adventure, a boat journey — and make STUFF HAPPEN (a surprise, a discovery, a big exciting event) that the characters face together. It can be thrilling and a little suspenseful, but it ALWAYS ends happily and safely — nobody gets hurt, and scary events like storms, big waves, or earthquakes resolve with everyone getting to safety and feeling brave and amazed. Use simple, vivid, active sentences. Do NOT force a bedtime or a "Goodnight" ending unless it genuinely fits. Respond ONLY as strict JSON: {"title": string, "paragraphs": string[]} with 6-9 short paragraphs.',
    },
    { role: 'user', content: `Weave a fun adventure story that includes all of these, each as its real self: ${list}.` },
  ];
}

/** Ask GitHub Models to weave a story. Throws on any failure. */
export async function aiStory(things: readonly Thing[]): Promise<WovenStory> {
  const token = getToken();
  if (!token) throw new Error('No AI token set');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    // No max_tokens / temperature: gpt-5 rejects the legacy names, and defaults
    // are fine for a short bedtime story — keeps every model happy.
    body: JSON.stringify({ model: getModel(), messages: messages(things) }),
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
