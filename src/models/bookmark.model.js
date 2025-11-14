import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

bookmarkSchema.index(
  { user_id: 1, job_id: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

export default mongoose.model('Bookmark', bookmarkSchema);
