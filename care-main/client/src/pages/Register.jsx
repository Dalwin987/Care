import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import api from "../Api/Axios";
import "./Register.css";
import { Home } from "lucide-react"

const Register = () => {
  const navigate = useNavigate();

  // GSAP refs
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      // Form fields
      tl.from(
        formRef.current.querySelectorAll(".register-group"),
        {
          x: -30,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
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
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...userData } = formData;

      const response = await api.post(
        "/auth/register",
        userData
      );

      alert(response.data.message);

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page" ref={pageRef}>
<Link to="/" className="home-logo ">
  <Home size={24} />
  <span></span>
</Link>
      {/* Background decorations */}
      <div className="blue-circle circle-one"></div>
      <div className="blue-circle circle-two"></div>

      <div className="register-card" ref={cardRef}>

        {/* Header */}
        <div
          className="register-header"
          ref={headerRef}
        >
          <div className="register-icon">
            +
          </div>

          <h2>Create Account</h2>

          <p>
            Join the Medical Care Buddy community and start your journey towards better health today!
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="register-form"
          ref={formRef}
        >

          {/* Name */}
          <div className="register-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div className="register-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div className="register-group">
            <label htmlFor="phone">
              Phone Number{" "}
              <span className="optional">
                (optional)
              </span>
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          {/* Password */}
          <div className="register-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div className="register-group">
            <label htmlFor="confirmPassword">
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="register-button"
            ref={buttonRef}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* Login */}
          <p className="login-link">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;