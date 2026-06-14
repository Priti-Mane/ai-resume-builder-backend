import { isValidEmail, isStrongEnoughPassword } from "../utils/validators.js";

describe("isValidEmail", () => {
  test("accepts valid email addresses", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
    expect(isValidEmail("user.name+tag@sub.domain.co")).toBe(true);
  });

  test("rejects invalid email addresses", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("missing@domain")).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });
});

describe("isStrongEnoughPassword", () => {
  test("accepts passwords with 6 or more characters", () => {
    expect(isStrongEnoughPassword("abcdef")).toBe(true);
    expect(isStrongEnoughPassword("longerpassword123")).toBe(true);
  });

  test("rejects passwords shorter than 6 characters", () => {
    expect(isStrongEnoughPassword("abc")).toBe(false);
    expect(isStrongEnoughPassword("")).toBe(false);
  });

  test("rejects non-string values", () => {
    expect(isStrongEnoughPassword(123456)).toBe(false);
    expect(isStrongEnoughPassword(null)).toBe(false);
  });
});
