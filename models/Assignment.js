import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  submissions: [
    {
      userId: { type: String },                  // Clerk user ID
      content: { type: String },                 // Assignment content / answer
      submittedAt: { type: Date, default: Date.now },
      grade: { type: Number },                    // Numeric grade
      feedback: { type: String },                 // Teacher feedback/comments
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
