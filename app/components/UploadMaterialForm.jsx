'use client';
import { useState } from 'react';

export default function UploadMaterialForm({ closeModal }) {
  const [form, setForm] = useState({
    subject: '',
    topic: '',
    description: '',
    tags: '',
    file: null,
  });

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });

    try {
      const res = await fetch('/api/upload-material', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Material uploaded successfully!');
        closeModal();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      alert('Upload error: ' + err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-2xl font-semibold text-primary mb-4">Upload Study Material</h2>
      <input
        name="subject"
        type="text"
        placeholder="Subject"
        required
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
      />
      <input
        name="topic"
        type="text"
        placeholder="Topic"
        required
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
      />
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-primary"
      />
      <input
        name="tags"
        type="text"
        placeholder="Tags (comma separated)"
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary"
      />
      <input
        name="file"
        type="file"
        accept=".pdf,image/*"
        required
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={closeModal}
          className="text-gray-600 hover:underline"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-primary px-6 py-2 text-white font-semibold hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </form>
  );
}
