'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserProfile() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      // Example: fetch additional profile data from your backend if needed
      fetch('/api/users/me')
        .then(res => res.json())
        .then(data => setProfileData(data))
        .catch(() => setProfileData(null));
    }
  }, [isSignedIn, isLoaded]);

  if (!isLoaded) return <p>Loading profile...</p>;
  if (!isSignedIn) return <p>Please sign in to view your profile.</p>;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h2 className="text-2xl font-semibold mb-4 text-primary">User Profile</h2>
      <p><strong>Name:</strong> {user.fullName || user.firstName || 'N/A'}</p>
      <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress || 'N/A'}</p>
      <p><strong>Role:</strong> {profileData?.role || 'Student'}</p>
      {/* Add more fields or edit functionality as needed */}
    </div>
  );
}
