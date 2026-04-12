import { useState, useEffect, useCallback } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { LoadSpinner } from "../components/Spinner/spinner.component";
import { showToast } from "../utils/toastrService";
import { API_BASE_URL } from "../../config";
import "../styles/Settings.css";

const getToken = () => localStorage.getItem("token");
const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

/*  Toggle  */
function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`stg-toggle ${checked ? "on" : ""} ${disabled ? "disabled" : ""}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className="stg-toggle-thumb" />
    </button>
  );
}

/*  Section  */
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

/*  Row  */
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

/*  Saved Card  */
function SavedCard({
  id,
  cardName,
  cardNumber,
  cardExpireDate,
  cardCVV,
  onRemove,
  removing,
}) {
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
          <p className="stg-card-brand">{cardName}</p>
          <p className="stg-card-number">
            •••• •••• •••• {cardNumber?.slice(-4)}
          </p>
          <p className="stg-card-expiry">Expiry: {cardExpireDate}</p>
        </div>
      </div>
      <button
        className="stg-card-remove"
        onClick={onRemove}
        disabled={removing}
        type="button"
      >
        {removing ? "..." : "Remove"}
      </button>
    </div>
  );
}

/*  Add Card Modal  */
function AddCardModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExpireDate: "",
    cardCVV: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function formatCardNumber(val) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  }

  async function handleSubmit() {
    const rawNumber = form.cardNumber.replace(/\s/g, "");
    if (!form.cardName.trim()) return setError("Cardholder name is required.");
    if (rawNumber.length !== 16)
      return setError("Card number must be 16 digits.");
    if (form.cardExpireDate.length !== 5)
      return setError("Enter a valid expiry (MM/YY).");
    if (form.cardCVV.length < 3)
      return setError("CVV must be at least 3 digits.");

    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/payment`, {
        method: "POST",
        body: JSON.stringify({
          cardName: form.cardName,
          cardNumber: rawNumber,
          cardExpireDate: form.cardExpireDate,
          cardCVV: form.cardCVV,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(data.data ?? data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow">Add New Card</p>
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-body">
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={form.cardName}
              onChange={(e) =>
                setForm((p) => ({ ...p, cardName: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={form.cardNumber}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  cardNumber: formatCardNumber(e.target.value),
                }))
              }
            />
          </div>
          <div className="form-row" style={{ gap: "12px" }}>
            <div className="form-group">
              <label>Expiry</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="MM/YY"
                value={form.cardExpireDate}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    cardExpireDate: formatExpiry(e.target.value),
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="•••"
                maxLength={4}
                value={form.cardCVV}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    cardCVV: e.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
              />
            </div>
          </div>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

/*  Address Card  */
function AddressCard({
  id,
  addressName,
  province,
  district,
  neighbour,
  apartment,
  floor,
  flat,
  onRemove,
  onEdit,
  removing,
}) {
  const fullAddress = `${neighbour}, ${apartment} Apt. Floor ${floor} Flat ${flat}, ${district} / ${province}`;

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
          <p className="stg-card-brand">{addressName}</p>
          <p className="stg-card-expiry" style={{ maxWidth: 260 }}>
            {fullAddress}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button className="stg-card-edit" onClick={onEdit} type="button">
          Edit
        </button>
        <button
          className="stg-card-remove"
          onClick={onRemove}
          disabled={removing}
          type="button"
        >
          {removing ? "..." : "Remove"}
        </button>
      </div>
    </div>
  );
}

/*  Add Address Modal  */
function AddAddressModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    addressName: "",
    province: "",
    district: "",
    neighbour: "",
    apartment: "",
    floor: "",
    flat: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const empty = Object.entries(form).find(([, v]) => !v.trim());
    if (empty) return setError(`${empty[0]} is required.`);

    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/address`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(data.data ?? data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function field(key, label, placeholder) {
    return (
      <div className="form-group">
        <label>{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        />
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow">Add New Address</p>
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-body">
          {field("addressName", "Address Title", "e.g. Home, Work")}
          <div className="form-row" style={{ gap: "12px" }}>
            {field("province", "Province", "e.g. Istanbul")}
            {field("district", "District", "e.g. Kadikoy")}
          </div>
          {field("neighbour", "Neighbourhood", "e.g. Moda Mah.")}
          <div className="form-row" style={{ gap: "12px" }}>
            {field("apartment", "Apartment", "Apartment name/no")}
            {field("floor", "Floor", "e.g. 3")}
            {field("flat", "Flat No", "e.g. 12")}
          </div>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            Add Address
          </button>
        </div>
      </div>
    </div>
  );
}

/*  Edit Address Modal  */
function EditAddressModal({ address, onClose, onSuccess }) {
  const [form, setForm] = useState({
    addressName: address.addressName ?? "",
    province: address.province ?? "",
    district: address.district ?? "",
    neighbour: address.neighbour ?? "",
    apartment: address.apartment ?? "",
    floor: address.floor ?? "",
    flat: address.flat ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    const empty = Object.entries(form).find(([, v]) => !v.trim());
    if (empty) return setError(`${empty[0]} is required.`);

    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/address/${address.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess({ ...address, ...form });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function field(key, label, placeholder) {
    return (
      <div className="form-group">
        <label>{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        />
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow">Edit Address</p>
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-body">
          {field("addressName", "Address Title", "e.g. Home, Work")}
          <div className="form-row" style={{ gap: "12px" }}>
            {field("province", "Province", "e.g. Istanbul")}
            {field("district", "District", "e.g. Kadikoy")}
          </div>
          {field("neighbour", "Neighbourhood", "e.g. Moda Mah.")}
          <div className="form-row" style={{ gap: "12px" }}>
            {field("apartment", "Apartment", "Apartment name/no")}
            {field("floor", "Floor", "e.g. 3")}
            {field("flat", "Flat No", "e.g. 12")}
          </div>
          <button
            className="save-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/*  Nav items  */
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
];

/*  Main  */
function SettingsPage() {
  const [activeSection, setActiveSection] = useState("notifications");
  const [globalLoading, setGlobalLoading] = useState(false);

  /* Permission state */
  const [permission, setPermission] = useState(null);
  const [permLoading, setPermLoading] = useState(false);

  /* Payment state */
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [removingCard, setRemovingCard] = useState(null);
  const [showAddCard, setShowAddCard] = useState(false);

  /* Address state */
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [removingAddress, setRemovingAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  /*  Fetch permission  */
  useEffect(() => {
    async function fetchPermission() {
      setPermLoading(true);
      try {
        const res = await authFetch(`${API_BASE_URL}/permission`);
        const data = await res.json();
        if (data.success) setPermission(data.data ?? data.permission ?? data);
      } catch (e) {
        showToast("Failed to load permission settings.", "error", 2000);
      } finally {
        setPermLoading(false);
      }
    }
    fetchPermission();
  }, []);

  /*  Fetch payments  */
  useEffect(() => {
    if (activeSection !== "payment") return;
    async function fetchCards() {
      setCardsLoading(true);
      try {
        const res = await authFetch(`${API_BASE_URL}/payment`);
        const data = await res.json();
        if (data.success) setCards(data.data ?? []);
      } catch {
        showToast("Failed to load payment methods.", "error", 2000);
      } finally {
        setCardsLoading(false);
      }
    }
    fetchCards();
  }, [activeSection]);

  /*  Fetch addresses  */
  useEffect(() => {
    if (activeSection !== "addresses") return;
    async function fetchAddresses() {
      setAddressesLoading(true);
      try {
        const res = await authFetch(`${API_BASE_URL}/address`);
        const data = await res.json();
        if (data.success) setAddresses(data.data ?? []);
      } catch {
        showToast("Failed to load addresses.", "error", 2000);
      } finally {
        setAddressesLoading(false);
      }
    }
    fetchAddresses();
  }, [activeSection]);

  /*  Toggle permission & immediately PATCH  */
  const handlePermissionToggle = useCallback(
    async (key) => {
      if (!permission) return;
      const newVal = !permission[key];
      const optimistic = { ...permission, [key]: newVal };
      setPermission(optimistic);

      try {
        const res = await authFetch(`${API_BASE_URL}/permission`, {
          method: "PATCH",
          body: JSON.stringify({ [key]: newVal }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        showToast("Settings updated.", "success", 1500);
      } catch (e) {
        // Rollback
        setPermission((prev) => ({ ...prev, [key]: !newVal }));
        showToast(e.message || "Failed to update settings.", "error", 2000);
      }
    },
    [permission],
  );

  /*  Remove card  */
  async function handleRemoveCard(id) {
    setRemovingCard(id);
    try {
      const res = await authFetch(`${API_BASE_URL}/payment/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setCards((prev) => prev.filter((c) => c.id !== id));
      showToast("Card removed.", "success", 1500);
    } catch (e) {
      showToast(e.message || "Failed to remove card.", "error", 2000);
    } finally {
      setRemovingCard(null);
    }
  }

  /*  Remove address  */
  async function handleRemoveAddress(id) {
    setRemovingAddress(id);
    try {
      const res = await authFetch(`${API_BASE_URL}/address/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast("Address removed.", "success", 1500);
    } catch (e) {
      showToast(e.message || "Failed to remove address.", "error", 2000);
    } finally {
      setRemovingAddress(null);
    }
  }

  const isLoading =
    globalLoading || permLoading || cardsLoading || addressesLoading;

  return (
    <div className="stg-layout">
      {isLoading && <LoadSpinner />}

      {showAddCard && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onSuccess={(card) => {
            setCards((prev) => [...prev, card]);
            setShowAddCard(false);
            showToast("Card added successfully.", "success", 2000);
          }}
        />
      )}

      {showAddAddress && (
        <AddAddressModal
          onClose={() => setShowAddAddress(false)}
          onSuccess={(addr) => {
            setAddresses((prev) => [...prev, addr]);
            setShowAddAddress(false);
            showToast("Address added successfully.", "success", 2000);
          }}
        />
      )}

      {editingAddress && (
        <EditAddressModal
          address={editingAddress}
          onClose={() => setEditingAddress(null)}
          onSuccess={(updated) => {
            setAddresses((prev) =>
              prev.map((a) => (a.id === updated.id ? updated : a)),
            );
            setEditingAddress(null);
            showToast("Address updated successfully.", "success", 2000);
          }}
        />
      )}

      <DashboardHeader />

      <main className="stg-main">
        <div className="stg-hero">
          <p className="stg-hero-eyebrow">My Account</p>
          <h1 className="stg-hero-title">Settings</h1>
        </div>

        <div className="stg-body">
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
                      checked={permission?.emailNotifyForNewProduct ?? false}
                      onChange={() =>
                        handlePermissionToggle("emailNotifyForNewProduct")
                      }
                      disabled={permLoading}
                    />
                  </Row>
                  <Row
                    label="Discounts and Campaigns"
                    sublabel="Instant promotional messages"
                  >
                    <Toggle
                      checked={permission?.emailNotifyForDiscount ?? false}
                      onChange={() =>
                        handlePermissionToggle("emailNotifyForDiscount")
                      }
                      disabled={permLoading}
                    />
                  </Row>
                </Section>

                <Section
                  title="SMS Notifications"
                  description="Notifications that will be sent to your phone number."
                >
                  <Row
                    label="New Products"
                    sublabel="New collections from your favorite brands"
                  >
                    <Toggle
                      checked={permission?.smsNotifyForNewProduct ?? false}
                      onChange={() =>
                        handlePermissionToggle("smsNotifyForNewProduct")
                      }
                      disabled={permLoading}
                    />
                  </Row>
                  <Row
                    label="Discounts and Campaigns"
                    sublabel="Instant promotional messages"
                  >
                    <Toggle
                      checked={permission?.smsNotifyForDiscount ?? false}
                      onChange={() =>
                        handlePermissionToggle("smsNotifyForDiscount")
                      }
                      disabled={permLoading}
                    />
                  </Row>
                </Section>
              </>
            )}

            {/* PAYMENT */}
            {activeSection === "payment" && (
              <Section
                title="Saved Cards"
                description="Manage your cards for faster checkout."
              >
                <div className="stg-card-list">
                  {cardsLoading && <p className="stg-empty-note">Loading...</p>}
                  {!cardsLoading && cards.length === 0 && (
                    <p className="stg-empty-note">No saved cards found.</p>
                  )}
                  {cards.map((card) => (
                    <SavedCard
                      key={card.id}
                      {...card}
                      removing={removingCard === card.id}
                      onRemove={() => handleRemoveCard(card.id)}
                    />
                  ))}
                </div>
                <button
                  className="stg-add-btn"
                  type="button"
                  onClick={() => setShowAddCard(true)}
                >
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
            )}

            {/* ADDRESSES */}
            {activeSection === "addresses" && (
              <Section
                title="My Addresses"
                description="Add and manage your delivery addresses."
              >
                <div className="stg-card-list">
                  {addressesLoading && (
                    <p className="stg-empty-note">Loading...</p>
                  )}
                  {!addressesLoading && addresses.length === 0 && (
                    <p className="stg-empty-note">No saved addresses found.</p>
                  )}
                  {addresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      {...addr}
                      removing={removingAddress === addr.id}
                      onRemove={() => handleRemoveAddress(addr.id)}
                      onEdit={() => setEditingAddress(addr)}
                    />
                  ))}
                </div>
                <button
                  className="stg-add-btn"
                  type="button"
                  onClick={() => setShowAddAddress(true)}
                >
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

            {/* PRIVACY & SECURITY */}
            {activeSection === "privacy" && (
              <Section
                title="Security"
                description="Enhance your account security."
              >
                <Row
                  label="SMS Two-Factor Authentication"
                  sublabel="Verification code via SMS when logging in"
                >
                  <Toggle
                    checked={permission?.smsTwoFA ?? false}
                    onChange={() => handlePermissionToggle("smsTwoFA")}
                    disabled={permLoading}
                  />
                </Row>
                <Row
                  label="Email Two-Factor Authentication"
                  sublabel="Verification code via email when logging in"
                >
                  <Toggle
                    checked={permission?.emailToFA ?? false}
                    onChange={() => handlePermissionToggle("emailToFA")}
                    disabled={permLoading}
                  />
                </Row>
                <Row
                  label="New Login Alerts"
                  sublabel="Receive an email when a new login is detected"
                >
                  <Toggle
                    checked={permission?.newLoginWarning ?? false}
                    onChange={() => handlePermissionToggle("newLoginWarning")}
                    disabled={permLoading}
                  />
                </Row>
              </Section>
            )}
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}

export default SettingsPage;
