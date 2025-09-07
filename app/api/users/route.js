import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await connectToDatabase();

  const { searchParams } = new URL(request.url);
  const clerkId = searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: 'clerkId query param required' }, { status: 400 });
  }

  try {
    let user = await User.findOne({ clerkId }).lean();

    if (!user) {
      // Optionally create user in DB if not exists
      user = await User.create({ clerkId, role: 'student' });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
