
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Pill,
  Loader2,
  Check,
} from "lucide-react";

import gsap from "gsap";

import api from "../Api/Axios";
import Hero from "../../components/Hero";

function Home() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Store which medicines are taken
  const [takenMedicines, setTakenMedicines] = useState([]);

  // Popup
  const [takenMessage, setTakenMessage] = useState(false);

  const pageRef = useRef(null);
const takenMessageRef = useRef(null);
  // ==========================================
  // GET ALL MEDICINES
  // ==========================================
  const fetchMedicines = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medicines");

      console.log("MEDICINES:", response.data);

      if (response.data.success) {
        setMedicines(response.data.data || []);
      }
    } catch (error) {
      console.error("GET MEDICINES ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load medicines"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // DELETE MEDICINE
  // ==========================================
  const handleDelete = async (id) => {
    if (!id) {
      alert("Medicine ID is missing");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteLoading(id);

      const response = await api.delete(
        `/medicines/${id}`
      );

      if (response.data.success) {
        setMedicines((prev) =>
          prev.filter(
            (medicine) => medicine._id !== id
          )
        );

        // Remove from taken list too
        setTakenMedicines((prev) =>
          prev.filter(
            (medicineId) => medicineId !== id
          )
        );
      }
    } catch (error) {
      console.error("DELETE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete medicine"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==========================================
  // TAKE MEDICINE
  // ==========================================
  const handleTaken = (id, tabletName) => {
    // Add medicine ID to taken list
    setTakenMedicines((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });

    // Show popup
    setTakenMessage(true);

    setTimeout(() => {
      setTakenMessage(false);
    }, 2000);
  };

  // ==========================================
  // LOAD MEDICINES
  // ==========================================
  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
  if (takenMessage && takenMessageRef.current) {
    gsap.fromTo(
      takenMessageRef.current,
      {
        y: -30,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)",
      }
    );
  }
}, [takenMessage]);
  // ==========================================
  // GSAP ANIMATION
  // ==========================================
  useEffect(() => {
    if (loading || !pageRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      // Navbar
      gsap.from(".dosebox-navbar", {
        y: -15,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Heading
      gsap.from(".page-heading", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power2.out",
      });

      // Medicine cards
      if (medicines.length > 0) {
        gsap.from(".medicine-card", {
          y: 18,
          opacity: 0,
          duration: 0.45,
          stagger: 0.07,
          delay: 0.15,
          ease: "power2.out",
          clearProps: "all",
        });
      }
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, [loading, medicines.length]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />

          <span className="font-medium">
            Loading medicines...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-slate-50"
    >
      {/* ==========================================
          TAKEN POPUP
      ========================================== */}

    {takenMessage && (
  <div
    ref={takenMessageRef}
    className="fixed top-5 right-5 z-[100] bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
  >
    <Check size={18} />
    Medicine marked as Taken
  </div>
)}

      {/* ==========================================
          NAVBAR
      ========================================== */}

      <nav className="dosebox-navbar bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">

          <div className="flex items-center justify-between gap-3">

            {/* Logo */}

            <div className="flex items-center gap-2 ">

              <div className="w-10 h-10  flex items-center justify-center">
               <img
  src="/logo.png"
  alt="Pill"
  className="w-20 h-20 "
/>
              </div>

              <div className="min-w-0">

                <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">
                  DoseBox
                </h1>

                <p className="text-[10px] sm:text-xs text-slate-500 truncate">
                  Medicine Reminder
                </p>

              </div>

            </div>

            {/* Desktop */}

            <div className="hidden sm:flex items-center gap-3">

              <button
                onClick={() => navigate("/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              >
                <Plus size={18} />
                <span>Add Medicine</span>
              </button>

              <button
                onClick={() => navigate("/register")}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/medi")}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                Check Me
              </button>

            </div>

            {/* Mobile */}

            <div className="flex sm:hidden items-center gap-2">


              <button
                onClick={() => navigate("/add")}
                aria-label="Add Medicine"
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
              >
                <Plus size={20} />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-3 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Register
              </button>



            </div>

          </div>
        </div>
      </nav>

      {/* HERO */}

      <Hero />

      {/* ==========================================
          MAIN
      ========================================== */}

      
    </div>
  );
}

export default Home;

