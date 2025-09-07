// app/api/upload-material/route.js
import { MongoClient, GridFSBucket } from 'mongodb';
import { NextResponse } from 'next/server';
import Material from '@/models/Material';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request) {
  try {
    await connectToDatabase();

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

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: 'materials' });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadStream = bucket.openUploadStream(file.name, { contentType: file.type });
    
    uploadStream.end(buffer);

    await new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });
    
    const fileId = uploadStream.id;

    // THE URL FIX: Point to the materials API with a query parameter
    const fileUrl = `/api/materials?fileId=${fileId.toString()}`;

    const newMaterial = new Material({
      subject,
      topic,
      description,
      tags,
      fileUrl,
      fileId: fileId.toString(),
    });

    await newMaterial.save();
    await client.close();

    return NextResponse.json({ success: true, material: newMaterial });

  } catch (error) {
    console.error('Upload Material API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
