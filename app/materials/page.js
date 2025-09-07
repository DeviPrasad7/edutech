// app/materials/page.js
'use client';

import { useState } from 'react';
import MaterialsList from '../components/MaterialsList';
import UploadMaterialForm from '../components/UploadMaterialForm';
// Assuming you have this modal component from our previous fixes
import AnimatedModal from '../components/AnimatedModal'; 
import { IoAddSharp } from 'react-icons/io5';

export default function MaterialsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // This state is a simple trick to force a refresh in the child component
  const [refreshKey, setRefreshKey] = useState(0);

  // This function will be called from the form on a successful upload
  const handleUploadSuccess = () => {
    setRefreshKey(prevKey => prevKey + 1); // Increment the key to trigger a refetch
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Materials</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2 transition-transform duration-200 hover:scale-105"
          aria-label="Upload new material"
        >
          <IoAddSharp size={24} />
          <span className="hidden sm:inline">Add Material</span>
        </button>
      </header>

      {/* Pass the refreshKey to the list component */}
      <MaterialsList refreshKey={refreshKey} />

      {/* The modal for the upload form */}
      <AnimatedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload New Material"
      >
        <UploadMaterialForm onUploadSuccess={handleUploadSuccess} />
      </AnimatedModal>
    </div>
  );
}
