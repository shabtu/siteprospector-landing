# CLAUDE.md — Development Guidelines

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack), static export (`output: "export"`)
- Tailwind CSS v4
- Cloudflare Pages (deploy target, see `DEPLOY.md`)
- Swedish only: `<html lang="sv">`, all copy in Swedish

---

## Commits — Always Atomic

Every commit must represent **one logical change**. No bundling unrelated work.

**Rules:**
- One feature, one fix, or one refactor per commit
- Never commit broken code — every commit must build
- Use conventional commit messages:
  - `feat: add URL input form to CTA section`
  - `fix: mobile overflow on audit card`
  - `style: adjust hero title size on small screens`
  - `refactor: extract ScoreCard into separate component`
  - `chore: update Next.js to 16.2.6`

**Before every commit:**
```bash
npm run build   # must pass
npm run lint    # must pass
```

---

## Project Structure

```
app/
  layout.tsx        # Root layout, fonts, metadata
  page.tsx          # Assembles all sections
  not-found.tsx     # Swedish 404 (becomes out/404.html)
  integritet/       # /integritet, from content/legal/integritetspolicy.md
  villkor/          # /villkor, from content/legal/villkor-webbplats.md
  globals.css       # All custom CSS + responsive breakpoints
components/
  Nav.tsx
  Hero.tsx
  HowItWorks.tsx
  Example.tsx       # Fictional before/after example (3 problems, 3 fixes)
  Included.tsx      # Price card with what's included
  Faq.tsx
  Contact.tsx       # 'Mail us' section
  ScoreCheck.tsx    # 'Hur står sig er hemsida?': URL field, Turnstile, polling (only with a site key)
  ScoreResult.tsx   # The score card: total, the category bars (six or seven), findings, proposal by mail
  ScoreOffer.tsx    # Under the score: the demo if one is building or ready, else the ask form, else a mail link
  AskForm.tsx       # POST /request: e-mail, optional name, Turnstile (only with NEXT_PUBLIC_SCORE_ASK=on)
  AskFallback.tsx   # The ask with the URL alone, when the score answers 503
  useScorePoll.ts   # Polls GET /score/<token>: the score (90 s) and the demo (5 s, 10 min)
  Turnstile.tsx     # Cloudflare Turnstile widget, loaded only when the score section renders
  LegalPage.tsx
  Footer.tsx
content/legal/      # Markdown for the legal pages
lib/
  site.ts           # Business facts and the offer (price, binding)
  legal.ts          # Markdown to HTML at build time
  score.ts          # Client for the public score API (plan 05 in the pipeline repo)
  ask.ts            # Client for POST /request (the ask for a proposal)
```

Keep components focused. If a component exceeds ~150 lines, consider splitting.

---

## CSS Conventions

Readability rules: body text at least 17 px on phones (18 px on desktop), nothing under 15 px except the footer, body text at least 7:1 contrast, the accent (`--accent`) only for buttons and small marks, no background pattern. Custom properties are in `:root` in `globals.css`; use them.

Breakpoints: 640px (mobile/desktop) and 900px (nav links, two-column example).

Always test at 375px (iPhone SE) and 430px (iPhone Pro Max).

---

## Testing

### Unit tests (Vitest)
```bash
npm run test
```

Test files live next to the component: `components/Hero.test.tsx`

**Test what matters:**
- Interactive state (score animations, form submissions)
- Conditional rendering (confirm card, scan states)
- Utility functions

Don't test static markup.

### Visual/E2E (Playwright)
```bash
npm run test:e2e
```

Key flows to cover:
1. CTA URL form — submit → confirm card appears
2. Scroll to sections via nav links
3. Mobile viewport — no horizontal overflow
4. Score animation plays on load

### Before deploying
```bash
npm run build && npm run lint && npm run test
```

---

## Deploy

The site is exported to static files in `out/` and hosted on Cloudflare Pages. How to build, which variables to set and how to upload: **`DEPLOY.md`**. Vercel is no longer the deploy target (its Hobby plan is non-commercial).

Production URL: **https://siteprospector.com**

---

## Content

- The price, binding time and other offer facts live in `lib/site.ts` and must match the contract. Don't state anything the offer doesn't include (no "cancel anytime", no promises about reply times or uptime).
- No invented figures, ratings or customer quotes. The example section is fictional and says so.
- Facts come only from `docs/offer-facts.md` in the pipeline repo (what it marks Beslutat). Support is by e-mail only.
- The only form is the score section, and it is built only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set (see `DEPLOY.md`, section 3, for the order). It shows the model-free conversion score the API returns, never the upgrade score. The response contract is section 6 of `plans/05-public-score-endpoint.md` in the pipeline repo. After a score the next step is the ask form when `NEXT_PUBLIC_SCORE_ASK=on`, else mailing `SITE.email`. The page never shows whether a request was approved by hand, skipped or refused: it shows the API's message, and a demo only when the API sends one.
- Show the API's Swedish error sentences as they are. Don't add promises of contact or reply time to the result card.

---

## Do Not

- Don't use `any` in TypeScript — type everything
- Don't add dependencies without good reason — keep the bundle lean
- Don't commit `node_modules`, `.env`, or `.vercel`
- Don't hardcode copy — use constants or props so it's easy to update
- Don't skip the build check before deploying
- Don't add server features (API routes, middleware, `next/image` optimisation): the site is a static export
