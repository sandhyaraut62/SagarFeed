import { useEffect, useState } from "react";
import api from "../../api.js";
import { StockBadge } from "../../components/dashboard/StatBox.jsx";

function DealerInventory() {
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data.products);
        const initialDrafts = {};
        res.data.products.forEach((p) => (initialDrafts[p.id] = p.stock_quantity));
        setDrafts(initialDrafts);
      })
      .catch(() => setError("Could not load inventory."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (productId) => {
    setSavingId(productId);
    try {
      const res = await api.patch(`/products/${productId}/stock`, {
        stock_quantity: Number(drafts[productId]),
      });
      setProducts((prev) => prev.map((p) => (p.id === productId ? res.data.product : p)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update stock.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading inventory...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <section className="dash-panel">
      <div className="dash-panel-head">
        <h2>Inventory ({products.length} products)</h2>
      </div>
      <div className="dash-table-wrap">
        <table className="dash-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Stock Qty</th>
              <th>Level</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.unit}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    className="dash-qty-input"
                    value={drafts[product.id]}
                    onChange={(e) =>
                      setDrafts((prev) => ({ ...prev, [product.id]: e.target.value }))
                    }
                  />
                </td>
                <td>
                  <StockBadge level={product.stockLabel} />
                </td>
                <td>
                  <button
                    type="button"
                    className="dash-btn-small"
                    disabled={savingId === product.id}
                    onClick={() => handleSave(product.id)}
                  >
                    {savingId === product.id ? "Saving..." : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DealerInventory;
