import connectToDatabase from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import { NextResponse } from 'next/server';

// GET handler: fetch announcements
export async function GET() {
  await connectToDatabase();
  try {
    const announcements = await Announcement.find()
      .sort({ postedAt: -1 })
      .lean();
    return NextResponse.json({ announcements });
  } catch (error) {
    console.error('Fetch Announcements API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST handler: add a new announcement
export async function POST(request) {
  await connectToDatabase();
  try {
    const { title, content } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const announcement = new Announcement({
      title: title.trim(),
      content: content.trim(),
    });

    await announcement.save();

    return NextResponse.json(
      { success: true, announcementId: announcement._id }
    );
  } catch (error) {
    console.error('Add Announcement API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
