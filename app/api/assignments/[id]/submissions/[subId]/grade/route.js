import connectToDatabase from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  await connectToDatabase();
  const { id: assignmentId, subId } = params;
  
  try {
    const { grade } = await request.json();

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const submission = assignment.submissions.id(subId);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    submission.grade = grade;
    await assignment.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update grade error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
