// jobs/medicineReminder.js

const cron = require("node-cron");
const Medicine = require("../models/Medicine.js");
const resend = require("../config/Resend.js");

const REMINDER_EMAIL = process.env.REMINDER_EMAIL;

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    let currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const ampm = currentHour >= 12 ? "PM" : "AM";

    currentHour = currentHour % 12;

    if (currentHour === 0) {
      currentHour = 12;
    }

    const currentTime = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")} ${ampm}`;

    console.log("Checking medicine time:", currentTime);

    const medicines = await Medicine.find({
      time: {
        $regex: new RegExp(`^${currentTime}$`, "i"),
      },
    });

    for (const medicine of medicines) {
      await resend.emails.send({
        from: "Medicine Reminder <onboarding@resend.dev>",
        to: REMINDER_EMAIL,
        subject: `💊 Medicine Reminder - ${medicine.tabletName}`,
        html: `
          <h2>💊 Medicine Reminder</h2>

          <p>It is time to take your medicine.</p>

          <h3>${medicine.tabletName}</h3>

          <p><strong>Dosage:</strong> ${medicine.mg}</p>

          <p><strong>Time:</strong> ${medicine.time}</p>

          ${
            medicine.description
              ? `<p><strong>Description:</strong> ${medicine.description}</p>`
              : ""
          }

          <p>⏰ Please take your medicine on time.</p>
        `,
      });

      console.log(
        `✅ Email sent for ${medicine.tabletName} at ${medicine.time}`
      );
    }
  } catch (error) {
    console.error("❌ Medicine reminder error:", error);
  }
});