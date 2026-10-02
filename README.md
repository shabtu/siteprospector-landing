# Site Prospector

The Swedish landing page for [siteprospector.com](https://siteprospector.com), built with Next.js, TypeScript and Tailwind v4 and exported as a static site for Cloudflare Pages.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build and deploy

```bash
npm run build   # static export to out/
npm run lint
npm run test
```

`out/` is what gets deployed. See [DEPLOY.md](DEPLOY.md) for the Cloudflare Pages steps and the build-time variables.

## Stack

- **Next.js 16** (App Router, `output: "export"`, React 18)
- **TypeScript** (strict)
- **Tailwind CSS v4** (the brand tokens live in `app/globals.css` under `@theme`)
- **next/font** for Inter and JetBrains Mono (downloaded at build time and served from the site itself)
- **marked** turns the legal Markdown into HTML at build time
- **Vitest** for the tests

## File map

```
app/
  layout.tsx          Fonts, Swedish metadata, <html lang="sv">
  page.tsx            Composes the sections of the start page
  not-found.tsx       Swedish 404
  integritet/         /integritet
  villkor/            /villkor
  globals.css         @theme tokens + all component styles

components/
  Nav, Hero, HowItWorks, Example, Included, PriceCard, Faq, CTA, Footer
  AuditForm.tsx       The free-audit form
  Turnstile.tsx       Cloudflare Turnstile widget
  LegalPage.tsx       Page shell for the legal texts

content/legal/        integritetspolicy.md, villkor-webbplats.md
lib/                  site.ts (business facts and the offer), audit.ts, legal.ts, scroll.ts
```

## The free-audit form

There is no server, so the form posts straight from the browser to the audit API, with a Cloudflare Turnstile token:

```
POST $NEXT_PUBLIC_AUDIT_API_URL   (default https://api.siteprospector.com/api/audit)
{ "url": "...", "email": "...", "name": "...", "turnstileToken": "..." }
```

Until the API is live, leave `NEXT_PUBLIC_TURNSTILE_SITE_KEY` unset when building: the form is then shown disabled with "Den kostnadsfria analysen öppnar inom kort." and no request is made. The form only shows success after a 2xx answer. Details in [DEPLOY.md](DEPLOY.md).

## Editing the content

- Copy sits in constants at the top of each component. The price, binding time and other offer facts are in `lib/site.ts`; keep them in line with the contract.
- The legal pages render `content/legal/*.md`. Replace the placeholder text with the reviewed text and rebuild.
- The example section is fictional ("Exempelby Tandvård") and contains no real figures, ratings or customer quotes. Keep it that way.

## License

Private — © 2026 Site Prospector
