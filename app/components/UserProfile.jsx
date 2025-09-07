// components/UserProfile.jsx
'use client';
import { useUser } from '@clerk/nextjs';
import { FaUserCircle, FaEnvelope, FaChalkboardTeacher } from 'react-icons/fa';

export default function UserProfile({ profileData }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p className="text-gray-400">Loading...</p>;

  const displayName = user?.fullName || profileData?.name || 'Teacher';
  const displayEmail = user?.primaryEmailAddress?.emailAddress || profileData?.email || 'No email';
  const displayRole = profileData?.role || 'teacher';

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center space-x-4">
        {user?.imageUrl ? (
          <img src={user.imageUrl} alt="Profile" className="w-20 h-20 rounded-full border-2 border-indigo-400" />
        ) : (
          <FaUserCircle size={80} className="text-slate-500" />
        )}
        <div>
          <h3 className="text-2xl font-bold">{displayName}</h3>
          <p className="text-sm text-gray-400 capitalize">{displayRole}</p>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <FaEnvelope className="text-slate-400" />
          <span className="text-gray-300">{displayEmail}</span>
        </div>
        <div className="flex items-center gap-3">
          <FaChalkboardTeacher className="text-slate-400" />
          <span className="text-gray-300">Role: <span className="font-semibold capitalize">{displayRole}</span></span>
        </div>
      </div>
    </div>
  );
}
