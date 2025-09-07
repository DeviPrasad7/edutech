// models/Submission.js
import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: String, required: true }, // Clerk user ID
  studentName: { type: String, required: true }, // To avoid extra lookups
  content: { type: String, required: true }, // The actual text of the submission
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  feedback: { type: String },
});

export default mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
