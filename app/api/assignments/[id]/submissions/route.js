// app/api/assignments/[id]/submissions/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';

export async function GET(request, { params }) {
  await connectToDatabase();
  
  // This is the definitive fix for Next.js 15+
  // We first await the params object, and then access its 'id' property.
  const awaitedParams = await params;
  const assignmentId = awaitedParams.id;

  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  try {
    // Find all submissions that match the assignmentId
    const submissions = await Submission.find({ assignmentId }).lean();
    
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}
