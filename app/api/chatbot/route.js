// app/api/chatbot/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, chatHistory } = await request.json();

    if (!message?.trim()) {
      return new Response('Message text is required', { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response('GEMINI_API_KEY is not configured on the server.', { status: 500 });
    }

    // UPDATED: Changed to the latest non-deprecated model for better rate limits.
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

    const systemPrompt = `You are EduSphere AI, a helpful and encouraging teaching assistant. Your goal is to help students learn. Based on the provided chat history and the user's latest message, provide a concise and helpful response. Keep your answers conversational.`;

    const fullPrompt = `${systemPrompt}\n\n--- CHAT HISTORY ---\n${chatHistory
      .map((msg) => `${msg.from}: ${msg.text}`)
      .join('\n')}\n\n--- NEW MESSAGE ---\nuser: ${message}`;

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }],
        }],
      }),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      console.error('Gemini API Error:', errorBody);
      const errorMessage = errorBody?.error?.message || 'Failed to get a response from the AI model.';
      return new Response(errorMessage, { status: res.status });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return new Response('Received an empty reply from the AI model.', { status: 500 });
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
