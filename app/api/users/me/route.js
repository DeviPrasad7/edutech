// app/api/users/me/route.js
import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    const { userId: clerkId } = auth();

    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    let user = await User.findOne({ clerkId }).lean();
    
    // If the user exists in Clerk but not in your DB, create them automatically.
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);
      user = await User.create({
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName,
        // The default role will be 'teacher' as defined in your User model.
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
