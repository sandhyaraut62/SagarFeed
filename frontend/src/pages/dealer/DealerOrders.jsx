import { useEffect, useState } from "react";
import api from "../../api.js";
import { OrderStatusBadge, ORDER_STATUS_OPTIONS } from "../../components/dashboard/StatBox.jsx";

function DealerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = () => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError("Could not load orders."))
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
      alert("Could not update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading orders...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>All Orders ({orders.length})</h2>
      </div>

      {orders.length === 0 ? (
        <p className="dash-empty">No orders have been placed yet.</p>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    #{order.id}
                    <div className="dash-muted-small">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    {order.customer_name}
                    <div className="dash-muted-small">{order.customer_phone}</div>
                  </td>
                  <td>
                    <ul className="dash-item-list">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.product_name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>Rs. {Number(order.total_amount).toLocaleString()}</td>
                  <td>
                    <span className="dash-payment-pill">
                      {order.payment_method === "esewa" ? "eSewa" : "Cash on Delivery"}
                    </span>
                  </td>
                  <td>
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
                    <div style={{ marginTop: 6 }}>
                      <OrderStatusBadge status={order.order_status} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default DealerOrders;
