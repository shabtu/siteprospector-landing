import { describe, expect, it, vi } from "vitest";
import {
  MESSAGES,
  interpret,
  normalizeWebsiteUrl,
  pollScore,
  progressText,
  startScore,
  tokenFromHash,
} from "./score";

const TOKEN = "AbCdEfGhIjKlMnOpQrStUvWx";

const DONE = {
  status: "done",
  token: TOKEN,
  url: "https://frisor.se/",
  host: "frisor.se",
  score: 42,
  categories: [
    { id: "clarity", label: "Tydlighet", score: 8, max: 20 },
    { id: "cta", label: "Kontaktvägar", score: 4, max: 20 },
  ],
  findings: [{ key: "no_phone", text: "Telefonnumret syns inte på startsidan." }],
  canAsk: true,
  auditedAt: "2026-10-28T09:12:41Z",
};

function respond(status: number, body: unknown) {
  return vi.fn(async () => new Response(body === undefined ? "Too Many Requests" : JSON.stringify(body), { status }));
}

describe("normalizeWebsiteUrl", () => {
  it("adds https to a bare domain and keeps an explicit scheme", () => {
    expect(normalizeWebsiteUrl("  frisor.se ")).toBe("https://frisor.se");
    expect(normalizeWebsiteUrl("http://frisor.se/om")).toBe("http://frisor.se/om");
  });

  it("refuses what cannot be a public website address", () => {
    expect(normalizeWebsiteUrl("")).toBeNull();
    expect(normalizeWebsiteUrl("localhost")).toBeNull();
    expect(normalizeWebsiteUrl("ftp://frisor.se")).toBeNull();
    expect(normalizeWebsiteUrl("https://user:pw@frisor.se")).toBeNull();
    expect(normalizeWebsiteUrl(`frisor.se/${"a".repeat(300)}`)).toBeNull();
  });
});

describe("interpret", () => {
  it("reads a queued answer as pending with its token, queue position and poll delay", () => {
    expect(interpret(202, { token: TOKEN, status: "queued", queuedAhead: 2, pollAfterMs: 2000 })).toEqual({
      kind: "pending",
      token: TOKEN,
      queuedAhead: 2,
      pollAfterMs: 2000,
    });
  });

  it("keeps the polled token when a running answer has none, and bounds the poll delay", () => {
    expect(interpret(200, { status: "running", pollAfterMs: 50 }, TOKEN)).toMatchObject({
      kind: "pending",
      token: TOKEN,
      pollAfterMs: 1000,
    });
  });

  it("reads a done body as the result", () => {
    const state = interpret(200, DONE);
    expect(state.kind).toBe("done");
    if (state.kind !== "done") return;
    expect(state.result.score).toBe(42);
    expect(state.result.categories).toHaveLength(2);
    expect(state.result.findings[0]?.key).toBe("no_phone");
    expect(state.result.canAsk).toBe(true);
  });

  it("keeps a seventh category and finding keys it does not know (the contract's list is open)", () => {
    const state = interpret(200, {
      ...DONE,
      categories: [...DONE.categories, { id: "guidelines", label: "Riktlinjer", score: 6, max: 15 }],
      findings: [{ key: "junk_headings", text: "Rubrikerna på startsidan säger inget om företaget." }],
    });
    expect(state.kind).toBe("done");
    if (state.kind !== "done") return;
    expect(state.result.categories.at(-1)).toEqual({ id: "guidelines", label: "Riktlinjer", score: 6, max: 15 });
    expect(state.result.findings[0]?.key).toBe("junk_headings");
  });

  it("shows the same result for every status an ask moves the request to", () => {
    for (const status of ["asked", "approved", "skipped", "refused"]) {
      expect(interpret(200, { ...DONE, status, canAsk: false }).kind).toBe("done");
    }
  });

  it("does not show a result whose body is malformed", () => {
    expect(interpret(200, { ...DONE, categories: [{ id: "x" }] })).toMatchObject({ kind: "failed", error: "error" });
    expect(interpret(200, { status: "queued" })).toMatchObject({ kind: "failed", error: "error" });
  });

  it("uses the API's own sentence for a failed audit", () => {
    const message = "Vi kunde inte öppna webbplatsen. Kontrollera adressen och försök igen.";
    expect(interpret(200, { status: "failed", error: "unreachable", message })).toEqual({
      kind: "failed",
      error: "unreachable",
      message,
    });
  });

  it("uses the API's error body, and the status when there is no body (Cloudflare's own 429)", () => {
    expect(interpret(403, { error: "verification", message: "Ladda om." })).toMatchObject({ message: "Ladda om." });
    expect(interpret(429, null)).toEqual({ kind: "failed", error: "rate_limited", message: MESSAGES.rate_limited });
    expect(interpret(503, null)).toMatchObject({ error: "unavailable" });
    expect(interpret(502, null)).toMatchObject({ error: "error" });
  });

  it("treats a 404 as a token that is gone", () => {
    expect(interpret(404, null, TOKEN)).toMatchObject({ error: "not_found" });
  });
});

describe("startScore and pollScore", () => {
  it("posts the URL and the Turnstile token as JSON, without credentials", async () => {
    const fetchImpl = respond(202, { token: TOKEN, status: "queued", queuedAhead: 0, pollAfterMs: 2000 });
    const state = await startScore("https://frisor.se", "tt", { baseUrl: "https://api.test", fetchImpl });

    expect(state.kind).toBe("pending");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.test/score");
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("omit");
    expect(JSON.parse(String(init.body))).toEqual({ url: "https://frisor.se", turnstileToken: "tt" });
  });

  it("reports a network failure instead of throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await startScore("https://frisor.se", "tt", { fetchImpl })).toMatchObject({ error: "network" });
  });

  it("polls the token's address and never sends a token that is not one", async () => {
    const fetchImpl = respond(200, DONE);
    expect((await pollScore(TOKEN, { baseUrl: "https://api.test", fetchImpl })).kind).toBe("done");
    expect(fetchImpl).toHaveBeenCalledWith(`https://api.test/score/${TOKEN}`, expect.anything());

    const unused = respond(200, DONE);
    expect(await pollScore("../health", { fetchImpl: unused })).toMatchObject({ error: "not_found" });
    expect(unused).not.toHaveBeenCalled();
  });
});

describe("progressText", () => {
  it("names the queue first, then the step by elapsed time", () => {
    expect(progressText(0, 1)).toBe("En granskning före er i kön.");
    expect(progressText(0, 3)).toBe("3 granskningar före er i kön.");
    expect(progressText(1_000, 0)).toBe("Öppnar webbplatsen …");
    expect(progressText(5_000, 0)).toContain("startsidan");
    expect(progressText(60_000, 0)).toContain("längre tid");
  });
});

describe("tokenFromHash", () => {
  it("reads a valid token from the address and ignores anything else", () => {
    expect(tokenFromHash(`#granskning=${TOKEN}`)).toBe(TOKEN);
    expect(tokenFromHash("#granskning=kort")).toBeNull();
    expect(tokenFromHash("#pricing")).toBeNull();
  });
});
