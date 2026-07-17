import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import api from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const STEPS = ["Delivery Address", "Payment Method", "Confirm"];

function CheckoutPage() {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [address, setAddress] = useState({
    fullName: user?.fullName || "",
    phone: "",
    addressLine: "",
    city: "",
    district: "",
    landmark: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/addresses")
      .then((res) => {
        setSavedAddresses(res.data.addresses);
        if (res.data.addresses.length > 0) {
          setSelectedAddressId(res.data.addresses[0].id);
        } else {
          setShowNewAddressForm(true);
        }
      })
      .catch(() => setShowNewAddressForm(true))
      .finally(() => setLoadingAddresses(false));
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const reviewAddress = showNewAddressForm
    ? address
    : (() => {
        const saved = savedAddresses.find((a) => a.id === selectedAddressId);
        return saved
          ? {
              fullName: saved.full_name,
              phone: saved.phone,
              addressLine: saved.address_line,
              city: saved.city,
              district: saved.district,
              landmark: saved.landmark,
            }
          : address;
      })();

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      const payload = {
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        paymentMethod,
      };
      if (!showNewAddressForm && selectedAddressId) {
        payload.addressId = selectedAddressId;
      } else {
        payload.address = address;
      }

      const res = await api.post("/orders", payload);
      const order = res.data.order;

      if (paymentMethod === "esewa") {
        // Redirect to eSewa's payment page; the cart is cleared once payment is
        // confirmed on the callback page, not here (order isn't paid yet).
        const initRes = await api.post("/payments/esewa/initiate", { orderId: order.id });
        const { formUrl, fields } = initRes.data;

        const form = document.createElement("form");
        form.method = "POST";
        form.action = formUrl;
        Object.entries(fields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        clearCart();
        form.submit();
        return;
      }

      clearCart();
      navigate("/order-success", { state: { order } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong while placing your order.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <PageHero title="Checkout" subtitle="Complete your order" />
        <div className="page-wrap section-pad cart-empty">
          <p>Your cart is empty — add some products before checking out.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero title="Checkout" subtitle="Just a couple of steps to complete your order" />

      <div className="page-wrap section-pad checkout-layout">
        <div className="checkout-main">
          <ol className="checkout-steps">
            {STEPS.map((label, i) => (
              <li key={label} className={i === step ? "is-active" : i < step ? "is-done" : ""}>
                <span className="checkout-step-num">{i + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {step === 0 && (
            <div className="checkout-card">
              <h3>Delivery Address</h3>

              {loadingAddresses ? (
                <p className="dash-loading">Loading your saved addresses...</p>
              ) : (
                <>
                  {savedAddresses.length > 0 && (
                    <div className="saved-address-list">
                      {savedAddresses.map((saved) => (
                        <label
                          key={saved.id}
                          className={`payment-option ${
                            !showNewAddressForm && selectedAddressId === saved.id ? "is-selected" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={!showNewAddressForm && selectedAddressId === saved.id}
                            onChange={() => {
                              setSelectedAddressId(saved.id);
                              setShowNewAddressForm(false);
                            }}
                          />
                          <span className="payment-option-text">
                            <strong>{saved.full_name} · {saved.phone}</strong>
                            <small>
                              {saved.address_line}, {saved.city}
                              {saved.district ? `, ${saved.district}` : ""}
                            </small>
                          </span>
                        </label>
                      ))}

                      <label className={`payment-option ${showNewAddressForm ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="savedAddress"
                          checked={showNewAddressForm}
                          onChange={() => setShowNewAddressForm(true)}
                        />
                        <span className="payment-option-text">
                          <strong>+ Use a new address</strong>
                        </span>
                      </label>
                    </div>
                  )}

                  {showNewAddressForm && (
                    <form className="checkout-address-form" onSubmit={handleAddressSubmit}>
                      <label>
                        <b>Full Name</b>
                        <input name="fullName" value={address.fullName} onChange={handleAddressChange} required />
                      </label>
                      <label>
                        <b>Phone Number</b>
                        <input name="phone" value={address.phone} onChange={handleAddressChange} required />
                      </label>
                      <label>
                        <b>Address</b>
                        <input
                          name="addressLine"
                          placeholder="Street / Ward / Tole"
                          value={address.addressLine}
                          onChange={handleAddressChange}
                          required
                        />
                      </label>
                      <div className="two-col">
                        <label>
                          <b>City / Municipality</b>
                          <input name="city" value={address.city} onChange={handleAddressChange} required />
                        </label>
                        <label>
                          <b>District</b>
                          <input name="district" value={address.district} onChange={handleAddressChange} />
                        </label>
                      </div>
                      <label>
                        <b>Landmark (optional)</b>
                        <input name="landmark" value={address.landmark} onChange={handleAddressChange} />
                      </label>
                      <button className="form-button" type="submit">Continue to Payment →</button>
                    </form>
                  )}

                  {!showNewAddressForm && selectedAddressId && (
                    <button
                      type="button"
                      className="form-button"
                      style={{ marginTop: 16 }}
                      onClick={() => setStep(1)}
                    >
                      Continue to Payment →
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="checkout-card">
              <h3>Payment Method</h3>

              <label className={`payment-option ${paymentMethod === "esewa" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="esewa"
                  checked={paymentMethod === "esewa"}
                  onChange={() => setPaymentMethod("esewa")}
                />
                <span className="payment-option-icon payment-icon-esewa">eSewa</span>
                <span className="payment-option-text">
                  <strong>Pay with eSewa</strong>
                  <small>Fast, secure digital wallet payment</small>
                </span>
              </label>

              <label className={`payment-option ${paymentMethod === "cod" ? "is-selected" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <span className="payment-option-icon payment-icon-cod">₨</span>
                <span className="payment-option-text">
                  <strong>Cash on Delivery</strong>
                  <small>Pay in cash when your order arrives</small>
                </span>
              </label>

              <div className="checkout-nav-row">
                <button type="button" className="button button-outline" onClick={() => setStep(0)}>
                  ← Back
                </button>
                <button type="button" className="form-button" style={{ width: "auto" }} onClick={() => setStep(2)}>
                  Continue to Review →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-card">
              <h3>Review & Confirm</h3>

              <div className="checkout-review-block">
                <h4>Deliver To</h4>
                <p>{reviewAddress.fullName} · {reviewAddress.phone}</p>
                <p>
                  {reviewAddress.addressLine}, {reviewAddress.city}
                  {reviewAddress.district ? `, ${reviewAddress.district}` : ""}
                </p>
                {reviewAddress.landmark && <p>Landmark: {reviewAddress.landmark}</p>}
              </div>

              <div className="checkout-review-block">
                <h4>Payment Method</h4>
                <p>{paymentMethod === "esewa" ? "eSewa (Digital Wallet)" : "Cash on Delivery"}</p>
              </div>

              <div className="checkout-review-block">
                <h4>Items</h4>
                {items.map((item) => (
                  <div className="cart-summary-row" key={item.productId}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {error && <p className="dash-error">{error}</p>}

              <div className="checkout-nav-row">
                <button type="button" className="button button-outline" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="form-button"
                  style={{ width: "auto" }}
                  disabled={placing}
                  onClick={handlePlaceOrder}
                >
                  {placing ? "Placing Order..." : `Place Order — Rs. ${totalAmount.toLocaleString()}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item) => (
            <div className="cart-summary-row" key={item.productId}>
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="cart-summary-row cart-summary-total">
            <span>Total</span>
            <span>Rs. {totalAmount.toLocaleString()}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

export default CheckoutPage;
