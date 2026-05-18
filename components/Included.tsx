const INCLUDED = [
  { num: "01", title: "Modern, responsive website", desc: "Built from scratch for your business. Mobile-first, fast, beautiful." },
  { num: "02", title: "Hosting on premium infrastructure", desc: "Sub-second load times anywhere in the world. Zero downtime." },
  { num: "03", title: "SSL certificate, always on", desc: "Browsers trust your site. Customer data stays encrypted. Renewed automatically." },
  { num: "04", title: "Real human support", desc: "Email or text. Real reply within 4 business hours. No tickets, no bots." },
  { num: "05", title: "Unlimited content updates", desc: "New hours, new menu, new staff? Send us a message. We change it for you." },
  { num: "06", title: "Monthly performance report", desc: "Visitors, calls, form submissions, ranking. Plain English, every month." },
];

export default function Included() {
  return (
    <section className="section">
      <div className="sec-head">
        <div className="sec-label">What&apos;s included</div>
        <h2 className="sec-title">$149/month. Everything.</h2>
        <p className="sec-sub">
          One flat price. No setup fees, no contracts, no upsells. Cancel anytime — we&apos;ll
          release your domain and content within 24 hours.
        </p>
      </div>
      <div className="included-grid">
        {INCLUDED.map((item) => (
          <div className="inc-item" key={item.num}>
            <span className="inc-num">{item.num}</span>
            <div className="inc-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
            <span className="inc-check">✓</span>
          </div>
        ))}
      </div>
    </section>
  );
}
