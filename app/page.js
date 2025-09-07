'use client';

import { useState } from 'react';

import AnimatedModal from './components/AnimatedModal';
import AIQuestionGenerator from './components/AIQuestionGenerator';
import UploadMaterialForm from './components/UploadMaterialForm';
import MaterialsList from './components/MaterialsList';
import UserProfile from './components/UserProfile';
import Announcements from './components/Announcements';
import AssignmentEvaluation from './components/AssignmentEvaluation';

export default function DashboardPage() {
  const [isAIQGenOpen, setIsAIQGenOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAssignmentEvalOpen, setIsAssignmentEvalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-6 py-10">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <h1 className="text-5xl font-extrabold text-indigo-700 drop-shadow-md">
          EduTech Dashboard
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setIsAIQGenOpen(true)}
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white text-lg font-semibold shadow hover:bg-indigo-700 transition"
          >
            Generate MCQs
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="rounded-lg bg-indigo-500 px-6 py-3 text-white text-lg font-semibold shadow hover:bg-indigo-600 transition"
          >
            Upload Material
          </button>
          <button
            onClick={() => setIsAssignmentEvalOpen(true)}
            className="rounded-lg bg-purple-600 px-6 py-3 text-white text-lg font-semibold shadow hover:bg-purple-700 transition"
          >
            Evaluate Assignment
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
        <div className="bg-white rounded-lg shadow p-6">
          <MaterialsList />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <UserProfile />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Announcements />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <AssignmentEvaluation closeModal={() => setIsAssignmentEvalOpen(false)} />
        </div>
      </section>

      <AnimatedModal isOpen={isAIQGenOpen} onClose={() => setIsAIQGenOpen(false)}>
        <AIQuestionGenerator closeModal={() => setIsAIQGenOpen(false)} />
      </AnimatedModal>

      <AnimatedModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)}>
        <UploadMaterialForm closeModal={() => setIsUploadOpen(false)} />
      </AnimatedModal>

      <AnimatedModal
        isOpen={isAssignmentEvalOpen}
        onClose={() => setIsAssignmentEvalOpen(false)}
      >
        <AssignmentEvaluation closeModal={() => setIsAssignmentEvalOpen(false)} />
      </AnimatedModal>
    </main>
  );
}
