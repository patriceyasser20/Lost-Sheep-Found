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
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 40 }}>
      {open ? (
        <div style={{ width: 320, background: 'var(--cream)', border: '1px solid var(--line)', boxShadow: '0 12px 30px rgba(76,60,46,.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
            <strong style={{ fontSize: 13 }}>Support</strong>
            <button onClick={() => setOpen(false)} aria-label="Close chat" style={{ border: 0, background: 'transparent', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ maxHeight: 260, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ fontSize: 13, color: m.role === 'user' ? 'var(--brown)' : 'var(--brown-soft)', textAlign: m.role === 'user' ? 'right' : 'left' }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', borderTop: '1px solid var(--line)' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask a question…"
              style={{ flex: 1, border: 0, padding: 12, fontSize: 13, outline: 'none', background: 'transparent' }}
            />
            <button onClick={send} aria-label="Send" style={{ border: 0, background: 'transparent', padding: '0 14px', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open support chat"
          className="button button-dark"
          style={{ borderRadius: '50%', width: 52, height: 52, padding: 0 }}
        >
          <MessageCircle size={20} />
        </button>
      )}
    </div>
  );
}
