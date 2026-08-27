import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/authcontext.jsx";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Link } from "react-router-dom";
import "./Login.css";
import { Home } from "lucide-react"
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // GSAP refs
  const pageRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // ==========================================
  // GSAP PAGE ANIMATION
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

      // Forgot password
      tl.from(
        ".forgot-password",
        {
          opacity: 0,
          y: 10,
          duration: 0.4,
        },
        "-=0.2"
      );

      // Login button
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

      // Demo text
      tl.from(
        ".demo-text",
        {
          opacity: 0,
          duration: 0.4,
        },
        "-=0.2"
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // ==========================================
  // LOGIN BUTTON HOVER
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
  // LOGIN LOGIC - UNCHANGED
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      alert(
        "Login failed: " +
          (err.response?.data?.error ||
            "Something went wrong")
      );
    }
  };

  return (
    <div className="login-page" ref={pageRef}>

<Link to="/" className="home-logo ">
  <Home size={24} />
  <span></span>
</Link>
      {/* Background decorations */}
      <div className="blue-circle login-circle-one"></div>
      <div className="blue-circle login-circle-two"></div>

      <div className="login-card" ref={cardRef}>

        {/* Header */}
        <div
          className="login-header"
          ref={headerRef}
        >
          <div className="login-icon">
            
          </div>

          <h2>Welcome Back</h2>

          <p>
  Care Buddy          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
          ref={formRef}
        >

          {/* EMAIL */}

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="you@example.com"
              required
            />
          </div>

          {/* PASSWORD */}

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
              required
            />
          </div>

          {/* FORGOT PASSWORD */}

          <div className="forgot-password">
            <button
              type="button"
              onClick={() =>
                navigate("/forgot-password")
              }
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-button"
            ref={buttonRef}
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
          >
            Log in
          </button>

          <p className="demo-text">
            Demo: Use any registered account
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;