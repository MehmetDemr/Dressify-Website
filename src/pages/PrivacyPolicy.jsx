import { useEffect } from "react";
import LandingPageHeader from "../components/Landing-Page/landing-page-header/Header";
import LandingPageFooter from "../components/Landing-Page/landing-page-footer/Footer";
import "../styles/PolicyPages.css";

function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = "Privacy Policy | Dressify";
  }, []);

  return (
    <>
      <LandingPageHeader />

      <main className="public-page">
        <section className="public-hero public-hero--compact">
          <p className="public-eyebrow">Privacy Policy</p>

          <h1 className="public-title">
            Your Privacy <br />
            Matters To <em>Dressify</em>
          </h1>

          <p className="public-sub">
            This Privacy Policy explains how Dressify may collect, use, and
            protect information when you use our platform.
          </p>
        </section>

        <section className="legal-section">
          <div className="legal-content">
            <article className="legal-block">
              <h2>1. Information We Collect</h2>
              <p>
                When you create an account or use Dressify, we may collect
                information such as your name, email address, login details,
                favourite products, shopping preferences, and messages you send
                through contact forms.
              </p>
            </article>

            <article className="legal-block">
              <h2>2. How We Use Information</h2>
              <p>
                We may use your information to provide account access, improve
                the shopping experience, display relevant products, process
                support requests, improve platform performance, and communicate
                important updates.
              </p>
            </article>

            <article className="legal-block">
              <h2>3. Account and Favourite Products</h2>
              <p>
                Since Dressify products are available after login, your account
                may store information such as saved favourites, recently viewed
                products, and personal style preferences to improve your user
                experience.
              </p>
            </article>

            <article className="legal-block">
              <h2>4. Cookies and Similar Technologies</h2>
              <p>
                Dressify may use cookies or similar technologies to keep users
                signed in, remember preferences, analyze platform usage, and
                improve performance. You can manage cookie preferences through
                your browser settings.
              </p>
            </article>

            <article className="legal-block">
              <h2>5. Sharing Information</h2>
              <p>
                We do not sell personal information. We may share limited data
                with service providers only when necessary for hosting,
                analytics, payment processing, delivery, customer support, or
                legal compliance.
              </p>
            </article>

            <article className="legal-block">
              <h2>6. Data Security</h2>
              <p>
                We use reasonable technical and organizational measures to
                protect user information. However, no online system can be
                guaranteed to be completely secure.
              </p>
            </article>

            <article className="legal-block">
              <h2>7. Your Rights</h2>
              <p>
                Depending on applicable law, you may have the right to access,
                correct, delete, or restrict the use of your personal
                information. You can contact Dressify for privacy-related
                requests.
              </p>
            </article>

            <article className="legal-block">
              <h2>8. Updates to This Policy</h2>
              <p>
                Dressify may update this Privacy Policy when our platform,
                services, or legal requirements change. Updated versions will be
                published on this page.
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

export default PrivacyPolicyPage;
