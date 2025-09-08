// RENAME to: components/ChatWidget.jsx
'use client';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useModalStore } from '../stores/useModalStore'; // NEW: Import store

// NEW: A simple icon for the header close button
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);


export default function ChatWidget() { // UPDATED: Renamed component
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: "Hello I am EduTech! How can I help you with your studies today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { toggleChat } = useModalStore(); // NEW: Get toggle function from store

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

async function sendMessage() {
  if (!input.trim()) return;
  const userMessage = { from: 'user', text: input };
  setChatHistory((prev) => [...prev, userMessage]);
  setInput('');
  setLoading(true);

  try {
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input, chatHistory }),
    });

    if (!res.ok) {
      // If the response is not OK, read the error message as plain text
      const errorText = await res.text();
      throw new Error(errorText || `Request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (!data.reply) {
      throw new Error('Received an empty reply from the server.');
    }

    setChatHistory((prev) => [...prev, { from: 'bot', text: data.reply }]);
  } catch (err) {
    toast.error(err.message);
    setChatHistory((prev) => [
      ...prev,
      { from: 'bot', text: "Sorry, I encountered an error. Please try again." },
    ]);
  } finally {
    setLoading(false);
  }
}



  return (
    // UPDATED: The container is now the widget itself, with a header
    <div className="bg-slate-800 p-4 rounded-xl max-w-md w-full flex flex-col h-[36rem] border border-slate-700 shadow-2xl">
      {/* NEW: Widget Header */}
      <div className="flex justify-between items-center pb-3 border-b border-slate-700 mb-3">
        <h2 className="text-lg font-bold text-white">EduTech AI Assistant</h2>
        <button
            onClick={toggleChat}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close chat"
        >
            <CloseIcon />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto mb-4 pr-2 space-y-4">
        {/* Chat history mapping remains the same */}
        {chatHistory.map((msg, i) => (
          <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] break-words ${msg.from === 'user' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="p-3 rounded-lg bg-slate-700 text-gray-400 italic">AI is typing...</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex space-x-2 border-t border-slate-700 pt-3">
        <input
          type="text"
          className="flex-grow p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-indigo-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}