// src/lib/store/ui.store.ts

import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  duration?: number;
}

interface UiState {
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toasts: Toast[];
  activeModal: string | null;
  modalData: unknown;
}

interface UiActions {
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  collapseSidebar: (collapsed: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  openModal: (name: string, data?: unknown) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiState & UiActions>((set, get) => ({
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  toasts: [],
  activeModal: null,
  modalData: null,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  collapseSidebar: (collapsed) => set({ isSidebarCollapsed: collapsed }),

  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    // Auto-remove after duration
    setTimeout(() => get().removeToast(id), toast.duration ?? 4000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  openModal: (name, data = null) => set({ activeModal: name, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
