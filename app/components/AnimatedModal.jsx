// components/AnimatedModal.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

// A simple X icon for the close button
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

// I've added an optional 'title' prop for better reusability.
export default function AnimatedModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Main modal panel */}
          <motion.div
            // THIS IS THE FIX: Added flex, flex-col, and max-h-[90vh]
            className="bg-slate-800 border border-slate-700 text-gray-100 max-w-lg w-full rounded-xl shadow-2xl flex flex-col max-h-[90vh]"
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. A fixed header for the title and close button */}
            <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
              <h3 className="text-lg font-bold text-white">{title || ''}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-slate-700 rounded-full p-1 transition"
                aria-label="Close modal"
              >
                <CloseIcon />
              </button>
            </header>

            {/* 2. A scrollable main content area */}
            <main className="p-6 overflow-y-auto">
              {children}
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
