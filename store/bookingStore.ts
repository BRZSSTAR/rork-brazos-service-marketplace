import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type {
  SavedAddress,
  SavedPaymentMethod,
  BookingDraft,
} from '@/types';

const BOOKING_DATA_KEY = 'brazos_booking_data';

interface BookingPersistedData {
  cpf: string | null;
  addresses: SavedAddress[];
  paymentMethods: SavedPaymentMethod[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function formatCpfValue(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validateCpfValue(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(10), 10)) return false;

  return true;
}

const initialState = {
  cpf: null as string | null,
  addresses: [] as SavedAddress[],
  paymentMethods: [] as SavedPaymentMethod[],
  currentDraft: null as BookingDraft | null,
  isHydrated: false,
};

export const useBookingStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[Booking] Hydrating booking data...');
        const raw = await AsyncStorage.getItem(BOOKING_DATA_KEY);
        if (raw) {
          const data: BookingPersistedData = JSON.parse(raw);
          set({
            cpf: data.cpf ?? null,
            addresses: data.addresses ?? [],
            paymentMethods: data.paymentMethods ?? [],
            isHydrated: true,
          });
          console.log('[Booking] Hydrated:', {
            hasCpf: !!data.cpf,
            addressCount: data.addresses?.length ?? 0,
            paymentCount: data.paymentMethods?.length ?? 0,
          });
        } else {
          set({ isHydrated: true });
          console.log('[Booking] No stored booking data found');
        }
      } catch (error) {
        console.error('[Booking] Hydration error:', error);
        set({ isHydrated: true });
      }
    },

    persist: async () => {
      const { cpf, addresses, paymentMethods } = get();
      const data: BookingPersistedData = { cpf, addresses, paymentMethods };
      await AsyncStorage.setItem(BOOKING_DATA_KEY, JSON.stringify(data));
      console.log('[Booking] Persisted booking data');
    },

    saveCpf: async (cpf: string) => {
      console.log('[Booking] Saving CPF');
      set({ cpf });
      const { cpf: c, addresses, paymentMethods } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf: c, addresses, paymentMethods })
      );
    },

    addAddress: async (address: Omit<SavedAddress, 'id' | 'createdAt'>) => {
      const newAddress: SavedAddress = {
        ...address,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      console.log('[Booking] Adding address:', newAddress.label);
      const updated = [...get().addresses, newAddress];
      set({ addresses: updated });
      const { cpf, paymentMethods } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf, addresses: updated, paymentMethods })
      );
      return newAddress;
    },

    updateAddress: async (id: string, updates: Partial<SavedAddress>) => {
      const updated = get().addresses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      set({ addresses: updated });
      const { cpf, paymentMethods } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf, addresses: updated, paymentMethods })
      );
    },

    deleteAddress: async (id: string) => {
      const updated = get().addresses.filter((a) => a.id !== id);
      set({ addresses: updated });
      const { cpf, paymentMethods } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf, addresses: updated, paymentMethods })
      );
    },

    addPaymentMethod: async (
      method: Omit<SavedPaymentMethod, 'id' | 'createdAt'>
    ) => {
      const newMethod: SavedPaymentMethod = {
        ...method,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      console.log('[Booking] Adding payment method:', newMethod.type);
      let updated = [...get().paymentMethods, newMethod];
      if (newMethod.isDefault) {
        updated = updated.map((m) =>
          m.id === newMethod.id ? m : { ...m, isDefault: false }
        );
      }
      set({ paymentMethods: updated });
      const { cpf, addresses } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf, addresses, paymentMethods: updated })
      );
      return newMethod;
    },

    deletePaymentMethod: async (id: string) => {
      const updated = get().paymentMethods.filter((m) => m.id !== id);
      set({ paymentMethods: updated });
      const { cpf, addresses } = get();
      await AsyncStorage.setItem(
        BOOKING_DATA_KEY,
        JSON.stringify({ cpf, addresses, paymentMethods: updated })
      );
    },

    setDraft: (draft: BookingDraft | null) => {
      set({ currentDraft: draft });
    },

    updateDraft: (updates: Partial<BookingDraft>) => {
      const current = get().currentDraft;
      set({ currentDraft: current ? { ...current, ...updates } : updates });
    },

    getInitialStep: (): number => {
      const { cpf, addresses, paymentMethods } = get();
      if (!cpf) return 0;
      if (addresses.length === 0) return 1;
      if (paymentMethods.length === 0) return 2;
      return 3;
    },

    formatCpf: formatCpfValue,
    validateCpf: validateCpfValue,
  }))
);
