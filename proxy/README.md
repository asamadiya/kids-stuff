# AI story proxy (optional, Azure Functions)

The site is static (GitHub Pages), so "Sign in with GitHub → have a model write
the story" needs one tiny always-on piece: this **Azure Function app**. It
completes GitHub sign-in, keeps the token in an **httpOnly cookie** (the browser
never reads it), and forwards the request to a model. Until it's deployed and the
app is built with `VITE_AI_PROXY_URL`, the site quietly uses its built-in offline
story weaver — nothing breaks.

The web client is proxy-agnostic: it just calls `VITE_AI_PROXY_URL/{login,me,story,logout}`.

## Endpoints

Azure Functions serve under `/api`, so the routes are
`/api/login`, `/api/callback`, `/api/me`, `/api/story`, `/api/logout`.
Set `VITE_AI_PROXY_URL` to `https://<app>.azurewebsites.net/api`.

## Model backend

- **`MODEL_BACKEND=github` (default):** the Function calls **GitHub Models**
  (`gpt-4o`) with the signed-in user's GitHub token. Supported API; no Copilot
  subscription needed. This is the recommended path.
- **`copilot`:** the GitHub Copilot chat API (needs a Copilot subscription; it's
  an internal editor endpoint and may reject a custom OAuth app's token).
- **`azure`:** Azure OpenAI with the Function's own key (use your *personal*
  Azure only — never LinkedIn infra).

## Setup (≈10 minutes)

1. **GitHub OAuth App** — https://github.com/settings/developers → *New OAuth App*
   - Homepage: `https://asamadiya.github.io/kids-stuff/`
   - Callback URL: `https://<your-func-app>.azurewebsites.net/api/callback`
   - Copy the **Client ID** and generate a **Client secret**.

2. **Create + deploy the Function app** (Node 20) on your **personal** Azure:
   ```bash
   az functionapp create -g <rg> -n <your-func-app> \
     --consumption-plan-location eastus2 --runtime node --runtime-version 20 \
     --functions-version 4 --storage-account <storage>
   cd proxy && npm install
   func azure functionapp publish <your-func-app>
   ```

3. **Configure app settings** (`az functionapp config appsettings set` or the portal):
   `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `APP_ORIGIN=https://asamadiya.github.io`,
   `APP_PATH=/kids-stuff/`, `MODEL_BACKEND=copilot` (or `github`).

4. **CORS with credentials.** The Function returns explicit CORS headers scoped to
   `APP_ORIGIN`. Make sure the portal's Function App → CORS list does **not** also
   add `*` (a wildcard there disables credentialed CORS). Leaving the portal CORS
   list empty lets the code's headers through.

5. **Point the app at it:** build Pages with
   `VITE_AI_PROXY_URL=https://<your-func-app>.azurewebsites.net/api npm run build`,
   then redeploy Pages. The Loom now shows **"Sign in with GitHub for AI stories."**

## Local dev

Copy `local.settings.sample.json` → `local.settings.json`, fill it in, then
`func start`. (Do not commit `local.settings.json`.)

## Security notes

- The token lives only in an httpOnly, Secure, SameSite=None cookie scoped to the
  Function; the web app never sees it. For extra hardening, encrypt the cookie or
  store a session id + token server-side.
- With `MODEL_BACKEND=azure`, the model key stays in Function config and never
  reaches the browser; GitHub sign-in gates who may call `/story`.
