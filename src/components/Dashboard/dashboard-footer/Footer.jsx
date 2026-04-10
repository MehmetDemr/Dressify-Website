import "./Footer.css";

function DashboardFooter() {
  return (
    <footer className="dash-footer">
      <span className="dash-footer-brand">DRESSIFY</span>
      <span className="dash-footer-copy">
        © 2026 Dressify. All rights reserved.
      </span>
      <div className="dash-footer-links">
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#support">Support</a>
      </div>
    </footer>
  );
}

export default DashboardFooter;
