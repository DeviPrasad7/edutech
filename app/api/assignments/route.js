// app/api/assignments/route.js
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

// This GET handler fetches ALL assignments. It does not use params.
export async function GET(request) {
  await connectToDatabase();
  try {
    const assignments = await Assignment.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to retrieve assignments' }, { status: 500 });
  }
}

// This POST handler creates a NEW assignment.
export async function POST(request) {
  await connectToDatabase();
  try {
    const body = await request.json();
    const newAssignment = new Assignment({
      title: body.title,
      description: body.description,
      dueDate: body.dueDate,
    });
    await newAssignment.save();
    return NextResponse.json({ success: true, assignment: newAssignment }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
