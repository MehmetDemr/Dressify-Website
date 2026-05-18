import { useEffect, useState } from "react";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";
import { API_BASE_URL } from "../../config";
import "../styles/PolicyPages.css";

const INITIAL_FORM = { name: "", email: "", topic: "", message: "" };

function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Contact Dressify | Support & Partnerships";
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { name, email, topic, message } = form;

    if (!name || !email || !topic || !message) {
      setStatus("error");
      setErrorMsg("Please fill in all fields before sending.");
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      setErrorMsg("");

      const res = await fetch(`${API_BASE_URL}/gmailOtp/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setForm(INITIAL_FORM);
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
      setErrorMsg("Could not reach the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LandingPageHeader />

      <main className="public-page">
        <section className="public-hero">
          <p className="public-eyebrow">Contact</p>

          <h1 className="public-title">
            Get In Touch <br />
            With <em>Dressify</em>
          </h1>

          <p className="public-sub">
            Have a question about orders, returns, sizing, account access, or
            brand partnerships? Our team is ready to help.
          </p>
        </section>

        <section className="contact-section">
          <div className="contact-grid">
            <div className="contact-info">
              <p className="section-eyebrow">Support & Partnership</p>

              <h2 className="public-section-title">
                We are here to help customers and future partners.
              </h2>

              <p className="public-text">
                Dressify supports customers who want to discover fashion from
                popular brands and businesses that want to become part of a
                curated online shopping platform.
              </p>

              <div className="contact-info-list">
                <div className="contact-info-item">
                  <span>01</span>
                  <div>
                    <h3>Customer Support</h3>
                    <p>
                      Questions about orders, delivery, returns, sizing, or
                      account access.
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <span>02</span>
                  <div>
                    <h3>Brand Partnerships</h3>
                    <p>
                      Fashion brands, clothing stores, and sellers can contact
                      us for collaboration opportunities.
                    </p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <span>03</span>
                  <div>
                    <h3>General Inquiries</h3>
                    <p>
                      For general questions about Dressify, our platform, or our
                      services.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <div className="form-row">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="form-row">
                <label htmlFor="topic">Topic</label>
                <select
                  id="topic"
                  value={form.topic}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="" disabled>
                    Select a topic
                  </option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Brand Partnership</option>
                  <option value="returns">Returns & Delivery</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className="form-row">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="6"
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              {status === "success" && (
                <p className="contact-feedback contact-feedback--success">
                  Your message has been sent. We'll get back to you shortly.
                </p>
              )}

              {status === "error" && (
                <p className="contact-feedback contact-feedback--error">
                  {errorMsg}
                </p>
              )}

              <button
                type="button"
                className="public-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </>
  );
}

export default ContactPage;
