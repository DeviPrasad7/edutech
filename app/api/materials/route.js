// app/api/materials/route.js
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import Material from '@/models/Material';
import connectToDatabase from '@/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');

  await connectToDatabase();
  
  // LOGIC 1: If a fileId is provided, serve the file
  if (fileId) {
    if (fileId.length !== 24) {
      return NextResponse.json({ error: 'Invalid file ID format' }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const db = client.db();
      const bucket = new GridFSBucket(db, { bucketName: 'materials' });
      const objectId = new ObjectId(fileId);
      
      const files = await bucket.find({ _id: objectId }).toArray();
      if (files.length === 0) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
      
      const file = files[0];
      const downloadStream = bucket.openDownloadStream(objectId);
      
      return new NextResponse(downloadStream, {
        headers: {
          'Content-Type': file.contentType || 'application/octet-stream',
          'Content-Disposition': `inline; filename="${file.filename}"`,
        },
      });
    } catch (error) {
      console.error('File download error:', error);
      return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
    }

  // LOGIC 2: If no fileId, list all materials
  } else {
    try {
      const materials = await Material.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ materials });
    } catch (error) {
      console.error('List materials error:', error);
      return NextResponse.json({ error: 'Failed to retrieve materials' }, { status: 500 });
    }
  }
}
