import resend from "./Sendmail.js";
const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log("RESEND RESPONSE:", response);

    return response;
  } catch (error) {
    console.error("RESEND EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;