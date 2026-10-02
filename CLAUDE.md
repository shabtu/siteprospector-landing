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
  Example.tsx       # Fictional before/after example (no invented figures)
  Included.tsx      # What's included + <PriceCard />
  PriceCard.tsx
  Faq.tsx
  CTA.tsx           # Section around the audit form
  AuditForm.tsx     # Free-audit form (client)
  Turnstile.tsx     # Cloudflare Turnstile widget (client)
  LegalPage.tsx
  Footer.tsx
content/legal/      # Markdown for the legal pages
lib/
  site.ts           # Business facts and the offer (price, binding)
  audit.ts          # Request to the audit API
  legal.ts          # Markdown to HTML at build time
  scroll.ts
```

Keep components focused. If a component exceeds ~150 lines, consider splitting.

---

## CSS Conventions

Custom properties are defined in `globals.css` under `:root`. Use them — don't hardcode colors.

```css
var(--ink)      /* primary text */
var(--ink-2)    /* secondary text */
var(--ink-3)    /* muted text */
var(--gold)     /* accent */
var(--green)    /* success/positive */
var(--red)      /* error/negative */
var(--bg)       /* page background */
var(--line)     /* borders */
```

**Responsive breakpoints:**
- `960px` — tablet adjustments
- `640px` — mobile (primary mobile target)

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
- The audit form posts to an external API and stays disabled until `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set at build time (see `DEPLOY.md`).

---

## Do Not

- Don't use `any` in TypeScript — type everything
- Don't add dependencies without good reason — keep the bundle lean
- Don't commit `node_modules`, `.env`, or `.vercel`
- Don't hardcode copy — use constants or props so it's easy to update
- Don't skip the build check before deploying
- Don't add server features (API routes, middleware, `next/image` optimisation): the site is a static export
