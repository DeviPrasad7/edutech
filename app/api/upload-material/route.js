import connectToDatabase from '@/lib/mongodb';
import Material from '@/models/Material';
import { NextResponse } from 'next/server';
import { MongoClient, GridFSBucket } from 'mongodb';

export async function POST(request) {
  await connectToDatabase();

  try {
    const formData = await request.formData();

    const subject = formData.get('subject');
    const topic = formData.get('topic');
    const description = formData.get('description');
    const tagsRaw = formData.get('tags') || '';
    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);
    const file = formData.get('file');

    if (!subject || !topic || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB for GridFS
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();

    // Create GridFS bucket
    const bucket = new GridFSBucket(db, { bucketName: 'materialsFiles' });

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload file to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    });

    const fileId = await new Promise((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', () => resolve(uploadStream.id));
      uploadStream.end(buffer);
    });

    // Create fileUrl pointing to your file streaming API
    const fileUrl = `/api/materials/file/${fileId.toString()}`;

    const material = new Material({ subject, topic, description, tags, fileUrl });
    await material.save();

    await client.close();

    return NextResponse.json({ success: true, materialId: material._id });
  } catch (error) {
    console.error('Upload Material API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
