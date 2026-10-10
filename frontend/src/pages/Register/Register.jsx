import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/layout/Navbar/Navbar";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("USER"); // "USER" or "ORGANIZER"
  const [organizationName, setOrganizationName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const result = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      confirmPassword,
      role,
      organizationName: role === "ORGANIZER" ? organizationName.trim() : "",
      phone: phone.trim(),
    });
    setIsLoading(false);

    if (result.success) {
      if (role === "ORGANIZER") {
        navigate("/organizer-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-page">
        <div className="register-card">
          <h1>Create Account</h1>
          <p>Join Kairos to discover and host campus events.</p>

          <form onSubmit={handleSubmit}>
            <div className="role-selector-wrap">
              <label className="role-selector-label">I want to:</label>
              <div className="role-options">
                <button
                  type="button"
                  className={`role-tab ${role === "USER" ? "active" : ""}`}
                  onClick={() => setRole("USER")}
                >
                  🎓 Attend Events
                </button>
                <button
                  type="button"
                  className={`role-tab ${role === "ORGANIZER" ? "active" : ""}`}
                  onClick={() => setRole("ORGANIZER")}
                >
                  🏢 Host / Organize
                </button>
              </div>
            </div>

            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {role === "ORGANIZER" && (
              <input
                type="text"
                placeholder="Club / Organization / Chapter Name"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            )}

            <input
              type="tel"
              placeholder="Contact Phone Number (Optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password (min 6 characters)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;