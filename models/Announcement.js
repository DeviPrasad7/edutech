import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedAt: { type: Date, default: Date.now },
  authorId: { type: String },  // Optionally keep Clerk user ID posting announcement
});

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
