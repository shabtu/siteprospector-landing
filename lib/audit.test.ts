import { describe, expect, it, vi } from "vitest";
import { AUDIT_API_URL, normalizeWebsiteUrl, submitAudit, type AuditRequest } from "./audit";

const request: AuditRequest = {
  url: "https://minfirma.se",
  email: "anna@minfirma.se",
  name: "Anna Svensson",
  turnstileToken: "token-123",
};

function fetchReturning(status: number) {
  return vi.fn<typeof fetch>(async () => new Response(null, { status }));
}

describe("normalizeWebsiteUrl", () => {
  it("adds https:// to a bare domain", () => {
    expect(normalizeWebsiteUrl("minfirma.se")).toBe("https://minfirma.se");
  });

  it("trims whitespace and keeps the path", () => {
    expect(normalizeWebsiteUrl("  www.minfirma.se/kontakt  ")).toBe("https://www.minfirma.se/kontakt");
  });

  it("keeps an address that already has a scheme", () => {
    expect(normalizeWebsiteUrl("http://minfirma.se")).toBe("http://minfirma.se");
    expect(normalizeWebsiteUrl("https://minfirma.se/")).toBe("https://minfirma.se/");
  });

  it("accepts domains with å, ä and ö", () => {
    expect(normalizeWebsiteUrl("bäckeriet.se")).toBe("https://bäckeriet.se");
  });

  it.each(["", "   ", "minfirma", "inte en adress", "ftp://minfirma.se", "javascript:alert(1)"])(
    "rejects %j",
    (input) => {
      expect(normalizeWebsiteUrl(input)).toBeNull();
    },
  );
});

describe("submitAudit", () => {
  it("posts the request as JSON to the audit API", async () => {
    const fetchImpl = fetchReturning(202);

    await submitAudit(request, { endpoint: "https://api.example.test/audit", fetchImpl });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [endpoint, init] = fetchImpl.mock.calls[0];
    expect(endpoint).toBe("https://api.example.test/audit");
    expect(init?.method).toBe("POST");
    expect(init?.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(String(init?.body))).toEqual(request);
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it("defaults to the production audit API", async () => {
    const fetchImpl = fetchReturning(202);

    await submitAudit(request, { fetchImpl });

    expect(AUDIT_API_URL).toBe("https://api.siteprospector.com/api/audit");
    expect(fetchImpl.mock.calls[0][0]).toBe(AUDIT_API_URL);
  });

  it.each([200, 201, 202, 204])("counts HTTP %i as success", async (status) => {
    expect(await submitAudit(request, { fetchImpl: fetchReturning(status) })).toEqual({ ok: true });
  });

  it.each([
    [400, "invalid"],
    [422, "invalid"],
    [401, "verification"],
    [403, "verification"],
    [429, "rate_limited"],
    [404, "server"],
    [500, "server"],
    [502, "server"],
    [503, "server"],
  ] as const)("reports HTTP %i as a %s failure, never as success", async (status, failure) => {
    expect(await submitAudit(request, { fetchImpl: fetchReturning(status) })).toEqual({
      ok: false,
      failure,
    });
  });

  it("reports a network error as a failure", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new TypeError("Failed to fetch");
    });

    expect(await submitAudit(request, { fetchImpl })).toEqual({ ok: false, failure: "network" });
  });

  it("reports a timeout as a failure", async () => {
    const fetchImpl = vi.fn<typeof fetch>(async () => {
      throw new DOMException("The operation timed out.", "TimeoutError");
    });

    expect(await submitAudit(request, { fetchImpl })).toEqual({ ok: false, failure: "network" });
  });
});
