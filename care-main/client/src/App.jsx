
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import AddMedicine from "./pages/Addmedicine";
import EditMedicine from "./pages/Editmedicine";
import MedicineDetails from "./pages/MedicineDetails";
import Medi from "./pages/Medi.jsx";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Routes>

      {/* ================= HOME ================= */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* ================= MEDICINE ================= */}

      {/* Add Medicine */}
      <Route
        path="/add"
        element={<AddMedicine />}
      />

      {/* Medicine List / Medi Page */}
      <Route
        path="/medi"
        element={<Medi />}
      />

      {/* Medicine Details */}
      <Route
        path="/medicine/:id"
        element={<MedicineDetails />}
      />

      {/* Edit Medicine */}
      <Route
        path="/edit/:id"
        element={<EditMedicine />}
      />

      {/* ================= AUTH ================= */}

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Register */}
      <Route
        path="/register"
        element={<Register />}
      />

      {/* Forgot Password */}
      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      {/* OTP Verification */}
      <Route
        path="/verify-otp"
        element={<OtpVerification />}
      />

      {/* Reset Password */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl font-bold">
                404
              </h1>

              <p className="mt-2 text-gray-500">
                Page not found
              </p>
            </div>
          </div>
        }
      />

    </Routes>
  );
}

export default App;

