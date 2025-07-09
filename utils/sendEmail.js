const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
  // Configure your SMTP transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Blog App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html, // Add HTML support
  });
};

module.exports = sendEmail;