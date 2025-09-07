import connectToDatabase from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();

  try {
    const assignments = await Assignment.find({}, { title: 1, dueDate: 1 }).sort({ dueDate: 1 }).lean();
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Assignments fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectToDatabase();

  try {
    const { title, description, dueDate } = await request.json();

    if (!title?.trim() || !dueDate) {
      return NextResponse.json({ error: 'Title and due date are required' }, { status: 400 });
    }

    const assignment = new Assignment({
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: new Date(dueDate),
    });

    await assignment.save();

    return NextResponse.json({ success: true, assignmentId: assignment._id });
  } catch (error) {
    console.error('Assignment creation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
