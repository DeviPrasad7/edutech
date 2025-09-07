// components/AIQuestionGenerator.jsx
'use client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { Disclosure } from '@headlessui/react'; // For a nice accordion display

// A simple chevron icon for the accordion
const ChevronUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
);

export default function AIQuestionGenerator() {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: { numQuestions: 5 } // Set a default value
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Generating questions...');
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
      setGeneratedQuestions(result.questions || []);
      // reset(); // Optionally reset the form after generation
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  return (
    // The component now matches our dark theme
    <div className="bg-slate-800 p-8 rounded-xl max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-white mb-6">AI Question Generator</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Subject (e.g., Biology)"
            {...register('subject', { required: 'Subject is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.subject && <p className="text-rose-400 mt-1 text-sm">{errors.subject.message}</p>}
        </div>
        <div>
          <input
            type="text"
            placeholder="Topic (e.g., Cell Mitosis)"
            {...register('topic', { required: 'Topic is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.topic && <p className="text-rose-400 mt-1 text-sm">{errors.topic.message}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-300">Number of Questions</label>
          <input
            type="number"
            {...register('numQuestions', {
              required: 'Number of questions is required',
              min: { value: 1, message: 'Must be at least 1' },
              max: { value: 20, message: 'Cannot exceed 20' }
            })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.numQuestions && <p className="text-rose-400 mt-1 text-sm">{errors.numQuestions.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
        >
          {isSubmitting ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {generatedQuestions.length > 0 && (
        <div className="mt-8 w-full">
          <h3 className="text-xl font-bold text-white mb-4">Generated Questions</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto rounded-lg bg-slate-900 p-4">
            {generatedQuestions.map((q, index) => (
              <Disclosure key={index} as="div" className="bg-slate-700 rounded-lg">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-indigo-300 hover:bg-slate-600 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500/75">
                      <span>{q.question}</span>
                      <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-indigo-400 transition-transform`} />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-300">
                      <ul className="list-disc list-inside space-y-1">
                          {q.options.map((opt, i) => <li key={i}>{opt}</li>)}
                      </ul>
                      <p className="mt-3 font-semibold text-lime-400">Correct Answer: {q.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}