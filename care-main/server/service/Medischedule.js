import cron from "node-cron";
import Medicine from "../models/Medicine.js";
import resend from "../config/Resend.js";

// ==========================================
// NORMALIZE TIME
// ==========================================
const normalizeTime = (time) => {
  return time
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
};

// ==========================================
// INDIA TIME
// ==========================================
const getCurrentIndiaTime = () => {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
};

// ==========================================
// INDIA DATE
// ==========================================
const getTodayIndiaDate = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
};

// ==========================================
// SEND EMAIL
// ==========================================
const sendMedicineReminder = async (medicine) => {
  try {
    const toEmail = process.env.REMINDER_EMAIL;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    console.log("--------------------------------");
    console.log("FROM:", fromEmail);
    console.log("TO:", toEmail);
    console.log("TO TYPE:", typeof toEmail);
    console.log("--------------------------------");

    if (!toEmail) {
      console.error(
        "❌ REMINDER_EMAIL missing"
      );
      return false;
    }

    if (!fromEmail) {
      console.error(
        "❌ RESEND_FROM_EMAIL missing"
      );
      return false;
    }

    const { data, error } =
      await resend.emails.send({
        from: `DoseBox <${fromEmail}>`,

        // Must be a string
        to: toEmail,

        subject:
          `💊 Medicine Reminder - ${medicine.tabletName}`,

        html: `
          <div style="
            font-family: Arial;
            max-width: 600px;
            margin: auto;
            padding: 30px;
          ">

            <h1 style="color:#2563eb;">
              💊 DoseBox Medicine Reminder
            </h1>

            <p>
              It is time to take your medicine.
            </p>

            <div style="
              background:#eff6ff;
              padding:20px;
              border-radius:10px;
            ">

              <h2>
                ${medicine.tabletName}
              </h2>

              <p>
                <strong>Dosage:</strong>
                ${medicine.mg}
              </p>

              <p>
                <strong>Time:</strong>
                ${medicine.time}
              </p>

              <p>
                <strong>Description:</strong>
                ${medicine.description || "No description"}
              </p>

            </div>

            <p>
              ⏰ Please take your medicine on time.
            </p>

          </div>
        `,
      });

    if (error) {
      console.error(
        "❌ RESEND ERROR:",
        error
      );

      return false;
    }

    console.log(
      "📧 EMAIL SENT SUCCESSFULLY"
    );

    console.log(
      "Medicine:",
      medicine.tabletName
    );

    console.log(
      "Email ID:",
      data?.id
    );

    return true;

  } catch (error) {
    console.error(
      "❌ EMAIL ERROR:",
      error
    );

    return false;
  }
};

// ==========================================
// START CRON
// ==========================================
const startMedicineReminder = () => {

  cron.schedule(
    "* * * * *",
    async () => {

      try {

        const currentTime =
          normalizeTime(
            getCurrentIndiaTime()
          );

        const today =
          getTodayIndiaDate();

        console.log(
          `⏰ Checking medicines: ${currentTime}`
        );

        const medicines =
          await Medicine.find({
            time: {
              $regex: `^${currentTime}$`,
              $options: "i",
            },
          });

        if (medicines.length === 0) {
          return;
        }

        for (const medicine of medicines) {

          // Already sent today
          if (
            medicine.lastReminderDate === today
          ) {
            console.log(
              `⏭️ Already sent today: ${medicine.tabletName}`
            );

            continue;
          }

          console.log(
            `💊 Medicine time: ${medicine.tabletName}`
          );

          const sent =
            await sendMedicineReminder(
              medicine
            );

          if (sent) {

            medicine.lastReminderDate =
              today;

            await medicine.save();

            console.log(
              `✅ Reminder saved: ${medicine.tabletName}`
            );
          }
        }

      } catch (error) {

        console.error(
          "❌ Scheduler error:",
          error
        );

      }
    },
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log(
    "💊 Medicine reminder scheduler started"
  );
};

export default startMedicineReminder;