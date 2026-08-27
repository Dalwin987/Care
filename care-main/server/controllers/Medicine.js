import mongoose from "mongoose";
import Medicine from "../models/Medicine.js";
import cloudinary from "../config/Cloudinary.js";

// ==========================================
// CREATE MEDICINE
// ==========================================
const createMedicine = async (req, res) => {
  try {
    let tabletPic = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "dosebox/medicines",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      tabletPic = result.secure_url;
    }

    const medicine = await Medicine.create({
      tabletName: req.body.tabletName,
      tabletPic,
      time: req.body.time,
      mg: req.body.mg,
      description: req.body.description || "",
    });

    return res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      data: medicine,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL MEDICINES
const getMedicines = async (req, res) => {
  try {

    const medicines = await Medicine
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: medicines,
    });

  } catch (error) {

    console.error(
      "GET ALL MEDICINES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get medicines",
      error: error.message,
    });

  }
};


// ==========================================
// GET ONE MEDICINE
// ==========================================
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("GET MEDICINE ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: medicine,
    });

  } catch (error) {
    console.error("GET ONE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get medicine",
    });
  }
};


// ==========================================
// UPDATE MEDICINE
// ==========================================
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("UPDATE MEDICINE ID:", id);

    // Check ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    // Find medicine
    const medicine = await Medicine.findById(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // Keep old image
    let tabletPic = medicine.tabletPic;

    // ==========================================
    // Upload new image if selected
    // ==========================================
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "dosebox/medicines",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      tabletPic = result.secure_url;

      console.log(
        "NEW CLOUDINARY URL:",
        tabletPic
      );
    }

    // ==========================================
    // Update fields
    // ==========================================
    medicine.tabletName =
      req.body.tabletName ?? medicine.tabletName;

    medicine.tabletPic =
      tabletPic;

    medicine.time =
      req.body.time ?? medicine.time;

    medicine.mg =
      req.body.mg ?? medicine.mg;

    medicine.description =
      req.body.description ?? medicine.description;

    // Save
    await medicine.save();

    return res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine,
    });

  } catch (error) {
    console.error(
      "UPDATE MEDICINE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update medicine",
      error: error.message,
    });
  }
};


// ==========================================
// DELETE MEDICINE
// ==========================================
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("DELETE MEDICINE ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID",
      });
    }

    const medicine =
      await Medicine.findByIdAndDelete(id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete medicine",
    });
  }
};


// ==========================================
// EXPORT
// ==========================================
export {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
};