import { useEffect, useState } from "react";
import api from "../../api.js";
import { StatBox } from "../../components/dashboard/StatBox.jsx";

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load admin stats."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-loading">Loading dashboard...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <div className="dash-stack">
      <div className="dash-stat-grid">
        <StatBox label="Total Dealers" value={stats.totalDealers} />
        <StatBox label="Total Farmers" value={stats.totalFarmers} />
        <StatBox label="Blocked Accounts" value={stats.blockedAccounts} />
        <StatBox label="Total Orders" value={stats.totalOrders} />
        <StatBox label="Total Revenue" value={`Rs. ${Number(stats.totalRevenue).toLocaleString()}`} />
        <StatBox label="Products in Catalog" value={stats.totalProducts} />
        <StatBox label="Low Stock Products" value={stats.lowStockCount} />
      </div>

      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Platform Control</h2>
        </div>
        <p>
          Use the sidebar to review and manage every Dealer and Farmer account registered on
          Sagar Feeds — activate, block, or remove accounts, and keep an eye on overall order
          activity across the platform.
        </p>
      </section>
    </div>
  );
}

export default AdminOverview;
