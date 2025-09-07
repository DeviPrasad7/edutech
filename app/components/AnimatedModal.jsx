// components/AnimatedModal.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';

// A simple X icon for the close button
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

export default function AnimatedModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          // UPDATED: Added backdrop-blur-sm for the requested effect
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* UPDATED: Added 'relative' to position the close button */}
          <motion.div
            className="bg-slate-800 border border-slate-700 text-gray-100 max-w-lg w-full rounded-xl shadow-2xl relative"
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* NEW: The close button in the top-right corner */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-white hover:bg-slate-700 rounded-full p-2 transition-colors duration-200 z-10"
                aria-label="Close modal"
            >
                <CloseIcon />
            </button>
            {/* We remove the padding from here and expect the children to have it, for better alignment of the close button */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}