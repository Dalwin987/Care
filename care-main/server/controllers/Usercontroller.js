import bcrypt from "bcryptjs";
import User from "../models/User.js";
import RefreshToken from "../middleware/Refreshtoken.js";
import resend from "../config/Resend.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/JwtUtils.js";

// ======================================================
// GENERATE OTP
// ======================================================

const generateOtp = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};

// ======================================================
// REGISTER
// POST /api/auth/register
// ======================================================

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone
    ) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Normalize email
    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
// ======================================================
// LOGIN
// POST /api/auth/login
// ======================================================

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error:
          "Email and password are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: "Account disabled",
      });
    }

    // Generate tokens
    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    // Save refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() +
          7 * 24 * 60 * 60 * 1000
      ),
    });

    // Save refresh token in cookie
    res.cookie(
      "refreshToken",
      refreshToken,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "strict",

        maxAge:
          7 * 24 * 60 * 60 * 1000,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ======================================================
// FORGOT PASSWORD - SEND OTP
// POST /api/auth/forgot-password
// ======================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Email not available",
      });
    }

    // Generate OTP
    const otp = generateOtp();

    // OTP valid for 10 minutes
    const expiry = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // Save OTP in MongoDB
    user.forgot_password_otp = otp;
    user.forgot_password_expiry = expiry;

    await user.save();

    console.log("==============================");
    console.log("OTP SAVED");
    console.log("EMAIL:", user.email);
    console.log("OTP:", otp);
    console.log("EXPIRY:", expiry);
    console.log("==============================");

    // Send OTP email
    const { data, error } =
      await resend.emails.send({
        from: `DoseBox <${process.env.RESEND_FROM_EMAIL}>`,

        to: user.email,

        subject:
          "DoseBox - Password Reset OTP",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
          ">

            <h2 style="color:#2563eb;">
              💊 DoseBox
            </h2>

            <p>Hello ${user.name},</p>

            <p>
              You requested to reset your
              DoseBox password.
            </p>

            <p>
              Your password reset OTP is:
            </p>

            <div style="
              background:#eff6ff;
              padding:20px;
              text-align:center;
              border-radius:10px;
              margin:20px 0;
            ">

              <h1 style="
                color:#2563eb;
                letter-spacing:8px;
              ">
                ${otp}
              </h1>

            </div>

            <p>
              This OTP is valid for
              <strong>10 minutes</strong>.
            </p>

            <p style="color:#777;">
              If you did not request this,
              please ignore this email.
            </p>

          </div>
        `,
      });

    if (error) {
      console.error(
        "RESEND ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        error:
          "Failed to send OTP email",
      });
    }

    console.log(
      "EMAIL SENT:",
      data?.id
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP sent successfully",
    });
  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ======================================================
// VERIFY OTP
// POST /api/auth/verify-otp
// ======================================================

const verifyForgotPasswordOtp = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error:
          "Email and OTP are required",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const enteredOtp = otp
      .toString()
      .trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Email not available",
      });
    }

    console.log("==============================");
    console.log(
      "VERIFY EMAIL:",
      normalizedEmail
    );
    console.log(
      "DB OTP:",
      user.forgot_password_otp
    );
    console.log(
      "ENTERED OTP:",
      enteredOtp
    );
    console.log(
      "EXPIRY:",
      user.forgot_password_expiry
    );
    console.log("==============================");

    // OTP doesn't exist
    if (!user.forgot_password_otp) {
      return res.status(400).json({
        success: false,
        error: "OTP not found",
      });
    }

    // OTP expired
    if (
      !user.forgot_password_expiry ||
      user.forgot_password_expiry <
        new Date()
    ) {
      return res.status(400).json({
        success: false,
        error: "OTP expired",
      });
    }

    // OTP doesn't match
    if (
      user.forgot_password_otp !==
      enteredOtp
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    console.log(
      "✅ OTP VERIFIED SUCCESSFULLY"
    );

    return res.status(200).json({
      success: true,
      message:
        "OTP verified successfully",
    });
  } catch (error) {
    console.error(
      "VERIFY OTP ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ======================================================
// RESET PASSWORD
// POST /api/auth/reset-password
// ======================================================

const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      newPassword,
      confirmPassword,
    } = req.body;

    // Validation
    if (
      !email ||
      !otp ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Email, OTP, newPassword and confirmPassword are required",
      });
    }

    // Check passwords
    if (
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Passwords do not match",
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    const enteredOtp = otp
      .toString()
      .trim();

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Email not available",
      });
    }

    // OTP exists?
    if (!user.forgot_password_otp) {
      return res.status(400).json({
        success: false,
        error: "OTP not found",
      });
    }

    // OTP match?
    if (
      user.forgot_password_otp !==
      enteredOtp
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid OTP",
      });
    }

    // OTP expired?
    if (
      !user.forgot_password_expiry ||
      user.forgot_password_expiry <
        new Date()
    ) {
      return res.status(400).json({
        success: false,
        error: "OTP expired",
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    // Clear OTP
    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;

    await user.save();

    console.log(
      `✅ PASSWORD RESET: ${user.email}`
    );

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully",
    });
  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ======================================================
// REFRESH TOKEN
// POST /api/auth/refresh
// ======================================================

const refresh = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error:
          "Refresh token not found",
      });
    }

    const decoded =
      verifyRefreshToken(
        refreshToken
      );

    const storedToken =
      await RefreshToken.findOne({
        token: refreshToken,
        revoked: false,
      });

    if (
      !storedToken ||
      storedToken.expiresAt <
        new Date()
    ) {
      return res.status(403).json({
        success: false,
        error:
          "Invalid or expired refresh token",
      });
    }

    const user =
      await User.findById(
        decoded.id
      );

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        error:
          "User not found or inactive",
      });
    }

    const accessToken =
      generateAccessToken(user);

    return res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    console.error(
      "REFRESH ERROR:",
      error
    );

    return res.status(403).json({
      success: false,
      error:
        "Invalid refresh token",
    });
  }
};

// ======================================================
// LOGOUT
// POST /api/auth/logout
// ======================================================

const logout = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (refreshToken) {
      await RefreshToken.findOneAndUpdate(
        {
          token: refreshToken,
        },
        {
          revoked: true,
        }
      );
    }

    res.clearCookie(
      "refreshToken",
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite: "strict",
      }
    );

    return res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  } catch (error) {
    console.error(
      "LOGOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default {
  register,
  login,
  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
  refresh,
  logout,
};