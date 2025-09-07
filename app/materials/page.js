'use client';

import MaterialsList from '../components/MaterialsList';
import UploadMaterialForm from '../components/UploadMaterialForm';

export default function MaterialsPage() {
  return (
    <main className="bg-indigo-50 min-h-screen p-8 max-w-5xl mx-auto">
      <h1 className="mb-6 text-4xl font-extrabold text-indigo-700">Materials</h1>
      <div className="bg-white rounded shadow p-6">
        <UploadMaterialForm/>
        <MaterialsList />
      </div>
    </main>
  );
}
