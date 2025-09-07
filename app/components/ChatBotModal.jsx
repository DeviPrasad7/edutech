'use client';
import { useState } from 'react';

export default function ChatBotModal({ closeModal }) {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    setChatHistory((prev) => [...prev, { from: 'user', text: input }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, chatHistory }),
      });
      const data = await res.json();
      setChatHistory((prev) => [...prev, { from: 'bot', text: data.reply }]);
    } catch {
      setChatHistory((prev) => [...prev, { from: 'bot', text: 'Error: unable to respond.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-96 max-w-lg mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-primary">AI Chatbot</h2>
      <div className="flex-grow overflow-auto border rounded p-3 mb-4 space-y-2">
        {chatHistory.length === 0 && <p className="text-gray-400">Start chatting!</p>}
        {chatHistory.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[70%] ${
              msg.from === 'user' ? 'bg-primary text-white self-end' : 'bg-gray-200'
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="italic text-gray-500">AI is typing...</p>}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow border rounded px-3 py-2 focus:ring-2 focus:ring-primary"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-primary text-white px-4 rounded font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>

      <button
        onClick={closeModal}
        className="mt-4 w-full py-2 text-center border rounded hover:bg-gray-100"
      >
        Close Chat
      </button>
    </div>
  );
}
