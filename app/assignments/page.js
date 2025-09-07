// app/assignments/page.js
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import AnimatedModal from '../components/AnimatedModal';
import { IoAddSharp, IoSearch, IoSparkles } from "react-icons/io5";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    setIsLoadingAssignments(true);
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const validAssignments = data.assignments || [];
        setAssignments(validAssignments);
        if (validAssignments.length > 0) {
          setSelectedAssignment(validAssignments[0]);
        }
      })
      .catch(err => toast.error(`Failed to load assignments: ${err.message}`))
      .finally(() => setIsLoadingAssignments(false));
  }, []);

  useEffect(() => {
    if (!selectedAssignment?._id) {
      setSubmissions([]);
      return;
    }
    setIsLoadingSubmissions(true);
    fetch(`/api/assignments/${selectedAssignment._id}/submissions`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setSubmissions(data.submissions || []);
      })
      .catch(err => toast.error(`Failed to load submissions: ${err.message}`))
      .finally(() => setIsLoadingSubmissions(false));
  }, [selectedAssignment]);

  const handleCreateAssignment = async (data) => {
    const loadingToast = toast.loading('Creating assignment...');
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.error || 'Failed to create');

      const newAssignment = responseData.assignment || responseData;
      if (!newAssignment?._id) throw new Error("API did not return a valid assignment object.");

      toast.success('Assignment created!', { id: loadingToast });
      setAssignments(prev => [newAssignment, ...prev]);
      setSelectedAssignment(newAssignment);
      setIsModalOpen(false);
      reset();
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  // In app/assignments/page.js

  const handleUpdateGrade = async (submissionId, newGrade) => {
    const grade = parseFloat(newGrade);
    if (isNaN(grade) || grade < 0) {
      toast.error('Please enter a valid non-negative grade.');
      return;
    }

    try {
      // Corrected URL to match the new folder structure
      const res = await fetch(`/api/submissions/${submissionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update grade');
      }

      setSubmissions(subs => subs.map(s => (s._id === submissionId ? { ...s, grade } : s)));
      toast.success('Grade saved!');
    } catch (error) {
      toast.error(error.message);
    }
  };


  const filteredSubmissions = submissions.filter(sub =>
    sub.studentName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full text-white">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-transform duration-200 hover:scale-105"
        >
          <IoAddSharp size={24} />
          <span className="hidden sm:inline">New Assignment</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-slate-800 p-4 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">All Assignments</h2>
          {isLoadingAssignments ? <p className="text-gray-400">Loading...</p> : (
            <ul className="space-y-2">
              {assignments.filter(Boolean).map(assign => (
                <li key={assign._id}>
                  <button
                    onClick={() => setSelectedAssignment(assign)}
                    className={`w-full text-left p-3 rounded-md transition ${selectedAssignment?._id === assign._id ? 'bg-indigo-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    <p className="font-bold">{assign.title}</p>
                    <p className="text-xs text-gray-300">Due: {new Date(assign.dueDate).toLocaleDateString()}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl">
          {selectedAssignment ? (
            <>
              <h2 className="text-2xl font-bold mb-1">{selectedAssignment.title}</h2>
              <p className="text-gray-400 mb-6">{selectedAssignment.description}</p>

              <div className="relative mb-4">
                <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-2 pl-10 rounded-md bg-slate-700 border border-slate-600"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-700 text-sm text-gray-400">
                    <tr>
                      <th className="p-2">Student</th>
                      <th className="p-2">Submission</th>
                      <th className="p-2 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingSubmissions ? (
                      <tr><td colSpan="3" className="text-center p-4">Loading submissions...</td></tr>
                    ) : filteredSubmissions.length === 0 ? (
                      <tr><td colSpan="3" className="text-center p-4">No submissions for this assignment.</td></tr>
                    ) : (
                      filteredSubmissions.map(sub => (
                        <tr key={sub._id} className="border-b border-slate-700">
                          <td className="p-2 font-semibold">{sub.studentName}</td>
                          <td className="p-2 text-sm text-gray-300 max-w-xs truncate">{sub.content}</td>
                          <td className="p-2 text-center">
                            <input
                              type="number"
                              defaultValue={sub.grade}
                              onBlur={(e) => handleUpdateGrade(sub._id, e.target.value)}
                              className="w-20 p-1 rounded bg-slate-900 text-center"
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 flex items-center justify-center h-full">
              <p>Select an assignment to view submissions.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Assignment">
        <form onSubmit={handleSubmit(handleCreateAssignment)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600" />
            {errors.title && <p className="text-rose-400 mt-1 text-sm">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea {...register('description')} rows={3} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Due Date</label>
            <input type="date" {...register('dueDate', { required: 'Due date is required' })} className="w-full p-2 rounded-md bg-slate-700 border border-slate-600" />
            {errors.dueDate && <p className="text-rose-400 mt-1 text-sm">{errors.dueDate.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      </AnimatedModal>
    </div>
  );
}
