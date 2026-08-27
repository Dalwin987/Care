import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Pill,
  Loader2,
  Home,
} from "lucide-react";

import gsap from "gsap";
import "./Editmedicine.css";
import api from "../Api/Axios";

function EditMedicine() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [formData, setFormData] = useState({
    tabletName: "",
    time: "",
    mg: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] =
    useState(false);

  // ==========================================
  // GSAP REFS
  // ==========================================

  const pageRef = useRef(null);
  const homeRef = useRef(null);
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const buttonRef = useRef(null);

  // ==========================================
  // GET MEDICINE
  // ==========================================

  const fetchMedicine = async () => {
    try {
      console.log("MEDICINE ID:", id);

      if (!id || id === ":id") {
        console.error(
          "INVALID MEDICINE ID:",
          id
        );

        alert("Invalid medicine ID");

        navigate("/");

        return;
      }

      const response = await api.get(
        `/medicines/${id}`
      );

      console.log(
        "MEDICINE RESPONSE:",
        response.data
      );

      const medicine = response.data.data;

      setFormData({
        tabletName:
          medicine.tabletName || "",

        time:
          medicine.time || "",

        mg:
          medicine.mg || "",

        description:
          medicine.description || "",
      });

      setPreview(
        medicine.tabletPic || ""
      );

    } catch (error) {
      console.error(
        "GET MEDICINE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to get medicine"
      );

      navigate("/");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicine();
  }, [id]);

  // ==========================================
  // GSAP PAGE ANIMATION
  // ==========================================

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Page
      tl.from(pageRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      // Home icon
      tl.from(
        homeRef.current,
        {
          x: -40,
          y: -40,
          opacity: 0,
          scale: 0.7,
          duration: 0.7,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      );

      // Card
      tl.from(
        cardRef.current,
        {
          y: 60,
          opacity: 0,
          scale: 0.94,
          duration: 0.8,
          ease: "back.out(1.5)",
        },
        "-=0.4"
      );

      // Header
      tl.from(
        headerRef.current.children,
        {
          y: -25,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Form fields
      tl.from(
        formRef.current.querySelectorAll(
          ".edit-form-group"
        ),
        {
          x: -30,
          opacity: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.2"
      );

      // Button
      tl.from(
        buttonRef.current,
        {
          y: 25,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading]);

  // ==========================================
  // HOME HOVER
  // ==========================================

  const handleHomeEnter = () => {
    gsap.to(homeRef.current, {
      scale: 1.08,
      y: -3,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleHomeLeave = () => {
    gsap.to(homeRef.current, {
      scale: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  // ==========================================
  // BUTTON HOVER
  // ==========================================

  const handleButtonEnter = () => {
    if (updateLoading) return;

    gsap.to(buttonRef.current, {
      scale: 1.03,
      y: -2,
      duration: 0.25,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = () => {
    gsap.to(buttonRef.current, {
      scale: 1,
      y: 0,
      duration: 0.25,
      ease: "power2.out",
    });
  };

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

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==========================================
  // UPDATE
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

      const data = new FormData();

      data.append(
        "tabletName",
        formData.tabletName
      );

      data.append(
        "time",
        formData.time
      );

      data.append(
        "mg",
        formData.mg
      );

      data.append(
        "description",
        formData.description
      );

      if (image) {
        data.append(
          "tabletPic",
          image
        );
      }

      const response = await api.put(
        `/medicines/${id}`,
        data
      );

      console.log(
        "UPDATE RESPONSE:",
        response.data
      );

      if (response.data.success) {
        alert(
          "Medicine updated successfully"
        );

        navigate("/");
      }

    } catch (error) {
      console.error(
        "UPDATE MEDICINE ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update medicine"
      );

    } finally {
      setUpdateLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-loading-page">

        <div className="edit-loading-box">

          <Loader2
            size={25}
            className="edit-loading-spinner"
          />

          <span>
            Loading medicine...
          </span>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div
      className="edit-page"
      ref={pageRef}
    >

      {/* =====================================
          HOME ICON
      ====================================== */}

     

      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="edit-circle edit-circle-one"></div>

      <div className="edit-circle edit-circle-two"></div>

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="edit-top-header">

        <div className="edit-header-inner">

          <button
            onClick={() => navigate("/")}
            className="edit-back-button"
          >
            <ArrowLeft size={19} />

            Back
          </button>

        </div>

      </div>

      {/* =====================================
          CONTENT
      ====================================== */}

      <main className="edit-main">

        <div
          className="edit-card"
          ref={cardRef}
        >

          {/* =================================
              TITLE
          ================================== */}

          <div
            className="edit-header"
            ref={headerRef}
          >

            <div className="edit-title-row">

              <div className="edit-title-icon">
                <Pill size={25} />
              </div>

              <div>

                <h1>
                  Edit Medicine
                </h1>

                <p>
                  Update medicine information
                </p>

              </div>

            </div>

          </div>

          {/* =================================
              FORM
          ================================== */}

          <form
            onSubmit={handleUpdate}
            className="edit-form"
            ref={formRef}
          >

            {/* IMAGE */}

            <div className="edit-form-group">

              <label>
                Medicine Image
              </label>

              <div className="edit-image-box">

                {preview ? (

                  <div className="edit-preview">

                    <img
                      src={preview}
                      alt="Medicine"
                    />

                    <label className="edit-change-image">

                      <Upload size={18} />

                      Change Image

                      <input
                        type="file"
                        accept="image/*"
                        onChange={
                          handleImageChange
                        }
                      />

                    </label>

                  </div>

                ) : (

                  <label className="edit-upload">

                    <Upload size={35} />

                    <span>
                      Upload image
                    </span>

                    <small>
                      PNG, JPG or JPEG
                    </small>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                    />

                  </label>

                )}

              </div>

            </div>

            {/* NAME */}

            <div className="edit-form-group">

              <label htmlFor="tabletName">
                Medicine Name
              </label>

              <input
                id="tabletName"
                type="text"
                name="tabletName"
                value={
                  formData.tabletName
                }
                onChange={handleChange}
              />

            </div>

            {/* MG */}

            <div className="edit-form-group">

              <label htmlFor="mg">
                Dosage
              </label>

              <input
                id="mg"
                type="text"
                name="mg"
                value={formData.mg}
                onChange={handleChange}
                placeholder="500mg"
              />

            </div>

            {/* TIME */}

            <div className="edit-form-group">

              <label htmlFor="time">
                Medicine Time
              </label>

              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />

            </div>

            {/* DESCRIPTION */}

            <div className="edit-form-group">

              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                rows="4"
              />

            </div>

            {/* UPDATE BUTTON */}

            <button
              type="submit"
              disabled={updateLoading}
              className="edit-submit"
              ref={buttonRef}
              onMouseEnter={
                handleButtonEnter
              }
              onMouseLeave={
                handleButtonLeave
              }
            >

              {updateLoading ? (
                <>
                  <Loader2
                    size={20}
                    className="edit-spinner"
                  />

                  Updating...
                </>
              ) : (
                <>
                  <Pill size={20} />

                  Update Medicine
                </>
              )}

            </button>

          </form>

        </div>

      </main>
    </div>
  );
}

export default EditMedicine;