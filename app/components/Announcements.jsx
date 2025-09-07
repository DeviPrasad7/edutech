'use client';
import { useState, useEffect } from 'react';
import AddAnnouncementModal from './AddAnnouncementsModal';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch announcements (re-runs when refreshKey changes)
  useEffect(() => {
    fetch('/api/announcements')
      .then(res => res.json())
      .then(data => setAnnouncements(data.announcements || []))
      .catch(error => console.error('Error fetching announcements:', error));
  }, [refreshKey]);

  // Handler to refresh announcements after adding new one
  const handleAnnouncementAdded = () => {
    setRefreshKey(prev => prev + 1); // Triggers useEffect to refetch
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-medium"
        >
          + Add Announcement
        </button>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No announcements yet.</p>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div key={ann._id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{ann.title}</h3>
              <p className="text-gray-700 mb-2">{ann.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(ann.postedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <AddAnnouncementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdded={handleAnnouncementAdded}
      />
    </div>
  );
}
