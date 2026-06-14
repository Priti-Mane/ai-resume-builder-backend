import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    fullName: String,
    email: String,
    phone: String,
    targetRole: String,
    summary: String,
    photo: { type: String, default: "" },
    template: { type: String, default: "classic" },
    links: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    education: { type: Array, default: [] },
    skills: { type: Array, default: [] },
    experience: { type: Array, default: [] },
    projects: { type: Array, default: [] },
    certifications: { type: Array, default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
