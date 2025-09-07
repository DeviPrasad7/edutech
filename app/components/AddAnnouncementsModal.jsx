'use client';
import { useState } from 'react';

export default function AddAnnouncementModal({ isOpen, onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setTitle('');
        setContent('');
        onAdded();
        onClose();
      } else {
        alert('Failed to add announcement');
      }
    } catch {
      alert('Error adding announcement');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Announcement</h2>
        <input
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full mb-4 p-3 border rounded"
        />
        <textarea
          placeholder="Content"
          rows={5}
          required
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full mb-4 p-3 border rounded resize-none"
        />
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
}
