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
              <a href="/login">
                <button className="btn-primary">Explore Collection</button>
              </a>
              <a href="/#about">
                <button className="btn-ghost">Our Story →</button>
              </a>
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

        {/* BRAND SHOWCASE */}
        <section className="featured" id="featured">
          <div className="featured-inner featured-inner--showcase">
            <div className="featured-text">
              <p className="section-eyebrow">Curated Brands</p>

              <h2 className="featured-title">
                Discover Fashion <br />
                From <em>Trusted Brands</em>
              </h2>

              <p className="featured-desc">
                Dressify brings together popular fashion and sportswear brands
                in one clean shopping experience. Explore daily essentials,
                seasonal pieces, and comfortable styles selected for modern
                wardrobes.
              </p>

              <div className="featured-tags">
                {[
                  "Nike",
                  "Adidas",
                  "Zara",
                  "Pull&Bear",
                  "H&M",
                  "Koton",
                  "Mavi",
                  "Colin’s",
                ].map((brand, index) => (
                  <span className="featured-tag" key={index}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            <div className="featured-showcase">
              <div className="showcase-card showcase-card--large">
                <span className="showcase-label">New Season</span>
                <h3>Everyday essentials for effortless style.</h3>
                <p>T-shirts, pants, jumpers, sweatshirts and more.</p>
              </div>

              <div className="showcase-card showcase-card--small showcase-card--gold">
                <span>8+</span>
                <p>Featured Brands</p>
              </div>

              <div className="showcase-card showcase-card--small">
                <span>Partner</span>
                <p>Brands and stores can join Dressify.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="about-inner">
            <div className="about-content">
              <p className="section-eyebrow">About Dressify</p>

              <h2 className="section-title about-title">
                Fashion Discovery, <br />
                Made <em>Effortless</em>
              </h2>

              <p className="about-lead">
                Dressify is an online fashion platform that helps customers
                discover clothing products from popular brands in one clean and
                easy-to-browse experience.
              </p>

              <div className="about-copy-grid">
                <p className="about-desc">
                  From Nike, Adidas, Zara, Pull&amp;Bear, H&amp;M, Koton, Mavi,
                  and Colin’s to everyday essentials like t-shirts, pants,
                  jumpers, and sweatshirts, Dressify brings modern fashion
                  choices together in one place.
                </p>

                <p className="about-desc">
                  We also welcome fashion brands, clothing stores, and sellers
                  who want to become Dressify partners, increase their online
                  visibility, and reach customers through a curated shopping
                  platform.
                </p>
              </div>

              <div className="about-highlights">
                {[
                  "Curated Fashion Brands",
                  "Easy Online Shopping",
                  "Partnership Opportunities",
                ].map((item, index) => (
                  <span className="about-highlight" key={index}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="faq-inner">
            <div className="faq-header">
              <p className="faq-eyebrow">FAQ</p>

              <h2 className="faq-heading">
                Frequently Asked <em>Questions</em>
              </h2>

              <p className="faq-sub">
                Everything you need to know about Dressify orders, delivery,
                returns, sizing, payments, brands, and partnership
                opportunities.
              </p>
            </div>

            <div className="faq-grid">
              {[
                {
                  question: "What is Dressify?",
                  answer:
                    "Dressify is an online fashion platform that brings together selected clothing products from popular fashion brands. Our goal is to make it easier for customers to discover stylish, comfortable, and season-ready pieces in one place.",
                },
                {
                  question: "Which brands can I find on Dressify?",
                  answer:
                    "Dressify features products from well-known fashion and sportswear brands such as Nike, Adidas, Zara, Pull&Bear, H&M, Koton, Mavi, and Colin’s. Brand availability may change over time depending on collections, stock status, and seasonal updates.",
                },
                {
                  question: "What kind of products does Dressify offer?",
                  answer:
                    "Dressify focuses on everyday fashion essentials such as t-shirts, pants, jumpers, sweatshirts, and other clothing pieces. Our collections are designed to help customers create modern, comfortable, and easy-to-style outfits.",
                },
                {
                  question: "How long does standard delivery take?",
                  answer:
                    "Orders are usually dispatched within 1–2 business days. Standard delivery across Turkey generally arrives in 2–4 business days. Delivery time may vary depending on the city, courier workload, campaign periods, and product availability.",
                },
                {
                  question: "Can I return or exchange an item?",
                  answer:
                    "Yes. You can request a return or exchange within the return period, as long as the item is unused, unworn, undamaged, and returned with its original packaging and tags.",
                },
                {
                  question: "How can I find the right size?",
                  answer:
                    "Each product page includes size and fit information to help you choose the best option. Before placing an order, we recommend checking the product description, size details, and fit notes.",
                },
                {
                  question: "Which payment methods do you accept?",
                  answer:
                    "Dressify accepts major credit and debit cards. Available payment methods may vary depending on your location, bank, campaign options, and checkout preferences.",
                },
                {
                  question: "Can I track my order?",
                  answer:
                    "Yes. Once your order is shipped, tracking information is shared so you can follow your delivery status and estimate when your package will arrive.",
                },
                {
                  question: "Are the products original?",
                  answer:
                    "Dressify focuses on curated and trusted fashion products. Product details, brand information, category information, and available descriptions are shown clearly before purchase.",
                },
                {
                  question:
                    "Can brands or stores become a partner with Dressify?",
                  answer:
                    "Yes. Dressify is open to brand partnerships and store collaborations. Fashion brands, clothing stores, and sellers who want to reach more customers can contact us to discuss partnership opportunities.",
                },
                {
                  question: "Why should a brand partner with Dressify?",
                  answer:
                    "Partnering with Dressify can help brands increase their online visibility, present their products to fashion-focused customers, and become part of a curated shopping experience.",
                },
                {
                  question: "How often are new products added?",
                  answer:
                    "New products and collections may be added regularly depending on brand updates, seasonal trends, and stock availability.",
                },
              ].map((item, index) => (
                <article className="faq-card" key={index}>
                  <span className="faq-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="faq-question">{item.question}</h3>

                  <p className="faq-answer">{item.answer}</p>
                </article>
              ))}
            </div>

            <div className="faq-bottom">
              <p className="faq-bottom-text">
                Still have questions? Our support team is ready to help.
              </p>

              <Link to="/contact" className="faq-cta">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingPageFooter></LandingPageFooter>
    </>
  );
}

export default HomePage;
