// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'teacher', // The default role is now 'teacher'
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);