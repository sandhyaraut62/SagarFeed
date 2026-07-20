import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets, navLinks } from "../content.js";
import { useAuth } from "../context/AuthContext.jsx";
import NotificationBell from "./NotificationBell.jsx";

const DASHBOARD_BY_ROLE = {
  Farmer: "/farmer",
  Dealer: "/dealer",
  Admin: "/admin",
};

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Keep main links separate from auth links so auth links can be right-aligned
  const primaryLinks = navLinks.filter(([, path]) => path !== "/login" && path !== "/register");
  const supportLinks = [
    { label: "Farmer Support", path: "/farmer-support" },
    { label: "Collaborations", path: "/collaborations" },
    { label: "Social Responsibility", path: "/social-responsibility" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <NavLink className="brand" to="/" aria-label="Sagar Feeds home">
        <img src={assets.logo} alt="Sagar Feeds" />
      </NavLink>

      <nav aria-label="Main navigation" className="main-nav">
        {primaryLinks.map(([label, path]) => (
          <NavLink key={path} to={path} end={path === "/"}>
            {label}
          </NavLink>
        ))}

        <div
          className={`nav-dropdown ${isSupportOpen ? "open" : ""}`}
          onMouseEnter={() => setIsSupportOpen(true)}
          onMouseLeave={() => setIsSupportOpen(false)}
        >
          <button
            type="button"
            className="nav-dropdown-toggle"
            onClick={() => setIsSupportOpen((prev) => !prev)}
            onFocus={() => setIsSupportOpen(true)}
            onBlur={() => setIsSupportOpen(false)}
            aria-expanded={isSupportOpen}
            aria-haspopup="menu"
          >
            <b>More <span aria-hidden="true">▾</span></b>
          </button>

          <div className="nav-dropdown-menu" role="menu">
            {supportLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className="nav-dropdown-link"
                role="menuitem"
                onClick={() => setIsSupportOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <nav aria-label="Auth navigation" className="auth-nav">
        {isAuthenticated ? (
          <>
            <NotificationBell />
            <NavLink to={DASHBOARD_BY_ROLE[user.role] || "/"}>Dashboard</NavLink>
            <button type="button" className="header-logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Sign In</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
