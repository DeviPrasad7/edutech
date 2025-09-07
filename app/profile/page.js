// app/profile/page.js
'use client';

import UserProfile from '../components/UserProfile';
import PerformanceChart from '../components/Charts'; 

// Reusable Card component (assuming it's in a shared location)
function Card({ title, children }) {
  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6 sm:p-8">
      <h2 className="font-extrabold text-2xl text-indigo-300 mb-6">{title}</h2>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  return (
    // This will now render inside your main RootLayout with the dark theme and navbar
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white">
        Your Profile & Performance
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <Card title="Account Details">
                <UserProfile />
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card title="Performance Analysis">
                <PerformanceChart />
            </Card>
        </div>
      </div>
    </div>
  );
}