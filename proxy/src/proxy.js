/**
 * Moonlit Storybook — AI story proxy (Azure Functions, v4 programming model).
 *
 * A static site (GitHub Pages) can't hold an OAuth secret or bypass CORS, so this
 * small Function app is the piece that (1) completes GitHub sign-in, (2) keeps the
 * token in an httpOnly cookie the browser never reads, and (3) asks a model to
 * write the story. The web app only ever talks to this Function (with
 * credentials), so the child signs in once and everything works via the cookie.
 *
 * Model backend (set MODEL_BACKEND):
 *   "azure"  (default) — Azure OpenAI, using this Function's own key. Simplest on
 *                        Azure; reuses your AI resource. GitHub sign-in is the gate.
 *   "github"           — GitHub Models, using the signed-in user's GitHub token.
 *
 * App settings (Function App → Configuration):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET   — your GitHub OAuth App
 *   APP_ORIGIN   e.g. https://asamadiya.github.io
 *   APP_PATH     e.g. /kids-stuff/
 *   MODEL_BACKEND                             — "azure" | "github"  (default azure)
 *   # when MODEL_BACKEND=azure:
 *   AZURE_OPENAI_ENDPOINT   e.g. https://chgu-4562-resource.openai.azure.com
 *   AZURE_OPENAI_KEY
 *   AZURE_OPENAI_DEPLOYMENT e.g. gpt-4o
 *   AZURE_OPENAI_API_VERSION (default 2024-08-01-preview)
 *   # when MODEL_BACKEND=github:
 *   GITHUB_MODEL  (default gpt-4o)
 *   GITHUB_MODELS_URL (default https://models.github.ai/inference/chat/completions)
 */

const { app } = require('@azure/functions');

const COOKIE = 'ks_gh';
const env = (k, d) => process.env[k] ?? d;

const corsHeaders = () => ({
  'Access-Control-Allow-Origin': env('APP_ORIGIN', '*'),
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  Vary: 'Origin',
});

const json = (body, status = 200, extra = {}) => ({
  status,
  headers: { 'content-type': 'application/json', ...corsHeaders(), ...extra },
  body: JSON.stringify(body),
});

function readCookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}
const setCookie = (t) =>
  `${COOKIE}=${encodeURIComponent(t)}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${60 * 60 * 8}`;
const clearCookie = () => `${COOKIE}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;
const appUrl = () => `${env('APP_ORIGIN', '')}${env('APP_PATH', '/')}`;
const selfOrigin = (req) => new URL(req.url).origin;

function messages(things) {
  const list = things.map((t) => `${t.label}${t.emoji ? ' ' + t.emoji : ''}`).join(', ');
  return [
    {
      role: 'system',
      content:
        'You are a gentle bedtime storyteller for a 4-5 year old. Write a SHORT (120-200 words), warm, cozy, completely calm story with simple short sentences. Nothing scary, sad, or loud. The story MUST include every given thing by name. End on a peaceful goodnight. Respond ONLY as strict JSON: {"title": string, "paragraphs": string[]} with 5-8 short paragraphs, the last ending with the word "Goodnight."',
    },
    { role: 'user', content: `Weave a bedtime story that includes all of these: ${list}.` },
  ];
}

async function callModel(userToken, things) {
  const backend = env('MODEL_BACKEND', 'azure');
  let url;
  let headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  let model;
  if (backend === 'github') {
    url = env('GITHUB_MODELS_URL', 'https://models.github.ai/inference/chat/completions');
    headers.Authorization = `Bearer ${userToken}`;
    model = env('GITHUB_MODEL', 'gpt-4o');
  } else {
    const dep = env('AZURE_OPENAI_DEPLOYMENT', 'gpt-4o');
    const ver = env('AZURE_OPENAI_API_VERSION', '2024-08-01-preview');
    url = `${env('AZURE_OPENAI_ENDPOINT')}/openai/deployments/${dep}/chat/completions?api-version=${ver}`;
    headers['api-key'] = env('AZURE_OPENAI_KEY');
    model = dep;
  }
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model, messages: messages(things), temperature: 0.9, max_tokens: 600 }),
  });
  if (!res.ok) return { ok: false, status: res.status, detail: (await res.text()).slice(0, 300) };
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  let story;
  try {
    story = JSON.parse(content.replace(/^```json\s*|\s*```$/g, ''));
  } catch {
    const paras = content.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);
    story = { title: 'A Bedtime Tale', paragraphs: paras.length ? paras : [content] };
  }
  return { ok: true, story };
}

app.http('login', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'login',
  handler: async (req) => {
    const auth = new URL('https://github.com/login/oauth/authorize');
    auth.searchParams.set('client_id', env('GITHUB_CLIENT_ID'));
    auth.searchParams.set('redirect_uri', `${selfOrigin(req)}/api/callback`);
    auth.searchParams.set('scope', 'read:user');
    return { status: 302, headers: { Location: auth.toString() } };
  },
});

app.http('callback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'callback',
  handler: async (req) => {
    const code = new URL(req.url).searchParams.get('code');
    if (!code) return json({ error: 'missing code' }, 400);
    const tok = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env('GITHUB_CLIENT_ID'),
        client_secret: env('GITHUB_CLIENT_SECRET'),
        code,
        redirect_uri: `${selfOrigin(req)}/api/callback`,
      }),
    }).then((r) => r.json());
    if (!tok.access_token) return json({ error: 'oauth failed' }, 400);
    return { status: 302, headers: { Location: appUrl(), 'Set-Cookie': setCookie(tok.access_token) } };
  },
});

app.http('me', {
  methods: ['GET', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'me',
  handler: async (req) => {
    if (req.method === 'OPTIONS') return { status: 204, headers: corsHeaders() };
    const token = readCookie(req, COOKIE);
    if (!token) return json({ signedIn: false });
    const u = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'moonlit-storybook', Accept: 'application/vnd.github+json' },
    }).then((r) => (r.ok ? r.json() : null));
    return json(u ? { signedIn: true, login: u.login, name: u.name } : { signedIn: false });
  },
});

app.http('story', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'story',
  handler: async (req) => {
    if (req.method === 'OPTIONS') return { status: 204, headers: corsHeaders() };
    const token = readCookie(req, COOKIE);
    if (!token) return json({ error: 'not signed in' }, 401);
    const body = await req.json().catch(() => ({}));
    const things = Array.isArray(body.things) ? body.things.slice(0, 10) : [];
    if (things.length < 3) return json({ error: 'need at least 3 things' }, 400);
    const out = await callModel(token, things);
    if (!out.ok) return json({ error: 'model error', status: out.status, detail: out.detail }, 502);
    return json({ story: out.story });
  },
});

app.http('logout', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'logout',
  handler: async (req) =>
    req.method === 'OPTIONS'
      ? { status: 204, headers: corsHeaders() }
      : { status: 200, headers: { ...corsHeaders(), 'Set-Cookie': clearCookie() } },
});
