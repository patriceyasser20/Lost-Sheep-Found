'use client';

import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; text: string };

export default function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm here to help with orders, shipping, or finding the right piece. What's on your mind?" },
  ]);

  async function send() {
    if (!input.trim()) return;
    const next = [...messages, { role: 'user' as const, text: input }];
    setMessages(next);
    setInput('');

    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: next }),
    });
    const data = await res.json();
    setMessages((m) => [...m, { role: 'assistant', text: data.reply ?? "Sorry, I couldn't get a response." }]);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open ? (
        <div className="w-[320px] border border-line bg-cream shadow-[0_12px_30px_rgba(76,60,46,.18)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-[14px]">
            <strong className="text-[13px]">Support</strong>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="cursor-pointer border-0 bg-transparent">
              <X size={16} />
            </button>
          </div>
          <div className="flex max-h-[260px] flex-col gap-[10px] overflow-y-auto p-[14px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-[13px] ${m.role === 'user' ? 'text-right text-brown' : 'text-left text-brown-soft'}`}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex border-t border-line">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask a question…"
              className="flex-1 border-0 bg-transparent p-3 text-[13px] outline-none"
            />
            <button onClick={send} aria-label="Send" className="cursor-pointer border-0 bg-transparent px-[14px]">
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open support chat"
          className="flex h-[52px] w-[52px] cursor-pointer items-center justify-center rounded-full border border-transparent bg-brown p-0 text-cream transition duration-[.25s] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,60,46,.16)]"
        >
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  );
}
