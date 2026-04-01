import logo from "../../../assets/dressify-logo.png";
import { Link } from "react-router-dom";
import "./Header.css";

function LandingPageHeader() {
  return (
    <div className="container navbar-inner">
      <div className="brand">
        <img src={logo} alt="Dressify Logo" className="brand-logo" />
      </div>

      <nav className="nav-links">
        <a href="#collection">Collection</a>
        <a href="#about">About</a>
        <a href="#featured">Featured</a>
        <a href="#contact">Contact</a>
      </nav>

      <div className="auth-actions">
        <Link to="/login" className="nav-btn nav-btn--ghost">
          Login
        </Link>
        <Link to="/register" className="nav-btn nav-btn--primary">
          Register
        </Link>
      </div>
    </div>
  );
}

export default LandingPageHeader;
