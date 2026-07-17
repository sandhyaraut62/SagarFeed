import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import { useCart } from "../context/CartContext.jsx";
import api from "../api.js";

function CartPage() {
  const { items, updateQuantity, replaceItems, removeItem, totalAmount, totalItems } = useCart();
  const [cartNotice, setCartNotice] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) return;

    let ignore = false;
    api
      .get("/products")
      .then((res) => {
        if (ignore) return;

        const activeProducts = new Map(res.data.products.map((product) => [product.id, product]));
        let changed = false;
        let removed = false;

        const nextItems = items
          .map((item) => {
            const product = activeProducts.get(item.productId);
            if (!product) {
              changed = true;
              removed = true;
              return null;
            }

            const nextItem = {
              ...item,
              name: product.name,
              category: product.category,
              stage: product.stage,
              image: product.image,
              imageUrl: product.image_url,
              price: Number(product.price),
              unit: product.unit,
            };

            if (JSON.stringify(nextItem) !== JSON.stringify(item)) changed = true;
            return nextItem;
          })
          .filter(Boolean);

        if (changed) {
          replaceItems(nextItems);
          setCartNotice(
            removed
              ? "Your cart was updated because one or more products are no longer available."
              : "Your cart was updated with the latest product details."
          );
        }
      })
      .catch(() => {
        if (!ignore) setCartNotice("Could not refresh the latest product details right now.");
      });

    return () => {
      ignore = true;
    };
  }, [items, replaceItems]);

  return (
    <>
      <PageHero title="Your Cart" subtitle="Review your items before checking out" />

      <div className="page-wrap section-pad">
        {cartNotice && <p className="dash-success">{cartNotice}</p>}
        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link className="button button-primary" to="/products">
              Browse Products →
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-row" key={item.productId}>
                  <div className="cart-row-info">
                    <strong>{item.name}</strong>
                    <span className="dash-muted-small">{item.category} · {item.unit}</span>
                  </div>
                  <div className="cart-row-qty">
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <div className="cart-row-price">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                  <button
                    type="button"
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <aside className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary-row">
                <span>Items ({totalItems})</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="cart-summary-row">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <button
                type="button"
                className="button button-primary cart-checkout-btn"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout →
              </button>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

export default CartPage;
