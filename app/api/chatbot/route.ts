import { NextRequest, NextResponse } from 'next/server';

// TODO: connect to Anthropic's Messages API (or another provider) here.
// For now, returns a friendly canned reply so the widget is testable
// without an API key.

export async function POST(req: NextRequest) {
  const { messages } = await req.json().catch(() => ({ messages: [] }));
  const lastUserMessage = messages?.[messages.length - 1]?.text ?? '';

  return NextResponse.json({
    reply: lastUserMessage
      ? "Thanks for reaching out! Our chatbot isn't fully connected yet — email hello@lostsheepfound.com and we'll help directly."
      : "Hi! What can I help you find today?",
  });
}
