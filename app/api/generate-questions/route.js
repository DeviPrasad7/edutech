import { NextResponse } from 'next/server';

function extractTextFromContent(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : extractTextFromContent(part.text || part.parts || '')))
      .join('\n');
  }
  if (content && typeof content === 'object') {
    if (content.text) return content.text;
    if (content.parts) return extractTextFromContent(content.parts);
  }
  return '';
}

export async function POST(request) {
  try {
    const { subject, topic, numQuestions = 5 } = await request.json();

    if (!subject?.trim() || !topic?.trim() || isNaN(numQuestions) || numQuestions <= 0) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

    const promptText = `Generate ${numQuestions} multiple choice questions with answers on the topic "${topic}" in subject "${subject}". Format clearly with question and options.`;

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: res.status });
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content || '';
    const rawText = extractTextFromContent(content);
    const questions = rawText.split('\n').filter(Boolean);

    return NextResponse.json({
      questions,
      count: questions.length,
      formatted: questions.join('\n\n'), // additional pretty format string
    });
  } catch (error) {
    console.error('Generate Questions API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
