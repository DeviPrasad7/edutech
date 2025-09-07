// app/stores/useModalStore.js
import { create } from 'zustand';

export const MODAL_TYPES = {
  AI_QUESTION_GENERATOR: 'AI_QUESTION_GENERATOR',
  UPLOAD_MATERIAL: 'UPLOAD_MATERIAL',
  ADD_ANNOUNCEMENT: 'ADD_ANNOUNCEMENT',
};

export const useModalStore = create((set) => ({
  // Modal state
  modalType: null,
  isOpen: false,
  openModal: (modalType) => set({ modalType, isOpen: true }),
  closeModal: () => set({ modalType: null, isOpen: false }),

  // NEW: Chat Widget State
  isChatOpen: false,
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}));