import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { StatBox, OrderStatusBadge } from "../../components/dashboard/StatBox.jsx";

function FarmerOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/farmer/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-loading">Loading dashboard...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <div className="dash-stack">
      <div className="dash-stat-grid">
        <StatBox label="Total Orders" value={stats.totalOrders} />
        <StatBox label="Active Orders" value={stats.activeOrders} />
        <StatBox label="Total Spent" value={`Rs. ${Number(stats.totalSpent).toLocaleString()}`} />
      </div>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Recent Orders</h2>
          <Link to="/farmer/orders">View all →</Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="dash-empty">
            You haven't placed any orders yet. <Link to="/products">Browse products →</Link>
          </p>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>Rs. {Number(order.total_amount).toLocaleString()}</td>
                  <td>{order.payment_method === "esewa" ? "eSewa" : "Cash on Delivery"}</td>
                  <td>
                    <OrderStatusBadge status={order.order_status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default FarmerOverview;
