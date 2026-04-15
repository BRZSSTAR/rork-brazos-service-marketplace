import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { SavedAddress } from '@/types';

const ADDRESS_STORAGE_KEY = 'brazos_saved_addresses';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

async function persistAddresses(addresses: SavedAddress[]) {
  await AsyncStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addresses));
  console.log('[AddressStore] Persisted', addresses.length, 'addresses');
}

const initialState = {
  addresses: [] as SavedAddress[],
  isHydrated: false,
};

export const useAddressStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[AddressStore] Hydrating addresses...');
        const raw = await AsyncStorage.getItem(ADDRESS_STORAGE_KEY);

        if (raw) {
          const parsed: SavedAddress[] = JSON.parse(raw);
          const migrated = parsed.map((a) => ({
            ...a,
            isDefault: a.isDefault ?? false,
          }));
          set({ addresses: migrated, isHydrated: true });
          console.log('[AddressStore] Hydrated', migrated.length, 'addresses');
        } else {
          const legacyRaw = await AsyncStorage.getItem('brazos_booking_data');
          if (legacyRaw) {
            try {
              const legacy = JSON.parse(legacyRaw);
              if (Array.isArray(legacy.addresses) && legacy.addresses.length > 0) {
                const migrated: SavedAddress[] = legacy.addresses.map((a: SavedAddress, idx: number) => ({
                  ...a,
                  isDefault: idx === 0,
                }));
                await persistAddresses(migrated);
                set({ addresses: migrated, isHydrated: true });
                console.log('[AddressStore] Migrated', migrated.length, 'addresses from legacy store');
                return;
              }
            } catch (e) {
              console.error('[AddressStore] Legacy migration error:', e);
            }
          }
          set({ isHydrated: true });
          console.log('[AddressStore] No stored addresses found');
        }
      } catch (error) {
        console.error('[AddressStore] Hydration error:', error);
        set({ isHydrated: true });
      }
    },

    addAddress: async (address: Omit<SavedAddress, 'id' | 'createdAt'>) => {
      const isFirst = get().addresses.length === 0;
      const newAddress: SavedAddress = {
        ...address,
        id: generateId(),
        isDefault: isFirst || address.isDefault,
        createdAt: new Date().toISOString(),
      };
      console.log('[AddressStore] Adding address:', newAddress.label, 'isDefault:', newAddress.isDefault);

      let updated = [...get().addresses, newAddress];
      if (newAddress.isDefault) {
        updated = updated.map((a) =>
          a.id === newAddress.id ? a : { ...a, isDefault: false }
        );
      }
      set({ addresses: updated });
      await persistAddresses(updated);
      return newAddress;
    },

    updateAddress: async (id: string, updates: Partial<Omit<SavedAddress, 'id' | 'createdAt'>>) => {
      console.log('[AddressStore] Updating address:', id);
      let updated = get().addresses.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      );
      if (updates.isDefault) {
        updated = updated.map((a) =>
          a.id === id ? a : { ...a, isDefault: false }
        );
      }
      set({ addresses: updated });
      await persistAddresses(updated);
    },

    deleteAddress: async (id: string) => {
      console.log('[AddressStore] Deleting address:', id);
      const current = get().addresses;
      const toDelete = current.find((a) => a.id === id);
      let updated = current.filter((a) => a.id !== id);

      if (toDelete?.isDefault && updated.length > 0) {
        updated = [{ ...updated[0], isDefault: true }, ...updated.slice(1)];
        console.log('[AddressStore] Reassigned default to:', updated[0].id);
      }

      set({ addresses: updated });
      await persistAddresses(updated);
    },

    setDefault: async (id: string) => {
      console.log('[AddressStore] Setting default address:', id);
      const updated = get().addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
      set({ addresses: updated });
      await persistAddresses(updated);
    },

    getDefaultAddress: (): SavedAddress | undefined => {
      const { addresses } = get();
      return addresses.find((a) => a.isDefault) ?? addresses[0];
    },

    getAddressById: (id: string): SavedAddress | undefined => {
      return get().addresses.find((a) => a.id === id);
    },
  }))
);
