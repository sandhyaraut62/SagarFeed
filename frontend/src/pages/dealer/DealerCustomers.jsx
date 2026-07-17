import { useEffect, useState } from "react";
import api from "../../api.js";

function DealerCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dealer/customers")
      .then((res) => setCustomers(res.data.customers))
      .catch(() => setError("Could not load customers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="dash-loading">Loading customers...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>Customers ({customers.length})</h2>
      </div>
      {customers.length === 0 ? (
        <p className="dash-empty">No customers have ordered yet.</p>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>
                  <td>
                    {c.email}
                    <div className="dash-muted-small">{c.phone}</div>
                  </td>
                  <td>{c.role}</td>
                  <td>{c.order_count}</td>
                  <td>Rs. {Number(c.total_spent).toLocaleString()}</td>
                  <td>{new Date(c.last_order_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default DealerCustomers;
