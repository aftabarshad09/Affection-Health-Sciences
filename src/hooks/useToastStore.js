import { create } from 'zustand';

let nextId = 1;

// Minimal toast queue — avoids pulling in a whole notification library for
// what's essentially "show a message, auto-dismiss it."
export const useToastStore = create((set) => ({
  toasts: [],
  show(message, type = 'info', duration = 3500) {
    const id = nextId++;
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  dismiss(id) {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));

export const useToast = () => {
  const show = useToastStore((s) => s.show);
  return {
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info'),
  };
};
