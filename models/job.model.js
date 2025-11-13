import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String, trim: true }],
    salary: { type: Number, required: true },
    experience_level: { type: Number, required: true },
    location: { type: String, trim: true },
    job_type: { type: String, trim: true },
    positions: { type: Number, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Job", jobSchema);
