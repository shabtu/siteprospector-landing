import { describe, expect, it, vi } from "vitest";
import { ASK_MESSAGES, interpretAsk, isValidEmail, submitAsk } from "./ask";
import { interpret } from "./score";

const TOKEN = "AbCdEfGhIjKlMnOpQrStUvWx";

describe("isValidEmail", () => {
  it("accepts an ordinary address and refuses what is not one", () => {
    expect(isValidEmail(" maria@frisor.se ")).toBe(true);
    expect(isValidEmail("maria@frisor")).toBe(false);
    expect(isValidEmail("maria frisor.se")).toBe(false);
  });
});

describe("interpretAsk", () => {
  it("reads the rule's approval and the plain receipt, with the API's sentence", () => {
    expect(interpretAsk(200, { ok: true, approved: true, message: "Tack. Vi påbörjar ert förslag." })).toEqual({
      ok: true,
      approved: true,
      message: "Tack. Vi påbörjar ert förslag.",
    });
    expect(interpretAsk(200, { ok: true, approved: false })).toEqual({
      ok: true,
      approved: false,
      message: ASK_MESSAGES.received,
    });
  });

  it("does not count a 2xx without ok as received", () => {
    expect(interpretAsk(200, {})).toMatchObject({ ok: false, error: "error" });
  });

  it("maps every error status of the contract, with or without a body", () => {
    expect(interpretAsk(400, { error: "invalid_email", message: "Skriv den igen." })).toMatchObject({
      error: "invalid_email",
      message: "Skriv den igen.",
    });
    expect(interpretAsk(403, null)).toMatchObject({ error: "verification" });
    expect(interpretAsk(404, "Not found")).toMatchObject({ error: "not_found", message: ASK_MESSAGES.not_found });
    expect(interpretAsk(409, null)).toMatchObject({ error: "already_asked" });
    expect(interpretAsk(422, { error: "score_first", message: "Granska webbplatsen först." })).toMatchObject({
      error: "score_first",
    });
    expect(interpretAsk(429, null)).toMatchObject({ error: "rate_limited" });
    expect(interpretAsk(503, null)).toMatchObject({ error: "unavailable" });
  });
});

describe("submitAsk", () => {
  it("posts the token, the trimmed address and name and the Turnstile token, without credentials", async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true, approved: false }), { status: 200 }));
    const outcome = await submitAsk(
      { token: TOKEN, email: " maria@frisor.se ", name: " Maria ", turnstileToken: "tt" },
      { baseUrl: "https://api.test", fetchImpl },
    );

    expect(outcome.ok).toBe(true);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.test/request");
    expect(init.credentials).toBe("omit");
    expect(JSON.parse(String(init.body))).toEqual({
      token: TOKEN,
      email: "maria@frisor.se",
      name: "Maria",
      turnstileToken: "tt",
    });
  });

  it("reports a network failure instead of throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    const outcome = await submitAsk({ url: "https://frisor.se", email: "a@b.se", name: "", turnstileToken: "t" }, { fetchImpl });
    expect(outcome).toMatchObject({ ok: false, error: "network" });
  });
});

describe("the proposal on the score", () => {
  const done = {
    status: "done",
    token: TOKEN,
    score: 42,
    categories: [{ id: "clarity", label: "Tydlighet", score: 8, max: 20 }],
    findings: [],
    canAsk: false,
  };

  function proposalOf(proposal: unknown) {
    const state = interpret(200, { ...done, proposal });
    return state.kind === "done" ? state.result.proposal : "not done";
  }

  it("reads building, ready and stopped, and no field as none", () => {
    expect(proposalOf(undefined)).toBeNull();
    expect(proposalOf({ status: "building", step: "Bygger sidan", startedAt: "2026-10-28T09:13:30Z" })).toEqual({
      status: "building",
      step: "Bygger sidan",
    });
    expect(proposalOf({ status: "ready", url: "https://demo.siteprospector.com/d/XyZ/", versions: 3 })).toEqual({
      status: "ready",
      url: "https://demo.siteprospector.com/d/XyZ/",
    });
    expect(proposalOf({ status: "stopped" })).toEqual({ status: "stopped" });
  });

  it("never offers a ready demo whose address is not https", () => {
    expect(proposalOf({ status: "ready", url: "javascript:alert(1)" })).toBeNull();
    expect(proposalOf({ status: "ready", url: "http://demo.siteprospector.com/d/x/" })).toBeNull();
  });
});
