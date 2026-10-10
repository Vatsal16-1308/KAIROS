import { useState } from "react";
import "./Navbar.css";
import { FaSearch, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaCalendarCheck, FaChartLine, FaShieldAlt } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ThemeToggle from "../../ThemeToggle/ThemeToggle";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMobileMenuOpen(false);
    }
  };

  const getDashboardRoute = () => {
    if (role === "ADMIN") return "/admin";
    if (role === "ORGANIZER") return "/organizer-dashboard";
    return "/user-dashboard";
  };

  const getDashboardLabel = () => {
    if (role === "ADMIN") return "Admin Panel";
    if (role === "ORGANIZER") return "Organizer Hub";
    return "My Tickets";
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar__logo" onClick={() => setMobileMenuOpen(false)}>
          <h2>Kairos</h2>
        </Link>

        {/* Navigation */}
        <ul className={`navbar__links ${mobileMenuOpen ? "navbar__links--open" : ""}`}>
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          </li>
          <li className={location.pathname.startsWith("/events") ? "active" : ""}>
            <Link to="/events" onClick={() => setMobileMenuOpen(false)}>Events</Link>
          </li>

          {isAuthenticated && (
            <li className={location.pathname === getDashboardRoute() ? "active" : ""}>
              <Link to={getDashboardRoute()} onClick={() => setMobileMenuOpen(false)}>
                {getDashboardLabel()}
              </Link>
            </li>
          )}
        </ul>

        {/* Right Side */}
        <div className="navbar__actions">
          <form className="search-box" onSubmit={handleSearch}>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <ThemeToggle />

          {isAuthenticated ? (
            <div className="navbar__user-section">
              <Link to={getDashboardRoute()} className="user-profile-badge">
                <span className="user-avatar-icon">
                  {role === "ADMIN" ? <FaShieldAlt /> : role === "ORGANIZER" ? <FaChartLine /> : <FaCalendarCheck />}
                </span>
                <span className="user-name-label">{user?.name?.split(" ")[0]}</span>
                <span className={`role-pill role-pill--${role?.toLowerCase()}`}>{role}</span>
              </Link>
              <button
                className="logout-btn"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                title="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="navbar__auth-buttons">
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
            </div>
          )}

          <button
            className="menu-icon-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <FaTimes className="menu-icon" /> : <FaBars className="menu-icon" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;