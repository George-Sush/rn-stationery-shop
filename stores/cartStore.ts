import { create } from 'zustand';
import { CartLine, Medicine } from '../types/medicine';
import { useShallow } from 'zustand/react/shallow';

interface CartState {
  lines: Record<string, CartLine>;

  add: (medicine: Medicine, quantity?: number) => void;
  remove: (medicineId: string) => void;
  increment: (medicineId: string) => void;
  decrement: (medicineId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: {},

  add: (medicine, quantity = 1) =>
    set((state) => {
      if (medicine.requiresPrescription || medicine.stock <= 0 || quantity <= 0) {
        return state;
      }

      const existing = state.lines[medicine.id];
      const nextQuantity = Math.min(
        (existing?.quantity ?? 0) + quantity,
        medicine.stock,
      );
      return {
        lines: {
          ...state.lines,
          [medicine.id]: existing
            ? { ...existing, quantity: nextQuantity }
            : { medicine, quantity: nextQuantity },
        },
      };
    }),

  remove: (medicineId) =>
    set((state) => {
      const { [medicineId]: _removed, ...rest } = state.lines;
      return { lines: rest };
    }),

  increment: (medicineId) =>
    set((state) => {
      const line = state.lines[medicineId];
      if (!line) return state;
      if (line.quantity >= line.medicine.stock) return state;
      return {
        lines: {
          ...state.lines,
          [medicineId]: { ...line, quantity: line.quantity + 1 },
        },
      };
    }),

  decrement: (medicineId) =>
    set((state) => {
      const line = state.lines[medicineId];
      if (!line) return state;
      if (line.quantity <= 1) {
        const { [medicineId]: _removed, ...rest } = state.lines;
        return { lines: rest };
      }
      return {
        lines: {
          ...state.lines,
          [medicineId]: { ...line, quantity: line.quantity - 1 },
        },
      };
    }),

  clear: () => set({ lines: {} }),
}));

// ---------- Селекторы ----------
export const selectCartCount = (s: CartState): number =>
  Object.values(s.lines).reduce((sum, line) => sum + line.quantity, 0);

export const selectCartTotal = (s: CartState): number =>
  Object.values(s.lines).reduce(
    (sum, line) => sum + line.medicine.price * line.quantity,
    0,
  );

export const selectCartLines = (s: CartState): CartLine[] =>
  Object.values(s.lines);

// ---------- Хуки с shallow-сравнением ----------
export const useCartLines = () =>
  useCartStore(useShallow(selectCartLines));