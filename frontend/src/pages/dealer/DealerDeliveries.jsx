import { useEffect, useState } from "react";
import api from "../../api.js";
import { OrderStatusBadge, ORDER_STATUS_OPTIONS } from "../../components/dashboard/StatBox.jsx";

const ACTIVE_STATUSES = ["placed", "processing", "out_for_delivery"];

function DealerDeliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const loadOrders = () => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError("Could not load deliveries."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, orderStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, order_status: orderStatus } : o))
      );
    } catch {
      alert("Could not update delivery status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading deliveries...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  const visibleOrders = showAll ? orders : orders.filter((o) => ACTIVE_STATUSES.includes(o.order_status));

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>Deliveries</h2>
        <label className="dash-toggle">
          <input type="checkbox" checked={showAll} onChange={(e) => setShowAll(e.target.checked)} />
          Show delivered & cancelled
        </label>
      </div>

      {visibleOrders.length === 0 ? (
        <p className="dash-empty">Nothing to deliver right now.</p>
      ) : (
        <div className="dash-delivery-grid">
          {visibleOrders.map((order) => (
            <article key={order.id} className="dash-delivery-card">
              <div className="dash-delivery-head">
                <strong>Order #{order.id}</strong>
                <OrderStatusBadge status={order.order_status} />
              </div>
              <p className="dash-muted-small">{order.customer_name} · {order.customer_phone}</p>
              <p className="dash-muted-small">
                {order.address_line ? `${order.address_line}, ${order.city}` : "No address on file"}
              </p>
              <select
                value={order.order_status}
                disabled={updatingId === order.id}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default DealerDeliveries;
