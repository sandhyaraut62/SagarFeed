import { useEffect, useState } from "react";
import api from "../../api.js";
import { StockBadge } from "../../components/dashboard/StatBox.jsx";

const CATEGORIES = [
  "Layer Feed",
  "Broiler Feed",
  "Giriraj Feed",
  "Cattle Feed",
  "Swine Feed",
  "Aqua Feed",
  "Specialized Feed",
];

const BLANK_FORM = {
  id: null,
  category: CATEGORIES[0],
  name: "",
  stage: "",
  description: "",
  imageUrl: "",
  price: "",
  unit: "50kg bag",
  stockQuantity: 0,
  lowStockThreshold: 50,
  isActive: true,
};

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(null); // null = form closed
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const loadProducts = async () => {
    setError("");
    try {
      const res = await api.get("/products/admin/all");
      setProducts(res.data.products);
    } catch {
      setError("Could not load the product catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNewForm = () => {
    setNotice("");
    setForm({ ...BLANK_FORM });
  };

  const openEditForm = (product) => {
    setNotice("");
    setForm({
      id: product.id,
      category: product.category,
      name: product.name,
      stage: product.stage || "",
      description: product.description || "",
      imageUrl: product.image_url || "",
      price: product.price,
      unit: product.unit,
      stockQuantity: product.stock_quantity,
      lowStockThreshold: product.low_stock_threshold,
      isActive: Boolean(product.is_active),
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/products/${form.id}`, form);
        setNotice(`"${form.name}" was updated.`);
      } else {
        await api.post("/products", form);
        setNotice(`"${form.name}" was added to the catalog.`);
      }
      await loadProducts();
      setForm(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not save this product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setBusyId(product.id);
    try {
      await api.delete(`/products/${product.id}`);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      setNotice(`"${product.name}" was deleted.`);
      if (form?.id === product.id) setForm(null);
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete this product.");
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleActive = async (product) => {
    setBusyId(product.id);
    try {
      const res = await api.put(`/products/${product.id}`, { isActive: !product.is_active });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? res.data.product : p)));
      setNotice(
        `"${product.name}" is now ${res.data.product.is_active ? "visible to farmers and dealers" : "hidden from farmers and dealers"}.`
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update this product.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="dash-loading">Loading product catalog...</p>;
  if (error) return <p className="dash-error">{error}</p>;

  return (
    <div className="dash-stack">
      <section className="dash-panel">
        <div className="dash-panel-head">
          <h2>Product Catalog ({products.length})</h2>
          <button type="button" className="dash-btn-small" onClick={openNewForm}>
            + Add Product
          </button>
        </div>
        {notice && <p className="dash-success">{notice}</p>}

        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.name}
                    {product.stage && <div className="dash-muted-small">{product.stage}</div>}
                  </td>
                  <td>{product.category}</td>
                  <td>Rs. {Number(product.price).toLocaleString()}</td>
                  <td>
                    {product.stock_quantity} <StockBadge level={product.stockLabel} />
                  </td>
                  <td>
                    <span className={`badge badge-account-${product.is_active ? "active" : "blocked"}`}>
                      {product.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="dash-actions">
                    <button type="button" className="dash-btn-small" onClick={() => openEditForm(product)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="dash-btn-small"
                      disabled={busyId === product.id}
                      onClick={() => handleToggleActive(product)}
                    >
                      {product.is_active ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      className="dash-btn-small dash-btn-danger"
                      disabled={busyId === product.id}
                      onClick={() => handleDelete(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {form && (
        <section className="dash-panel">
          <div className="dash-panel-head">
            <h2>{form.id ? "Edit Product" : "Add New Product"}</h2>
          </div>
          <form className="admin-product-form" onSubmit={handleSubmit}>
            <div className="two-col">
              <label>
                <b>Category</b>
                <select name="category" value={form.category} onChange={handleFormChange} required>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label>
                <b>Name</b>
                <input name="name" value={form.name} onChange={handleFormChange} required />
              </label>
            </div>

            <div className="two-col">
              <label>
                <b>Stage / Variant (optional)</b>
                <input name="stage" value={form.stage} onChange={handleFormChange} placeholder="e.g. 0-8 Weeks" />
              </label>
              <label>
                <b>Unit</b>
                <input name="unit" value={form.unit} onChange={handleFormChange} required />
              </label>
            </div>

            <label>
              <b>Description</b>
              <input name="description" value={form.description} onChange={handleFormChange} />
            </label>

            <label>
              <b>Image URL (optional — leave blank to use the default category photo)</b>
              <input name="imageUrl" value={form.imageUrl} onChange={handleFormChange} placeholder="https://..." />
            </label>

            <div className="two-col">
              <label>
                <b>Price (Rs.)</b>
                <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleFormChange} required />
              </label>
              <label>
                <b>Stock Quantity</b>
                <input type="number" min="0" name="stockQuantity" value={form.stockQuantity} onChange={handleFormChange} />
              </label>
            </div>

            <label>
              <b>Low Stock Threshold</b>
              <input type="number" min="0" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleFormChange} />
            </label>

            <label className="checkbox-row">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleFormChange} />{" "}
              Visible on the public Products page
            </label>

            <div className="checkout-nav-row">
              <button type="button" className="button button-outline" onClick={() => setForm(null)}>
                Cancel
              </button>
              <button type="submit" className="form-button" style={{ width: "auto" }} disabled={saving}>
                {saving ? "Saving..." : form.id ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default AdminProducts;
