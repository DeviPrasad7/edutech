// app/profile/page.js
'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import UserProfile from '../components/UserProfile';
import PerformanceChart from '../components/Charts';

// Card component remains the same
function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl ${className}`}>
      <h2 className="text-xl font-bold text-white p-4 border-b border-slate-700">{title}</h2>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: 'Teacher Name',
    email: 'teacher@example.com',
    role: 'teacher',
  });
  const [performanceData, setPerformanceData] = useState({
    labels: ['Assignment 1', 'Quiz 1', 'Assignment 2', 'Midterm', 'Assignment 3', 'Final'],
    teacherAverage: [85, 90, 78, 88, 92, 89],
    classAverage: [82, 85, 80, 84, 88, 86],
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = (updatedData) => {
    setProfileData(prevData => ({ ...prevData, ...updatedData }));
    toast.success('Profile updated!');
  };

  useEffect(() => {
    // Data fetching is still disabled
  }, []);

  if (isLoading) {
    return <div className="text-center text-gray-400 p-10">Loading Profile...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Teacher Profile & Dashboard</h1>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card title="Profile Information">
            {/* The prop name onProfileUpdate is correct here */}
            <UserProfile 
              profileData={profileData} 
              onProfileUpdate={handleProfileUpdate} 
            />
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card title="Performance Overview">
            {performanceData ? (
              <PerformanceChart data={performanceData} />
            ) : (
              <p className="text-gray-400">No performance data available.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
