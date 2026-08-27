import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import "./OtpVerification.css";
import { Home } from "lucide-react";

function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // GSAP refs
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // ==========================================
  // GSAP ANIMATION
  // ==========================================
  useEffect(() => {
    if (!email) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Page fade
      tl.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Card
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

      // Form
      tl.from(
        formRef.current.children,
        {
          x: -25,
          opacity: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }, pageRef);

    return () => ctx.revert();
  }, [email]);

  // ==========================================
  // BUTTON HOVER
  // ==========================================
  const handleButtonEnter = () => {
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
  // OTP SUBMIT - LOGIC UNCHANGED
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      console.log(
        "VERIFY OTP RESPONSE:",
        response.data
      );

      // Go to reset password page
      navigate("/reset-password", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EMAIL NOT FOUND
  // ==========================================
  if (!email) {
    return (
      <div className="otp-page otp-error-page">
        <Link to="/" className="home-logo ">
  <Home size={24} />
  <span></span>
</Link>
        <div className="otp-error-card">
          <div className="otp-error-icon">
            !
          </div>

          <p className="otp-error-title">
            Email not found
          </p>

          <button
            onClick={() =>
              navigate("/forgot-password")
            }
            className="otp-back-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="otp-page"
      ref={pageRef}
    >
      {/* Background decorations */}
      <div className="otp-circle otp-circle-one"></div>
      <div className="otp-circle otp-circle-two"></div>

      <div
        className="otp-card"
        ref={cardRef}
      >
        {/* Header */}
        <div
          className="otp-header"
          ref={headerRef}
        >
          <div className="otp-icon">
            🔐
          </div>

          <h1>Verify OTP</h1>

          <p>
            OTP sent to
            <br />

            <span>
              {email}
            </span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="otp-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          ref={formRef}
        >
          {/* OTP */}
          <div className="otp-form-group">
            <label htmlFor="otp">
              Enter OTP
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              placeholder="Enter 6 digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="otp-button"
            ref={buttonRef}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;