import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Selected", "Rejected"],
      default: "Applied",
    },
    notes: { type: String, default: "" },
    appliedDate: { type: Date, default: Date.now },
    followUpDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
