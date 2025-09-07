// app/api/submissions/[id]/grade/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function POST(request, { params }) {
  await connectToDatabase();
  
  // This now correctly matches the folder name '[id]'
  const { id: submissionId } = params;
  
  if (!submissionId) {
    return NextResponse.json({ error: 'Submission ID is required' }, { status: 400 });
  }

  try {
    const { grade } = await request.json();

    if (typeof grade !== 'number') {
      return NextResponse.json({ error: 'A numeric grade is required' }, { status: 400 });
    }

    const updatedSubmission = await Submission.findByIdAndUpdate(
      submissionId,
      { $set: { grade: grade } },
      { new: true } // Return the updated document
    );

    if (!updatedSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, submission: updatedSubmission });
  } catch (error) {
    console.error('Update grade error:', error);
    return NextResponse.json({ error: 'Failed to update grade' }, { status: 500 });
  }
}
