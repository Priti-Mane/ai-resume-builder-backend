import nodemailer from "nodemailer";

// Returns a nodemailer transporter if SMTP env vars are configured, else null.
const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  const port = Number(process.env.SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // true for 465 (SSL), false for other ports (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    family: 4, // force IPv4 - some hosts (e.g. Render free tier) can't reach SMTP over IPv6
    connectionTimeout: 10000,
  });
};

// Sends a verification email if SMTP is configured.
// Otherwise logs the verification link to the console (useful for local dev).
export const sendVerificationEmail = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyLink = `${baseUrl}/verify-email?token=${token}`;

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n[Email Verification] No SMTP configured. Verification link for ${toEmail}:`);
    console.log(verifyLink, "\n");
    return { sent: false, link: verifyLink };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: "Verify your email - AI Resume Builder",
      html: `<p>Welcome! Please verify your email by clicking the link below:</p>
             <p><a href="${verifyLink}">${verifyLink}</a></p>`,
    });
    return { sent: true, link: verifyLink };
  } catch (err) {
    console.error("Email send error:", err.message);
    console.log(`[Email Verification] Fallback link for ${toEmail}:`, verifyLink);
    return { sent: false, link: verifyLink };
  }
};

// Sends a password reset email if SMTP is configured.
// Otherwise logs the reset link to the console (useful for local dev).
export const sendPasswordResetEmail = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  const transporter = getTransporter();

  if (!transporter) {
    console.log(`\n[Password Reset] No SMTP configured. Reset link for ${toEmail}:`);
    console.log(resetLink, "\n");
    return { sent: false, link: resetLink };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toEmail,
      subject: "Reset your password - AI Resume Builder",
      html: `<p>You requested a password reset. Click the link below to set a new password:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>
             <p>This link will expire in 1 hour. If you did not request this, you can ignore this email.</p>`,
    });
    return { sent: true, link: resetLink };
  } catch (err) {
    console.error("Email send error:", err.message);
    console.log(`[Password Reset] Fallback link for ${toEmail}:`, resetLink);
    return { sent: false, link: resetLink };
  }
};