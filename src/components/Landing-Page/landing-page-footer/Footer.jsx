import { Link } from "react-router-dom";
import "./Footer.css";

function LandingPageFooter() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <h2 className="footer-brand-name">DRESSIFY</h2>
          <p className="footer-brand-tagline">
            Discover curated fashion from popular brands. Sign in to explore
            products, save favourites, and build your personal style list.
          </p>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <p className="footer-col-title">Explore</p>
          <ul>
            <li>
              <a href="/#featured">Curated Brands</a>
            </li>
            <li>
              <a href="/#about">About Dressify</a>
            </li>
            <li>
              <a href="/#faq">FAQ</a>
            </li>
            <li>
              <Link to="/register">Start Shopping</Link>
            </li>
          </ul>
        </div>

        {/* Brands */}
        <div className="footer-col">
          <p className="footer-col-title">Brands</p>
          <ul>
            <li>
              <a href="/#featured">Nike</a>
            </li>
            <li>
              <a href="/#featured">Adidas</a>
            </li>
            <li>
              <a href="/#featured">Zara</a>
            </li>
            <li>
              <a href="/#featured">View All Brands</a>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div className="footer-col">
          <p className="footer-col-title">Account</p>
          <ul>
            <li>
              <Link to="/login">Sign In</Link>
            </li>
            <li>
              <Link to="/register">Create Account</Link>
            </li>
            <li>
              <Link to="/login">View Products</Link>
            </li>
            <li>
              <Link to="/login">My Favourites</Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <p className="footer-col-title">Support</p>
          <ul>
            <li>
              <a href="/#faq">Help Center</a>
            </li>
            <li>
              <a href="/#faq">Shipping Info</a>
            </li>
            <li>
              <a href="/#faq">Returns</a>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
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
