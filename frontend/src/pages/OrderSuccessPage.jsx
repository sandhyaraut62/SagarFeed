import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageHero from "../components/PageHero.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) navigate("/products", { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const dashboardPath = user?.role === "Dealer" ? "/dealer/orders" : "/farmer/orders";

  return (
    <>
      <PageHero title="Order Placed!" subtitle="Thank you for ordering from Sagar Feeds" />
      <div className="page-wrap section-pad centered">
        <div className="order-success-card">
          <div className="order-success-check">✓</div>
          <h2>Your order has been placed successfully</h2>
          <p>
            Order <strong>#{order.id}</strong> · Total{" "}
            <strong>Rs. {Number(order.totalAmount).toLocaleString()}</strong>
          </p>
          <p className="dash-muted-small">
            Payment method: {order.paymentMethod === "esewa" ? "eSewa" : "Cash on Delivery"}
          </p>

          <div className="order-success-actions">
            <Link className="button button-primary" to={dashboardPath}>
              View My Orders
            </Link>
            <Link className="button button-outline" to="/products">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderSuccessPage;
