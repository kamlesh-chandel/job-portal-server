import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under review',
        'interview scheduled',
        'hired',
        'rejected',
      ],
      default: 'pending',
    },
    deleted_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

submissionSchema.index(
  { job_id: 1, applicant_id: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

export default mongoose.model('Submission', submissionSchema);
