import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import "./ForgotPassword.css";
import { Home } from "lucide-react";
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Page fade
      tl.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Card animation
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

      // Header animation
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

      // Form animation
      tl.from(
        formRef.current.querySelectorAll(".form-group"),
        {
          x: -30,
          opacity: 0,
          duration: 0.45,
          stagger: 0.12,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // Button animation
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
  }, []);

  // ==========================================
  // BUTTON HOVER ANIMATION
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
  // SUBMIT LOGIC - UNCHANGED
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      console.log(
        "FORGOT PASSWORD RESPONSE:",
        response.data
      );

      setMessage(
        response.data.message ||
          "OTP sent successfully"
      );

      // Go to OTP page
      navigate("/verify-otp", {
        state: { email },
      });
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error.response?.data || error
      );

      setError(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="forgot-page"
      ref={pageRef}
    >
      <Link to="/" className="home-logo ">
  <Home size={24} />
  <span></span>
</Link>
      {/* Background circles */}
      <div className="forgot-circle circle-one"></div>
      <div className="forgot-circle circle-two"></div>

      <div
        className="forgot-card"
        ref={cardRef}
      >
        {/* Header */}
        <div
          className="forgot-header"
          ref={headerRef}
        >
          <div className="forgot-icon">
            🔐
          </div>

          <h1>Forgot Password</h1>

          <p>
            Enter your email to receive an OTP
          </p>
        </div>

        {/* Message */}
        {message && (
          <p className="forgot-message">
            {message}
          </p>
        )}

        {/* Error */}
        {error && (
          <p className="forgot-error">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          ref={formRef}
        >
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="forgot-button"
            ref={buttonRef}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;