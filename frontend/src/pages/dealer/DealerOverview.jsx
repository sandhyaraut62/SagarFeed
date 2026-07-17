import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api.js";
import { StatBox, StockBadge, OrderStatusBadge } from "../../components/dashboard/StatBox.jsx";

function DealerOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dealer/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-loading">Loading dashboard...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <div className="dash-stack">
      <div className="dash-stat-grid">
        <StatBox label="Total Orders" value={stats.totalOrders} />
        <StatBox label="Pending Orders" value={stats.pendingOrders} />
        <StatBox label="Total Customers" value={stats.totalCustomers} />
        <StatBox label="Total Revenue" value={`Rs. ${Number(stats.totalRevenue).toLocaleString()}`} />
      </div>

      <div className="dash-two-col">
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Recent Orders</h2>
            <Link to="/dealer/orders">View all →</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="dash-empty">No orders placed yet.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>Rs. {Number(order.total_amount).toLocaleString()}</td>
                    <td>
                      <OrderStatusBadge status={order.order_status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>Low Stock Alerts</h2>
            <Link to="/dealer/inventory">Manage inventory →</Link>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="dash-empty">All products are well stocked.</p>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.stock_quantity}</td>
                    <td>
                      <StockBadge level="Low" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default DealerOverview;
