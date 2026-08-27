import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  Pill,
  Loader2,
} from "lucide-react";

import api from "../Api/Axios";

function AddMedicine() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    tabletName: "",
    time: "",
    mg: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // IMAGE CHANGE
  // ==========================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================================
  // 24 HOUR → 12 HOUR
  // ==========================================
  const convertTo12Hour = (time24) => {
    if (!time24) return "";

    const [hours, minutes] = time24.split(":");

    let hour = Number(hours);

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${String(hour).padStart(
      2,
      "0"
    )}:${minutes} ${period}`;
  };

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tabletName.trim()) {
      alert("Please enter medicine name");
      return;
    }

    if (!formData.time) {
      alert("Please select medicine time");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Medicine name
      data.append(
        "tabletName",
        formData.tabletName
      );

      // ======================================
      // CONVERT TIME
      // ======================================
      const formattedTime =
        convertTo12Hour(formData.time);

      console.log(
        "TIME BEFORE:",
        formData.time
      );

      console.log(
        "TIME AFTER:",
        formattedTime
      );

      data.append(
        "time",
        formattedTime
      );

      // Dosage
      data.append(
        "mg",
        formData.mg
      );

      // Description
      data.append(
        "description",
        formData.description
      );

      // Image
      if (image) {
        data.append(
          "tabletPic",
          image
        );
      }

      // ======================================
      // API
      // ======================================
      const response = await api.post(
        "/medicines",
        data
      );

      console.log(
        "CREATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Medicine added successfully"
        );

        navigate("/");
      }

    } catch (error) {
      console.error(
        "CREATE MEDICINE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add medicine"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================
          HEADER
      ====================================== */}
      <div className="bg-white border-b">

        <div className="max-w-3xl mx-auto px-4 py-4">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
          >
            <ArrowLeft size={19} />

            Back
          </button>

        </div>

      </div>

      {/* =====================================
          MAIN
      ====================================== */}
      <main className="max-w-3xl mx-auto px-4 py-8">

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">

          {/* TITLE */}
          <div className="mb-7">

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">

                <Pill className="text-blue-600" />

              </div>

              <div>

                <h1 className="text-2xl font-bold text-slate-800">
                  Add Medicine
                </h1>

                <p className="text-sm text-slate-500">
                  Add a new medicine reminder
                </p>

              </div>

            </div>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================
                IMAGE
            ================================== */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Medicine Image
              </label>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-5">

                {preview ? (

                  <div className="space-y-4">

                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-56 object-cover rounded-xl"
                    />

                    <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl">

                      <Upload size={18} />

                      Change Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />

                    </label>

                  </div>

                ) : (

                  <label className="cursor-pointer flex flex-col items-center justify-center py-8">

                    <Upload
                      className="text-slate-400"
                      size={35}
                    />

                    <span className="mt-3 text-slate-600 font-medium">
                      Upload medicine image
                    </span>

                    <span className="text-sm text-slate-400 mt-1">
                      PNG, JPG or JPEG
                    </span>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />

                  </label>

                )}

              </div>

            </div>

            {/* =================================
                MEDICINE NAME
            ================================== */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Medicine Name
              </label>

              <input
                type="text"
                name="tabletName"
                value={
                  formData.tabletName
                }
                onChange={handleChange}
                placeholder="Example: Paracetamol"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* =================================
                DOSAGE
            ================================== */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dosage
              </label>

              <input
                type="text"
                name="mg"
                value={formData.mg}
                onChange={handleChange}
                placeholder="Example: 500mg"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* =================================
                TIME
            ================================== */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Medicine Time
              </label>

              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-slate-400 mt-2">
                Selected time will be saved as
                AM/PM format.
              </p>

            </div>

            {/* =================================
                DESCRIPTION
            ================================== */}
            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                rows="4"
                placeholder="Example: Take before lunch"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

            </div>

            {/* =================================
                SUBMIT
            ================================== */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl font-semibold transition"
            >

              {loading ? (

                <>
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />

                  Adding...
                </>

              ) : (

                <>
                  <Pill size={20} />

                  Add Medicine
                </>

              )}

            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default AddMedicine;