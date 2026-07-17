import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../../content.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { LogoutIcon } from "./icons.jsx";

// links: [{ label, to, icon: Component, end? }]
function DashboardShell({ links, roleLabel, accent = "navy" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`dash-shell dash-accent-${accent}`}>
      <aside className={`dash-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="dash-brand">
          <img src={assets.logo} alt="Sagar Feeds" />
          <span className="dash-role-pill">{roleLabel}</span>
        </div>

        <div className="dash-profile">
          <div className="dash-avatar">{(user?.fullName || "U").charAt(0).toUpperCase()}</div>
          <div>
            <strong>{user?.fullName}</strong>
            <p>{user?.email}</p>
          </div>
        </div>

        <nav className="dash-nav">
          {links.map(({ label, to, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setMobileOpen(false)}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="dash-logout" onClick={handleLogout}>
          <LogoutIcon />
          <span>Log Out</span>
        </button>
      </aside>

      <div className="dash-main">
        <header className="dash-topbar">
          <button
            type="button"
            className="dash-menu-toggle"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div className="dash-topbar-title">
            <h1>{roleLabel} Dashboard</h1>
            <p>Welcome back, {user?.fullName?.split(" ")[0]}</p>
          </div>
          <NavLink to="/" className="dash-site-link">
            ← Back to site
          </NavLink>
        </header>

        <div className="dash-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardShell;
