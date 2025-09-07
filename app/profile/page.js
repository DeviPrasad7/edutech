'use client';

import UserProfile from '../components/UserProfile';

export default function ProfilePage() {
  return (
    <main className="bg-indigo-50 min-h-screen p-8 max-w-md mx-auto">
      <h1 className="mb-6 text-4xl font-extrabold text-indigo-700">Profile</h1>
      <div className="bg-white rounded shadow p-6">
        <UserProfile />
      </div>
    </main>
  );
}
