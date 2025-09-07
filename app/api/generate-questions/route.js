// app/api/generate-questions/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { subject, topic, numQuestions } = await request.json();

    if (!subject || !topic || !numQuestions) {
      return new Response('Missing required fields: subject, topic, or numQuestions', { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response('GEMINI_API_KEY is not configured', { status: 500 });
    }

    // UPDATED: Using 'gemini-2.0-flash' which has a higher free-tier rate limit (15 RPM).
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    // This strict prompt forces the AI to return clean JSON, which is essential.
    const strictPrompt = `
      You are a JSON-only question generator. Your entire response MUST be a single, valid JSON object and nothing else. Do not include any introductory text, closing remarks, or markdown code blocks.

      The JSON object must contain a single key: "questions".
      The value of "questions" must be an array of exactly ${numQuestions} objects.
      Each object in the array MUST have three keys: "question" (a string), "options" (an array of strings), and "answer" (a string).
      If a question is not multiple-choice, the "options" array MUST be an empty array [].

      Subject: ${subject}
      Topic: ${topic}

      Example of a valid response format:
      {
        "questions": [
          {
            "question": "What is the capital of France?",
            "options": ["London", "Berlin", "Paris", "Madrid"],
            "answer": "Paris"
          }
        ]
      }
    `;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: strictPrompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
        },
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody?.error?.message || 'Failed to get a valid response from the AI model.');
    }

    const data = await res.json();
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error('Received an empty or invalid response from the AI.');
    }
    
    const parsedJson = JSON.parse(aiResponseText);
    
    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error('API Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
