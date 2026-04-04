import "./Footer.css";

function DashboardFooter() {
  return (
    <footer className="dash-footer">
      <span className="dash-footer-brand">DRESSIFY</span>
      <span className="dash-footer-copy">
        © 2026 Dressify. Tüm hakları saklıdır.
      </span>
      <div className="dash-footer-links">
        <a href="#privacy">Gizlilik</a>
        <a href="#terms">Kullanım Şartları</a>
        <a href="#support">Destek</a>
      </div>
    </footer>
  );
}

export default DashboardFooter;
