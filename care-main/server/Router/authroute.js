import express from "express";
import authController from "../controllers/Usercontroller.js";

const router = express.Router();

// ================================
// AUTH
// ================================

router.post(
  "/register",
  authController.register
);

router.post(
  "/login",
  authController.login
);

router.post(
  "/refresh",
  authController.refresh
);

router.post(
  "/logout",
  authController.logout
);

// ================================
// FORGOT PASSWORD
// ================================

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/verify-otp",
  authController.verifyForgotPasswordOtp
);

router.post(
  "/reset-password",
  authController.resetPassword
);

export default router;