import { useState } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import "../styles/Settings.css";

/* Toggle Switch  */
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`stg-toggle ${checked ? "on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="stg-toggle-thumb" />
    </button>
  );
}

/* Section Wrapper  */
function Section({ title, description, children }) {
  return (
    <div className="stg-section">
      <div className="stg-section-head">
        <h2 className="stg-section-title">{title}</h2>
        {description && <p className="stg-section-desc">{description}</p>}
      </div>
      <div className="stg-section-body">{children}</div>
    </div>
  );
}

/* Row  */
function Row({ label, sublabel, children }) {
  return (
    <div className="stg-row">
      <div className="stg-row-text">
        <span className="stg-row-label">{label}</span>
        {sublabel && <span className="stg-row-sublabel">{sublabel}</span>}
      </div>
      <div className="stg-row-control">{children}</div>
    </div>
  );
}

/* Saved Card  */
function SavedCard({ last4, brand, expiry, onRemove }) {
  return (
    <div className="stg-card">
      <div className="stg-card-left">
        <div className="stg-card-icon">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        </div>
        <div>
          <p className="stg-card-brand">{brand}</p>
          <p className="stg-card-number">•••• •••• •••• {last4}</p>
          <p className="stg-card-expiry">Expiry: {expiry}</p>
        </div>
      </div>
      <button className="stg-card-remove" onClick={onRemove} type="button">
        Remove
      </button>
    </div>
  );
}

/* Address Card  */
function AddressCard({ title, address, onRemove }) {
  return (
    <div className="stg-card">
      <div className="stg-card-left">
        <div className="stg-card-icon">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <p className="stg-card-brand">{title}</p>
          <p className="stg-card-expiry" style={{ maxWidth: 260 }}>
            {address}
          </p>
        </div>
      </div>
      <button className="stg-card-remove" onClick={onRemove} type="button">
        Remove
      </button>
    </div>
  );
}

/* Nav items  */
const NAV_ITEMS = [
  {
    id: "notifications",
    label: "Notifications",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    id: "payment",
    label: "Payment Methods",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    id: "addresses",
    label: "Addresses",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: "privacy",
    label: "Privacy & Security",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

/* Main  */
function SettingsPage() {
  const [activeSection, setActiveSection] = useState("notifications");

  /* Notf */
  const [notif, setNotif] = useState({
    emailDiscount: true,
    emailOrder: true,
    emailNewProduct: false,
    smsDiscount: false,
    smsOrder: true,
    pushAll: true,
    pushFavorite: true,
  });

  /* Payment */
  const [cards, setCards] = useState([
    { id: 1, last4: "4242", brand: "Visa", expiry: "08/27" },
    { id: 2, last4: "1234", brand: "Mastercard", expiry: "03/26" },
  ]);

  /* Adress */
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: "Home",
      address: "Bornova Mah. Ataturk Cad. No:12 D:3, Bornova / Izmir",
    },
    {
      id: 2,
      title: "Work",
      address: "Alsancak Mah. Kibris Sehitleri Cad. No:48, Konak / Izmir",
    },
  ]);

  /* Privacy */
  const [privacy, setPrivacy] = useState({
    twoFactor: false,
    loginAlert: true,
    dataSharing: false,
    activityVisible: true,
  });

  /* Appearance */
  const [appearance, setAppearance] = useState({
    language: "en",
    currency: "USD",
    compactView: false,
  });

  /* Account */
  const [account, setAccount] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  function toggleNotif(key) {
    setNotif((p) => ({ ...p, [key]: !p[key] }));
  }

  function togglePrivacy(key) {
    setPrivacy((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <div className="stg-layout">
      <DashboardHeader />

      <main className="stg-main">
        {/* Page Hero  */}
        <div className="stg-hero">
          <p className="stg-hero-eyebrow">My Account</p>
          <h1 className="stg-hero-title">Settings</h1>
        </div>

        <div className="stg-body">
          {/* Sidebar  */}
          <aside className="stg-sidebar">
            <nav className="stg-nav">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`stg-nav-item ${activeSection === item.id ? "active" : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <span className="stg-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Content  */}
          <div className="stg-content">
            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <>
                <Section
                  title="Email Notifications"
                  description="Choose which topics you want to receive emails about."
                >
                  <Row
                    label="New Products"
                    sublabel="New collections from your favorite brands"
                  >
                    <Toggle
                      checked={notif.emailNewProduct}
                      onChange={() => toggleNotif("emailNewProduct")}
                    />
                  </Row>

                  <Row
                    label="Discounts and Campaigns"
                    sublabel="Instant promotional messages"
                  >
                    <Toggle
                      checked={notif.emailDiscount}
                      onChange={() => toggleNotif("emailDiscount")}
                    />
                  </Row>
                </Section>

                <Section
                  title="SMS Notifications"
                  description="Notifications that will be sent to your phone number."
                >
                  <Row
                    label="Discounts and Campaigns"
                    sublabel="Instant promotional messages"
                  >
                    <Toggle
                      checked={notif.smsDiscount}
                      onChange={() => toggleNotif("smsDiscount")}
                    />
                  </Row>

                  <Row
                    label="Order Status"
                    sublabel="Updates about your shipping and delivery"
                  >
                    <Toggle
                      checked={notif.smsOrder}
                      onChange={() => toggleNotif("smsOrder")}
                    />
                  </Row>
                </Section>

                <Section
                  title="App Notifications"
                  description="Browser and mobile push notifications."
                >
                  <Row
                    label="All Notifications"
                    sublabel="General application notifications"
                  >
                    <Toggle
                      checked={notif.pushAll}
                      onChange={() => toggleNotif("pushAll")}
                    />
                  </Row>
                  <Row
                    label="Favorite Product Price Drop"
                    sublabel="When items in your wishlist go on sale"
                  >
                    <Toggle
                      checked={notif.pushFavorite}
                      onChange={() => toggleNotif("pushFavorite")}
                    />
                  </Row>
                </Section>
              </>
            )}

            {/* PAYMENT */}
            {activeSection === "payment" && (
              <>
                <Section
                  title="Saved Cards"
                  description="Manage your cards for faster checkout."
                >
                  <div className="stg-card-list">
                    {cards.length === 0 && (
                      <p className="stg-empty-note">No saved cards found.</p>
                    )}
                    {cards.map((card) => (
                      <SavedCard
                        key={card.id}
                        {...card}
                        onRemove={() =>
                          setCards((p) => p.filter((c) => c.id !== card.id))
                        }
                      />
                    ))}
                  </div>
                  <button className="stg-add-btn" type="button">
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add New Card
                  </button>
                </Section>
              </>
            )}

            {/* ADDRESSES */}
            {activeSection === "addresses" && (
              <Section
                title="My Addresses"
                description="Add and manage your delivery addresses."
              >
                <div className="stg-card-list">
                  {addresses.length === 0 && (
                    <p className="stg-empty-note">No saved addresses found.</p>
                  )}
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      {...addr}
                      onRemove={() =>
                        setAddresses((p) => p.filter((a) => a.id !== addr.id))
                      }
                    />
                  ))}
                </div>
                <button className="stg-add-btn" type="button">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add New Address
                </button>
              </Section>
            )}

            {/* PRIVACY */}
            {activeSection === "privacy" && (
              <>
                <Section
                  title="Security"
                  description="Enhance your account security."
                >
                  <Row
                    label="Two-Factor Authentication"
                    sublabel="Verification code via SMS when logging in"
                  >
                    <Toggle
                      checked={privacy.twoFactor}
                      onChange={() => togglePrivacy("twoFactor")}
                    />
                  </Row>

                  <Row
                    label="Login Alerts"
                    sublabel="Receive an email when a new login is detected"
                  >
                    <Toggle
                      checked={privacy.loginAlert}
                      onChange={() => togglePrivacy("loginAlert")}
                    />
                  </Row>
                </Section>

                <Section title="Danger Zone">
                  <div className="stg-danger-zone">
                    <div>
                      <p className="stg-danger-label">Delete Account</p>
                      <p className="stg-danger-sub">
                        All your data will be permanently deleted; this action
                        cannot be undone.
                      </p>
                    </div>
                    <button className="stg-danger-btn" type="button">
                      Delete Account
                    </button>
                  </div>
                </Section>
              </>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <>
                <Section
                  title="Language & Currency"
                  description="Select your preferred language and currency."
                >
                  <Row label="Language" sublabel="Choose interface language">
                    <select
                      className="stg-select"
                      value={appearance.language}
                      onChange={(e) =>
                        setAppearance((p) => ({
                          ...p,
                          language: e.target.value,
                        }))
                      }
                    >
                      <option value="tr">Turkish</option>
                      <option value="en">English</option>
                      <option value="de">German</option>
                    </select>
                  </Row>
                  <Row
                    label="Currency"
                    sublabel="Currency for displaying prices"
                  >
                    <select
                      className="stg-select"
                      value={appearance.currency}
                      onChange={(e) =>
                        setAppearance((p) => ({
                          ...p,
                          currency: e.target.value,
                        }))
                      }
                    >
                      <option value="TRY">₺ Lira</option>
                      <option value="USD">$ Dollar</option>
                      <option value="EUR">€ Euro</option>
                    </select>
                  </Row>
                </Section>

                <Section
                  title="Viewing Preferences"
                  description="Customize the product list view."
                >
                  <Row
                    label="Compact View"
                    sublabel="Show smaller product cards"
                  >
                    <Toggle
                      checked={appearance.compactView}
                      onChange={(v) =>
                        setAppearance((p) => ({ ...p, compactView: v }))
                      }
                    />
                  </Row>
                </Section>
              </>
            )}

            {/* ACCOUNT */}
            {activeSection === "account" && (
              <>
                <Section
                  title="Change Password"
                  description="Regularly update your password for your security."
                >
                  <div className="stg-form">
                    <div className="stg-field">
                      <label className="stg-label">Current Password</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.currentPassword}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            currentPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="stg-field">
                      <label className="stg-label">New Password</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.newPassword}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            newPassword: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="stg-field">
                      <label className="stg-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="stg-input"
                        placeholder="••••••••"
                        value={account.newPasswordConfirm}
                        onChange={(e) =>
                          setAccount((p) => ({
                            ...p,
                            newPasswordConfirm: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <button className="stg-save-btn" type="button">
                      Update Password
                    </button>
                  </div>
                </Section>
              </>
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default SettingsPage;
