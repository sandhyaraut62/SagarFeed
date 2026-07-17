import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await register(formData);
      navigate("/login", { state: { justRegistered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-only register-page">
      <div className="auth-card-container">
        <aside className="auth-card">
          <h2>Create an account</h2>
          <p className="muted">Join the Sagar Feed dealer & farmer network</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <b>Full Name</b>
              <input
                type="text"
                name="fullName"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </label>

            <div className="two-col">
              <label>
                <b>Email</b>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <b>Phone</b>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+977-XXX-XXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label>
              <b>I am a</b>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select your role</option>
                <option value="Dealer">Dealer</option>
                <option value="Farmer">Farmer</option>
              </select>
            </label>

            <label>
              <b>Password</b>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <b>Confirm Password</b>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />{" "}
              I agree to the <Link to="/terms" target="_blank">Terms of Service</Link> and{" "}
              <Link to="/privacy" target="_blank">Privacy Policy</Link>
            </label>

            {error && <p className="dash-error">{error}</p>}

            <button className="form-button" disabled={submitting}>
              {submitting ? "Creating account..." : "Create Account →"}
            </button>

            <div className="auth-alt">
              <p>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}

export default RegisterPage;
