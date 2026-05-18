import { useEffect } from "react";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";
import "../styles/PolicyPages.css";

function TermsPage() {
  useEffect(() => {
    document.title = "Terms of Service | Dressify";
  }, []);

  return (
    <>
      <LandingPageHeader />

      <main className="public-page">
        <section className="public-hero public-hero--compact">
          <p className="public-eyebrow">Terms of Service</p>

          <h1 className="public-title">
            Terms That Guide <br />
            Your <em>Dressify</em> Experience
          </h1>

          <p className="public-sub">
            Please read these terms carefully before using Dressify. By creating
            an account or using our platform, you agree to these terms.
          </p>
        </section>

        <section className="legal-section">
          <div className="legal-content">
            <article className="legal-block">
              <h2>1. Overview</h2>
              <p>
                Dressify is an online fashion platform that helps users discover
                clothing products from selected brands. Access to product pages,
                favourites, and personalized shopping features may require an
                account.
              </p>
            </article>

            <article className="legal-block">
              <h2>2. Account Registration</h2>
              <p>
                To access certain Dressify features, users may need to create an
                account. You are responsible for keeping your login information
                secure and for all activities that occur under your account.
              </p>
            </article>

            <article className="legal-block">
              <h2>3. Product Information</h2>
              <p>
                We aim to present product names, brands, categories,
                descriptions, pricing, and availability as accurately as
                possible. However, product information may change due to stock
                updates, brand changes, or technical errors.
              </p>
            </article>

            <article className="legal-block">
              <h2>4. Orders and Payments</h2>
              <p>
                If purchasing features are available, orders are subject to
                product availability, payment approval, delivery conditions, and
                applicable campaign rules. Dressify may refuse or cancel orders
                when necessary.
              </p>
            </article>

            <article className="legal-block">
              <h2>5. Returns and Exchanges</h2>
              <p>
                Return and exchange conditions may vary depending on product
                type, campaign rules, hygiene requirements, and applicable
                consumer regulations. Returned products must generally be
                unused, undamaged, and sent with original packaging and tags.
              </p>
            </article>

            <article className="legal-block">
              <h2>6. Brand and Store Partnerships</h2>
              <p>
                Fashion brands, clothing stores, and sellers may contact
                Dressify for potential partnership opportunities. Any
                partnership, listing, or collaboration may require additional
                approval and separate agreement.
              </p>
            </article>

            <article className="legal-block">
              <h2>7. Acceptable Use</h2>
              <p>
                Users agree not to misuse the platform, attempt unauthorized
                access, copy platform content without permission, interfere with
                security systems, or use Dressify for unlawful activities.
              </p>
            </article>

            <article className="legal-block">
              <h2>8. Changes to Terms</h2>
              <p>
                Dressify may update these terms from time to time. Continued use
                of the platform after updates means you accept the revised
                terms.
              </p>
            </article>

            <p className="legal-updated">Last updated: May 2026</p>
          </div>
        </section>
      </main>

      <LandingPageFooter />
    </>
  );
}

export default TermsPage;
