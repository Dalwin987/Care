import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    tabletName: {
      type: String,
      required: true,
    },

    tabletPic: {
      type: String,
      default: "",
    },

    time: {
      type: String,
      required: true,
      match: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i,
    },

    mg: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Prevent sending the same reminder
    // multiple times on the same day
    lastReminderDate: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Medicine = mongoose.model(
  "Medicine",
  medicineSchema
);

export default Medicine;