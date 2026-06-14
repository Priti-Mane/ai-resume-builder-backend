import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const getModel = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Returns a friendly message + status code for known Gemini error types.
const handleAIError = (err) => {
  const msg = err?.message || "";
  if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
    return {
      status: 429,
      message: "Daily AI usage limit reached. Please try again tomorrow.",
    };
  }
  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return {
      status: 401,
      message: "AI service is not configured correctly (invalid API key).",
    };
  }
  return { status: 500, message: "AI generation failed. Please try again." };
};

// POST /api/ai/summary
router.post("/summary", authMiddleware, async (req, res) => {
  try {
    const { role, skills } = req.body;
    const model = getModel();

    if (!model) {
      return res.json({
        summary: `Motivated ${role || "professional"} with hands-on experience in ${skills || "relevant technologies"}, eager to contribute to building scalable, efficient solutions. (Add GEMINI_API_KEY in .env for AI-generated summaries.)`,
      });
    }

    const prompt = `You are writing content for a resume. Write EXACTLY ONE concise, professional 3-4 line resume summary for a ${role || "fresher developer"} with skills in ${skills || "general programming"}. Do NOT offer multiple options, do NOT ask questions, do NOT add explanations or headings. Output ONLY the final summary text, plain text, no markdown, no quotes.`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text().trim();

    res.json({ summary });
  } catch (err) {
    console.error("AI summary error:", err.message);
    const { status, message } = handleAIError(err);
    res.status(status).json({ message });
  }
});

// POST /api/ai/skills
router.post("/skills", authMiddleware, async (req, res) => {
  try {
    const { role } = req.body;
    const model = getModel();

    if (!model) {
      return res.json({
        skills: ["Problem Solving", "Git", "REST APIs", "Communication"],
      });
    }

    const prompt = `List 6 relevant technical and soft skills for a resume for a ${role || "software developer"} role. Return ONLY a comma-separated list, no numbering, no extra text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const skills = text.split(",").map((s) => s.trim()).filter(Boolean);

    res.json({ skills });
  } catch (err) {
    console.error("AI skills error:", err.message);
    const { status, message } = handleAIError(err);
    res.status(status).json({ message });
  }
});

// POST /api/ai/project
router.post("/project", authMiddleware, async (req, res) => {
  try {
    const { title, tech } = req.body;
    const model = getModel();

    if (!model) {
      return res.json({
        description: `Developed ${title || "a full-stack application"} using ${tech || "modern web technologies"}, implementing core features with clean, maintainable code. (Add GEMINI_API_KEY in .env for AI-generated descriptions.)`,
      });
    }

    const prompt = `You are writing content for a resume. Write EXACTLY ONE concise 2-3 line bullet-style resume project description for a project titled "${title || "Untitled Project"}" built using ${tech || "various technologies"}. Start directly with an action verb (e.g. "Developed", "Built", "Implemented"). Do NOT offer multiple options, do NOT ask questions, do NOT add explanations or headings. Output ONLY the final description text, plain text, no markdown, no quotes.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    res.json({ description });
  } catch (err) {
    console.error("AI project description error:", err.message);
    const { status, message } = handleAIError(err);
    res.status(status).json({ message });
  }
});

export default router;
