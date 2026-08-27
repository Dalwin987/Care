import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Edit,
  Trash2,
  Clock,
  Pill,
  Loader2,
} from "lucide-react";

import gsap from "gsap";

import api from "../Api/Axios";
import Hero from "../../components/Hero";

function Home() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const pageRef = useRef(null);

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
  // LOAD MEDICINES
  // ==========================================
  useEffect(() => {
    fetchMedicines();
  }, []);

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
          <Loader2
            className="w-6 h-6 animate-spin"
          />

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
     

      <nav className="dosebox-navbar bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">

       

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center">
                <Pill
                  className="text-white w-6 h-6"
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

            
            <div className="hidden sm:flex items-center gap-3">


              <button
                onClick={() => navigate("/add")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
              >
                <Plus size={18} />

                <span>
                  Add Medicine
                </span>
              </button>


              <button
                onClick={() =>
                  navigate("/register")
                }
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                Register
              </button>
            </div>

          
            <div className="flex sm:hidden items-center gap-2">


              <button
                onClick={() =>
                  navigate("/add")
                }
                aria-label="Add Medicine"
                className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200"
              >
                <Plus size={20} />
              </button>

=
              <button
                onClick={() =>
                  navigate("/register")
                }
                className="px-3 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-medium transition-all duration-200"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

    
      <Hero />

     
      <main className="max-w-6xl mx-auto px-4 py-8">

    

        <div className="page-heading mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            My Medicines
          </h2>

          <p className="text-slate-500 mt-1">
            Manage your medicines and reminders
          </p>
        </div>

     

        {medicines.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">

            <div className="w-16 h-16 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
              <Pill className="text-blue-600 w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold text-slate-800 mt-5">
              No medicines found
            </h3>

            <p className="text-slate-500 mt-2">
              Add your first medicine to get
              started.
            </p>

            <button
              onClick={() =>
                navigate("/add")
              }
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all"
            >
              Add Medicine
            </button>
          </div>
        ) : (

       

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {medicines.map((medicine) => (
              <div
                key={medicine._id}
                className="medicine-card bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >


                <div className="h-52 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {medicine.tabletPic ? (
                    <img
                      src={medicine.tabletPic}
                      alt={medicine.tabletName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  ) : (
                    <Pill className="w-16 h-16 text-slate-300" />
                  )}
                </div>


                <div className="p-5">

                  <h3 className="text-xl font-bold text-slate-800">
                    {medicine.tabletName}
                  </h3>

                  <p className="text-blue-600 font-medium mt-1">
                    {medicine.mg}
                  </p>


                  <div className="flex items-center gap-2 text-slate-600 mt-4">
                    <Clock size={18} />

                    <span>
                      {medicine.time}
                    </span>
                  </div>


                  {medicine.description && (
                    <p className="text-sm text-slate-500 mt-3 line-clamp-2">
                      {medicine.description}
                    </p>
                  )}


                  <div className="grid grid-cols-2 gap-3 mt-6">

                   
                    <button
                      onClick={() =>
                        navigate(
                          `/edit/${medicine._id}`
                        )
                      }
                      className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2.5 rounded-xl font-medium transition-colors duration-200"
                    >
                      <Edit size={17} />
                      Edit
                    </button>


                    <button
                      onClick={() =>
                        handleDelete(
                          medicine._id
                        )
                      }
                      disabled={
                        deleteLoading ===
                        medicine._id
                      }
                      className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2.5 rounded-xl font-medium transition-colors duration-200"
                    >
                      {deleteLoading ===
                      medicine._id ? (
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                      ) : (
                        <Trash2 size={17} />
                      )}

                      Delete
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
