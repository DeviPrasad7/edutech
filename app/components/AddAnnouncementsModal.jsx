// AddAnnouncementsModal.jsx
'use client';
import { useForm } from 'react-hook-form'; // Import react-hook-form
import toast from 'react-hot-toast'; // Import toast for notifications
import { useSWRConfig } from 'swr'; // Import SWR's mutate function to trigger re-fetch
import { useModalStore } from '../stores/useModalStore'; // Import our global modal store

export default function AddAnnouncementModal() {
  // Get SWR's mutate function to update the announcements list automatically
  const { mutate } = useSWRConfig();
  const { closeModal } = useModalStore(); // Get the closeModal function from the store

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  async function onSubmit(data) {
    const loadingToast = toast.loading('Adding announcement...');
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to add announcement');
      }

      toast.success('Announcement added!', { id: loadingToast });
      reset(); // Reset form fields
      // Tell SWR to re-fetch the data for this key, updating the UI automatically
      mutate('/api/announcements');
      closeModal(); // Close the modal using the global store function
    } catch (error) {
      toast.error(error.message || 'Error adding announcement', { id: loadingToast });
    }
  }

  return (
    // The content for the modal. The AnimatedModal wrapper is in page.js
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-slate-800 p-8 rounded-xl max-w-lg w-full"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Add New Announcement</h2>
      <div className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="Title"
            {...register('title', { required: 'Title is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {errors.title && <p className="text-rose-400 mt-1 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <textarea
            placeholder="Content"
            rows={5}
            {...register('content', { required: 'Content is required' })}
            className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />
          {errors.content && <p className="text-rose-400 mt-1 text-sm">{errors.content.message}</p>}
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <button
          type="button"
          onClick={closeModal}
          className="px-5 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition font-semibold"
        >
          {isSubmitting ? 'Adding...' : 'Add Announcement'}
        </button>
      </div>
    </form>
  );
}