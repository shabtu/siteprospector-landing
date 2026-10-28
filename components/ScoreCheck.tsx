"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState, type FormEvent } from "react";
import ScoreResult from "@/components/ScoreResult";
import Turnstile from "@/components/Turnstile";
import { useScorePoll, type Waiting } from "@/components/useScorePoll";
import {
  DEFAULT_POLL_MS,
  HASH_KEY,
  MESSAGES,
  TURNSTILE_SITE_KEY,
  normalizeWebsiteUrl,
  progressText,
  startScore,
  tokenFromHash,
  type ScoreResult as Result,
  type ScoreState,
} from "@/lib/score";

const COPY = {
  title: "Hur står sig er hemsida?",
  text: "Skriv in adressen så granskar vi startsidan direkt, på dator och på mobil. Det tar några sekunder och kostar ingenting.",
  label: "Er hemsida",
  placeholder: "minfirma.se",
  submit: "Granska min hemsida",
  sending: "Startar …",
  invalid: MESSAGES.invalid_url,
  checkFailed: "Säkerhetskontrollen kunde inte laddas. Ladda om sidan och försök igen.",
  privacy: "Formuläret skyddas av Cloudflare Turnstile. Läs mer i vår",
  privacyLink: "integritetspolicy",
  and: "och våra",
  termsLink: "villkor",
} as const;

function setHash(token: string | null) {
  const url = new URL(window.location.href);
  url.hash = token ? `${HASH_KEY}=${token}` : "";
  window.history.replaceState(null, "", url);
}

export default function ScoreCheck() {
  const inputId = useId();
  const [url, setUrl] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [waiting, setWaiting] = useState<Waiting | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const settle = useCallback((state: ScoreState) => {
    setWaiting(null);
    if (state.kind === "done") {
      setResult(state.result);
      setHash(state.result.token);
    } else if (state.kind === "pending") {
      setHash(state.token);
      setWaiting({ ...state, startedAt: Date.now() });
    } else {
      setError(state.message);
      if (state.error !== "slow") setHash(null);
    }
  }, []);

  const { queuedAhead, elapsedMs } = useScorePoll(waiting, settle);

  // A reload of a page with #granskning=<token> picks the result up again.
  useEffect(() => {
    const resume = setTimeout(() => {
      const token = tokenFromHash(window.location.hash);
      if (token) setWaiting({ token, queuedAhead: 0, pollAfterMs: 0, startedAt: Date.now() });
    }, 0);
    return () => clearTimeout(resume);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const websiteUrl = normalizeWebsiteUrl(url);
    if (!websiteUrl) return setError(COPY.invalid);
    if (!turnstileToken || sending) return;

    setSending(true);
    setError(null);
    const state = await startScore(websiteUrl, turnstileToken);
    // A Turnstile token is single-use: ask for a fresh one whatever the answer was.
    setTurnstileToken(null);
    setResetCount((count) => count + 1);
    setSending(false);
    settle(state.kind === "pending" ? { ...state, pollAfterMs: state.pollAfterMs || DEFAULT_POLL_MS } : state);
  }

  function again() {
    setResult(null);
    setError(null);
    setHash(null);
  }

  return (
    <section className="section" id="granska" aria-labelledby="score-title">
      <h2 id="score-title">{COPY.title}</h2>
      {result ? (
        <ScoreResult result={result} onAgain={again} />
      ) : (
        <>
          <p>{COPY.text}</p>
          <form className="score-form" onSubmit={handleSubmit} noValidate hidden={waiting !== null}>
            <label htmlFor={inputId}>{COPY.label}</label>
            <div className="score-row">
              <input
                id={inputId}
                type="text"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                placeholder={COPY.placeholder}
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                aria-describedby={error ? `${inputId}-error` : undefined}
              />
              <button className="btn btn-primary" type="submit" disabled={sending || !turnstileToken || !url.trim()}>
                {sending ? COPY.sending : COPY.submit}
              </button>
            </div>
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              resetCount={resetCount}
              onToken={setTurnstileToken}
              onError={() => setError(COPY.checkFailed)}
            />
            <p className="score-privacy">
              {COPY.privacy} <Link href="/integritet">{COPY.privacyLink}</Link> {COPY.and}{" "}
              <Link href="/villkor">{COPY.termsLink}</Link>.
            </p>
          </form>
          <div aria-live="polite">
            {waiting && (
              <p className="score-waiting">
                <span className="spinner" aria-hidden="true" />
                {progressText(elapsedMs, queuedAhead)}
              </p>
            )}
            {error && (
              <p className="score-error" id={`${inputId}-error`} role="alert">
                {error}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
