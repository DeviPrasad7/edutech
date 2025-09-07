'use client';
import { useState } from 'react';

export default function AssignmentEvaluation({ closeModal }) {
  const [assignmentText, setAssignmentText] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function evaluateAssignment() {
    if (!assignmentText.trim()) return;

    setLoading(true);
    setError('');
    setEvaluation('');
    try {
      const res = await fetch('/api/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentText }),
      });
      const data = await res.json();
      if (res.ok) setEvaluation(data.evaluation || 'No evaluation returned.');
      else setError(data.error || 'Evaluation failed.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-primary">Evaluate Assignment</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <textarea
        rows={6}
        placeholder="Paste assignment text..."
        className="w-full p-3 border border-gray-300 rounded mb-3 focus:ring-2 focus:ring-primary"
        value={assignmentText}
        onChange={(e) => setAssignmentText(e.target.value)}
      />

      <button
        onClick={evaluateAssignment}
        disabled={loading || !assignmentText.trim()}
        className="w-full py-3 bg-primary text-white rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Evaluating...' : 'Evaluate'}
      </button>

      {evaluation && (
        <div className="mt-5 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
          {evaluation}
        </div>
      )}
    </div>
  );
}
