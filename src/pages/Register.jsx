import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/dressify-logo.png";
import { API_BASE_URL } from "../../config";
import "../styles/Auth.css";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;

    if (!formData.userName.trim()) {
      return "Username is required.";
    }

    if (formData.userName.length < 3) {
      return "Username must be at least 3 characters.";
    }

    if (formData.userName.length > 25) {
      return "Username must be at most 25 characters.";
    }

    if (!usernameRegex.test(formData.userName)) {
      return "Username can only contain letters, numbers and underscore.";
    }

    if (!formData.email.trim()) {
      return "Email address is required.";
    }

    if (!formData.password) {
      return "Password is required.";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!passwordRegex.test(formData.password)) {
      return "Password must contain at least 1 uppercase, 1 lowercase and 1 special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!formData.phone.trim()) {
      return "Phone number is required.";
    }

    if (!formData.gender) {
      return "Please select a gender.";
    }

    if (!formData.agreeTerms) {
      return "You must agree to the Terms & Conditions.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          gender: formData.gender,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Account created successfully.");

      setFormData({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        gender: "",
        agreeTerms: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/user/google`;
  };

  const handleAppleLogin = () => {
    window.location.href = `${API_BASE_URL}/user/apple`;
  };

  return (
    <>
    <LandingPageHeader></LandingPageHeader>
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
            <button
              className="auth-back-btn"
              onClick={() => navigate("/")}
              type="button"
            >
              ← Main Page
            </button>
            <p className="auth-eyebrow">Join Dressify</p>
            <h1 className="auth-title">Register</h1>
            <p className="auth-subtitle">
              Create your account to discover curated elegance.
            </p>

            <div className="auth-socials">
              <button
                type="button"
                className="auth-btn auth-btn--social"
                onClick={handleGoogleLogin}
              >
                Continue with Google
              </button>

              <button
                type="button"
                className="auth-btn auth-btn--social"
                onClick={handleAppleLogin}
              >
                Continue with Apple
              </button>
            </div>

            <div className="auth-divider">
              <span>or register with email</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="userName">Username</label>
                <input
                  id="userName"
                  name="userName"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="auth-select"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <label className="auth-check auth-check--terms">
                <input
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span>I agree to the Terms & Conditions</span>
              </label>

              {error && (
                <p className="auth-message auth-message--error">{error}</p>
              )}

              {success && (
                <p className="auth-message auth-message--success">{success}</p>
              )}

              <button
                type="submit"
                className="auth-btn auth-btn--primary"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
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
      <LandingPageFooter></LandingPageFooter>
    </>
  );
}

export default Register;
