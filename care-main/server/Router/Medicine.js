import express from "express";

import {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
} from "../controllers/Medicine.js";

import upload from "../middleware/multer.js";

const router = express.Router();

// ==========================================
// CREATE
// POST /api/medicines
// ==========================================

router.post(
  "/",
  upload.single("tabletPic"),
  createMedicine
);

// ==========================================
// GET ALL
// GET /api/medicines
// ==========================================

router.get(
  "/",
  getMedicines
);

// ==========================================
// GET ONE
// GET /api/medicines/:id
// ==========================================

router.get(
  "/:id",
  getMedicineById
);

// ==========================================
// UPDATE
// PUT /api/medicines/:id
// ==========================================

router.put(
  "/:id",
  upload.single("tabletPic"),
  updateMedicine
);

// ==========================================
// DELETE
// DELETE /api/medicines/:id
// ==========================================

router.delete(
  "/:id",
  deleteMedicine
);

export default router;