import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log(
  "Cloudinary:",
  process.env.CLOUDINARY_CLOUD_NAME
);

console.log(
  "Cloudinary API key exists:",
  !!process.env.CLOUDINARY_API_KEY
);

console.log(
  "Cloudinary secret exists:",
  !!process.env.CLOUDINARY_API_SECRET
);

export default cloudinary;