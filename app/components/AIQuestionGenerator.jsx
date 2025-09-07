// components/AIQuestionGenerator.jsx
'use client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function AIQuestionGenerator() {
  // This state will hold the array of question objects
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { numQuestions: 5 } // Default to 5 questions
  });

  // This function is called when the form is submitted
  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Generating questions...');
    
    // **THE FIX**: This line ensures the previous list is cleared before every new request.
    setGeneratedQuestions([]); 
    
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to generate questions');
      }

      toast.success('Questions generated successfully!', { id: loadingToast });
      
      // This directly REPLACES the old state with the new questions from the API
      setGeneratedQuestions(result.questions || []);
      
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  return (
    <div className="bg-slate-800 p-8 rounded-xl max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-white mb-6">AI Question Generator</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Subject Input */}
        <div>
          <input
            type="text"
            placeholder="Subject (e.g., Math)"
            {...register('subject', { required: 'Subject is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.subject && <p className="text-rose-400 mt-1 text-sm">{errors.subject.message}</p>}
        </div>

        {/* Topic Input */}
        <div>
          <input
            type="text"
            placeholder="Topic (e.g., Algebra)"
            {...register('topic', { required: 'Topic is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.topic && <p className="text-rose-400 mt-1 text-sm">{errors.topic.message}</p>}
        </div>

        {/* Number of Questions Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-300">Number of Questions</label>
          <input
            type="number"
            {...register('numQuestions', {
              required: true,
              min: { value: 1, message: 'Must be at least 1' },
              max: { value: 20, message: 'Cannot exceed 20' }
            })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.numQuestions && <p className="text-rose-400 mt-1 text-sm">{errors.numQuestions.message}</p>}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {/* --- SIMPLIFIED QUESTION DISPLAY --- */}
      <div className="mt-8 w-full">
        {/* Only show the title if there are questions */}
        {generatedQuestions.length > 0 && (
          <h3 className="text-xl font-bold mb-4 text-white">Generated Questions</h3>
        )}
        
        {/* A simple list to display each question */}
        <div className="space-y-4">
          {generatedQuestions.map((q, index) => (
            <div key={index} className="bg-slate-700 p-4 rounded-lg">
              {/* Question Text */}
              <p className="font-semibold text-white">{`${index + 1}. ${q.question}`}</p>
              
              {/* Options (only shown if they exist) */}
              {Array.isArray(q.options) && q.options.length > 0 && (
                <ul className="list-disc list-inside space-y-1 mt-2 pl-4 text-gray-300">
                  {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                </ul>
              )}
              
              {/* Answer */}
              <p className="mt-3 font-bold text-lime-400">Answer: {q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
