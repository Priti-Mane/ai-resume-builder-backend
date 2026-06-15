import { Resend } from "resend";

// Returns a Resend client if RESEND_API_KEY is configured, else null.
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

// Sends an email via Resend's HTTP API (works even on hosts that block SMTP ports).
// Returns { sent, link } - on failure, returns sent: false and logs the link.
const sendEmail = async ({ toEmail, subject, html, fallbackLogLabel, link }) => {
  const resend = getResendClient();

  if (!resend) {
    console.log(`\n[${fallbackLogLabel}] No RESEND_API_KEY configured. Link for ${toEmail}:`);
    console.log(link, "\n");
    return { sent: false, link };
  }

  try {
    const fromAddress = process.env.EMAIL_FROM || "onboarding@resend.dev";
    const { error } = await resend.emails.send({
      from: `AI Resume Builder <${fromAddress}>`,
      to: toEmail,
      subject,
      html,
    });

    if (error) {
      console.error("Email send error:", error.message || error);
      console.log(`[${fallbackLogLabel}] Fallback link for ${toEmail}:`, link);
      return { sent: false, link };
    }

    return { sent: true, link };
  } catch (err) {
    console.error("Email send error:", err.message);
    console.log(`[${fallbackLogLabel}] Fallback link for ${toEmail}:`, link);
    return { sent: false, link };
  }
};

// Sends a verification email (or logs the link if not configured).
export const sendVerificationEmail = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verifyLink = `${baseUrl}/verify-email?token=${token}`;

  return sendEmail({
    toEmail,
    subject: "Verify your email - AI Resume Builder",
    html: `<p>Welcome! Please verify your email by clicking the link below:</p>
           <p><a href="${verifyLink}">${verifyLink}</a></p>`,
    fallbackLogLabel: "Email Verification",
    link: verifyLink,
  });
};

// Sends a password reset email (or logs the link if not configured).
export const sendPasswordResetEmail = async (toEmail, token) => {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  return sendEmail({
    toEmail,
    subject: "Reset your password - AI Resume Builder",
    html: `<p>You requested a password reset. Click the link below to set a new password:</p>
           <p><a href="${resetLink}">${resetLink}</a></p>
           <p>This link will expire in 1 hour. If you did not request this, you can ignore this email.</p>`,
    fallbackLogLabel: "Password Reset",
    link: resetLink,
  });
};
