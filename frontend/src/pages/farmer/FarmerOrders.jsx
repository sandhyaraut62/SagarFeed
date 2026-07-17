import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { OrderStatusBadge } from "../../components/dashboard/StatBox.jsx";

const CANCELLABLE_STATUSES = ["placed", "processing"];

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    api
      .get("/orders/my")
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError("Could not load your orders."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order? This can't be undone.")) return;
    setCancellingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: "cancelled" } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel this order.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading your orders...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>My Orders ({orders.length})</h2>
        <Link to="/products" className="dash-btn-small dash-btn-link">
          + Browse Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="dash-empty">
          You haven't placed any orders yet. <Link to="/products">Browse our feed products →</Link>
        </p>
      ) : (
        <div className="dash-order-list">
          {orders.map((order) => (
            <article key={order.id} className="dash-order-card">
              <div className="dash-order-card-head">
                <div>
                  <strong>Order #{order.id}</strong>
                  <span className="dash-muted-small">
                    {" "}
                    · {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <OrderStatusBadge status={order.order_status} />
              </div>
              <ul className="dash-item-list">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product_name} × {item.quantity} — Rs. {Number(item.subtotal).toLocaleString()}
                  </li>
                ))}
              </ul>
              <div className="dash-order-card-foot">
                <span>
                  Deliver to: {order.address_line ? `${order.address_line}, ${order.city}` : "—"}
                </span>
                <span className="dash-payment-pill">
                  {order.payment_method === "esewa" ? "eSewa" : "Cash on Delivery"}
                </span>
                <strong>Rs. {Number(order.total_amount).toLocaleString()}</strong>
                {CANCELLABLE_STATUSES.includes(order.order_status) && (
                  <button
                    type="button"
                    className="dash-btn-small dash-btn-danger"
                    disabled={cancellingId === order.id}
                    onClick={() => handleCancel(order.id)}
                  >
                    {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default FarmerOrders;
