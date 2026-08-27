import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Pill,
} from "lucide-react";

import api from "../Api/Axios.js";

function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET MEDICINE
  // ==========================================

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("MEDICINE ID:", id);

        if (!id || id === ":id") {
          setError("Invalid medicine ID");
          return;
        }

        const response = await api.get(`/medicines/${id}`);

        console.log("API RESPONSE:", response.data);

        const medicineData = response.data?.data;

        console.log("MEDICINE DATA:", medicineData);

        if (!medicineData) {
          setError("Medicine not found");
          return;
        }

        setMedicine(medicineData);

      } catch (err) {
        console.error("GET MEDICINE ERROR:", err);

        console.error(
          "STATUS:",
          err.response?.status
        );

        console.error(
          "BACKEND:",
          err.response?.data
        );

        setError(
          err.response?.data?.message ||
          "Failed to load medicine"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchMedicine();
  }, [id]);

  // ==========================================
  // DELETE
  // ==========================================

  const deleteMedicine = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/medicines/${id}`);

      alert("Medicine deleted successfully");

      navigate("/");

    } catch (err) {
      console.error("DELETE ERROR:", err);

      alert(
        err.response?.data?.message ||
        "Delete failed"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />

          <p className="text-gray-600">
            Loading medicine...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !medicine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-6">

        <Pill
          size={70}
          className="text-gray-400 mb-4"
        />

        <h2 className="text-2xl font-bold text-gray-800">
          Medicine not found
        </h2>

        <p className="text-gray-500 mt-2">
          {error || "Unable to load medicine"}
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </button>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* BACK */}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* IMAGE */}

          {medicine.tabletPic ? (
            <img
              src={medicine.tabletPic}
              alt={medicine.tabletName}
              className="w-full h-72 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="h-72 flex items-center justify-center bg-blue-50">
              <Pill
                size={80}
                className="text-blue-400"
              />
            </div>
          )}

          {/* DETAILS */}

          <div className="p-8">

            <h1 className="text-3xl font-bold text-gray-900">
              {medicine.tabletName}
            </h1>

            <p className="text-xl text-blue-600 font-semibold mt-2">
              {medicine.mg}
            </p>

            {/* TIME */}

            <div className="flex items-center gap-3 mt-6 text-gray-700">

              <Clock
                size={22}
                className="text-blue-600"
              />

              <span className="font-medium">
                {medicine.time}
              </span>

            </div>

            {/* DESCRIPTION */}

            <div className="mt-6">

              <h3 className="font-bold text-lg text-gray-900">
                Description
              </h3>

              <p className="text-gray-600 mt-2">
                {medicine.description || "No description"}
              </p>

            </div>

            {/* BUTTONS */}

            <div className="flex gap-4 mt-8">

              <button
                onClick={() =>
                  navigate(`/edit/${medicine._id}`)
                }
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              >
                <Edit size={18} />
                Edit
              </button>

              <button
                onClick={deleteMedicine}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              >
                <Trash2 size={18} />
                Delete
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineDetails;