import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import api from "../api.js";
import { productImages } from "../content.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const CATEGORY_TABS = [
  "All Products",
  "Layer Feed",
  "Broiler Feed",
  "Giriraj Feed",
  "Cattle Feed",
  "Swine Feed",
  "Aqua Feed",
  "Specialized Feed",
];

const PRODUCT_IMAGE_OVERRIDES = {
  "Aqua Feed": "product-fish.webp",
  "Giriraj Feed": "product-giriraj.jpg",
  "Layer Feed": "product-layer.png",
  "Calf Feed": "product-calf.jpg",
  "Heifer Feed": "product-heifer.jpg",
  "Milky Feed": "product-milky.webp",
  "Dry Feed": "product-dry.jpg",
  "Common Quail Feed": "product-quail.jpg",
  "Goat Feed": "product-goat.jpg",
  "Horse Feed": "product-horse.jpg",
};

function getProductImage(product) {
  const overrideKey = PRODUCT_IMAGE_OVERRIDES[product.name] || PRODUCT_IMAGE_OVERRIDES[product.category];
  return (
    product.image_url ||
    productImages[overrideKey] ||
    productImages[product.image] ||
    productImages["product-broiler.png"]
  );
}

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All Products");
  const [addedId, setAddedId] = useState(null);

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.products))
      .catch(() => setError("Could not load the product catalog right now. Please try again later."))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const byCategory = {};
    products.forEach((product) => {
      if (!byCategory[product.category]) byCategory[product.category] = [];
      byCategory[product.category].push(product);
    });
    return byCategory;
  }, [products]);

  const visibleCategories =
    activeTab === "All Products" ? Object.keys(grouped) : [activeTab].filter((c) => grouped[c]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    addItem(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <>
      <PageHero
        title="Our Products"
        subtitle="Comprehensive range of nutritionally balanced feed products designed for different livestock needs"
      />

      <div className="page-wrap tab-row section-pad">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && <p className="page-wrap section-pad">Loading products...</p>}
      {error && <p className="page-wrap section-pad dash-error">{error}</p>}

      {!loading &&
        !error &&
        visibleCategories.map((category) => (
          <section className="page-wrap section-pad" key={category}>
            <h2 style={{ marginBottom: 16 }}>{category}</h2>
            <div className="product-grid">
              {grouped[category].map((product) => (
                <article className="product-card hover-card" key={product.id}>
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                  />
                  <div>
                    <h2>{product.name}</h2>
                    {product.stage && <p className="product-stage">{product.stage}</p>}
                    <p>{product.description}</p>
                    <div className="product-price-row">
                      <strong>Rs. {Number(product.price).toLocaleString()}</strong>
                      <span className="dash-muted-small"> / {product.unit}</span>
                    </div>
                    <button
                      type="button"
                      className="button button-primary product-add-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      {addedId === product.id ? "Added ✓" : "Add to Cart"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
    </>
  );
}

export default ProductsPage;
