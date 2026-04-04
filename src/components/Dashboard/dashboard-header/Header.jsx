import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/dressify-logo.png";
import "./Header.css";

function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Ana Sayfa", to: "/dashboard" },
    { label: "Markalar", to: "/dashboard/brands" },
    { label: "Kategoriler", to: "/dashboard/categories" },
    { label: "Etkinliklerim", to: "/dashboard/events" },
  ];

  return (
    <header className="dash-header">
      {/* Left — Brand */}
      <div className="dash-header-left">
        <Link to="/dashboard" className="dash-brand">
          <img src={logo} alt="Dressify Logo" className="brand-logo" />
        </Link>
      </div>

      {/* Center — Nav */}
      <nav className="dash-nav">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`dash-nav-link ${location.pathname === item.to ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right — Icons + User */}
      <div className="dash-header-right">
        {/* Search */}
        <button className="dash-icon-btn" aria-label="Ara">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </button>

        {/* Wishlist */}
        <button className="dash-icon-btn" aria-label="Favoriler">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Cart */}
        <button className="dash-icon-btn dash-cart-btn" aria-label="Sepet">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="dash-cart-badge">3</span>
        </button>

        {/* User Avatar + Dropdown */}
        <div className="dash-user-wrapper" ref={menuRef}>
          <button
            className={`dash-avatar ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Kullanıcı menüsü"
          >
            <span>MD</span>
          </button>

          {menuOpen && (
            <div className="dash-user-modal">
              <div className="dash-user-modal-top">
                <div className="dash-modal-avatar">MD</div>
                <div>
                  <p className="dash-modal-name">Mehmet Demir</p>
                  <p className="dash-modal-email">mehmet@gmail.com</p>
                </div>
              </div>

              <div className="dash-modal-divider" />

              <nav className="dash-modal-nav">
                <Link
                  to="/dashboard/profile"
                  className="dash-modal-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profilim
                </Link>

                <Link
                  to="/dashboard/favorites"
                  className="dash-modal-item"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  Favorilerim
                </Link>
              </nav>

              <div className="dash-modal-divider" />

              <button className="dash-modal-logout">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
