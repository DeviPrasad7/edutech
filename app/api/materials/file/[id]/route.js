import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'File ID required' }, { status: 400 });
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  try {
    const bucket = new GridFSBucket(db, { bucketName: 'materialsFiles' });
    const _id = new ObjectId(id);

    // Get file metadata
    const files = await bucket.find({ _id }).toArray();
    if (files.length === 0) {
      await client.close();
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(_id);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    await client.close();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${file.filename}"`,
      },
    });
  } catch (error) {
    await client.close();
    console.error('File streaming error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
