import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import api from "../api.js";

function PaymentEsewaCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const data = searchParams.get("data");

    if (!data) {
      Promise.resolve().then(() => {
        setStatus("error");
        setMessage("Missing payment confirmation data from eSewa.");
      });
      return;
    }

    api
      .get("/payments/esewa/verify", { params: { data } })
      .then((res) => {
        setStatus("success");
        setTimeout(() => {
          navigate("/order-success", { state: { order: res.data.order }, replace: true });
        }, 1200);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Could not verify your payment.");
      });
  }, [searchParams, navigate]);

  return (
    <>
      <PageHero title="Confirming Payment" subtitle="Please wait while we verify your eSewa payment" />
      <div className="page-wrap section-pad centered">
        <div className="order-success-card">
          {status === "verifying" && <p>Verifying your payment with eSewa...</p>}
          {status === "success" && (
            <>
              <div className="order-success-check">✓</div>
              <h2>Payment confirmed! Redirecting...</h2>
            </>
          )}
          {status === "error" && (
            <>
              <p className="dash-error">{message}</p>
              <div className="order-success-actions">
                <Link className="button button-primary" to="/products">Back to Products</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default PaymentEsewaCallback;
