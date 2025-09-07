import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { assignmentText } = await request.json();
    if (!assignmentText?.trim()) {
      return NextResponse.json({ error: 'Assignment text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    // Prompt or API call to evaluate assignment
    const res = await fetch('https://api.gemini.ai/evaluate-assignment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ assignmentText }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: res.status });
    }

    const data = await res.json();

    return NextResponse.json({ evaluation: data.evaluation || 'No evaluation returned' });
  } catch (error) {
    console.error('Evaluate Assignment API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
