import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  KeyRound,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

import "./Login.css";
import "./ForgotPassword.css";

import { forgotPassword, resetPassword } from "../../services/authService";

const RESEND_SECONDS = 60;

function ForgotPassword() {
  const [step, setStep] = useState("email"); 

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = async () => {
    setError("");
    setInfo("");
    setIsLoading(true);

    const result = await forgotPassword(email);

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return false;
    }

    if (import.meta.env.DEV && result.debugOtp) {
      console.log("[DEV] reset OTP:", result.debugOtp);
    }

    setInfo(result.message);
    setCooldown(RESEND_SECONDS);
    return true;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    const ok = await sendCode();
    if (ok) setStep("reset");
  };

  const handleResend = async () => {
    if (cooldown > 0 || isLoading) return;
    await sendCode();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setIsLoading(true);

    const result = await resetPassword({
      email,
      otp,
      password,
      passwordConfirmation: confirm,
    });

    setIsLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setInfo(result.message);
    setStep("done");
  };

  const backToEmail = () => {
    setStep("email");
    setOtp("");
    setPassword("");
    setConfirm("");
    setError("");
    setInfo("");
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
            <span className="brand-label">ACCOUNT RECOVERY</span>

            <h1>
              Forgot your password?
              <span>We'll get you back in.</span>
            </h1>

            <p>
              Enter your email, get a 6-digit code, and choose a new password.
            </p>
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
          {step === "email" && (
            <>
              <div className="login-header">
                <span className="login-eyebrow">Step 1 of 2</span>
                <h2>Reset your password</h2>
                <p>Enter the email address linked to your account.</p>
              </div>

              <form onSubmit={handleSendCode} className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>

                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                {error && <div className="login-error">{error}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Sending..." : "Send Code"}</span>
                  {!isLoading && <ArrowUpRight size={18} />}
                </button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <div className="login-header">
                <span className="login-eyebrow">Step 2 of 2</span>
                <h2>Enter the code</h2>
                <p>
                  We sent a 6-digit code to <strong>{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleReset} className="login-form">
                {info && <div className="forgot-info">{info}</div>}

                <div className="form-group">
                  <label htmlFor="otp">Verification Code</label>

                  <div className="input-wrapper">
                    <KeyRound size={18} />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        if (error) setError("");
                      }}
                      autoComplete="one-time-code"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="new-password">New Password</label>

                  <div className="input-wrapper">
                    <LockKeyhole size={18} />
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword((p) => !p)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password">Confirm Password</label>

                  <div className="input-wrapper">
                    <LockKeyhole size={18} />
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Repeat the new password"
                      value={confirm}
                      onChange={(e) => {
                        setConfirm(e.target.value);
                        if (error) setError("");
                      }}
                      autoComplete="new-password"
                      required
                    />
                  </div>
                </div>

                {error && <div className="login-error">{error}</div>}

                <button
                  type="submit"
                  className="login-button"
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Updating..." : "Reset Password"}</span>
                  {!isLoading && <ArrowUpRight size={18} />}
                </button>

                <div className="forgot-links">
                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={handleResend}
                    disabled={cooldown > 0 || isLoading}
                  >
                    {cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend code"}
                  </button>

                  <button
                    type="button"
                    className="forgot-link-btn"
                    onClick={backToEmail}
                  >
                    Change email
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "done" && (
            <div className="login-header">
              <span className="login-eyebrow">All set</span>
              <h2>Password updated</h2>
              <p>{info || "Please sign in with your new password."}</p>

              <Link to="/login" className="login-button forgot-done-btn">
                <span>Back to Sign In</span>
                <ArrowUpRight size={18} />
              </Link>
            </div>
          )}

          {step !== "done" && (
            <Link to="/login" className="forgot-back">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          )}

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

export default ForgotPassword;
