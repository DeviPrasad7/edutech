// models/Assignment.js
import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dueDate: { type: Date, required: true },
  courseId: { type: String }, // Optional: To associate with a course
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
