// components/UploadMaterialForm.jsx
'use client';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function UploadMaterialForm({ onUploadSuccess = () => {} }) {
  console.log('UploadMaterialForm onUploadSuccess prop:', typeof onUploadSuccess);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('topic', data.topic);
    formData.append('description', data.description);
    formData.append('tags', data.tags);
    formData.append('file', data.file[0]);

    const loadingToast = toast.loading('Uploading material...');

    try {
      // The API endpoint remains the same
      const res = await fetch('/api/upload-material', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      toast.success('Material uploaded successfully!', { id: loadingToast });
      reset(); // Clear the form fields
      onUploadSuccess(); // Trigger the refresh and close the modal

    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-300">Subject</label>
        <input
          {...register('subject', { required: 'Subject is required' })}
          className="w-full p-2 rounded-md bg-slate-700 text-white border border-slate-600"
        />
        {errors.subject && <p className="text-rose-400 mt-1 text-sm">{errors.subject.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">Topic</label>
        <input
          {...register('topic', { required: 'Topic is required' })}
          className="w-full p-2 rounded-md bg-slate-700 text-white border border-slate-600"
        />
        {errors.topic && <p className="text-rose-400 mt-1 text-sm">{errors.topic.message}</p>}
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full p-0 rounded-md bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">Tags (comma-separated)</label>
        <input
          {...register('tags')}
          className="w-full p-2 rounded-md bg-slate-700 text-white border border-slate-600"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-gray-300">File</label>
        <input
          type="file"
          {...register('file', { required: 'A file is required' })}
          className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {errors.file && <p className="text-rose-400 mt-1 text-sm">{errors.file.message}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 transition"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Material'}
      </button>
    </form>
  );
}
