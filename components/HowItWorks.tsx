export default function HowItWorks() {
  return (
    <section className="section">
      <div className="sec-head">
        <div className="sec-label">How it works</div>
        <h2 className="sec-title">Three steps. No meetings.</h2>
        <p className="sec-sub">
          You give us a URL. We do the rest. If you don&apos;t like what we build, you owe us
          nothing.
        </p>
      </div>
      <div className="steps">
        <div className="step">
          <div className="step-num">STEP 01 — UNDER 60 SECONDS</div>
          <div className="step-title">We analyze</div>
          <div className="step-desc">
            We run 47 checks against your existing site — speed, mobile, search ranking, security,
            and how easily customers can reach you. You get a real number, not a vibe.
          </div>
          <div className="step-visual">
            <div className="sv-row"><span className="sv-label">Loading speed</span><span className="sv-status fail"><span className="sv-mark">✗</span> 4.2s — slow</span></div>
            <div className="sv-row"><span className="sv-label">Mobile friendly</span><span className="sv-status fail"><span className="sv-mark">✗</span> Not optimized</span></div>
            <div className="sv-row"><span className="sv-label">Secure (SSL)</span><span className="sv-status fail"><span className="sv-mark">✗</span> Missing</span></div>
            <div className="sv-row"><span className="sv-label">Found on Google</span><span className="sv-status gold">Page 4</span></div>
          </div>
        </div>
        <div className="step">
          <div className="step-num">STEP 02 — UNDER 24 HOURS</div>
          <div className="step-title">We build</div>
          <div className="step-desc">
            We design and ship a complete new site for your business — real content, real photos,
            real performance. Ready for you to review the next day.
          </div>
          <div className="step-visual">
            <div className="sv-row"><span className="sv-label">Design</span><span className="sv-status pass"><span className="sv-mark">✓</span> Done</span></div>
            <div className="sv-row"><span className="sv-label">Copy &amp; photos</span><span className="sv-status pass"><span className="sv-mark">✓</span> Done</span></div>
            <div className="sv-row"><span className="sv-label">Mobile build</span><span className="sv-status gold">In progress</span></div>
            <div className="sv-row"><span className="sv-label">Final review</span><span className="sv-status" style={{ color: "var(--color-ink-3)" }}>Up next</span></div>
            <div className="sv-progress" />
          </div>
        </div>
        <div className="step">
          <div className="step-num">STEP 03 — YOUR CALL</div>
          <div className="step-title">You decide</div>
          <div className="step-desc">
            We send a private link to your new site. Compare them side by side. Keep it for
            $149/month, or walk away — no questions, no cost.
          </div>
          <div className="step-visual">
            <div className="sv-compare">
              <div className="sv-pill bad"><div className="lbl">Your site</div><div className="num">38</div></div>
              <div className="sv-pill good"><div className="lbl">Our build</div><div className="num">91</div></div>
            </div>
            <div className="sv-choice">
              <div className="sv-btn keep">Keep it</div>
              <div className="sv-btn">Pass</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
