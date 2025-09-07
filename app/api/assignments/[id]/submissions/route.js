import connectToDatabase from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  await connectToDatabase();
  const assignmentId = params.id;

  try {
    const assignment = await Assignment.findById(assignmentId).lean();
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Prepare submission data (add any fields you want your frontend to display, e.g. studentName)
    // Assuming your submissions array contains objects with necessary info
    const submissions = assignment.submissions.map(sub => ({
      _id: sub._id.toString(),
      studentName: sub.studentName || 'Unknown', // add this when submitting if missing
      studentId: sub.userId || 'N/A',            
      status: sub.status || 'Submitted',  // Optional: add status field if applicable
      content: sub.content,
      grade: sub.grade,
    }));

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Submissions fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
