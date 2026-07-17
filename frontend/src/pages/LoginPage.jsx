import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const DASHBOARD_BY_ROLE = {
  Farmer: "/farmer",
  Dealer: "/dealer",
  Admin: "/admin",
};

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login(formData.email, formData.password);
      const from = location.state?.from;
      navigate(from && from !== "/login" ? from : DASHBOARD_BY_ROLE[user.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-only">
      <div className="auth-card-container">
        <aside className="auth-card">
          <h2>Welcome back</h2>
          <p className="muted">Sign in to your account to continue</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <b>Email address</b>
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
              <b>Password</b>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>

            <div className="auth-alt" style={{ textAlign: "right", margin: "-8px 0 0" }}>
              <Link to="/forgot-password" style={{ fontSize: 13 }}>Forgot password?</Link>
            </div>

            {error && <p className="dash-error">{error}</p>}

            <button className="form-button" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In →"}
            </button>

            <div className="auth-alt">
              <p>
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}

export default LoginPage;
