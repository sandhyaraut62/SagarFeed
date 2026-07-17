import PageHero from "../components/PageHero.jsx";

function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="How we handle your information" />
      <div className="page-wrap section-pad legal-content">
        <p>Last updated: 2026</p>

        <h2>Information we collect</h2>
        <p>
          When you register, we collect your full name, email, phone number, and role (Farmer or
          Dealer). When you place an order, we also collect your delivery address and order
          details.
        </p>

        <h2>How we use your information</h2>
        <p>
          Your information is used to process orders, manage your account, provide dashboard
          features relevant to your role, and communicate with you about order status. We do not
          sell your personal information to third parties.
        </p>

        <h2>Payment information</h2>
        <p>
          Payments made via eSewa are processed directly by eSewa — we do not store your eSewa
          login credentials or payment card details.
        </p>

        <h2>Data retention</h2>
        <p>
          We retain your account and order history for as long as your account remains active, or
          as required by law.
        </p>

        <h2>Contact</h2>
        <p>
          For any privacy-related questions, reach out to us at Itahari, 56705, Koshi, or by phone
          at 025-582841.
        </p>
      </div>
    </>
  );
}

export default PrivacyPage;
