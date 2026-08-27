import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    /*role: {
      type: String,
      enum: ["admin", "driver", "passenger", "dispatcher"],
      default: "passenger",
    },*/

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // FORGOT PASSWORD OTP
    // ==========================
    forgot_password_otp: {
      type: String,
      default: null,
    },

    forgot_password_expiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;