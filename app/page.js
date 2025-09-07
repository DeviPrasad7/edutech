// page.js
'use client';

import { useModalStore, MODAL_TYPES } from './stores/useModalStore';
import AnimatedModal from './components/AnimatedModal';
import AIQuestionGenerator from './components/AIQuestionGenerator';
import UploadMaterialForm from './components/UploadMaterialForm';
import AddAnnouncementModal from './components/AddAnnouncementsModal'; // Renamed
import MaterialsList from './components/MaterialsList';
import Announcements from './components/Announcements';

// Reusable Card component to keep our JSX clean (DRY principle)
function Card({ id, title, children, headerAction }) {
  return (
    <div
      id={id}
      className="bg-slate-800 rounded-2xl border border-slate-700 shadow-lg p-6 sm:p-8 hover:shadow-xl hover:border-indigo-500/50 transition-all duration-300 flex flex-col"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-extrabold text-2xl text-indigo-300 select-none">
          {title}
        </h2>
        {headerAction}
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Use our global store to manage modals. So much cleaner!
  const { modalType, isOpen, openModal, closeModal } = useModalStore();

  return (
    <div className="min-h-screen bg-slate-950 text-black-800">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white select-none tracking-tight">
            Welcome to your <span className="text-indigo-400">Dashboard</span>
          </h1>
        </header>

        {/* Action Buttons: Visible on all screen sizes */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <button
              onClick={() => openModal(MODAL_TYPES.AI_QUESTION_GENERATOR)}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-indigo-500 text-white hover:bg-indigo-600 transform hover:-translate-y-1 shadow-lg"
            >
              Generate Questions 🤖
            </button>
            <button
              onClick={() => openModal(MODAL_TYPES.UPLOAD_MATERIAL)}
              className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-lime-400 text-slate-900 hover:bg-lime-500 transform hover:-translate-y-1 shadow-lg"
            >
              Upload Material 🚀
            </button>
        </section>

        {/* Main Grid Content using the new Card component */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"> {/* Make materials list wider */}
            <Card title="Study Materials">
              <MaterialsList />
            </Card>
          </div>

          <Card
            title="Announcements"
            headerAction={
              <button
                onClick={() => openModal(MODAL_TYPES.ADD_ANNOUNCEMENT)}
                className="bg-lime-400 hover:bg-lime-500 transition-colors duration-200 rounded-full px-5 py-2 text-slate-900 text-sm font-semibold shadow-md select-none"
                aria-label="Add Announcement"
              >
                + Add
              </button>
            }
          >
            <Announcements />
          </Card>
        </section>
      </main>

      {/* A single, elegant modal handler */}
      <AnimatedModal isOpen={isOpen} onClose={closeModal}>
        {modalType === MODAL_TYPES.AI_QUESTION_GENERATOR && <AIQuestionGenerator closeModal={closeModal} />}
        {modalType === MODAL_TYPES.UPLOAD_MATERIAL && <UploadMaterialForm closeModal={closeModal} />}
        {modalType === MODAL_TYPES.ADD_ANNOUNCEMENT && <AddAnnouncementModal />}
      </AnimatedModal>
    </div>
  );
}