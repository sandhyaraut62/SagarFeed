import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api.js";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [devLink, setDevLink] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setDevLink("");
    setSubmitting(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      if (res.data.devResetLink) setDevLink(res.data.devResetLink);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-only">
      <div className="auth-card-container">
        <aside className="auth-card">
          <h2>Forgot your password?</h2>
          <p className="muted">Enter your email and we'll send you a reset link</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <b>Email address</b>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            {message && <p className="dash-muted-small" style={{ color: "#1c8a44" }}>{message}</p>}
            {devLink && (
              <p className="dash-muted-small">
                (Dev mode — no email server configured) Reset link:{" "}
                <Link to={devLink.replace(window.location.origin, "")}>{devLink}</Link>
              </p>
            )}
            {error && <p className="dash-error">{error}</p>}

            <button className="form-button" disabled={submitting}>
              {submitting ? "Sending..." : "Send Reset Link →"}
            </button>

            <div className="auth-alt">
              <p>
                <Link to="/login">← Back to Sign In</Link>
              </p>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
