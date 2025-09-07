import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },  // Clerk user ID linkage
  email: { type: String, required: true },
  name: { type: String },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'teacher',
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite during hot reloads in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
