import connectToDatabase from '@/lib/mongodb';
import Material from '@/models/Material';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();

  try {
    const materials = await Material.find().sort({ uploadedAt: -1 }).lean();
    return NextResponse.json({ materials });
  } catch (error) {
    console.error('Fetch Materials API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
