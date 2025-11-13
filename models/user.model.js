import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },

    profile: {
      skills: [{ type: String, trim: true }],
      resume_url: { type: String, trim: true },
      profile_url: { type: String, trim: true },
    },

    social_links: {
      linkedin_url: { type: String, trim: true },
      github_url: { type: String, trim: true },
    },

    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.model('User', userSchema);
