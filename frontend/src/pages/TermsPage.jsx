import PageHero from "../components/PageHero.jsx";

function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="Please read these terms before using Sagar Feeds" />
      <div className="page-wrap section-pad legal-content">
        <p>Last updated: 2026</p>

        <h2>1. Using our platform</h2>
        <p>
          Sagar Feeds provides an online ordering platform for animal feed products for Dealers
          and Farmers. By registering an account, you agree to provide accurate information and
          to keep your login credentials secure.
        </p>

        <h2>2. Orders & Payment</h2>
        <p>
          Orders placed through this platform can be paid via eSewa or Cash on Delivery. Prices
          are listed per unit (e.g. per 50kg bag) and are subject to change. Stock availability is
          shown at the time of ordering but is not guaranteed until the order is confirmed by our
          team.
        </p>

        <h2>3. Cancellations</h2>
        <p>
          Orders can be cancelled by the customer before they are marked "Out for Delivery." Once
          an order has shipped, cancellations must be handled directly with our support team.
        </p>

        <h2>4. Account Suspension</h2>
        <p>
          Sagar Feeds reserves the right to suspend or block accounts that violate these terms,
          provide false information, or misuse the platform.
        </p>

        <h2>5. Contact</h2>
        <p>
          Questions about these terms can be directed to our office at Itahari, 56705, Koshi, or
          by phone at 025-582841.
        </p>
      </div>
    </>
  );
}

export default TermsPage;
