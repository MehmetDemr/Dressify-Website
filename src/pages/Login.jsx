import { Link } from "react-router-dom";
import logo from "../assets/dressify-logo.png";
import "../styles/Auth.css";

function Login() {
  return (
    <div className="auth-page">
      <div className="auth-overlay" />

      <div className="auth-shell">
        <div className="auth-brand">
          <img src={logo} alt="Dressify Logo" className="auth-logo" />
          <p className="auth-brand-text">Quiet luxury, timeless identity.</p>
        </div>

        <div className="auth-card">
          <p className="auth-eyebrow">Welcome Back</p>
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">
            Sign in to continue your Dressify experience.
          </p>

          <form className="auth-form">
            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" />
            </div>

            <div className="auth-row">
              <label className="auth-check">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <a href="#forgot" className="auth-link">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="auth-btn auth-btn--primary">
              Login
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <Link to="/register" className="auth-switch-link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
