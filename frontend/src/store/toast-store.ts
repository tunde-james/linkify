import { create } from "zustand";

type ToastType = "SUCCESS" | "ERROR";

interface ToastStore {
  message: string | null;
  type: ToastType | null;
  showToast: (params: { message: string; type: ToastType }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  type: null,
  showToast: ({ message, type }) => set({ message, type }),
  hideToast: () => set({ message: null, type: null }),
}));
