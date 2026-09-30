import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import "./Login.css";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  Store,
} from "lucide-react";
import { loginUser } from "../../services/authService";
import { getAuth } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({ phone: "", password: "" });


  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const auth = getAuth();

  if (auth?.token && auth?.user) {
    return (
      <Navigate
        to={
          auth.user.role === "admin"
            ? "/admin/dashboard"
            : "/provider/dashboard"
        }
        replace
      />
    );
  }
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await loginUser(formData.phone, formData.password);

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(
      result.user.role === "admin" ? "/admin/dashboard" : "/provider/dashboard",
    );
  };

  return (
    <main className="login-page">
      <section className="login-brand">
        <div className="brand-logo-watermark" aria-hidden="true" />

        <div className="brand-background-shape shape-one" aria-hidden="true" />

        <div className="brand-background-shape shape-two" aria-hidden="true" />

        <div className="brand-content">
          <div className="brand-header">
            <div className="brand-logo">
              <img src="/Logo.png" alt="MR Shopping" />
            </div>
          </div>

          <div className="brand-main">
            <span className="brand-label">MANAGEMENT PLATFORM</span>

            <h1>
              Everything you need.
              <span>In one place.</span>
            </h1>

            <p>
              Manage your business, orders, services and daily operations
              through one simple and powerful platform.
            </p>
          </div>

          <div className="brand-features">
            <div className="brand-feature">
              <div className="feature-icon">
                <Store size={18} />
              </div>

              <div>
                <strong>Business Management</strong>

                <span>Manage your operations with ease.</span>
              </div>
            </div>

            <div className="brand-feature">
              <div className="feature-icon">
                <ShieldCheck size={18} />
              </div>

              <div>
                <strong>Secure & Reliable</strong>

                <span>Your data is always protected.</span>
              </div>
            </div>
          </div>

          <div className="brand-footer">
            <span>Smart</span>

            <span className="footer-dot" />

            <span>Simple</span>

            <span className="footer-dot" />

            <span>Connected</span>
          </div>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-wrapper">
          <div className="mobile-brand">
            <div className="mobile-logo">
              <img src="/logo.png" alt="MR Shopping" />
            </div>
          </div>

          <div className="login-header">
            <span className="login-eyebrow">Welcome back</span>

            <h2>Sign in to your account</h2>

            <p>Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>

              <div className="input-wrapper">
                <Phone size={18} />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+201001234567"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={18} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />

                <span>Remember me</span>
              </label>

              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              <span>{isLoading ? "Signing in..." : "Sign In"}</span>

              {!isLoading && <ArrowUpRight size={18} />}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={15} />

            <span>Your account information is securely protected.</span>
          </div>

          <p className="login-footer">
            © {new Date().getFullYear()} MR Shopping. All rights reserved.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
