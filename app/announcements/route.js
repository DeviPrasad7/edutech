'use client';

import Announcements from '../components/Announcements';

export default function AnnouncementsPage() {
  return (
    <main className="bg-indigo-50 min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="mb-6 text-4xl font-extrabold text-indigo-700">Announcements</h1>
      <div className="bg-white rounded shadow p-6">
        <Announcements />
      </div>
    </main>
  );
}
