const CASE = {
  name: "Riverside Family Dentistry",
  initial: "R",
  type: "General & cosmetic dentistry",
  location: "Austin · TX",
  est: "Sample audit",
  before: 28,
  after: 91,
  domain: "riversidefamilydental.com",
  badFindings: [
    {
      title: "Looks fine, but built in 2015 — and hasn't been touched since 2019",
      detail:
        "Generic stock photo of a smiling family at the top, logo in Times New Roman, copyright reads © 2018 in the footer. Patients can tell.",
    },
    {
      title: "Seven-item navigation with no hierarchy",
      detail:
        "Home, About, Team, Services, Patient Forms, Insurance, Contact — with no signal about what to do first. Visitors stall.",
    },
    {
      title: "Phone number is buried in the footer — as an image",
      detail:
        "Not clickable on a phone. Not selectable to copy. People give up before scrolling that far.",
    },
    {
      title: '"Book Appointment" opens a PDF form',
      detail:
        "You print it, fill it in, fax it back. In 2026. No same-day booking anywhere on the site.",
    },
    {
      title: "Completely broken on mobile",
      detail:
        "Text overflows the screen, buttons are too small to tap, the hero photo crashes the layout. 68% of visitors come from a phone.",
    },
    {
      title: "Wall of text. No trust signals.",
      detail:
        "Three paragraphs about team credentials. No reviews, no rating, no patient count, no Google Maps. 6-second load.",
    },
  ],
  goodFindings: [
    {
      title: "One clear headline. One clear next step.",
      detail:
        '"Book your appointment online — same-week availability." One bold CTA above the fold. No second-guessing.',
    },
    {
      title: "Phone number top-right, one tap to call",
      detail:
        "Always visible, always clickable. On mobile it dials. On desktop it shows hours. Tap-to-call up 4×.",
    },
    {
      title: "Three trust signals where eyes go first",
      detail:
        "★ 4.9 from 312 patients · 18 years in Austin · 8,400+ patients served. All real, all visible above the fold.",
    },
    {
      title: "Services as cards with icons",
      detail:
        "Cleanings, whitening, Invisalign, emergencies — each tappable, each linking straight to booking with that service pre-selected.",
    },
    {
      title: "Embedded Google Maps + same-week booking",
      detail:
        "Patients see exactly where you are and book in three taps. No PDFs, no fax. Calendar synced to your practice management software.",
    },
    {
      title: "Mobile-first. Loads in 0.9 seconds.",
      detail:
        "Thumb-friendly buttons, no horizontal scroll, no overflow. Google search ranking climbs as a side effect.",
    },
  ],
  results: [
    { lbl: "Online bookings", num: "×5", small: "", delta: "~6 / mo → 30+ / mo" },
    { lbl: "Mobile load", num: "0.9", small: "s", delta: "down from 6.0s" },
    { lbl: "Phone clicks", num: "+312", small: "%", delta: "now tap-to-call" },
    { lbl: "Bounce rate", num: "−54", small: "%", delta: "visitors stay 3× longer" },
  ],
} as const;

function BeforeMock() {
  return (
    <div className="mock-before">
      <div className="mb-top">
        <span>Welcome to Riverside Family Dentistry!</span>
        <span>Site map | Print this page</span>
      </div>
      <div className="mb-head">
        <div className="mb-logo">Riverside Family Dentistry, P.C.</div>
        <div className="mb-tag">Serving the Austin community since 2008</div>
      </div>
      <div className="mb-nav">
        <span>Home</span><span>About</span><span>Our Team</span><span>Services</span>
        <span>Patient Forms</span><span>Insurance</span><span>Contact</span>
      </div>
      <div className="mb-body">
        <div className="mb-stock">
          <div className="mb-stock-ph">
            <span className="mb-people">👨‍👩‍👧‍👦</span>
            <span className="mb-stock-cap">[ stock photo: smiling family ]</span>
          </div>
        </div>
        <div className="mb-text">
          <h3>Welcome to Our Practice</h3>
          <p>
            Dr. Patricia Henderson and her team have been proudly providing comprehensive dental
            care to families in the greater Austin area for over fifteen years. We pride ourselves
            on offering...
          </p>
          <p>
            Our staff is committed to making your visit comfortable and pleasant. Please feel free
            to browse our website to learn more about the services we offer, our team&apos;s
            credentials, and...
          </p>
          <p>
            <a className="mb-link">→ Click here to download our New Patient Forms (PDF)</a>
          </p>
          <p>
            <a className="mb-link">→ Click here to download our Book Appointment Form (PDF)</a>
          </p>
        </div>
      </div>
      <div className="mb-announce">
        <strong>What&apos;s New:</strong>
        <span>Now Accepting New Patients! Please call to schedule your first visit.</span>
      </div>
      <div className="mb-services-row">
        <span><strong>Our Services:</strong></span>
        <span>General Dentistry</span><span className="sep">|</span>
        <span>Cleanings</span><span className="sep">|</span>
        <span>Whitening</span><span className="sep">|</span>
        <span>Crowns &amp; Bridges</span>
      </div>
      <div className="mb-foot">
        <span>© 2018 Riverside Family Dentistry, P.C. All rights reserved.</span>
        <span className="mb-phone-img">[ phone img ]</span>
      </div>
    </div>
  );
}

function AfterMock() {
  return (
    <div className="mock-after">
      <div className="ma-topbar">
        <span>📍 South Austin · Open today until 6pm</span>
        <span>Most insurance accepted · <strong>New patients welcome</strong></span>
      </div>
      <div className="ma-nav">
        <div className="ma-logo">
          <span className="lmark">R</span>
          Riverside Dental
        </div>
        <div className="ma-nav-links">
          <span>Services</span><span>New Patients</span><span>About</span><span>Visit</span>
        </div>
        <div className="ma-phone">📞 (512) 555-0142</div>
      </div>
      <div className="ma-hero">
        <div className="ma-hero-text">
          <div className="ma-eyebrow">★★★★★ 4.9 · 312 Google reviews</div>
          <div className="ma-h1">
            Gentle, modern dentistry —{" "}
            <span className="accent">booked online in 60 seconds.</span>
          </div>
          <div className="ma-sub">
            Same-week appointments. No pressure, no upsells. We&apos;ll take care of you and your
            family like we&apos;ve taken care of Austin since 2008.
          </div>
          <div className="ma-cta-row">
            <span className="ma-btn">Book online →</span>
            <span className="ma-btn-ghost">Meet the team</span>
          </div>
          <div className="ma-trust">
            <div className="ma-trust-item"><strong>18 yrs</strong><span>in Austin</span></div>
            <div className="ma-trust-sep" />
            <div className="ma-trust-item"><strong>8,400+</strong><span>patients</span></div>
            <div className="ma-trust-sep" />
            <div className="ma-trust-item"><strong>Same week</strong><span>availability</span></div>
          </div>
        </div>
        <div className="ma-portrait">
          <div className="ma-portrait-cap">[ Dr. Henderson ]</div>
        </div>
      </div>
      <div className="ma-services">
        <div className="ma-card"><div className="ma-card-icon">🦷</div><div className="ttl">Cleanings</div><div className="sub">From $89</div></div>
        <div className="ma-card"><div className="ma-card-icon">✨</div><div className="ttl">Whitening</div><div className="sub">In-office</div></div>
        <div className="ma-card"><div className="ma-card-icon">😊</div><div className="ttl">Invisalign</div><div className="sub">Free consult</div></div>
        <div className="ma-card"><div className="ma-card-icon">🚑</div><div className="ttl">Emergencies</div><div className="sub">Same day</div></div>
      </div>
      <div className="ma-foot-row">
        <div className="ma-review">
          <div className="stars">★★★★★</div>
          <div className="quote">
            &quot;Dr. Henderson is incredibly gentle. My kids actually look forward to their visits
            now — never thought I&apos;d say that about a dentist.&quot;
          </div>
          <div className="attrib">— Sarah K., patient since 2019</div>
        </div>
        <div className="ma-map">
          <div className="ma-map-grid" />
          <div className="ma-map-pin">◉</div>
          <div className="ma-map-label">3402 S Lamar Blvd</div>
        </div>
      </div>
    </div>
  );
}

export default function Example() {
  return (
    <section className="section" id="example">
      <div className="sec-head">
        <div className="sec-label">Sample audit</div>
        <h2 className="sec-title">
          A local dentist.
          <br />
          Same clinic, two websites.
        </h2>
        <p className="sec-sub">
          This is the kind of audit you&apos;ll receive. The &quot;before&quot; is the kind of site
          that looks fine at first glance — then quietly loses you a patient every week. Here&apos;s
          exactly what we&apos;d find, fix, and ship.
        </p>
      </div>

      <div className="case-wrap">
        <div className="case-header">
          <div className="case-avatar">{CASE.initial}</div>
          <div className="case-id">
            <div className="biz">{CASE.name}</div>
            <div className="meta">
              <span>{CASE.type}</span>
              <span className="dot-sep">·</span>
              <span>{CASE.location}</span>
              <span className="dot-sep">·</span>
              <span>{CASE.est}</span>
            </div>
          </div>
          <div className="case-scores">
            <div className="cs-block bad">
              <div className="lbl">Before</div>
              <div className="num">{CASE.before}<span className="over">/100</span></div>
            </div>
            <div className="cs-arrow">→</div>
            <div className="cs-block good">
              <div className="lbl">After</div>
              <div className="num">{CASE.after}<span className="over">/100</span></div>
            </div>
          </div>
        </div>

        <div className="case-body">
          <div className="case-side">
            <div className="case-side-head">
              <span className="case-tag before">Before</span>
              <span className="case-side-note">Looks fine · scores 28/100</span>
            </div>
            <div className="browser">
              <div className="browser-bar">
                <span className="dot-b" /><span className="dot-b" /><span className="dot-b" />
                <div className="url">⚠ http://{CASE.domain}</div>
              </div>
              <div className="browser-body">
                <BeforeMock />
              </div>
            </div>
            <div className="ex-findings">
              <h4>What we found · 6 critical issues</h4>
              {CASE.badFindings.map((f, i) => (
                <div key={i} className="finding bad">
                  <div className="finding-icon">✗</div>
                  <div className="finding-text">
                    {f.title}
                    <span className="detail">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="case-side">
            <div className="case-side-head">
              <span className="case-tag after">After · our rebuild</span>
              <span className="case-side-note">Built in 18 hours · scores 91/100</span>
            </div>
            <div className="browser">
              <div className="browser-bar">
                <span className="dot-b" /><span className="dot-b" /><span className="dot-b" />
                <div className="url">🔒 https://{CASE.domain}</div>
              </div>
              <div className="browser-body">
                <AfterMock />
              </div>
            </div>
            <div className="ex-findings">
              <h4>What we&apos;d change · every issue, fixed</h4>
              {CASE.goodFindings.map((f, i) => (
                <div key={i} className="finding good">
                  <div className="finding-icon">✓</div>
                  <div className="finding-text">
                    {f.title}
                    <span className="detail">{f.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="case-results">
          <div className="case-results-head">
            <h3>What this kind of rebuild typically delivers</h3>
            <span className="since">based on similar small-practice rebuilds</span>
          </div>
          <div className="results-grid">
            {CASE.results.map((r, i) => (
              <div className="result" key={i}>
                <div className="lbl">{r.lbl}</div>
                <div className="num">
                  {r.num}
                  {r.small && <span className="small">{r.small}</span>}
                </div>
                <div className="delta">
                  <span className="up">↑</span> {r.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
