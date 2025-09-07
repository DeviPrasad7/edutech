// components/AssignmentEvaluation.jsx
'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { IoSparkles } from "react-icons/io5";

export default function AssignmentEvaluation({ onEvaluated }) {
  const [assignmentText, setAssignmentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!assignmentText.trim()) {
      toast.error('Please enter some text to evaluate.');
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading('AI is evaluating...');
    
    try {
      const res = await fetch('/api/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed.');

      toast.success('Evaluation complete!', { id: loadingToast });
      // Pass the evaluation result to the parent component
      onEvaluated(data.evaluation); 
      setAssignmentText('');
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">AI Evaluation</h2>
      <form onSubmit={handleEvaluate} className="space-y-4">
        <div>
          <label htmlFor="assignmentText" className="block mb-2 font-medium text-gray-300">
            Submission Text
          </label>
          <textarea
            id="assignmentText"
            value={assignmentText}
            onChange={(e) => setAssignmentText(e.target.value)}
            rows={8}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Paste the student's submission text here..."
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <IoSparkles />
          {isLoading ? 'Evaluating...' : 'Evaluate with AI'}
        </button>
      </form>
    </div>
  );
}
