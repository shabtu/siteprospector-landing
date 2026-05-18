"use client";

import { useEffect, useState } from "react";

function AuditCard() {
  const [animated, setAnimated] = useState(false);
  const [beforeScore, setBeforeScore] = useState(0);
  const [afterScore, setAfterScore] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!animated) return;
    let b = 0;
    let a = 0;
    const interval = setInterval(() => {
      b += 2;
      a += 5;
      if (b >= 38) b = 38;
      if (a >= 91) a = 91;
      setBeforeScore(b);
      setAfterScore(a);
      if (b === 38 && a === 91) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [animated]);

  return (
    <div className="audit-card">
      <div className="audit-head">
        <div className="audit-head-l">
          <span className="pill">Audit Report</span>
          <span> · May 17, 2026</span>
        </div>
        <div className="audit-domain">riversidefamilydental.com</div>
      </div>

      <div className="score-compare">
        <div className="score-block">
          <div className="score-label">Current site</div>
          <div className="score-num bad">
            {beforeScore}
            <span className="over">/100</span>
          </div>
        </div>
        <div className="score-arrow">→</div>
        <div className="score-block">
          <div className="score-label">Our version</div>
          <div className="score-num good">
            {afterScore}
            <span className="over">/100</span>
          </div>
        </div>
      </div>

      <div className="audit-metrics">
        <div className="metric"><span className="metric-label">Mobile speed</span><span className="metric-val fail">4.2s</span></div>
        <div className="metric"><span className="metric-label">Mobile speed</span><span className="metric-val pass">0.8s</span></div>
        <div className="metric"><span className="metric-label">SEO score</span><span className="metric-val fail">42</span></div>
        <div className="metric"><span className="metric-label">SEO score</span><span className="metric-val pass">98</span></div>
        <div className="metric"><span className="metric-label">SSL cert</span><span className="metric-val fail">Missing</span></div>
        <div className="metric"><span className="metric-label">SSL cert</span><span className="metric-val pass">Active</span></div>
        <div className="metric"><span className="metric-label">Mobile friendly</span><span className="metric-val fail">No</span></div>
        <div className="metric"><span className="metric-label">Mobile friendly</span><span className="metric-val pass">Yes</span></div>
      </div>

      <div className="audit-foot">
        <span>Generated 11:42 AM · May 17, 2026</span>
        <span>
          <strong>Est. monthly customers lost: 47</strong>
        </span>
      </div>
    </div>
  );
}

export default function AuditShowcase() {
  return (
    <section className="audit-section">
      <div className="audit-section-inner">
        <div className="audit-section-head">
          <div className="audit-section-label">What you get</div>
          <h2 className="audit-section-title">A real report. With real numbers.</h2>
          <p className="audit-section-sub">
            Every audit comes with a score out of 100, the four metrics that matter most, and an
            estimate of what it&apos;s costing you each month.
          </p>
        </div>
        <AuditCard />
      </div>
    </section>
  );
}
