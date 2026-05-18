"use client";

import { useState, type FormEvent } from "react";

export default function CTA() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!url.trim() || !email.trim()) return;
    setState("sending");

    // TODO: replace with real backend (e.g. POST to /api/audit) — see README.
    // const res = await fetch("/api/audit", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ url, email, name }),
    // });

    setTimeout(() => setState("done"), 1400);
  }

  function reset() {
    setState("idle");
    setUrl("");
    setEmail("");
    setName("");
  }

  const cleanUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "") || "your-site.com";

  return (
    <section className="cta-section" id="cta">
      <div className="page">
        <h2 className="cta-title">
          Want to see how
          <br />
          <span className="gold">your site</span> performs?
        </h2>
        <p className="cta-sub">
          Drop your website and email. We&apos;ll send your full audit report — score, screenshots,
          recommendations — within 60 seconds.
        </p>

        {state !== "done" ? (
          <form className="url-form" onSubmit={submit}>
            <div className="form-field">
              <label htmlFor="url-in">Your website</label>
              <input
                id="url-in"
                type="text"
                placeholder="yourbusiness.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={state === "sending"}
                autoComplete="url"
              />
            </div>
            <div className="form-field">
              <label htmlFor="email-in">Where to send the audit</label>
              <input
                id="email-in"
                type="email"
                placeholder="you@yourbusiness.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={state === "sending"}
                autoComplete="email"
              />
            </div>
            <div className="form-field">
              <label htmlFor="name-in">
                Your name <span className="opt">(optional)</span>
              </label>
              <input
                id="name-in"
                type="text"
                placeholder="So we know who to address it to"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={state === "sending"}
                autoComplete="name"
              />
            </div>
            <button
              className="form-submit"
              type="submit"
              disabled={state === "sending" || !url.trim() || !email.trim()}
            >
              {state === "sending" ? (
                "Queuing your audit…"
              ) : (
                <>
                  Send my free audit <span>→</span>
                </>
              )}
            </button>
            <div className="url-note">
              <span><span className="check">✓</span> Free, no strings</span>
              <span><span className="check">✓</span> No sales calls</span>
              <span><span className="check">✓</span> Unsubscribe anytime</span>
            </div>
          </form>
        ) : (
          <div className="confirm-card">
            <div className="confirm-icon">✓</div>
            <div className="confirm-title">
              {name ? name.split(" ")[0] + ", y" : "Y"}our audit is{" "}
              <span className="gold">on the way</span>.
            </div>
            <p className="confirm-sub">
              We&apos;ve queued a full audit of <strong>{cleanUrl}</strong>. You&apos;ll get the
              report — score, screenshots, and the 5 biggest fixes — at your inbox in under 2
              minutes.
            </p>

            <div className="confirm-meta">
              <div className="confirm-meta-item">
                <div className="lbl">Auditing</div>
                <div className="val">{cleanUrl}</div>
              </div>
              <div className="confirm-meta-item">
                <div className="lbl">Sending to</div>
                <div className="val">{email}</div>
              </div>
            </div>

            <div className="confirm-status">
              <span className="pulse" />
              <span>Audit running · est. delivery in 60 seconds</span>
            </div>

            <button className="confirm-reset" type="button" onClick={reset}>
              Submit another site
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
