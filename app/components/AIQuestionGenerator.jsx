'use client';
import { useState } from 'react';

export default function AIQuestionGenerator({ closeModal }) {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  async function handleGenerate() {
    if (!subject.trim() || !topic.trim() || !(numQuestions > 0)) return;
    setLoading(true);
    setError(null);
    setQuestions([]);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, numQuestions }),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions || []);
      } else {
        setError(data.error || 'Failed to generate questions');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-primary mb-6">Generate MCQs</h2>

      {error && <p className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</p>}

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full py-3 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full py-3 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <label className="block mb-2 font-medium text-gray-700">
        Number of Questions
      </label>
      <input
        type="number"
        min={1}
        max={20}
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        className="w-24 py-2 px-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !subject || !topic || !(numQuestions > 0)}
        className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Generating...' : 'Generate Questions'}
      </button>

      {questions.length > 0 && (
        <div className="mt-6 max-h-72 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
          <ul className="list-disc list-inside space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="whitespace-pre-wrap text-gray-800">
                {typeof q === 'string' ? q : JSON.stringify(q, null, 2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
