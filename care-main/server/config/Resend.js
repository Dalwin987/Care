import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(
  process.env.RESEND_API_KEY
);

console.log("========== RESEND CONFIG ==========");
console.log(
  "API KEY EXISTS:",
  !!process.env.RESEND_API_KEY
);
console.log(
  "FROM EMAIL:",
  process.env.RESEND_FROM_EMAIL
);
console.log(
  "REMINDER EMAIL:",
  process.env.REMINDER_EMAIL
);
console.log("===================================");

export default resend;