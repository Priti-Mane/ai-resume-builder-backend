import express from "express";
import Job from "../models/Job.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/jobs - all jobs for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err.message);
    res.status(500).json({ message: "Server error fetching jobs." });
  }
});

// POST /api/jobs - create new job
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { company, position, status, notes, followUpDate } = req.body;

    if (!company || !position) {
      return res.status(400).json({ message: "Company and Position are required." });
    }

    const job = await Job.create({
      userId: req.userId,
      company,
      position,
      status: status || "Applied",
      notes: notes || "",
      followUpDate: followUpDate || null,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err.message);
    res.status(500).json({ message: "Server error creating job." });
  }
});

// PUT /api/jobs/:id - update job
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { returnDocument: "after", runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.json(job);
  } catch (err) {
    console.error("Update job error:", err.message);
    res.status(500).json({ message: "Server error updating job." });
  }
});

// DELETE /api/jobs/:id - delete job
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.json({ message: "Job deleted successfully." });
  } catch (err) {
    console.error("Delete job error:", err.message);
    res.status(500).json({ message: "Server error deleting job." });
  }
});

export default router;
