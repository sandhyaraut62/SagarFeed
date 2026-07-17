import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../api.js";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
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
          <h2>Set a new password</h2>
          <p className="muted">Choose a strong password for your account</p>

          {success ? (
            <p style={{ color: "#1c8a44", fontWeight: 700 }}>
              Password reset! Redirecting you to sign in...
            </p>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <label>
                <b>New Password</b>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </label>
              <label>
                <b>Confirm New Password</b>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>

              {error && <p className="dash-error">{error}</p>}

              <button className="form-button" disabled={submitting}>
                {submitting ? "Resetting..." : "Reset Password →"}
              </button>

              <div className="auth-alt">
                <p>
                  <Link to="/login">← Back to Sign In</Link>
                </p>
              </div>
            </form>
          )}
        </aside>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
