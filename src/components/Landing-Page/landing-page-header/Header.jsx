import { useState } from "react";
import logo from "../../../assets/dressify-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function LandingPageHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e, hash) => {
    e.preventDefault();
    setMenuOpen(false);

    if (location.pathname === "/") {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/" + hash);
    }
  };

  return (
    <div className="navbar-inner">
      <div className="brand">
        <Link to="/">
          <img src={logo} alt="Dressify Logo" className="brand-logo" />
        </Link>
      </div>

      <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`}>
        <a href="#about" onClick={(e) => handleNavClick(e, "#about")}>
          About
        </a>
        <a href="#featured" onClick={(e) => handleNavClick(e, "#featured")}>
          Featured
        </a>
        <Link to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </Link>

        <div className="auth-actions auth-actions--mobile">
          <Link
            to="/login"
            className="nav-btn nav-btn--ghost"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="nav-btn nav-btn--primary"
            onClick={() => setMenuOpen(false)}
          >
            Register
          </Link>
        </div>
      </nav>

      <div className="auth-actions auth-actions--desktop">
        <Link to="/login" className="nav-btn nav-btn--ghost">
          Login
        </Link>
        <Link to="/register" className="nav-btn nav-btn--primary">
          Register
        </Link>
      </div>

      <button
        className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
}

export default LandingPageHeader;
