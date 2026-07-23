# AI story proxy (optional)

The site is static (GitHub Pages), so "Sign in with GitHub → have Copilot/GPT
write the story" needs one tiny always-on piece: this Cloudflare Worker. It
completes GitHub sign-in, keeps the token in an **httpOnly cookie** (the browser
never reads it), and forwards the story request to a model. Until it's deployed
and the app is built with `VITE_AI_PROXY_URL`, the app quietly uses its built-in
offline story weaver — nothing breaks.

## What you set up (≈5 minutes)

1. **Create a GitHub OAuth App** — https://github.com/settings/developers → *New OAuth App*
   - Homepage URL: `https://asamadiya.github.io/kids-stuff/`
   - Authorization callback URL: `https://<your-worker-subdomain>.workers.dev/callback`
   - Save. Copy the **Client ID**, and generate a **Client secret**.

2. **Configure the worker** (in this `proxy/` folder):
   - Put the Client ID into `wrangler.toml` (`GITHUB_CLIENT_ID`).
   - `npx wrangler secret put GITHUB_CLIENT_SECRET` → paste the secret.
   - (Optional) adjust `MODEL` / `MODELS_URL`. Default is GitHub Models `gpt-4o`.

3. **Deploy:** `npx wrangler deploy` → note the worker URL, e.g.
   `https://moonlit-story-proxy.<you>.workers.dev`.

4. **Point the app at it:** build the site with the env var set, e.g.
   `VITE_AI_PROXY_URL=https://moonlit-story-proxy.<you>.workers.dev npm run build`
   (or add it to the deploy step). Redeploy Pages. The Loom now shows
   **“Sign in with GitHub for AI-written stories.”**

## Model backend

Default: **GitHub Models** (`gpt-4o`) — the supported "your GitHub token talks to
a GPT model" API, which fits "sign in with GitHub" cleanly.

To use the **Copilot API** instead: in `worker.js`, swap the `generate()` call to
first exchange the GitHub token for a Copilot token at
`https://api.github.com/copilot_internal/v2/token`, then POST to
`https://api.githubcopilot.com/chat/completions` with that token and the
`Copilot-Integration-Id` / editor headers. Note this is an internal editor
endpoint and is not intended for third-party web apps (ToS-gray, brittle).

## Security notes

- The token lives only in an httpOnly, Secure, SameSite=None cookie scoped to the
  worker; the web app never sees it. For extra hardening, encrypt the cookie
  value or store a session id + the token in Workers KV.
- CORS is locked to `APP_ORIGIN`.
