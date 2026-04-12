import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dressify-logo.png";
import { API_BASE_URL } from "../../config";
import "../styles/Auth.css";
import { LoadSpinner } from "../components/Spinner/spinner.component";
import { showToast } from "../utils/toastrService";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email && !email.includes("@")) {
        showToast("Email is invalid", "warning");
      }

      if (!password) {
        showToast("Password cannot be empty", "warning");
      }

      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast("Login failed", "error");
        throw new Error(data.message || "Login failed.");
      }

      const raw = data.access_token || data.token || "";
      const token = raw.startsWith("Bearer ") ? raw.slice(7) : raw;
      localStorage.setItem("token", token);

      showToast(
        "Login successful! You are being redirected...",
        "success",
        1500,
      );
      navigate("/dashboard");
    } catch (err) {
      showToast(
        err.message || "Login failed. Please check your information.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/user/google`;
  };

  const handleAppleLogin = () => {
    setAppleLoading(true);
    window.location.href = `${API_BASE_URL}/user/apple`;
  };

  return (
    <>
      {loading && <LoadSpinner />}

      <LandingPageHeader />
      <div className="auth-page">
        <div className="auth-overlay" />

        <div className="auth-shell">
          <div className="auth-brand">
            <img src={logo} alt="Dressify Logo" className="auth-logo" />
            <p className="auth-brand-text">Quiet luxury, timeless identity.</p>
          </div>

          <div className="auth-card">
            <button
              className="auth-back-btn"
              onClick={() => navigate("/")}
              type="button"
            >
              ← Main Page
            </button>

            <p className="auth-eyebrow">Welcome Back</p>
            <h1 className="auth-title">Login</h1>
            <p className="auth-subtitle">
              Sign in to continue your Dressify experience.
            </p>

            <div className="auth-socials">
              <button
                type="button"
                className="auth-btn auth-btn--social"
                onClick={handleGoogleLogin}
                disabled={googleLoading || appleLoading}
              >
                {googleLoading ? "Redirecting..." : "Continue with Google"}
              </button>
              <button
                type="button"
                className="auth-btn auth-btn--social"
                onClick={handleAppleLogin}
                disabled={appleLoading || googleLoading}
              >
                {appleLoading ? "Redirecting..." : "Continue with Apple"}
              </button>
            </div>

            <div className="auth-divider">
              <span>or sign in with email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="auth-row">
                <label className="auth-check">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="/dashboard/forgot-password" className="auth-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="auth-btn auth-btn--primary"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/register" className="auth-switch-link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      <LandingPageFooter />
    </>
  );
}

export default Login;
