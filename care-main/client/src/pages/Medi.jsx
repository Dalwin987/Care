import React, { useEffect, useRef, useState } from "react";

import {
  Edit,
  Trash2,
  Clock,
  Pill,
  Loader2,
  Check,
  Plus,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import gsap from "gsap";

import api from "../Api/Axios";

const Medi = () => {
  const navigate = useNavigate();

  // ==============================
  // STATES
  // ==============================

  const [medicines, setMedicines] = useState([]);
  const [takenMedicines, setTakenMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [takenMessage, setTakenMessage] = useState(false);

  // ==============================
  // REFS
  // ==============================

  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const successRef = useRef(null);

  // ==============================
  // FETCH MEDICINES
  // ==============================

  const fetchMedicines = async () => {
    try {
      setLoading(true);

      const response = await api.get("/medicines");

      setMedicines(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD
  // ==============================

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ==============================
  // PAGE ANIMATION
  // ==============================

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Background/page fade
      gsap.fromTo(
        pageRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
        }
      );

      // Heading
      gsap.fromTo(
        headingRef.current,
        {
          y: -30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
        }
      );

      // Medicine cards
      gsap.fromTo(
        cardsRef.current,
        {
          y: 50,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading, medicines]);

  // ==============================
  // TAKE MEDICINE
  // ==============================

  const handleTaken = (id) => {
    setTakenMedicines((prev) => {
      if (prev.includes(id)) {
        return prev;
      }

      return [...prev, id];
    });

    setTakenMessage(true);

    setTimeout(() => {
      setTakenMessage(false);
    }, 2200);
  };

  // ==============================
  // SUCCESS MESSAGE ANIMATION
  // ==============================

  useEffect(() => {
    if (!takenMessage || !successRef.current) return;

    gsap.fromTo(
      successRef.current,
      {
        y: -40,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.7)",
      }
    );
  }, [takenMessage]);

  // ==============================
  // DELETE MEDICINE
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medicine?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleteLoading(id);

      await api.delete(`/medicines/${id}`);

      setMedicines((prev) =>
        prev.filter((medicine) => medicine._id !== id)
      );

      setTakenMedicines((prev) =>
        prev.filter((medicineId) => medicineId !== id)
      );
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  // ==============================
  // LOADING SCREEN
  // ==============================

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-500 flex items-center justify-center">

        <div className="flex flex-col items-center gap-5">

          <div className="relative">

            <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-40 animate-pulse" />

            <Loader2
              size={48}
              className="relative text-cyan-400 animate-spin"
            />

          </div>

          <p className="text-slate-400 tracking-wide">
            Loading your medicines...
          </p>

        </div>

      </main>
    );
  }

  // ==============================
  // PAGE
  // ==============================

  return (
    <main
      ref={pageRef}
      className="min-h-screen bg-slate-800 text-white relative overflow-hidden"
    >

      {/* ==============================
          BACKGROUND GLOW
      ============================== */}

      <div className="pointer-events-none absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* ==============================
          SUCCESS MESSAGE
      ============================== */}

      {takenMessage && (
        <div
          ref={successRef}
          className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/95 border border-green-400/60 text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.35)] backdrop-blur-xl"
        >

          <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">

            <Check size={17} />

          </div>

          <div>
            <p className="font-semibold text-sm">
              Medicine Taken
            </p>

            <p className="text-xs text-slate-400">
              Dose marked successfully
            </p>
          </div>

        </div>
      )}

      {/* ==============================
          CONTENT
      ============================== */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ==============================
            HEADER
        ============================== */}

        <div
          ref={headingRef}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10"
        >

          <div>

            <div className="flex items-center gap-3">

              <div className="relative">

                <div className="absolute inset-0 bg-cyan-400 blur-md opacity-50" />

                <div className="relative w-11 h-11 rounded-xl bg-slate-900 border border-cyan-400/40 flex items-center justify-center">

                  <Pill
                    size={22}
                    className="text-cyan-400"
                  />

                </div>

              </div>

              <div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  My Medicines
                </h1>

                <p className="text-slate-400 mt-1">
                  Manage your medicines and daily reminders
                </p>

              </div>

            </div>

          </div>

          {/* ADD BUTTON */}

          <button
            onClick={() => navigate("/add")}
            className="group relative flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]"
          >

            <Plus
              size={19}
              className="group-hover:rotate-90 transition-transform duration-300"
            />

            Add Medicine

          </button>

        </div>

        {/* ==============================
            NO MEDICINES
        ============================== */}

        {medicines.length === 0 ? (

          <div className="relative max-w-xl mx-auto">

            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-60 blur-sm" />

            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">

              <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">

                <Pill
                  size={38}
                  className="text-cyan-400"
                />

              </div>

              <h3 className="text-2xl font-bold mt-6">
                No medicines found
              </h3>

              <p className="text-slate-400 mt-2">
                Add your first medicine to get started.
              </p>

              <button
                onClick={() => navigate("/add")}
                className="mt-7 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] transition-all"
              >
                Add Medicine
              </button>

            </div>

          </div>

        ) : (

          /* ==============================
             MEDICINE GRID
          ============================== */

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

            {medicines.map((medicine, index) => {

              const isTaken = takenMedicines.includes(
                medicine._id
              );

              return (
                <div
                  key={medicine._id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="group relative"
                >

                  {/* ==============================
                      NEON BORDER
                  ============================== */}

                  <div className="absolute -inset-[1px] rounded-[22px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 opacity-40 group-hover:opacity-100 blur-[2px] transition-all duration-500" />

                  {/* ==============================
                      CARD
                  ============================== */}

                  <div className="relative bg-slate-900/95 rounded-[21px] overflow-hidden border border-slate-800 backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_15px_45px_rgba(6,182,212,0.18)]">

                    {/* IMAGE */}

                    <div className="relative h-56 bg-slate-950 overflow-hidden">

                      {medicine.tabletPic ? (

                        <img
                          src={medicine.tabletPic}
                          alt={medicine.tabletName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center">

                          <Pill
                            size={70}
                            className="text-slate-700"
                          />

                        </div>

                      )}

                      {/* IMAGE OVERLAY */}

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                      {/* MEDICINE BADGE */}

                      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/30 backdrop-blur-md">

                        <Sparkles
                          size={13}
                          className="text-cyan-400"
                        />

                        <span className="text-xs text-cyan-300 font-medium">
                          Medicine
                        </span>

                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="p-5">

                      {/* NAME */}

                      <h3 className="text-xl font-bold text-white truncate">
                        {medicine.tabletName}
                      </h3>

                      {/* MG */}

                      <p className="text-cyan-400 font-semibold mt-1">
                        {medicine.mg}
                      </p>

                      {/* TIME */}

                      <div className="flex items-center gap-2 mt-4 text-slate-300">

                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">

                          <Clock
                            size={16}
                            className="text-blue-400"
                          />

                        </div>

                        <span className="text-sm">
                          {medicine.time}
                        </span>

                      </div>

                      {/* DESCRIPTION */}

                      {medicine.description && (
                        <p className="text-sm text-slate-400 mt-4 line-clamp-2 leading-relaxed">
                          {medicine.description}
                        </p>
                      )}

                      {/* ==============================
                          BUTTONS
                      ============================== */}

                      <div className="grid grid-cols-2 gap-3 mt-6">

                        {/* EDIT */}

                        <button
                          onClick={() =>
                            navigate(
                              `/edit/${medicine._id}`
                            )
                          }
                          className="group/edit flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-400/40 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 hover:shadow-[0_0_18px_rgba(59,130,246,0.2)] transition-all duration-300"
                        >

                          <Edit
                            size={17}
                            className="group-hover/edit:rotate-12 transition-transform"
                          />

                          Edit

                        </button>

                        {/* TAKE / TAKEN */}

                        <button
                          onClick={() =>
                            handleTaken(
                              medicine._id
                            )
                          }
                          disabled={isTaken}
                          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                            isTaken
                              ? "bg-green-500 text-white border border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.35)] cursor-default"
                              : "border border-red-400/60 text-red-300 hover:bg-red-500/10 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]"
                          }`}
                        >

                          <Check
                            size={17}
                            className={
                              isTaken
                                ? "animate-pulse"
                                : ""
                            }
                          />

                          {isTaken
                            ? "Taken"
                            : "Take"}

                        </button>

                        {/* DELETE */}

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
                          className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-400/30 text-red-300 hover:bg-red-500 hover:text-white hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] disabled:opacity-50 transition-all duration-300"
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

                          {deleteLoading ===
                          medicine._id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </div>

    </main>
  );
};

export default Medi;

