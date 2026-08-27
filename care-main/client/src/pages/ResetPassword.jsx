import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import "./ResetPassword.css";
import { Home } from "lucide-react"

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get email and OTP from Verify OTP page
  const email = location.state?.email;
  const otp = location.state?.otp;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // GSAP REFS
  // ==========================================

  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // ==========================================
  // GSAP ANIMATION
  // ==========================================

  useEffect(() => {
    if (!email || !otp) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Page fade
      tl.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Card entrance
      tl.from(
        cardRef.current,
        {
          y: 60,
          scale: 0.92,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      );

      // Header
      tl.from(
        headerRef.current.children,
        {
          y: -25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Form groups
      tl.from(
        formRef.current.querySelectorAll(
          ".reset-form-group"
        ),
        {
          x: -30,
          opacity: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // Button
      tl.from(
        buttonRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }, pageRef);

    return () => ctx.revert();
  }, [email, otp]);

  // ==========================================
  // BUTTON HOVER ANIMATION
  // ==========================================

  const handleButtonEnter = () => {
    if (loading) return;

    gsap.to(buttonRef.current, {
      scale: 1.03,
      y: -2,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  // ==========================================
  // HANDLE RESET PASSWORD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // Check password length
    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check email and OTP
    if (!email || !otp) {
      setError(
        "Invalid password reset session"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: email,
          otp: otp,
          newPassword: password,
          confirmPassword: confirmPassword,
        }
      );

      console.log(
        "RESET PASSWORD RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Password reset successfully"
        );

        // Redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(
          response.data.error ||
            "Failed to reset password"
        );
      }
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.error ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INVALID SESSION
  // ==========================================

  if (!email || !otp) {
    return (
      <div className="reset-page reset-invalid-page">
        <Link to="/" className="home-logo ">
  <Home size={24} />
  <span></span>
</Link>
        <div className="reset-invalid-card">

          <div className="reset-invalid-icon">
            !
          </div>

          <p className="reset-invalid-text">
            Invalid password reset session.
          </p>

          <button
            onClick={() =>
              navigate("/forgot-password")
            }
            className="reset-start-button"
          >
            Start Again
          </button>

        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="reset-page"
      ref={pageRef}
    >
      {/* Background circles */}
      <div className="reset-circle reset-circle-one"></div>
      <div className="reset-circle reset-circle-two"></div>

      <div
        className="reset-card"
        ref={cardRef}
      >

        {/* Header */}
        <div
          className="reset-header"
          ref={headerRef}
        >
          <div className="reset-icon">
            🔑
          </div>

          <h1>
            Reset Password
          </h1>

          <p>
            Create a new password for
            <br />

            <span>
              {email}
            </span>
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <p className="reset-message">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="reset-error">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          ref={formRef}
        >

          {/* New Password */}
          <div className="reset-form-group">

            <label htmlFor="password">
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
              disabled={loading}
            />

          </div>

          {/* Confirm Password */}
          <div className="reset-form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              required
              minLength={6}
              disabled={loading}
            />

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="reset-button"
            ref={buttonRef}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResetPassword;