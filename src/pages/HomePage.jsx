import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";
import "../styles/HomePage.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <LandingPageHeader></LandingPageHeader>
      <main className="main">
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="hero-bg">
            <div className="hero-grain" />
            <div className="hero-blob hero-blob--1" />
            <div className="hero-blob hero-blob--2" />
          </div>

          <div className="hero-content">
            <p className="hero-eyebrow">New Season — SS 2026</p>
            <h1 className="hero-title">
              Wear What <br />
              <em>You Mean</em>
            </h1>
            <p className="hero-sub">
              Curated pieces for the quietly confident. <br />
              Fashion that speaks before you do.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Explore Collection</button>
              <button className="btn-ghost">Our Story →</button>
            </div>
          </div>
        </section>

        {/*  MARQUEE STRIP  */}
        <div className="marquee-strip">
          <div className="marquee-track">
            {[
              "NEW ARRIVALS",
              "MAVİ",
              "ZARA",
              "PULL&BEAR",
              "NIKE",
              "ADIDAS",
              "H&M",
              "KOTON",
              "COLINS",
              "SEASON 2026",
              "NEW ARRIVALS",
              "MAVİ",
              "ZARA",
              "PULL&BEAR",
              "NIKE",
              "ADIDAS",
              "H&M",
              "KOTON",
              "COLINS",
              "SEASON 2026",
            ].map((t, i) => (
              <span key={i} className="marquee-item">
                {t} <span className="marquee-dot">◆</span>
              </span>
            ))}
          </div>
        </div>

        {/*  FEATURED BANNER  */}
        <section className="featured" id="featured">
          <div className="featured-inner">
            <div className="featured-text">
              <p className="section-eyebrow">Featured Drop</p>
              <h2 className="featured-title">
                The <em>Atelier</em> <br /> Edit
              </h2>
              <p className="featured-desc">
                Handpicked from our finest artisans. Each piece is crafted with
                intention — designed to last beyond every season.
              </p>
            </div>
            <div className="featured-visual">
              <div className="featured-card featured-card--back" />
              <div className="featured-card featured-card--front">
                <p className="featured-card-label">Atelier Collection</p>
                <p className="featured-card-sub">12 exclusive pieces</p>
              </div>
            </div>
          </div>
        </section>

        {/*  ABOUT  */}
        <section className="about" id="about">
          <div className="about-inner">
            <div className="about-visual">
              <div className="about-block about-block--1" />
              <div className="about-block about-block--2">
                <p className="about-block-stat">2019</p>
                <p className="about-block-label">Founded</p>
              </div>
              <div className="about-block about-block--3">
                <p className="about-block-stat">40K+</p>
                <p className="about-block-label">Happy Customers</p>
              </div>
            </div>
            <div className="about-text">
              <p className="section-eyebrow">Our Philosophy</p>
              <h2 className="section-title">
                Style Is <br />
                <em>A Statement</em>
              </h2>
              <p className="about-desc">
                Dressify was born from a belief that fashion should be
                intentional. We source thoughtfully, design with restraint, and
                create pieces that age with you — not against you.
              </p>
              <div className="about-values">
                {["Ethical Sourcing", "Timeless Design", "Slow Fashion"].map(
                  (v, i) => (
                    <div className="about-value" key={i}>
                      <span className="value-dot" />
                      {v}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter></LandingPageFooter>
    </>
  );
}

export default HomePage;
