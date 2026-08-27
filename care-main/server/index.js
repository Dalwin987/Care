import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import medicineRoutes from "./Router/Medicine.js";
import authRoutes from "./Router/authroute.js";
import startMedicineReminder from "./service/Medischedule.js";

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================
dotenv.config();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie middleware
app.use(cookieParser());

// ==========================================
// CHECK ENV VARIABLES
// ==========================================
console.log(
  "JWT_SECRET exists:",
  !!process.env.JWT_SECRET
);

console.log(
  "JWT_REFRESH_SECRET exists:",
  !!process.env.JWT_REFRESH_SECRET
);

console.log(
  "MONGO_URI exists:",
  !!process.env.MONGO_URI
);

console.log(
  "RESEND_API_KEY exists:",
  !!process.env.RESEND_API_KEY
);

console.log(
  "REMINDER_EMAIL:",
  process.env.REMINDER_EMAIL
);

// ==========================================
// ROUTES
// ==========================================
app.use("/api/medicines", medicineRoutes);
app.use("/api/auth", authRoutes);
// Routes
// 


app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working"
  });
});
// ==========================================
app.get("/", (req, res) => {
  res.send("DoseBox API is running");
});

// ==========================================
// MONGODB + SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // ==========================================
    // START MEDICINE REMINDER
    // ==========================================
    startMedicineReminder();

    // ==========================================
    // START SERVER
    // ==========================================
    app.listen(PORT, () => {
      console.log(
        `Server running on http://localhost:${PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB error:", error);
  });