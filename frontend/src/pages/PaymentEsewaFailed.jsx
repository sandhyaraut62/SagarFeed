import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import PageHero from "../components/PageHero.jsx";
import api from "../api.js";

function PaymentEsewaFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  const handleRetry = async () => {
    setRetrying(true);
    setError("");
    try {
      const initRes = await api.post("/payments/esewa/initiate", { orderId: Number(orderId) });
      const { formUrl, fields } = initRes.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = formUrl;
      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError(err.response?.data?.message || "Could not restart the payment. Please try again.");
      setRetrying(false);
    }
  };

  return (
    <>
      <PageHero title="Payment Not Completed" subtitle="Your eSewa payment was cancelled or failed" />
      <div className="page-wrap section-pad centered">
        <div className="order-success-card">
          <p>
            Your order {orderId ? `#${orderId} ` : ""}has not been charged. You can try the
            payment again, or switch to Cash on Delivery from your Orders page.
          </p>
          {error && <p className="dash-error">{error}</p>}
          <div className="order-success-actions">
            {orderId && (
              <button className="button button-primary" type="button" onClick={handleRetry} disabled={retrying}>
                {retrying ? "Redirecting..." : "Retry Payment"}
              </button>
            )}
            <Link className="button button-outline" to="/products">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentEsewaFailed;
