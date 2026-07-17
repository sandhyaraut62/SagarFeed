const nodemailer = require("nodemailer");

let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

// Sends an email if SMTP_* env vars are configured; otherwise logs the
// content to the console so the reset link can still be used in dev/testing.
async function sendMail({ to, subject, html, text }) {
  if (!transporter) {
    console.log("\n📧 [DEV MODE — no SMTP configured] Would send email:");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Body: ${text || html}\n`);
    return { delivered: false };
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Sagar Feeds" <no-reply@sagarfeeds.com.np>`,
    to,
    subject,
    html,
    text,
  });
  return { delivered: true };
}

module.exports = { sendMail };
