'use client';

import { useState, useEffect } from 'react';

export default function MaterialsList() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState([]);

  // Fetch materials on mount
  useEffect(() => {
    setLoading(true);
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data) => {
        setMaterials(data.materials || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter materials on search
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = materials.filter(
      (m) =>
        m.subject.toLowerCase().includes(lowerSearch) ||
        m.topic.toLowerCase().includes(lowerSearch)
    );
    setFilteredMaterials(filtered);
  }, [search, materials]);

  if (loading) return <p>Loading materials...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Study Materials</h2>

      <input
        type="text"
        placeholder="Search by subject or topic"
        className="w-full mb-6 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredMaterials.length === 0 ? (
        <p>No materials found.</p>
      ) : (
        <ul className="space-y-4 max-h-[60vh] overflow-auto">
          {filteredMaterials.map(({ _id, subject, topic, description, fileUrl }) => (
            <li key={_id} className="p-4 border rounded hover:shadow-lg transition">
              <h3 className="font-semibold text-lg mb-1">{subject} — {topic}</h3>
              <p className="text-gray-700 mb-2">{description}</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary p-2 rounded-2xl bg-purple-200 hover:bg-purple-400"
              >
                View Material
              </a>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
