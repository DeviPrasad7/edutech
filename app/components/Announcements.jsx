// Announcements.jsx
'use client';
import useSWR from 'swr'; // Import SWR

// The fetcher function is a simple wrapper around fetch
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Announcements() {
  // Use the SWR hook for data fetching
  // It returns data, error, and isLoading states automatically
  const { data, error, isLoading } = useSWR('/api/announcements', fetcher);

  if (isLoading) {
    return <p className="text-gray-400 text-center py-8">Loading announcements...</p>;
  }

  if (error || !data?.announcements) {
    return <p className="text-rose-400 text-center py-8">Failed to load announcements.</p>;
  }

  const { announcements } = data;

  return (
    <div className="space-y-4">
      {announcements.length === 0 ? (
        <p className="text-gray-800 text-center py-8">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann._id} className="bg-slate-700 p-6 rounded-lg border-l-4 border-indigo-500 shadow-sm">
              <h3 className="font-semibold text-lg text-white mb-2">{ann.title}</h3>
              <p className="text-gray-300 mb-2">{ann.content}</p>
              <p className="text-sm text-gray-400">
                {new Date(ann.postedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
      {/* The Add button is now in page.js, so we don't need the modal here */}
    </div>
  );
}