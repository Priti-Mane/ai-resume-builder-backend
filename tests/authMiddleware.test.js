import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

describe("authMiddleware", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: "test_secret" };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test("rejects requests with no Authorization header", () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("rejects requests with an invalid token", () => {
    const req = { headers: { authorization: "Bearer invalid_token" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("allows requests with a valid token and sets req.userId", () => {
    const token = jwt.sign({ id: "user123" }, "test_secret", { expiresIn: "1h" });
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe("user123");
  });
});
