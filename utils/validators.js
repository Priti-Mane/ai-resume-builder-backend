// Simple reusable validation helpers used across auth routes.

export const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isStrongEnoughPassword = (password) => {
  return typeof password === "string" && password.length >= 6;
};
