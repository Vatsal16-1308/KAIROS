import { useState } from "react";
import "./Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      if (from !== "/") {
        navigate(from, { replace: true });
      } else if (result.user?.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (result.user?.role === "ORGANIZER") {
        navigate("/organizer-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    }
  };

  const setDemoUser = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-card">
          <h1>Kairos</h1>
          <p>Welcome back! Sign in to continue.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="demo-accounts-box">
            <span className="demo-label">Quick Test Accounts:</span>
            <div className="demo-chips">
              <button
                type="button"
                className="demo-chip"
                onClick={() => setDemoUser("student@kairos.com", "student123")}
              >
                👤 Student
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => setDemoUser("ieee@kairos.com", "organizer123")}
              >
                🏢 Organizer
              </button>
              <button
                type="button"
                className="demo-chip"
                onClick={() => setDemoUser("admin@kairos.com", "admin123")}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;