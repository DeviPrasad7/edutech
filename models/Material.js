import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema({
  subject: { type: String, required: true },           // Subject name (e.g., Math, Physics)
  topic: { type: String, required: true },             // Specific topic within the subject
  description: { type: String },                        // Optional description of the material
  tags: [{ type: String }],                             // Array of tags for search/filtering
  fileUrl: { type: String, required: true },           // Public URL to the uploaded file
  uploaderId: { type: String },                         // Clerk user ID of who uploaded the material
  uploadedAt: { type: Date, default: Date.now },       // Timestamp of upload
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
