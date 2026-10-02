# Deploying to Cloudflare Pages

The site is a static export (`output: "export"` in `next.config.js`). `npm run build` writes a plain static site to `out/`. There is no server, no API route and no middleware, so deploying means uploading that folder to Cloudflare Pages.

## 1. Build

```bash
npm ci
npm run build        # writes out/
```

`out/` contains `index.html`, `integritet.html`, `villkor.html`, `404.html` and `_next/`. Cloudflare Pages serves them at `/`, `/integritet` and `/villkor`, redirects `/integritet.html` and `/integritet/` to `/integritet`, and shows `404.html` for unknown addresses.

To look at the build locally with Pages' own routing:

```bash
npx wrangler pages dev out
```

Notes:

- Needs Node 20.9 or newer (developed on Node 26). On Cloudflare's own build image, set `NODE_VERSION=22`.
- The build downloads Inter and JetBrains Mono from Google Fonts (`next/font/google`) and bundles them into `out/`, so visitors' browsers never contact Google. The build therefore needs internet access, and it can fail now and then if that download fails (it happened once during development). Run it again.

## 2. Environment variables (build time)

Both variables start with `NEXT_PUBLIC_`, so Next.js writes their values into the JavaScript during the build. Set them when you run `npm run build`; changing one means building and deploying again. Neither is a secret.

| Variable | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | not set | The Cloudflare Turnstile **site key**. While it is not set, the free-audit form is rendered disabled with the text "Den kostnadsfria analysen öppnar inom kort." and nothing is loaded from Cloudflare. |
| `NEXT_PUBLIC_AUDIT_API_URL` | `https://api.siteprospector.com/api/audit` | Where the form posts. Only set it to use another address (for example a test API). |

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA... npm run build
```

For local builds you can put the variables in `.env.production.local` (git-ignored). In CI, set them as build variables.

## 3. Go-live order: the audit API first, the Turnstile key second

**Do not set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` until the audit API is live.** With the key set, the form accepts input and tries to send it. If the API is not there, every submission ends in an error message. Without the key, the page is complete and honest about it, so it is safe to deploy the site before the API exists.

1. Deploy the audit API at `api.siteprospector.com/api/audit` (see section 5).
2. In the Cloudflare dashboard, open Turnstile and add a widget for `siteprospector.com` and `www.siteprospector.com` (add the `*.pages.dev` address too if you want to test there). Put the **secret key** in the API's `TURNSTILE_SECRET` and use the **site key** here.
3. Build with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set, and deploy again.

## 4. Deploy `out/`

**Dashboard upload.** Workers & Pages, Create, Pages, Upload assets. Name the project `siteprospector` and drag in the `out` folder.

**Wrangler.**

```bash
npx wrangler pages deploy out --project-name siteprospector --branch main
```

The first time, run `npx wrangler login`, or set `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` (this is how CI does it). If the project does not exist yet, create it first:

```bash
npx wrangler pages project create siteprospector --production-branch main
```

`--branch main` matters. Without it, wrangler takes the branch name from git, and a deployment from any branch other than the project's production branch becomes a preview deployment, not the live site.

**Domain.** In the Pages project, open Custom domains and add `siteprospector.com` and `www.siteprospector.com`. The bare domain needs its DNS on Cloudflare; `www` can be a CNAME to `siteprospector.pages.dev` from any DNS provider.

**Rollback.** Pages keeps earlier deployments: open the project, Deployments, and roll back to a previous one.

## 5. What the audit API has to do

The browser posts straight to the API, so the API must accept requests from `https://siteprospector.com`.

Request:

```
POST https://api.siteprospector.com/api/audit
Content-Type: application/json

{
  "url": "https://minfirma.se",
  "email": "anna@minfirma.se",
  "name": "Anna Svensson",
  "turnstileToken": "<token from the Turnstile widget>"
}
```

- `url` is always an absolute http(s) address. The form adds `https://` when the visitor types `minfirma.se`.
- `name` is optional and is an empty string when left blank.
- `turnstileToken` is single use. Verify it with Cloudflare's siteverify endpoint before doing anything else.
- CORS: answer the `OPTIONS` preflight and send `Access-Control-Allow-Origin: https://siteprospector.com` (and the `www` address if it is used), `Access-Control-Allow-Methods: POST, OPTIONS` and `Access-Control-Allow-Headers: Content-Type`.

How the form reads the answer:

| Answer | What the visitor sees |
| --- | --- |
| any 2xx | The confirmation. This is the only case where the form shows success. |
| 400, 422 | Check the website address and e-mail. |
| 401, 403 | The security check was not accepted. |
| 429 | Too many requests, try again later. |
| any other status, no answer within 15 seconds, or a network error | A general error that points to the contact e-mail. |

After every failed attempt the form asks Turnstile for a new token.

## 6. After a deploy

- `/`, `/integritet` and `/villkor` open; an unknown address shows the Swedish 404 page.
- The page source has `<html lang="sv">`, the Swedish title and the Open Graph tags.
- Without the site key: the form is disabled and shows the text from section 2. With it: the Turnstile widget appears and a test submission reaches the API.

## 7. Legal texts

`content/legal/integritetspolicy.md` and `content/legal/villkor-webbplats.md` hold a placeholder ("Utkast – texten publiceras efter juridisk granskning."). Replace each file with the reviewed text, build and deploy. A first line such as `# Integritetspolicy` becomes the page title.

The privacy policy should mention that the form page loads Cloudflare Turnstile and that the form collects a website address, an e-mail address and an optional name.

## Not set up

Security headers (a `_headers` file), `robots.txt`, a sitemap and an Open Graph image.
