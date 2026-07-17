import { createContext, useContext, useEffect, useState } from "react";
import api from "../api.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "sagarfeeds_auth";

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate the stored token against the backend once on load; if it's
    // stale/expired or the account was blocked/removed, clear the session.
    const stored = readStoredAuth();

    Promise.resolve().then(() => {
      if (!stored?.token) {
        setLoading(false);
        return;
      }

      api
        .get("/auth/me", { headers: { Authorization: `Bearer ${stored.token}` } })
        .then((res) => {
          const refreshed = { token: stored.token, user: res.data.user };
          setAuth(refreshed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(refreshed));
        })
        .catch(() => {
          localStorage.removeItem(STORAGE_KEY);
          setAuth(null);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const nextAuth = { token: res.data.token, user: res.data.user };
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    return nextAuth.user;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token),
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export default AuthContext;
