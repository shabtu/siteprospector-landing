"use client";

import { useId, useState, type FormEvent } from "react";
import Turnstile from "@/components/Turnstile";
import {
  TURNSTILE_SITE_KEY,
  normalizeWebsiteUrl,
  submitAudit,
  type AuditFailure,
} from "@/lib/audit";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "done";
type FormError = AuditFailure | "url" | "check_unavailable";

const COPY = {
  closed: "Den kostnadsfria analysen öppnar inom kort.",
  url: { label: "Er hemsida", placeholder: "minfirma.se" },
  email: { label: "Er e-postadress", placeholder: "namn@minfirma.se" },
  name: {
    label: "Ert namn",
    optional: "(valfritt)",
    placeholder: "Så vet vi vem vi ska vända oss till",
  },
  submit: "Skicka min gratis analys",
  sending: "Skickar…",
  notes: ["Gratis och utan förpliktelse", "Ni får se resultatet först"],
  errors: {
    url: "Webbadressen verkar inte stämma. Skriv den till exempel som minfirma.se.",
    check_unavailable:
      "Säkerhetskontrollen kunde inte laddas, så formuläret kan inte skickas. Ladda om sidan och försök igen.",
    invalid:
      "Vi kunde inte ta emot uppgifterna. Kontrollera webbadressen och e-postadressen och försök igen.",
    verification: "Säkerhetskontrollen godkändes inte. Försök igen.",
    rate_limited:
      "Det har kommit in för många förfrågningar från er uppkoppling. Vänta en stund och försök igen.",
    server: `Något gick fel och vi kan inte bekräfta att er förfrågan kom fram. Försök igen om en stund, eller mejla ${SITE.email}.`,
    network: `Vi fick ingen kontakt med analystjänsten. Kontrollera uppkopplingen och försök igen, eller mejla ${SITE.email}.`,
  } satisfies Record<FormError, string>,
  done: {
    title: "tagit emot",
    reset: "Skicka in en annan hemsida",
  },
} as const;

export default function AuditForm() {
  const urlId = useId();
  const emailId = useId();
  const nameId = useId();

  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [resetCount, setResetCount] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<FormError | null>(null);

  // Without a Turnstile key the audit API is not live yet: the form stays closed.
  const open = TURNSTILE_SITE_KEY !== "";
  const sending = status === "sending";
  const canSubmit = open && !sending && url.trim() !== "" && email.trim() !== "" && token !== null;

  function handleToken(next: string | null) {
    setToken(next);
    if (next) setError((current) => (current === "check_unavailable" ? null : current));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || token === null) return;

    const websiteUrl = normalizeWebsiteUrl(url);
    if (!websiteUrl) {
      setError("url");
      return;
    }

    setStatus("sending");
    setError(null);

    const result = await submitAudit({
      url: websiteUrl,
      email: email.trim(),
      name: name.trim(),
      turnstileToken: token,
    });

    if (result.ok) {
      setStatus("done");
      return;
    }

    // A Turnstile token works once, so a retry needs a fresh one.
    setToken(null);
    setResetCount((count) => count + 1);
    setError(result.failure);
    setStatus("idle");
  }

  function reset() {
    setStatus("idle");
    setError(null);
    setToken(null);
    setUrl("");
    setEmail("");
    setName("");
  }

  if (status === "done") {
    const firstName = name.trim().split(/\s+/)[0];
    const shownUrl = url.trim().replace(/^https?:\/\//i, "").replace(/\/$/, "");

    return (
      <div className="confirm-card">
        <div className="confirm-icon">✓</div>
        <div className="confirm-title">
          Tack{firstName ? `, ${firstName}` : ""}! Vi har <span className="gold">{COPY.done.title}</span>{" "}
          er förfrågan.
        </div>
        <p className="confirm-sub">
          Vi skickar resultatet för <strong>{shownUrl}</strong> till <strong>{email.trim()}</strong>.
          Titta gärna i skräpposten om ni inte ser mejlet.
        </p>
        <div className="confirm-meta">
          <div className="confirm-meta-item">
            <div className="lbl">Hemsida</div>
            <div className="val">{shownUrl}</div>
          </div>
          <div className="confirm-meta-item">
            <div className="lbl">Skickas till</div>
            <div className="val">{email.trim()}</div>
          </div>
        </div>
        <button className="confirm-reset" type="button" onClick={reset}>
          {COPY.done.reset}
        </button>
      </div>
    );
  }

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      {!open && <p className="form-closed">{COPY.closed}</p>}

      <div className="form-field">
        <label htmlFor={urlId}>{COPY.url.label}</label>
        <input
          id={urlId}
          type="text"
          inputMode="url"
          placeholder={COPY.url.placeholder}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={!open || sending}
          autoComplete="url"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor={emailId}>{COPY.email.label}</label>
        <input
          id={emailId}
          type="email"
          placeholder={COPY.email.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!open || sending}
          autoComplete="email"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor={nameId}>
          {COPY.name.label} <span className="opt">{COPY.name.optional}</span>
        </label>
        <input
          id={nameId}
          type="text"
          placeholder={COPY.name.placeholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!open || sending}
          autoComplete="name"
        />
      </div>

      {open && (
        <Turnstile
          siteKey={TURNSTILE_SITE_KEY}
          resetCount={resetCount}
          onToken={handleToken}
          onError={() => setError("check_unavailable")}
        />
      )}

      {error && (
        <p className="form-error" role="alert">
          {COPY.errors[error]}
        </p>
      )}

      <button className="form-submit" type="submit" disabled={!canSubmit}>
        {sending ? (
          COPY.sending
        ) : (
          <>
            {COPY.submit} <span>→</span>
          </>
        )}
      </button>

      <div className="url-note">
        {COPY.notes.map((note) => (
          <span key={note}>
            <span className="check">✓</span> {note}
          </span>
        ))}
      </div>
    </form>
  );
}
