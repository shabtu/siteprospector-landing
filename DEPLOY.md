# Deploying to Cloudflare Pages

> The score section ("Hur står sig er hemsida?") is on the page only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set at build time. Without it the page is as before: no form, nothing loaded from Cloudflare. Set it only in the order of section 3.

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
- The build downloads Inter from Google Fonts (`next/font/google`) and bundles them into `out/`, so visitors' browsers never contact Google. The build therefore needs internet access.
- Intermittent failure: twice in about thirty local builds, `next build` stopped with a Turbopack error mentioning `next/font/google` ("queries have exactly one entry") and passed on the next run. Let CI retry the build once. The lasting fix is to keep the font files in the repository and load them with `next/font/local`.

## 2. Environment variables (build time)

Both variables start with `NEXT_PUBLIC_`, so Next.js writes their values into the JavaScript during the build. Set them when you run `npm run build`; changing one means building and deploying again. Neither is a secret.

| Variable | Default | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | not set | The Cloudflare Turnstile **site key**. While it is not set, the score section and its nav link are left out of the page and nothing is loaded from Cloudflare. |
| `NEXT_PUBLIC_SCORE_API_URL` | `https://api.siteprospector.com` | The base address of the score API; the page calls `POST /score` and `GET /score/<token>` under it. Only set it to use another address (for example a local test API). |

```bash
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAA... npm run build
```

For local builds you can put the variables in `.env.production.local` (git-ignored). In CI, set them as build variables.

## 3. Go-live order: the API and the legal texts first, the Turnstile key last

**Do not set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` until all three of these are true.** With the key set, the section accepts input and calls the API; without it, the page is complete and says nothing about a form.

1. The score API is live at `api.siteprospector.com` and switched on (`publicScoreEnabled` in the app's Settings). It is PR 1 of plan 05 in the pipeline repo; section 5 is its contract.
2. In the Cloudflare dashboard, Turnstile has a widget for `siteprospector.com` and `www.siteprospector.com` (and the `*.pages.dev` address to test there). The **secret key** goes to the API's `TURNSTILE_SECRET`, the **site key** here.
3. The privacy policy describes the form (section 7). Today it says the site has no form.

Then build with `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set and deploy again. To switch the section off, build and deploy without the key.

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

## 5. What the score API has to do

The contract is section 6 of `plans/05-public-score-endpoint.md` in the pipeline repo; `lib/score.ts` codes against it and `lib/score.test.ts` holds the cases. In short:

- `POST /score` with `{ "url": "https://minfirma.se", "turnstileToken": "…" }`. `202` with `{ token, status: "queued", queuedAhead, pollAfterMs }`, or `200` with the finished result when a recent audit was reused.
- `GET /score/<token>` every `pollAfterMs` until `status` is `done` (the score, six or seven categories with their maxima, up to five findings in Swedish; the page draws whatever categories and finding keys come) or `failed` (an error code and a Swedish sentence). The page gives up after 90 seconds with "Det tar längre än vanligt …" and keeps the token in the address (`#granskning=<token>`), so a reload picks the result up again.
- Errors carry `{ "error": "<code>", "message": "<Swedish sentence>" }`, which the page shows as it is. A status without a JSON body (Cloudflare's own 429, a proxy's 502) gets the page's own sentence for that status.
- CORS for `https://siteprospector.com` exactly, no credentials. The page sends no cookies.
- A Turnstile token is single use: the page asks for a new one after every `POST`.

The result card offers a free proposal by e-mail (a `mailto:` link with the site's host in the subject). The ask form of the plan's `POST /request` comes with PR 2.

## 6. After a deploy

- `/`, `/integritet` and `/villkor` open; an unknown address shows the Swedish 404 page.
- The page source has `<html lang="sv">`, the Swedish title and the Open Graph tags.
- Without the site key: no score section and no "Granska er sida" link. With it: the Turnstile widget appears, and a test address shows a score within about ten seconds.

## 7. Legal texts

The privacy policy and the website terms are in `content/legal/` (version 1.0 of 2026-10-09). The privacy policy says today that the site has no form ("Vi har i dag inget formulär på webbplatsen"), so it must change, reviewed by the lawyer, before the site key is set; the terms should link to it from the form's context. Plan 05 section 5 lists what is new: the form itself, that the web address is audited and the result shown on the page and not mailed, what is stored and for how long, and that Cloudflare Turnstile runs in the browser. Replace the files, build and deploy together with the key.

## Not set up

Security headers (a `_headers` file), `robots.txt`, a sitemap and an Open Graph image.
