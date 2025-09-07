'use client';

import { useState, useEffect } from 'react';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredSubs, setFilteredSubs] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  async function createAssignment() {
    if (!newTitle.trim() || !newDueDate) {
      alert('Title and due date are required');
      return;
    }

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          dueDate: newDueDate,
        }),
      });

      if (res.ok) {
        alert('Assignment created!');
        setNewTitle('');
        setNewDesc('');
        setNewDueDate('');
        // Refresh assignments list
        const updated = await fetch('/api/assignments');
        const data = await updated.json();
        setAssignments(data.assignments || []);
      } else {
        alert('Failed to create assignment');
      }
    } catch (err) {
      alert('Error creating assignment');
      console.error(err);
    }
  }


  // Fetch all assignments on mount
  useEffect(() => {
    fetch('/api/assignments')
      .then(res => res.json())
      .then(data => setAssignments(data.assignments || []))
      .catch(console.error);
  }, []);

  // Fetch submissions when an assignment is selected
  useEffect(() => {
    if (!selectedAssignment) {
      setSubmissions([]);
      return;
    }
    fetch(`/api/assignments/${selectedAssignment._id}/submissions`)
      .then(res => res.json())
      .then(data => setSubmissions(data.submissions || []))
      .catch(console.error);
  }, [selectedAssignment]);

  // Filter submissions by student name or ID based on search
  useEffect(() => {
    const searchTerm = search.toLowerCase();
    const filtered = submissions.filter(sub =>
      sub.studentName.toLowerCase().includes(searchTerm) ||
      sub.studentId.toLowerCase().includes(searchTerm)
    );
    setFilteredSubs(filtered);
  }, [search, submissions]);

  // Update grade manually for a submission
  async function updateGrade(subId, newGrade) {
    if (isNaN(newGrade) || newGrade < 0) {
      alert('Please enter a valid numeric grade >= 0');
      return;
    }
    try {
      const res = await fetch(`/api/assignments/${selectedAssignment._id}/submissions/${subId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: newGrade }),
      });
      if (res.ok) {
        // Update locally without refetching
        setSubmissions(subs =>
          subs.map(s => (s._id === subId ? { ...s, grade: newGrade } : s))
        );
      } else {
        alert('Failed to update grade');
      }
    } catch (error) {
      alert('Error saving grade');
      console.error(error);
    }
  }

  // Call AI API to evaluate and assign grade
  async function aiGrade(subId, content) {
    try {
      const res = await fetch('/api/evaluate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentText: content }),
      });
      const data = await res.json();
      if (res.ok && data.evaluation) {
        const aiScore = parseFloat(data.evaluation);
        if (!isNaN(aiScore)) {
          await updateGrade(subId, aiScore);
          alert(`AI graded: ${aiScore}`);
        } else {
          alert('AI evaluation did not return a valid numeric grade.');
        }
      } else {
        alert('AI grading failed.');
      }
    } catch (error) {
      alert('Error during AI grading');
      console.error(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-6">
      <div className="border p-4 rounded max-w-md mb-8">
        <h2 className="text-xl font-semibold mb-3">Create New Assignment</h2>

        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <textarea
          placeholder="Description (optional)"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          rows={3}
        />

        <label className="block mb-1 font-medium">Due Date:</label>
        <input
          type="date"
          value={newDueDate}
          onChange={e => setNewDueDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          onClick={createAssignment}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create Assignment
        </button>
      </div>

      <h1 className="text-3xl font-bold">Assignments</h1>

      {/* Assignments list */}
      <div className="border rounded shadow p-4 max-w-md">
        <h2 className="text-xl font-semibold mb-3">Assignment List</h2>
        {assignments.length === 0 ? (
          <p>No assignments found.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {assignments.map(a => (
              <li
                key={a._id}
                className={`cursor-pointer p-2 hover:bg-gray-100 ${selectedAssignment?._id === a._id ? 'bg-gray-200 font-semibold' : ''
                  }`}
                onClick={() => setSelectedAssignment(a)}
              >
                <div>{a.title}</div>
                <div className="text-sm text-gray-600">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Submissions & grading if an assignment selected */}
      {selectedAssignment && (
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-3">
            Submissions for: <span className="italic">{selectedAssignment.title}</span>
          </h2>

          <input
            type="text"
            placeholder="Search by student name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border p-2 mb-4 w-full max-w-sm rounded"
          />

          {filteredSubs.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Student</th>
                  <th className="border p-2 text-left">Status</th>
                  <th className="border p-2 text-left">Grade</th>
                  <th className="border p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map(sub => (
                  <tr key={sub._id}>
                    <td className="border p-2">{sub.studentName}</td>
                    <td className="border p-2">{sub.status || 'Submitted'}</td>
                    <td className="border p-2">
                      <input
                        type="number"
                        min="0"
                        value={sub.grade ?? ''}
                        onChange={e => {
                          const grade = e.target.value ? Number(e.target.value) : '';
                          setSubmissions(subs =>
                            subs.map(s => (s._id === sub._id ? { ...s, grade } : s))
                          );
                        }}
                        onBlur={e => {
                          const grade = e.target.value ? Number(e.target.value) : null;
                          if (grade !== null) updateGrade(sub._id, grade);
                        }}
                        className="w-20 p-1 border rounded"
                      />
                    </td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => aiGrade(sub._id, sub.content)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        AI Grade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
