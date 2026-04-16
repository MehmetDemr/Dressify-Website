import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/dressify-logo.png";
import { API_BASE_URL } from "../../../../config";
import "./Header.css";

function getInitials(userName, email) {
  if (userName && userName.length >= 2)
    return userName.slice(0, 2).toUpperCase();
  if (email) return email.slice(0, 2).toUpperCase();
  return "??";
}

function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const [brands, setBrands] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [pinnedDropdown, setPinnedDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const closeTimerRef = useRef(null);
  const navRef = useRef(null);


  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function openMenu(name) {
    clearCloseTimer();
    setOpenDropdown(name);
  }

  function scheduleClose(name) {
    if (pinnedDropdown === name) return;
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown((prev) => (prev === name ? null : prev));
    }, 220);
  }

  function togglePinnedMenu(name) {
    clearCloseTimer();
    if (pinnedDropdown === name) {
      setPinnedDropdown(null);
      setOpenDropdown(null);
      return;
    }
    setPinnedDropdown(name);
    setOpenDropdown(name);
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setUser(json.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
      if (navRef.current && !navRef.current.contains(e.target)) {
        clearCloseTimer();
        setOpenDropdown(null);
        setPinnedDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pinnedDropdown]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    async function fetchNavData() {
      try {
        const [brandRes] = await Promise.all([
          fetch(`${API_BASE_URL}/brand`),
        ]);
        const brandJson = await brandRes.json();
        if (brandJson.success) setBrands(brandJson.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchNavData();
  }, []);

  useEffect(() => {
    async function fetchCartCount() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/card`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          const total = (json.data || []).reduce(
            (sum, item) => sum + (item.quantity || 1),
            0,
          );
          setCartCount(total);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchCartCount();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const initials = user ? getInitials(user.userName, user.email) : "..";
  const displayName = user?.userName ?? "—";
  const displayEmail = user?.email ?? "—";

  return (
    <header className="dash-header">
      {/* Left — Brand */}
      <div className="dash-header-left">
        <Link to="/dashboard" className="dash-brand">
          <img src={logo} alt="Dressify Logo" className="brand-logo" />
        </Link>
      </div>

      {/* Center Nav — desktop */}
      <nav className="dash-nav" ref={navRef}>
        <Link to="/dashboard" className="dash-nav-link">
          HomePage
        </Link>

        <div
          className="dash-nav-item"
          onMouseEnter={() => openMenu("brands")}
          onMouseLeave={() => scheduleClose("brands")}
        >
          <button
            type="button"
            className={`dash-nav-link dash-nav-trigger ${openDropdown === "brands" ? "active" : ""}`}
            onClick={() => togglePinnedMenu("brands")}
          >
            <span>Brands</span>
            <svg
              className={`dash-nav-chevron ${openDropdown === "brands" ? "open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {openDropdown === "brands" && (
            <div
              className="dash-dropdown"
              onMouseEnter={clearCloseTimer}
              onMouseLeave={() => scheduleClose("brands")}
            >
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/dashboard/${brand.brandSlug}`}
                  className="dash-dropdown-item"
                  onClick={() => {
                    setOpenDropdown(null);
                    setPinnedDropdown(null);
                  }}
                >
                  {brand.brandName}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/dashboard/events" className="dash-nav-link">
          Activities
        </Link>
      </nav>

      {/* Right */}
      <div className="dash-header-right">
        <Link to="/dashboard/favourite">
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
        </Link>

        <Link to="/dashboard/card">
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
            {cartCount > 0 && (
              <span className="dash-cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>
        </Link>

        {/* User Avatar */}
        <div className="dash-user-wrapper" ref={menuRef}>
          <button
            className={`dash-avatar ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Kullanıcı menüsü"
          >
            <span>{initials}</span>
          </button>

          {menuOpen && (
            <div className="dash-user-modal">
              <div className="dash-user-modal-top">
                <div className="dash-modal-avatar">{initials}</div>
                <div className="dash-modal-user-info">
                  <p className="dash-modal-name">{displayName}</p>
                  <p className="dash-modal-email">{displayEmail}</p>
                  {user?.userType && (
                    <span className="dash-modal-badge">
                      {user.userType === "standart_user"
                        ? "Standart"
                        : user.userType}
                    </span>
                  )}
                </div>
              </div>
              <div className="dash-modal-divider" />
              {user && (
                <div className="dash-modal-status-row">
                  <div className="dash-status-item">
                    <span
                      className={`dash-status-dot ${user.active ? "active" : "inactive"}`}
                    />
                    <span className="dash-status-label">
                      {user.active ? "Active" : "Passive"}
                    </span>
                  </div>
                  {user.lastLogin && (
                    <div className="dash-status-item">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span className="dash-status-label">
                        {new Date(user.lastLogin).toLocaleDateString("tr-TR", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              )}
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
                  Profile
                </Link>
                <Link
                  to="/dashboard/favourite"
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
                  My Favourites
                </Link>
                <Link
                  to="/dashboard/settings"
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
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Settings
                </Link>
              </nav>
              <div className="dash-modal-divider" />
              <button className="dash-modal-logout" onClick={handleLogout}>
                {" "}
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
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`dash-hamburger ${mobileNavOpen ? "dash-hamburger--open" : ""}`}
          onClick={() => setMobileNavOpen((v) => !v)}
          aria-label="Menü"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      <div
        className={`dash-mobile-nav ${mobileNavOpen ? "dash-mobile-nav--open" : ""}`}
      >
        <Link
          to="/dashboard"
          className="dash-mobile-link"
          onClick={() => setMobileNavOpen(false)}
        >
          Main Page
        </Link>

        {/* Markalar accordion */}
        <div className="dash-mobile-group">
          <button
            className="dash-mobile-trigger"
            onClick={() =>
              setMobileExpanded((v) => (v === "brands" ? null : "brands"))
            }
          >
            Brands
            <svg
              className={`dash-nav-chevron ${mobileExpanded === "brands" ? "open" : ""}`}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {mobileExpanded === "brands" && (
            <div className="dash-mobile-sub">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/dashboard/${brand.brandSlug}`}
                  className="dash-mobile-sub-link"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {brand.brandName}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link
          to="/dashboard/events"
          className="dash-mobile-link"
          onClick={() => setMobileNavOpen(false)}
        >
          My Activities
        </Link>
      </div>
    </header>
  );
}

export default DashboardHeader;
