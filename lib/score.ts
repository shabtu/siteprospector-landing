/**
 * Client for the public score API (plan 05 in the pipeline repo, section 6).
 *
 * The site is a static export, so the browser talks to the API directly:
 * POST /score starts a model-free audit of a website, GET /score/<token> polls
 * it until the score is done or has failed. The API verifies the Turnstile
 * token; every answer it gives an error in carries a Swedish sentence, which
 * the page shows as it is.
 *
 * Both values below are read at build time (NEXT_PUBLIC_* is inlined by Next).
 */

export const SCORE_API_URL = (process.env.NEXT_PUBLIC_SCORE_API_URL || "https://api.siteprospector.com").replace(
  /\/+$/,
  "",
);

/** Empty until the score API is live. While empty, the score section is not on the page. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

/** How long the page waits for a score before it gives up (the request goes on). */
export const SCORE_GIVE_UP_MS = 90_000;
export const DEFAULT_POLL_MS = 2_000;
const REQUEST_TIMEOUT_MS = 15_000;
const MIN_POLL_MS = 1_000;
const MAX_POLL_MS = 10_000;

export type Category = { id: string; label: string; score: number; max: number };
export type Finding = { key: string; text: string };

/** A demo built for the visitor after an approved ask (PR 2 of the plan). */
export type Proposal =
  | { status: "building"; step: string }
  | { status: "ready"; url: string }
  | { status: "stopped" };

export type ScoreResult = {
  token: string;
  url: string;
  host: string;
  score: number;
  categories: Category[];
  findings: Finding[];
  canAsk: boolean;
  auditedAt: string;
  proposal: Proposal | null;
};

/** What one answer of the API means for the page. */
export type ScoreState =
  | { kind: "pending"; token: string; queuedAhead: number; pollAfterMs: number }
  | { kind: "done"; result: ScoreResult }
  | { kind: "failed"; error: string; message: string };

/** The API's own error codes, plus the ones the client makes up when there is no usable answer. */
export const MESSAGES = {
  invalid_url: "Det ser inte ut som en webbadress. Skriv till exempel frisor.se.",
  verification: "Vi kunde inte bekräfta att du är en människa. Ladda om sidan och försök igen.",
  rate_limited: "Många vill ha en granskning just nu. Försök igen om en stund.",
  unavailable: "Granskningen är inte tillgänglig just nu. Försök igen senare.",
  not_found: "Vi hittar inte den granskningen längre. Granska webbplatsen igen.",
  network: "Vi fick ingen kontakt med granskningen. Kontrollera uppkopplingen och försök igen.",
  error: "Något gick fel hos oss. Försök igen om en stund.",
  slow: "Det tar längre än vanligt. Ladda om sidan om en stund, så finns resultatet här.",
} as const;

/** The statuses whose answer is the finished result: done, and every status an ask moves it to. */
const RESULT_STATUSES = new Set(["done", "asked", "approved", "skipped", "refused"]);
const TOKEN_RE = /^[A-Za-z0-9_-]{24}$/;

/** Exported for lib/ask.ts, which reads the same kind of answers. */
export { isObject, str };

export function isScoreToken(value: string): boolean {
  return TOKEN_RE.test(value);
}

/**
 * Turns what a visitor typed ("frisor.se") into an absolute http(s) URL.
 * Returns null when it cannot be a website address. The API checks again.
 */
export function normalizeWebsiteUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > 300) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".") || parsed.username || parsed.password) return null;
    return candidate;
  } catch {
    return null;
  }
}

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function str(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parseCategory(value: unknown): Category | null {
  if (!isObject(value)) return null;
  const id = str(value.id);
  const label = str(value.label);
  if (id === null || label === null || !isNumber(value.score) || !isNumber(value.max) || value.max <= 0) return null;
  return { id, label, score: Math.max(0, Math.min(value.score, value.max)), max: value.max };
}

function parseFinding(value: unknown): Finding | null {
  if (!isObject(value)) return null;
  const key = str(value.key);
  const text = str(value.text);
  return key !== null && text !== null && text.trim() !== "" ? { key, text } : null;
}

/** The demo's public address must be an https address; anything else is not shown as a link. */
function parseProposal(value: unknown): Proposal | null {
  if (!isObject(value)) return null;
  if (value.status === "building") return { status: "building", step: str(value.step) ?? "" };
  if (value.status === "stopped") return { status: "stopped" };
  if (value.status === "ready") {
    const url = str(value.url);
    try {
      if (url && new URL(url).protocol === "https:") return { status: "ready", url };
    } catch {
      return null;
    }
  }
  return null;
}

/** The finished result, or null when the body is not one. Unknown extra fields are ignored. */
export function parseResult(body: unknown, fallbackToken: string): ScoreResult | null {
  if (!isObject(body) || !isNumber(body.score) || !Array.isArray(body.categories)) return null;
  const categories = body.categories.map(parseCategory);
  if (categories.some((c) => c === null)) return null;
  const findings = Array.isArray(body.findings) ? body.findings.map(parseFinding) : [];
  return {
    token: str(body.token) ?? fallbackToken,
    url: str(body.url) ?? "",
    host: str(body.host) ?? "",
    score: Math.round(Math.max(0, Math.min(100, body.score))),
    categories: categories as Category[],
    findings: findings.filter((f): f is Finding => f !== null).slice(0, 5),
    canAsk: body.canAsk === true,
    auditedAt: str(body.auditedAt) ?? "",
    proposal: parseProposal(body.proposal),
  };
}

function pollDelay(value: unknown): number {
  return isNumber(value) ? Math.max(MIN_POLL_MS, Math.min(MAX_POLL_MS, value)) : DEFAULT_POLL_MS;
}

function failure(error: string, message?: string | null): ScoreState {
  const known = (MESSAGES as Record<string, string>)[error];
  return { kind: "failed", error, message: message || known || MESSAGES.error };
}

/** The error a status means when the body has no JSON of its own (Cloudflare's own 429, a proxy's 502). */
function errorForStatus(status: number): string {
  if (status === 400 || status === 422) return "invalid_url";
  if (status === 401 || status === 403) return "verification";
  if (status === 404) return "not_found";
  if (status === 429) return "rate_limited";
  if (status === 503) return "unavailable";
  return "error";
}

/** Reads one answer of POST /score or GET /score/<token>. */
export function interpret(status: number, body: unknown, token = ""): ScoreState {
  const json = isObject(body) ? body : {};
  const bodyStatus = str(json.status);

  if (status >= 200 && status < 300) {
    if (bodyStatus === "queued" || bodyStatus === "running") {
      const pendingToken = str(json.token) ?? token;
      if (!isScoreToken(pendingToken)) return failure("error");
      return {
        kind: "pending",
        token: pendingToken,
        queuedAhead: isNumber(json.queuedAhead) ? Math.max(0, Math.round(json.queuedAhead)) : 0,
        pollAfterMs: pollDelay(json.pollAfterMs),
      };
    }
    if (bodyStatus === "failed") return failure(str(json.error) ?? "error", str(json.message));
    if (bodyStatus !== null && RESULT_STATUSES.has(bodyStatus)) {
      const result = parseResult(json, token);
      if (result && isScoreToken(result.token)) return { kind: "done", result };
    }
    return failure("error");
  }

  if (status === 404) return failure("not_found");
  return failure(str(json.error) ?? errorForStatus(status), str(json.message));
}

type FetchOptions = { baseUrl?: string; fetchImpl?: typeof fetch };

async function call(path: string, init: RequestInit, token: string, options: FetchOptions): Promise<ScoreState> {
  const { baseUrl = SCORE_API_URL, fetchImpl = fetch } = options;
  let response: Response;
  try {
    response = await fetchImpl(`${baseUrl}${path}`, {
      ...init,
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return failure("network");
  }
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }
  return interpret(response.status, body, token);
}

/** Starts a score. Only call it with a URL normalizeWebsiteUrl accepted and a fresh Turnstile token. */
export function startScore(url: string, turnstileToken: string, options: FetchOptions = {}): Promise<ScoreState> {
  return call(
    "/score",
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, turnstileToken }) },
    "",
    options,
  );
}

export function pollScore(token: string, options: FetchOptions = {}): Promise<ScoreState> {
  if (!isScoreToken(token)) return Promise.resolve(failure("not_found"));
  return call(`/score/${token}`, { method: "GET" }, token, options);
}

/** The line under the spinner, from how long the visitor has waited and how many are ahead in the queue. */
export function progressText(elapsedMs: number, queuedAhead: number): string {
  if (queuedAhead > 0) {
    return queuedAhead === 1 ? "En granskning före er i kön." : `${queuedAhead} granskningar före er i kön.`;
  }
  if (elapsedMs < 3_000) return "Öppnar webbplatsen …";
  if (elapsedMs < 8_000) return "Läser startsidan, på dator och på mobil …";
  if (elapsedMs < 30_000) return "Räknar ihop poängen …";
  return "Det tar lite längre tid än vanligt …";
}

/** The page keeps the token in the address (#granskning=<token>), so a reload finds the result again. */
export const HASH_KEY = "granskning";

export function tokenFromHash(hash: string): string | null {
  const value = new URLSearchParams(hash.replace(/^#/, "")).get(HASH_KEY);
  return value && isScoreToken(value) ? value : null;
}
