import { NavLink, useNavigate } from "react-router-dom";
import { assets, navLinks } from "../content.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { CartIcon } from "./dashboard/icons.jsx";
import NotificationBell from "./NotificationBell.jsx";

const DASHBOARD_BY_ROLE = {
  Farmer: "/farmer",
  Dealer: "/dealer",
  Admin: "/admin",
};

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  // Keep main links separate from auth links so auth links can be right-aligned
  const primaryLinks = navLinks.filter(([, path]) => path !== "/login" && path !== "/register");

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
      </nav>

      <nav aria-label="Auth navigation" className="auth-nav">
        {isAuthenticated && user?.role !== "Admin" && (
          <NavLink to="/cart" className="header-cart-link" aria-label="Cart">
            <CartIcon />
            {totalItems > 0 && <span className="header-cart-count">{totalItems}</span>}
          </NavLink>
        )}

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
