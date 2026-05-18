# CLAUDE.md — Development Guidelines

## Stack
- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4
- Vercel (deploy target)

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
  globals.css       # All custom CSS + responsive breakpoints
components/
  Nav.tsx
  Hero.tsx
  AuditShowcase.tsx
  HowItWorks.tsx
  Example.tsx
  Included.tsx
  CTA.tsx
  Footer.tsx
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

```bash
vercel deploy --prod --yes
```

The repo is linked to Vercel project `veltare/siteprospector-next`. Every push to `main` auto-deploys.

Production URL: **https://siteprospector-next.vercel.app**
Custom domain (pending): **siteprospector.com**

---

## Do Not

- Don't use `any` in TypeScript — type everything
- Don't add dependencies without good reason — keep the bundle lean
- Don't commit `node_modules`, `.env`, or `.vercel`
- Don't hardcode copy — use constants or props so it's easy to update
- Don't skip the build check before deploying
