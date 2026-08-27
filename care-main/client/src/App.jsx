import { Routes, Route } from "react-router-dom";

import Home  from "./pages/Home";

import AddMedicine from "./pages/Addmedicine";
import EditMedicine from "./pages/Editmedicine";
import MedicineDetails from "./pages/MedicineDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Request from "../src/pages/Request.jsx"
function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* MEDICINE */}
      <Route
        path="/add"
        element={<AddMedicine />}
      />

      <Route
        path="/medicine/:id"
        element={<MedicineDetails />}
      />

      <Route
        path="/edit/:id"
        element={<EditMedicine />}
      />

      {/* AUTH */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/verify-otp"
        element={<OtpVerification />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />
      <Route
        path="/request"
        element={<Request />}
      />

      {/* 404 */}
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