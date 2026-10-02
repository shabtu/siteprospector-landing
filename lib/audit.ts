/**
 * Client for the free-audit API.
 *
 * The site is a static export, so there is no server of our own to post to:
 * the browser sends the request straight to the audit API, together with a
 * Cloudflare Turnstile token that the API verifies.
 *
 * Both values below are read at build time (NEXT_PUBLIC_* is inlined by Next).
 */

export const AUDIT_API_URL =
  process.env.NEXT_PUBLIC_AUDIT_API_URL || "https://api.siteprospector.com/api/audit";

/** Empty until the audit API is live. While empty, the form stays disabled. */
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

const REQUEST_TIMEOUT_MS = 15_000;

export type AuditRequest = {
  url: string;
  email: string;
  name: string;
  turnstileToken: string;
};

export type AuditFailure = "invalid" | "verification" | "rate_limited" | "server" | "network";

export type AuditResult = { ok: true } | { ok: false; failure: AuditFailure };

/**
 * Turns what a visitor typed ("minfirma.se") into an absolute http(s) URL.
 * Returns null when it cannot be a website address.
 */
export function normalizeWebsiteUrl(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    if (!parsed.hostname.includes(".")) return null;
    return candidate;
  } catch {
    return null;
  }
}

function failureFromStatus(status: number): AuditFailure {
  if (status === 400 || status === 422) return "invalid";
  if (status === 401 || status === 403) return "verification";
  if (status === 429) return "rate_limited";
  return "server";
}

/**
 * Sends the request. Only a 2xx answer counts as success: a failed request,
 * a timeout or an error status is always reported as a failure.
 */
export async function submitAudit(
  request: AuditRequest,
  options: { endpoint?: string; fetchImpl?: typeof fetch } = {},
): Promise<AuditResult> {
  const { endpoint = AUDIT_API_URL, fetchImpl = fetch } = options;

  let response: Response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, failure: "network" };
  }

  if (response.ok) return { ok: true };
  return { ok: false, failure: failureFromStatus(response.status) };
}
