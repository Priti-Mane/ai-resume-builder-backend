import express from "express";
import Resume from "../models/Resume.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/resume - get logged-in user's resume
router.get("/", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: "No resume found." });
    }
    res.json(resume);
  } catch (err) {
    console.error("Get resume error:", err.message);
    res.status(500).json({ message: "Server error fetching resume." });
  }
});

// POST /api/resume - create or update resume (upsert)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId },
      { ...data, userId: req.userId },
      { returnDocument: "after", upsert: true, runValidators: true }
    );

    res.json(resume);
  } catch (err) {
    console.error("Save resume error:", err.message);
    res.status(500).json({ message: "Server error saving resume." });
  }
});

export default router;
