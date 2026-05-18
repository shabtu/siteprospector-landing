export default function Footer() {
  return (
    <footer>
      <div className="page">
        <div className="foot-address">
          <span>Habtu Consulting AB &middot; Org.nr 559333-3015</span>
          <span>Prästgårdsgatan 2, 172 32 Sundbyberg, Sverige</span>
          <a href="mailto:simon@siteprospector.com">simon@siteprospector.com</a>
        </div>
        <div className="foot">
          <div className="foot-l">
            <div className="logo">
              <div className="logo-mark" />
              Site Prospector
            </div>
            <span className="foot-copy">© 2026 Habtu Consulting AB</span>
          </div>
          <div className="foot-r">
            <a href="mailto:simon@siteprospector.com">simon@siteprospector.com</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
