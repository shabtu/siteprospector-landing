# Site Prospector

A Next.js 15 + TypeScript + Tailwind v4 landing page for [siteprospector.com](https://siteprospector.com).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build & deploy (Vercel)

```bash
npm run build
# or:
npx vercel --prod
```

Point your `siteprospector.com` DNS at Vercel.

## Stack

- **Next.js 15** (App Router, React 18)
- **TypeScript** (strict)
- **Tailwind CSS v4** (the brand tokens live in `app/globals.css` under `@theme`)
- **next/font** for self-hosted Inter + JetBrains Mono (no Google Fonts CDN at runtime)

## File map

```
app/
  layout.tsx       Fonts, metadata, root <html>
  page.tsx         Composes the landing sections
  globals.css      @theme tokens + all component styles (~1000 lines)

components/
  Nav.tsx
  Hero.tsx
  AuditShowcase.tsx     Includes <AuditCard> with the animated 38 → 91 reveal
  HowItWorks.tsx        Three steps with the consistent-height visual tiles
  Example.tsx           CASE data + <BeforeMock> (dated 2015 site) + <AfterMock> (rebuilt site)
  Included.tsx          What's-included grid
  CTA.tsx                Lead-capture form (URL + email + optional name)
  Footer.tsx
```

## Wiring the form to a real backend

The CTA form currently fakes the submission for the demo. To capture leads for real, replace the `setTimeout` in `components/CTA.tsx` with a fetch to a real endpoint. Two common patterns:

### Option 1 — Drop-in service (5 min, no code)

Use [Formspree](https://formspree.io), [Web3Forms](https://web3forms.com), or [Tally](https://tally.so). Change the fetch URL to their endpoint. They'll email you each submission and let you forward to a Google Sheet, Notion, etc.

### Option 2 — Vercel serverless function (~30 min, full control)

Create `app/api/audit/route.ts`:

```ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, email, name } = await req.json();

  // 1. Validate
  if (!url || !email) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 2. Kick off your audit pipeline (queue, Lighthouse run, etc.)
  // await enqueueAudit({ url, email, name });

  // 3. Email confirmation via Resend / Postmark / SendGrid
  // await resend.emails.send({ ... });

  return NextResponse.json({ ok: true });
}
```

Then in `CTA.tsx`, replace the `setTimeout` block with:

```ts
const res = await fetch("/api/audit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, email, name }),
});
if (res.ok) setState("done");
else setState("idle"); // show error
```

## Customizing the design

- **Brand colors** live as CSS variables under `@theme` in `app/globals.css`. Change `--color-gold`, `--color-green`, etc. there and the whole site updates.
- **The dated-site mock** (`<BeforeMock>` in `components/Example.tsx`) is hand-styled to look like a 2015-era practice site. Swap industry-specific copy/structure if your hot lead industries change.
- **Section copy** lives directly in the component JSX — no CMS yet. If you want one, the `CASE` constant in `Example.tsx` is the obvious first thing to lift into a `lib/cases.ts` array.

## License

Private — © 2026 Site Prospector
