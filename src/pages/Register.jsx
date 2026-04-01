import { Link } from "react-router-dom";
import logo from "../assets/dressify-logo.png";
import "../styles/Auth.css";

function Register() {
  return (
    <div className="auth-page">
      <div className="auth-overlay" />

      <div className="auth-shell">
        <div className="auth-brand">
          <img src={logo} alt="Dressify Logo" className="auth-logo" />
          <p className="auth-brand-text">
            Create your account and step into refined fashion.
          </p>
        </div>

        <div className="auth-card">
          <p className="auth-eyebrow">Join Dressify</p>
          <h1 className="auth-title">Register</h1>
          <p className="auth-subtitle">
            Create your account to discover curated elegance.
          </p>

          <form className="auth-form">
            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" placeholder="Enter your full name" />
            </div>

            <div className="auth-field">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <input type="password" placeholder="Create a password" />
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm your password" />
            </div>

            <label className="auth-check auth-check--terms">
              <input type="checkbox" />
              <span>I agree to the Terms & Conditions</span>
            </label>

            <button type="submit" className="auth-btn auth-btn--primary">
              Create Account
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
