"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import Turnstile from "@/components/Turnstile";
import { ASK_MESSAGES, isValidEmail, submitAsk, type AskOutcome, type AskTarget } from "@/lib/ask";
import { TURNSTILE_SITE_KEY } from "@/lib/score";

const COPY = {
  email: "Er e-postadress",
  emailHint: "Gärna en adress på företagets egen domän.",
  name: "Ert namn",
  optional: "(valfritt)",
  submit: "Be om ett gratis förslag",
  sending: "Skickar …",
  privacy: "Vi använder adressen bara för förfrågan. Läs mer i vår",
  privacyLink: "integritetspolicy",
  and: "och våra",
  termsLink: "villkor",
} as const;

type Props = {
  target: AskTarget;
  /** The site's host, for the placeholder (namn@frisor.se). */
  host: string;
  onAsked: (outcome: Extract<AskOutcome, { ok: true }>) => void;
};

export default function AskForm({ target, host, onAsked }: Props) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidEmail(email)) return setError(ASK_MESSAGES.invalid_email);
    if (!turnstileToken || sending) return;

    setSending(true);
    setError(null);
    const outcome = await submitAsk({ ...target, email, name, turnstileToken });
    setTurnstileToken(null);
    setResetCount((count) => count + 1);
    setSending(false);
    if (outcome.ok) onAsked(outcome);
    else setError(outcome.message);
  }

  return (
    <form className="ask-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`${id}-email`}>{COPY.email}</label>
      <input
        id={`${id}-email`}
        type="email"
        autoComplete="email"
        placeholder={host ? `namn@${host.replace(/^www\./, "")}` : "namn@minfirma.se"}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
      />
      <p className="ask-hint" id={`${id}-hint`}>
        {COPY.emailHint}
      </p>
      <label htmlFor={`${id}-name`}>
        {COPY.name} <span className="ask-optional">{COPY.optional}</span>
      </label>
      <input
        id={`${id}-name`}
        type="text"
        autoComplete="name"
        maxLength={100}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Turnstile
        siteKey={TURNSTILE_SITE_KEY}
        resetCount={resetCount}
        onToken={setTurnstileToken}
        onError={() => setError(ASK_MESSAGES.verification)}
      />
      <button className="btn btn-primary" type="submit" disabled={sending || !turnstileToken || !email.trim()}>
        {sending ? COPY.sending : COPY.submit}
      </button>
      {error && (
        <p className="score-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
      <p className="score-privacy">
        {COPY.privacy} <Link href="/integritet">{COPY.privacyLink}</Link> {COPY.and}{" "}
        <Link href="/villkor">{COPY.termsLink}</Link>.
      </p>
    </form>
  );
}
