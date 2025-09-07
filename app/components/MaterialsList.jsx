// components/MaterialsList.jsx
'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { IoCloudDownloadOutline, IoSearch } from 'react-icons/io5';

export default function MaterialsList({ refreshKey }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // This useEffect will run on initial mount AND whenever refreshKey changes
  useEffect(() => {
    setLoading(true);
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setMaterials(data.materials || []);
      })
      .catch((err) => toast.error(`Failed to load materials: ${err.message}`))
      .finally(() => setLoading(false));
  }, [refreshKey]); // The dependency on refreshKey is what triggers the refetch

  const filteredMaterials = materials.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.topic.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return <div className="text-center text-gray-400 mt-10">Loading materials...</div>;
  }

  return (
    <div>
      <div className="relative mb-6">
        <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by subject, topic, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 pl-10 rounded-md bg-slate-800 text-white border border-slate-700"
        />
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center text-gray-500 mt-10 bg-slate-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold">No Materials Found</h3>
          <p>Try uploading something new!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div key={material._id} className="bg-slate-700 p-5 rounded-lg shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{material.topic}</h3>
                <p className="text-sm font-semibold text-indigo-400 mb-2">{material.subject}</p>
                <p className="text-gray-400 mb-4 text-sm">{material.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {material.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
              <a
                href={material.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition"
              >
                <IoCloudDownloadOutline size={20} />
                View Material
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
