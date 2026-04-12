import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import logo from "../assets/dressify-logo.png";
import "../styles/Auth.css";
import "../styles/ForgotPassword.css";
import { LoadSpinner } from "../components/Spinner/spinner.component";
import { showToast } from "../utils/toastrService";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";

const STEPS = { METHOD: 1, VERIFY: 2, RESET: 3 };

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(STEPS.METHOD);
  const [method, setMethod] = useState(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordError = useMemo(() => {
    if (!password) return null;
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password))
      return "Must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Must contain at least one lowercase letter.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Must contain at least one special character.";
    return null;
  }, [password]);

  const sendUrl =
    method === "email"
      ? `${API_BASE_URL}/gmailOtp/send`
      : `${API_BASE_URL}/phoneOtp/send`;
  const verifyUrl =
    method === "email"
      ? `${API_BASE_URL}/gmailOtp/verify`
      : `${API_BASE_URL}/phoneOtp/verify`;

  const fullPhone = `+90${phone}`;
  const identifier =
    method === "email" ? { email: email.trim() } : { phoneNumber: fullPhone };

  function handlePhoneChange(e) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    if (digits.startsWith("0")) return;
    setPhone(digits);
  }

  function formatPhoneDisplay(digits) {
    if (!digits) return "";
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 8);
    const p4 = digits.slice(8, 10);
    return [p1, p2, p3, p4].filter(Boolean).join(" ").trim();
  }

  async function handleSendOtp() {
    if (method === "email") {
      if (!email.trim() || !email.includes("@")) {
        showToast("Please enter a valid email address.", "warning");
        return;
      }
    } else {
      if (phone.length !== 10) {
        showToast("Please enter a valid 10-digit phone number.", "warning");
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch(sendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identifier),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send code.");

      showToast("Verification code sent!", "success");
      setStep(STEPS.VERIFY);
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  }

 
  async function handleVerifyOtp() {
    if (!/^\d{6}$/.test(otp.trim())) {
      showToast("Please enter the 6-digit code.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...identifier, code: otp.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid code.");

      const token = data.resetToken;
      if (!token) throw new Error("Invalid session. Please try again.");

      localStorage.setItem("resetToken", token);

      showToast("Code verified!", "success");
      setStep(STEPS.RESET);
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (passwordError) {
      showToast(passwordError, "warning");
      return;
    }
    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "warning");
      return;
    }

    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      showToast("Session expired. Please start again.", "error");
      setStep(STEPS.METHOD);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/user/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password.");

      localStorage.removeItem("resetToken");

      showToast("Password reset successfully! Redirecting...", "success", 2000);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleMethodSelect(m) {
    setMethod(m);
    setOtp("");
    localStorage.removeItem("resetToken");
  }

  const stepLabels = ["Choose method", "Verify code", "New password"];

  return (
    <>
      {loading && <LoadSpinner />}
      <LandingPageHeader />

      <div className="auth-page">
        <div className="auth-overlay" />

        <div className="auth-shell fp-shell">
          {/* Brand */}
          <div className="auth-brand">
            <img src={logo} alt="Dressify Logo" className="auth-logo" />
            <p className="auth-brand-text">
              Reset your password securely and get back to refined fashion.
            </p>
          </div>

          {/* Card */}
          <div className="auth-card fp-card">
            <button
              className="auth-back-btn"
              onClick={() => navigate("/login")}
              type="button"
            >
              ← Back to Login
            </button>

            <p className="auth-eyebrow">Account Recovery</p>
            <h1 className="auth-title">Forgot Password</h1>

            {/* Stepper */}
            <div className="fp-stepper">
              {stepLabels.map((label, i) => {
                const s = i + 1;
                const active = step === s;
                const done = step > s;
                return (
                  <div key={s} className="fp-step">
                    <div
                      className={`fp-step-circle ${active ? "active" : ""} ${done ? "done" : ""}`}
                    >
                      {done ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        s
                      )}
                    </div>
                    <span className="fp-step-label">{label}</span>
                    {s < 3 && (
                      <div className={`fp-step-line ${done ? "done" : ""}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/*  Step 1: Method  */}
            {step === STEPS.METHOD && (
              <div className="fp-body">
                <p className="fp-hint">
                  How would you like to verify your identity?
                </p>

                <div className="fp-method-grid">
                  <button
                    type="button"
                    className={`fp-method-btn ${method === "email" ? "active" : ""}`}
                    onClick={() => handleMethodSelect("email")}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Via Email</span>
                    <p>We'll send a code to your email address</p>
                  </button>

                  <button
                    type="button"
                    className={`fp-method-btn ${method === "phone" ? "active" : ""}`}
                    onClick={() => handleMethodSelect("phone")}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                      <line x1="12" y1="18" x2="12.01" y2="18" />
                    </svg>
                    <span>Via Phone</span>
                    <p>We'll send a code to your phone number</p>
                  </button>
                </div>

                {method === "email" && (
                  <div className="auth-field">
                    <label htmlFor="fp-email">Email Address</label>
                    <input
                      id="fp-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}

                {method === "phone" && (
                  <div className="auth-field">
                    <label htmlFor="fp-phone">Phone Number</label>
                    <div className="fp-phone-wrapper">
                      <span className="fp-phone-prefix">+90</span>
                      <input
                        id="fp-phone"
                        type="tel"
                        inputMode="numeric"
                        placeholder="5__ ___ __ __"
                        value={formatPhoneDisplay(phone)}
                        onChange={handlePhoneChange}
                        className="fp-phone-input"
                        maxLength={13}
                      />
                    </div>
                    <p className="fp-field-hint">
                      {phone.length > 0 && phone.length < 10
                        ? `${10 - phone.length} more digit(s) needed`
                        : phone.length === 10
                          ? `Will be sent as: +90${phone}`
                          : "Enter your 10-digit mobile number"}
                    </p>
                  </div>
                )}

                {method && (
                  <button
                    type="button"
                    className="auth-btn auth-btn--primary"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Send Verification Code
                  </button>
                )}
              </div>
            )}

            {/*  Step 2: Verify OTP  */}
            {step === STEPS.VERIFY && (
              <div className="fp-body">
                <div className="fp-info-box">
                  Code sent to:{" "}
                  <strong>
                    {method === "email"
                      ? email
                      : `+90 ${formatPhoneDisplay(phone)}`}
                  </strong>
                </div>

                <div className="auth-field">
                  <label htmlFor="fp-otp">Verification Code</label>
                  <input
                    id="fp-otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="fp-otp-input"
                  />
                  <p className="fp-field-hint">
                    Enter the 6-digit code we sent you.
                  </p>
                </div>

                <button
                  type="button"
                  className="auth-btn auth-btn--primary"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                >
                  Verify Code
                </button>

                <div className="fp-row">
                  <button
                    type="button"
                    className="auth-btn auth-btn--ghost"
                    onClick={() => setStep(STEPS.METHOD)}
                    disabled={loading}
                  >
                    Change Method
                  </button>
                  <button
                    type="button"
                    className="auth-btn auth-btn--ghost"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Reset Password  */}
            {step === STEPS.RESET && (
              <div className="fp-body">
                <div className="fp-info-box fp-info-box--success">
                  ✓ Identity verified. Set your new password below.
                </div>

                <div className="auth-field">
                  <label htmlFor="fp-password">New Password</label>
                  <input
                    id="fp-password"
                    type="password"
                    placeholder="Create a new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && (
                    <p className="fp-field-error">{passwordError}</p>
                  )}
                </div>

                <div className="auth-field">
                  <label htmlFor="fp-confirm">Confirm Password</label>
                  <input
                    id="fp-confirm"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {confirmPassword && password !== confirmPassword && (
                    <p className="fp-field-error">Passwords do not match.</p>
                  )}
                </div>

                <button
                  type="button"
                  className="auth-btn auth-btn--primary"
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  Reset Password
                </button>

                <button
                  type="button"
                  className="auth-btn auth-btn--ghost"
                  onClick={() => {
                    setStep(STEPS.VERIFY);
                    setPassword("");
                    setConfirmPassword("");
                  }}
                  disabled={loading}
                >
                  Back
                </button>
              </div>
            )}

            <p className="auth-switch">
              Remember your password?{" "}
              <Link to="/login" className="auth-switch-link">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <LandingPageFooter />
    </>
  );
}

export default ForgotPassword;
