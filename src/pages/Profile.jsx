import { useState, useEffect } from "react";
import DashboardHeader from "../components/Dashboard/dashboard-header/Header";
import DashboardFooter from "../components/Dashboard/dashboard-footer/Footer";
import { LoadSpinner } from "../components/Spinner/spinner.component";
import { showToast } from "../utils/toastrService";
import { API_BASE_URL } from "../../config";
import "../styles/Profile.css";

//  Helpers 
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

  //  Add Phone Modal 
function AddPhoneModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [newPhone, setNewPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (digits.startsWith("0")) return;
    setNewPhone(digits);
  }

  function formatPhone(digits) {
    if (!digits) return "";
    return [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 8),
      digits.slice(8, 10),
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  const fullPhone = `+90${newPhone}`;

  async function sendOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/send/send-otp-add`, {
        method: "POST",
        body: JSON.stringify({ newPhone: fullPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/verify/verify-otp-add`, {
        method: "POST",
        body: JSON.stringify({ newPhone: fullPhone, verifyCode: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(fullPhone);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Enter number", "Verify"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <p className="modal-eyebrow">Add Phone Number</p>

        <div className="modal-stepper">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`modal-step ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}
            >
              <div className="modal-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {error && <p className="modal-error">{error}</p>}

        {step === 1 && (
          <div className="modal-body">
            <p className="modal-hint">Enter the phone number you want to add.</p>
            <div className="form-group">
              <label>Phone Number</label>
              <div className="fp-phone-wrapper">
                <span className="fp-phone-prefix">+90</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="5__ ___ __ __"
                  value={formatPhone(newPhone)}
                  onChange={handlePhoneChange}
                  className="fp-phone-input"
                  maxLength={13}
                />
              </div>
            </div>
            <button
              className="save-btn"
              onClick={sendOtp}
              disabled={loading || newPhone.length !== 10}
            >
              Send Code
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="modal-body">
            <p className="modal-hint">
              A verification code was sent to <strong>{fullPhone}</strong>.
            </p>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              className="save-btn"
              onClick={verifyOtp}
              disabled={loading || otp.length !== 6}
            >
              Add Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

//  Email Change Modal 
function EmailChangeModal({ currentEmail, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [emailChangeToken, setEmailChangeToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendOtpToCurrent() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/gmailOtp/send`, {
        method: "POST",
        body: JSON.stringify({ email: currentEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCurrentOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/gmailOtp/profile-verify`, {
        method: "POST",
        body: JSON.stringify({ email: currentEmail, verifyCode: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setEmailChangeToken(data.emailChangeToken || data.resetToken);
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendOtpToNew() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/gmailOtp/send-new-email`, {
        method: "POST",
        body: JSON.stringify({ emailChangeToken, newEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyNewOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/gmailOtp/verify-new-email`, {
        method: "POST",
        body: JSON.stringify({
          emailChangeToken,
          newEmail,
          verifyCode: newOtp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(newEmail);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Send", "Verify", "New email", "Confirm"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow">Change Email</p>
        <div className="modal-stepper">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`modal-step ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}
            >
              <div className="modal-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        {error && <p className="modal-error">{error}</p>}
        {step === 1 && (
          <div className="modal-body">
            <p className="modal-hint">
              A verification code will be sent to your current email (
              <strong>{currentEmail}</strong>).
            </p>
            <button
              className="save-btn"
              onClick={sendOtpToCurrent}
              disabled={loading}
            >
              Send Code
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="modal-body">
            <p className="modal-hint">
              <strong>{currentEmail}</strong> — code sent.
            </p>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              className="save-btn"
              onClick={verifyCurrentOtp}
              disabled={loading || otp.length !== 6}
            >
              Verify
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="modal-body">
            <p className="modal-hint">Enter your new email address.</p>
            <div className="form-group">
              <label>New Email</label>
              <input
                type="email"
                placeholder="new@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <button
              className="save-btn"
              onClick={sendOtpToNew}
              disabled={loading || !newEmail.includes("@")}
            >
              Send Code
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="modal-body">
            <p className="modal-hint">
              <strong>{newEmail}</strong> — code sent.
            </p>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={newOtp}
                onChange={(e) =>
                  setNewOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              className="save-btn"
              onClick={verifyNewOtp}
              disabled={loading || newOtp.length !== 6}
            >
              Update Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

//  Phone Change Modal 
function PhoneChangeModal({ currentPhone, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newOtp, setNewOtp] = useState("");
  const [phoneChangeToken, setPhoneChangeToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleNewPhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (digits.startsWith("0")) return;
    setNewPhone(digits);
  }
  function formatPhone(digits) {
    if (!digits) return "";
    return [
      digits.slice(0, 3),
      digits.slice(3, 6),
      digits.slice(6, 8),
      digits.slice(8, 10),
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }
  const fullNewPhone = `+90${newPhone}`;

  async function sendOtpToCurrent() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/send`, {
        method: "POST",
        body: JSON.stringify({ phoneNumber: currentPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyCurrentOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/profile-verify`, {
        method: "POST",
        body: JSON.stringify({ phoneNumber: currentPhone, verifyCode: otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPhoneChangeToken(data.phoneChangeToken);
      setStep(3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendOtpToNew() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/send-new-phone`, {
        method: "POST",
        body: JSON.stringify({ phoneChangeToken, newPhone: fullNewPhone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(4);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyNewOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch(`${API_BASE_URL}/phoneOtp/verify-new-phone`, {
        method: "POST",
        body: JSON.stringify({
          phoneChangeToken,
          newPhone: fullNewPhone,
          verifyCode: newOtp,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      onSuccess(fullNewPhone);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const stepLabels = ["Send", "Verify", "New number", "Confirm"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow">Change Phone</p>
        <div className="modal-stepper">
          {stepLabels.map((label, i) => (
            <div
              key={i}
              className={`modal-step ${step > i ? "done" : ""} ${step === i + 1 ? "active" : ""}`}
            >
              <div className="modal-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>
        {error && <p className="modal-error">{error}</p>}
        {step === 1 && (
          <div className="modal-body">
            <p className="modal-hint">
              A verification code will be sent to your current number (
              <strong>{currentPhone}</strong>).
            </p>
            <button
              className="save-btn"
              onClick={sendOtpToCurrent}
              disabled={loading}
            >
              Send Code
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="modal-body">
            <p className="modal-hint">
              <strong>{currentPhone}</strong> — code sent.
            </p>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              className="save-btn"
              onClick={verifyCurrentOtp}
              disabled={loading || otp.length !== 6}
            >
              Verify
            </button>
          </div>
        )}
        {step === 3 && (
          <div className="modal-body">
            <p className="modal-hint">Enter your new phone number.</p>
            <div className="form-group">
              <label>New Number</label>
              <div className="fp-phone-wrapper">
                <span className="fp-phone-prefix">+90</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="5__ ___ __ __"
                  value={formatPhone(newPhone)}
                  onChange={handleNewPhoneChange}
                  className="fp-phone-input"
                  maxLength={13}
                />
              </div>
            </div>
            <button
              className="save-btn"
              onClick={sendOtpToNew}
              disabled={loading || newPhone.length !== 10}
            >
              Send Code
            </button>
          </div>
        )}
        {step === 4 && (
          <div className="modal-body">
            <p className="modal-hint">
              <strong>{fullNewPhone}</strong> — code sent.
            </p>
            <div className="form-group">
              <label>Verification Code</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                maxLength={6}
                value={newOtp}
                onChange={(e) =>
                  setNewOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />
            </div>
            <button
              className="save-btn"
              onClick={verifyNewOtp}
              disabled={loading || newOtp.length !== 6}
            >
              Update Number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}



//  Delete Confirm Modal 
function DeleteModal({ onClose, onConfirm, loading }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {loading && <LoadSpinner />}
      <div
        className="modal-box modal-box--danger"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
        <p className="modal-eyebrow modal-eyebrow--danger">Danger Zone</p>
        <p className="modal-hint">
          Deleting your account is <strong>irreversible</strong>. All your data
          will be permanently removed. Are you sure you want to continue?
        </p>
        <div className="modal-actions">
          <button
            className="save-btn save-btn--ghost"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="save-btn save-btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

//  Main ProfilePage 
function ProfilePage() {
  const [user, setUser] = useState(null);
  const [personalForm, setPersonalForm] = useState({
    userName: "",
    gender: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPw: "",
    confirm: "",
  });
  const [pwStrength, setPwStrength] = useState({ score: 0, label: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showAddPhoneModal, setShowAddPhoneModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isLoading = Object.values(loading).some(Boolean);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await authFetch(`${API_BASE_URL}/user/me`);
        const json = await res.json();
        if (json.success) {
          setUser(json.data);
          setPersonalForm({
            userName: json.data.userName || "",
            gender: json.data.gender || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }
    fetchUser();
  }, []);

  function setErr(key, msg) {
    setErrors((prev) => ({ ...prev, [key]: msg }));
  }
  function setLoad(key, val) {
    setLoading((prev) => ({ ...prev, [key]: val }));
  }

  function checkPwStrength(val) {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const labels = ["", "Very weak", "Weak", "Medium", "Strong"];
    setPwStrength({ score, label: val ? labels[score] || "Very weak" : "" });
  }

  function getInitials() {
    if (user?.userName?.length >= 2)
      return user.userName.slice(0, 2).toUpperCase();
    if (user?.email) return user.email.slice(0, 2).toUpperCase();
    return "..";
  }

  function formatDate(dateStr, withTime = false) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
    });
  }

  async function handlePersonalSave() {
    setErr("personal", "");
    setLoad("personal", true);
    try {
      const res = await authFetch(`${API_BASE_URL}/user/change-personal-info`, {
        method: "PATCH",
        body: JSON.stringify({
          newUserName: personalForm.userName,
          newGender: personalForm.gender,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser((prev) => ({
        ...prev,
        userName: personalForm.userName,
        gender: personalForm.gender,
      }));
      showToast("Personal information updated.", "success", 2000);
    } catch (e) {
      setErr("personal", e.message);
    } finally {
      setLoad("personal", false);
    }
  }

  async function handlePasswordSave() {
    setErr("password", "");
    if (passwordForm.newPw !== passwordForm.confirm) {
      setErr("password", "Passwords do not match.");
      return;
    }
    setLoad("password", true);
    try {
      const res = await authFetch(`${API_BASE_URL}/user/change-password`, {
        method: "PATCH",
        body: JSON.stringify({
          oldPassword: passwordForm.current,
          newPassword: passwordForm.newPw,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setPasswordForm({ current: "", newPw: "", confirm: "" });
      setPwStrength({ score: 0, label: "" });
      showToast("Password changed successfully.", "success", 2000);
    } catch (e) {
      setErr("password", e.message);
    } finally {
      setLoad("password", false);
    }
  }

  async function handleDeleteAccount() {
    setLoad("delete", true);
    try {
      const res = await authFetch(`${API_BASE_URL}/user/me`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (e) {
      setErr("delete", e.message);
      setLoad("delete", false);
    }
  }

  const strengthClass =
    ["", "weak", "weak", "medium", "strong"][pwStrength.score] || "";

  return (
    <>
      {/* Global spinner */}
      {isLoading && <LoadSpinner />}

      {showEmailModal && (
        <EmailChangeModal
          currentEmail={user?.email}
          onClose={() => setShowEmailModal(false)}
          onSuccess={(newEmail) => {
            setUser((prev) => ({ ...prev, email: newEmail }));
            setShowEmailModal(false);
            showToast("Email updated successfully.", "success", 2000);
          }}
        />
      )}

      {showPhoneModal && (
        <PhoneChangeModal
          currentPhone={user?.phone}
          onClose={() => setShowPhoneModal(false)}
          onSuccess={(newPhone) => {
            setUser((prev) => ({ ...prev, phone: newPhone }));
            setShowPhoneModal(false);
            showToast("Phone number updated.", "success", 2000);
          }}
        />
      )}

      {showAddPhoneModal && (
        <AddPhoneModal
          onClose={() => setShowAddPhoneModal(false)}
          onSuccess={(newPhone) => {
            setUser((prev) => ({ ...prev, phone: newPhone }));
            setShowAddPhoneModal(false);
            showToast("Phone number added successfully.", "success", 2000);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          loading={loading.delete}
        />
      )}

      <DashboardHeader />

      <main className="profile-page">
        <div className="profile-wrap">
          <div className="profile-grid">
            {/* Sidebar */}
            <aside className="profile-sidebar">
              <div className="profile-avatar">{getInitials()}</div>
              <p className="profile-display-name">{user?.userName ?? "—"}</p>
              <p className="profile-display-email">{user?.email ?? "—"}</p>
              <span className="profile-badge">
                {user?.userType === "standart_user"
                  ? "Standard"
                  : (user?.userType ?? "—")}
              </span>
              <div className="profile-divider" />
              <ul className="profile-stats">
                <li className="stat-row">
                  <span className="stat-label">Status</span>
                  <span className="stat-value">
                    <span
                      className={`status-dot ${user?.active ? "active" : "inactive"}`}
                    />
                    {user?.active ? "Active" : "Inactive"}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Role</span>
                  <span className="role-pill">{user?.role ?? "—"}</span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Gender</span>
                  <span className="stat-value">
                    {user?.gender === "male"
                      ? "Male"
                      : user?.gender === "female"
                        ? "Female"
                        : "—"}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Last login</span>
                  <span className="stat-value">
                    {formatDate(user?.lastLogin, true)}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">First login</span>
                  <span className="stat-value">
                    {formatDate(user?.firstLogin, true)}
                  </span>
                </li>
                <li className="stat-row">
                  <span className="stat-label">Registered</span>
                  <span className="stat-value">
                    {formatDate(user?.createdAt)}
                  </span>
                </li>
              </ul>
            </aside>

            {/* Main content */}
            <div className="profile-main">
              {/* Personal Info */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
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
                    Personal Info
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={personalForm.userName}
                      onChange={(e) =>
                        setPersonalForm((p) => ({
                          ...p,
                          userName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={personalForm.gender}
                      onChange={(e) =>
                        setPersonalForm((p) => ({
                          ...p,
                          gender: e.target.value,
                        }))
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                {errors.personal && (
                  <p className="form-error">{errors.personal}</p>
                )}
                <button
                  className="save-btn"
                  onClick={handlePersonalSave}
                  disabled={loading.personal}
                >
                  {loading.personal ? "Saving..." : "Save"}
                </button>
              </div>

              {/* Email Address */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Email Address
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current email</label>
                    <input type="email" value={user?.email ?? ""} readOnly />
                  </div>
                </div>
                <button
                  className="save-btn"
                  onClick={() => setShowEmailModal(true)}
                >
                  Change Email
                </button>
              </div>

              {/* Phone Number */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.79 16l.13.92z" />
                    </svg>
                    Phone Number
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Current number</label>
                    <input type="tel" value={user?.phone ?? ""} readOnly />
                  </div>
                </div>
                <button
                  className="save-btn"
                  onClick={() =>
                    user?.phone
                      ? setShowPhoneModal(true)
                      : setShowAddPhoneModal(true)
                  }
                >
                  {user?.phone ? "Change Phone" : "Add Phone"}
                </button>
              </div>

              {/* Change Password */}
              <div className="profile-card">
                <div className="card-header">
                  <span className="card-title">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Change Password
                  </span>
                  <div className="gold-line" />
                </div>
                <div className="form-row">
                  <div className="form-group form-full">
                    <label>Current password</label>
                    <input
                      type="password"
                      placeholder="Enter your current password"
                      value={passwordForm.current}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          current: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>New password</label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={passwordForm.newPw}
                      onChange={(e) => {
                        setPasswordForm((p) => ({
                          ...p,
                          newPw: e.target.value,
                        }));
                        checkPwStrength(e.target.value);
                      }}
                    />
                    <div className="pw-strength">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`pw-bar ${i <= pwStrength.score ? strengthClass : ""}`}
                        />
                      ))}
                    </div>
                    {pwStrength.label && (
                      <span className={`pw-hint pw-hint--${strengthClass}`}>
                        {pwStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Confirm password</label>
                    <input
                      type="password"
                      placeholder="Confirm your new password"
                      value={passwordForm.confirm}
                      onChange={(e) =>
                        setPasswordForm((p) => ({
                          ...p,
                          confirm: e.target.value,
                        }))
                      }
                    />
                    {passwordForm.confirm &&
                      passwordForm.newPw !== passwordForm.confirm && (
                        <span className="pw-hint pw-hint--weak">
                          Passwords do not match
                        </span>
                      )}
                  </div>
                </div>
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
                <button
                  className="save-btn"
                  onClick={handlePasswordSave}
                  disabled={loading.password}
                >
                  {loading.password ? "Updating..." : "Update Password"}
                </button>
              </div>

              {/* Danger Zone */}
              <div className="profile-card profile-card--danger">
                <div className="card-header">
                  <span className="card-title card-title--danger">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Danger Zone
                  </span>
                </div>
                <p className="danger-info">
                  Deleting your account is irreversible. All your data will be
                  permanently removed.
                </p>
                {errors.delete && <p className="form-error">{errors.delete}</p>}
                <button
                  className="save-btn save-btn--danger"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </>
  );
}

export default ProfilePage;
