import "./Footer.css";

function LandingPageFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-brand-name">DRESSIFY</h2>
          <p className="footer-brand-tagline">
            Curated fashion for those who believe style is a form of
            self-expression.
          </p>
        </div>

        {/* Collection */}
        <div className="footer-col">
          <p className="footer-col-title">Collection</p>
          <ul>
            <li>
              <a href="#new">New Arrivals</a>
            </li>
            <li>
              <a href="#women">Women</a>
            </li>
            <li>
              <a href="#men">Men</a>
            </li>
            <li>
              <a href="#accessories">Accessories</a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <p className="footer-col-title">Company</p>
          <ul>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#careers">Careers</a>
            </li>
            <li>
              <a href="#press">Press</a>
            </li>
            <li>
              <a href="#sustainability">Sustainability</a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <p className="footer-col-title">Support</p>
          <ul>
            <li>
              <a href="#faq">FAQ</a>
            </li>
            <li>
              <a href="#shipping">Shipping</a>
            </li>
            <li>
              <a href="#returns">Returns</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Dressify. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#instagram">Instagram</a>
          <a href="#pinterest">Pinterest</a>
          <a href="#tiktok">TikTok</a>
        </div>
      </div>
    </footer>
  );
}

export default LandingPageFooter;
