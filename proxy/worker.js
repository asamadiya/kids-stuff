/**
 * Moonlit Storybook — AI story proxy (Cloudflare Worker).
 *
 * A static site cannot hold an OAuth secret or bypass CORS, so this tiny worker
 * is the piece that (1) completes GitHub sign-in, (2) keeps the token in an
 * httpOnly cookie the browser never reads, and (3) forwards the story request to
 * a model. The web app only ever talks to THIS worker (with credentials), so the
 * user just signs in with GitHub once and everything works via the cookie.
 *
 * Deploy: see proxy/README.md. Configure these (wrangler.toml vars + secrets):
 *   GITHUB_CLIENT_ID      (var)    — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET  (secret) — from your GitHub OAuth App
 *   APP_ORIGIN            (var)    — e.g. https://asamadiya.github.io
 *   APP_PATH              (var)    — e.g. /kids-stuff/
 *   MODEL                 (var)    — default "gpt-4o"
 *   MODELS_URL            (var)    — default GitHub Models endpoint (below)
 */

const COOKIE = 'ks_gh';
const DEFAULT_MODELS_URL = 'https://models.github.ai/inference/chat/completions';

const cors = (env) => ({
  'Access-Control-Allow-Origin': env.APP_ORIGIN,
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type',
  'Vary': 'Origin',
});

const json = (env, body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...cors(env), ...extra },
  });

function readCookie(req, name) {
  const raw = req.headers.get('Cookie') || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

const setCookie = (token) =>
  `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${60 * 60 * 8}`;
const clearCookie = () => `${COOKIE}=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;

const appUrl = (env) => `${env.APP_ORIGIN}${env.APP_PATH || '/'}`;

function storyPrompt(things) {
  const list = things.map((t) => `${t.label}${t.emoji ? ' ' + t.emoji : ''}`).join(', ');
  return [
    {
      role: 'system',
      content:
        'You are a gentle bedtime storyteller for a 4–5 year old child. Write a SHORT (120–200 words), warm, cozy, and completely calm story. Use simple, short sentences. Nothing scary, sad, or loud. The story MUST include every one of the given things by name. End on a peaceful goodnight. Respond ONLY as strict JSON: {"title": string, "paragraphs": string[]} with 5–8 short paragraphs, the last ending with the word "Goodnight."',
    },
    { role: 'user', content: `Please weave a bedtime story that includes all of these: ${list}.` },
  ];
}

async function generate(env, token, things) {
  const url = env.MODELS_URL || DEFAULT_MODELS_URL;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      model: env.MODEL || 'gpt-4o',
      messages: storyPrompt(things),
      temperature: 0.9,
      max_tokens: 600,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return { ok: false, status: res.status, detail: detail.slice(0, 300) };
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content ?? '';
  let parsed;
  try {
    parsed = JSON.parse(content.replace(/^```json\s*|\s*```$/g, ''));
  } catch {
    const paras = content.split(/\n{2,}|\n/).map((s) => s.trim()).filter(Boolean);
    parsed = { title: 'A Bedtime Tale', paragraphs: paras.length ? paras : [content] };
  }
  return { ok: true, story: parsed };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    // 1) Kick off GitHub sign-in.
    if (path === '/login') {
      const redirect = `${url.origin}/callback`;
      const auth = new URL('https://github.com/login/oauth/authorize');
      auth.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      auth.searchParams.set('redirect_uri', redirect);
      auth.searchParams.set('scope', 'read:user');
      auth.searchParams.set('allow_signup', 'true');
      return Response.redirect(auth.toString(), 302);
    }

    // 2) GitHub redirects back here with a code; exchange it and set the cookie.
    if (path === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return json(env, { error: 'missing code' }, 400);
      const tok = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${url.origin}/callback`,
        }),
      }).then((r) => r.json());
      if (!tok.access_token) return json(env, { error: 'oauth failed', detail: tok }, 400);
      return new Response(null, {
        status: 302,
        headers: { Location: appUrl(env), 'Set-Cookie': setCookie(tok.access_token) },
      });
    }

    // 3) Who am I? (drives the signed-in UI)
    if (path === '/me') {
      const token = readCookie(request, COOKIE);
      if (!token) return json(env, { signedIn: false });
      const u = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'moonlit-storybook', Accept: 'application/vnd.github+json' },
      }).then((r) => (r.ok ? r.json() : null));
      return json(env, u ? { signedIn: true, login: u.login, name: u.name } : { signedIn: false });
    }

    // 4) Make a story.
    if (path === '/story' && request.method === 'POST') {
      const token = readCookie(request, COOKIE);
      if (!token) return json(env, { error: 'not signed in' }, 401);
      const body = await request.json().catch(() => ({}));
      const things = Array.isArray(body.things) ? body.things.slice(0, 10) : [];
      if (things.length < 3) return json(env, { error: 'need at least 3 things' }, 400);
      const out = await generate(env, token, things);
      if (!out.ok) return json(env, { error: 'model error', status: out.status, detail: out.detail }, 502);
      return json(env, { story: out.story });
    }

    if (path === '/logout') {
      return new Response(null, { status: 200, headers: { ...cors(env), 'Set-Cookie': clearCookie() } });
    }

    return json(env, { ok: true, service: 'moonlit story proxy' });
  },
};
