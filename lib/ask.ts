/**
 * The ask: a visitor who has read their score leaves an e-mail address and
 * asks for a free proposal (POST /request, plan 05 section 6, PR 2 of the
 * pipeline repo). A rule may approve it at once, and the demo is then built
 * while the page polls GET /score/<token> for its `proposal` field.
 *
 * The form is on the page only with NEXT_PUBLIC_SCORE_ASK=on, set once the
 * API has the route (DEPLOY.md). Read at build time.
 */

import { SCORE_API_URL, isObject, str } from "./score";

export const ASK_ENABLED = process.env.NEXT_PUBLIC_SCORE_ASK === "on";

/** How often and how long the page polls while a demo is being built. */
export const PROPOSAL_POLL_MS = 5_000;
export const PROPOSAL_GIVE_UP_MS = 10 * 60_000;

const REQUEST_TIMEOUT_MS = 15_000;
const EMAIL_RE = /^[^@\s]{1,64}@[^@\s]{1,190}\.[a-zA-Z]{2,}$/;

/** With `token` under a score; with `url` when the score itself is unavailable (flow A). */
export type AskTarget = { token: string } | { url: string };

export type AskRequest = AskTarget & { email: string; name: string; turnstileToken: string };

export type AskOutcome =
  | { ok: true; approved: boolean; message: string }
  | { ok: false; error: string; message: string };

export const ASK_MESSAGES = {
  received: "Tack. Vi har tagit emot din förfrågan.",
  approved: "Tack. Vi påbörjar ert förslag.",
  invalid_email: "Det ser inte ut som en e-postadress. Skriv den igen.",
  verification: "Vi kunde inte bekräfta att du är en människa. Ladda om sidan och försök igen.",
  already_asked: "Vi har redan tagit emot en förfrågan för den här webbplatsen.",
  cannot_ask: "Granskningen hittade för lite att gå vidare på för ett förslag.",
  not_found: "Vi hittar inte granskningen längre. Granska webbplatsen igen.",
  rate_limited: "Många vill ha ett förslag just nu. Försök igen om en stund.",
  unavailable: "Det går inte att be om ett förslag just nu. Försök igen senare.",
  network: "Vi fick ingen kontakt. Kontrollera uppkopplingen och försök igen.",
  error: "Något gick fel hos oss. Försök igen om en stund.",
} as const;

export function isValidEmail(input: string): boolean {
  return EMAIL_RE.test(input.trim());
}

function errorForStatus(status: number): string {
  if (status === 400) return "invalid_email";
  if (status === 401 || status === 403) return "verification";
  if (status === 404) return "not_found";
  if (status === 409) return "already_asked";
  if (status === 422) return "cannot_ask";
  if (status === 429) return "rate_limited";
  if (status === 503) return "unavailable";
  return "error";
}

/** Reads one answer of POST /request. Only a 2xx with `ok: true` counts as received. */
export function interpretAsk(status: number, body: unknown): AskOutcome {
  const json = isObject(body) ? body : {};
  const message = str(json.message);

  if (status >= 200 && status < 300 && json.ok === true) {
    const approved = json.approved === true;
    return { ok: true, approved, message: message || (approved ? ASK_MESSAGES.approved : ASK_MESSAGES.received) };
  }
  // A 404 is plain text: the token is unknown or its score is not done.
  const error = status === 404 ? "not_found" : (str(json.error) ?? errorForStatus(status));
  const known = (ASK_MESSAGES as Record<string, string>)[error];
  return { ok: false, error, message: (status !== 404 && message) || known || ASK_MESSAGES.error };
}

export async function submitAsk(
  request: AskRequest,
  options: { baseUrl?: string; fetchImpl?: typeof fetch } = {},
): Promise<AskOutcome> {
  const { baseUrl = SCORE_API_URL, fetchImpl = fetch } = options;
  const body = { ...request, email: request.email.trim(), name: request.name.trim().slice(0, 100) };
  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, error: "network", message: ASK_MESSAGES.network };
  }
  let json: unknown = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return interpretAsk(response.status, json);
}
