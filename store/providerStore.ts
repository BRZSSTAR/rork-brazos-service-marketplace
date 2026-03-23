import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type {
  ProviderOnboardingDraft,
  ProviderProfile,
  WeeklyAvailability,
  DayAvailability,
} from '@/types';

const PROVIDER_DATA_KEY = 'brazos_provider_data';
const ONBOARDING_DRAFT_KEY = 'brazos_provider_onboarding_draft';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const defaultDay: DayAvailability = { enabled: false, startTime: '08:00', endTime: '18:00' };

export const DEFAULT_AVAILABILITY: WeeklyAvailability = {
  monday: { ...defaultDay, enabled: true },
  tuesday: { ...defaultDay, enabled: true },
  wednesday: { ...defaultDay, enabled: true },
  thursday: { ...defaultDay, enabled: true },
  friday: { ...defaultDay, enabled: true },
  saturday: { ...defaultDay },
  sunday: { ...defaultDay },
};

interface ProviderPersistedData {
  profile: ProviderProfile | null;
}

const initialState = {
  profile: null as ProviderProfile | null,
  onboardingDraft: null as ProviderOnboardingDraft | null,
  isHydrated: false,
};

export const useProviderStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[Provider] Hydrating provider data...');
        const [rawProfile, rawDraft] = await Promise.all([
          AsyncStorage.getItem(PROVIDER_DATA_KEY),
          AsyncStorage.getItem(ONBOARDING_DRAFT_KEY),
        ]);

        const profile = rawProfile ? (JSON.parse(rawProfile) as ProviderPersistedData).profile : null;
        const onboardingDraft = rawDraft ? (JSON.parse(rawDraft) as ProviderOnboardingDraft) : null;

        set({ profile, onboardingDraft, isHydrated: true });
        console.log('[Provider] Hydrated:', { hasProfile: !!profile, hasDraft: !!onboardingDraft });
      } catch (error) {
        console.error('[Provider] Hydration error:', error);
        set({ isHydrated: true });
      }
    },

    updateOnboardingDraft: async (updates: Partial<ProviderOnboardingDraft>) => {
      const current = get().onboardingDraft ?? {};
      const updated = { ...current, ...updates };
      set({ onboardingDraft: updated });
      await AsyncStorage.setItem(ONBOARDING_DRAFT_KEY, JSON.stringify(updated));
      console.log('[Provider] Updated onboarding draft:', Object.keys(updates));
    },

    clearOnboardingDraft: async () => {
      set({ onboardingDraft: null });
      await AsyncStorage.removeItem(ONBOARDING_DRAFT_KEY);
      console.log('[Provider] Cleared onboarding draft');
    },

    submitOnboarding: async (userId: string) => {
      const draft = get().onboardingDraft;
      if (!draft?.category || !draft?.serviceTitle || !draft?.description || !draft?.pricePerHourCents) {
        throw new Error('Incomplete onboarding data');
      }

      const profile: ProviderProfile = {
        id: generateId(),
        userId,
        category: draft.category,
        serviceTitle: draft.serviceTitle,
        description: draft.description,
        pricePerHourCents: draft.pricePerHourCents,
        serviceArea: draft.serviceArea ?? '',
        yearsExperience: draft.yearsExperience ?? 0,
        availability: draft.availability ?? DEFAULT_AVAILABILITY,
        status: 'PENDING_APPROVAL',
        createdAt: new Date().toISOString(),
      };

      const data: ProviderPersistedData = { profile };
      await AsyncStorage.setItem(PROVIDER_DATA_KEY, JSON.stringify(data));
      await AsyncStorage.removeItem(ONBOARDING_DRAFT_KEY);

      set({ profile, onboardingDraft: null });
      console.log('[Provider] Onboarding submitted:', profile.id);
      return profile;
    },

    updateProfile: async (updates: Partial<ProviderProfile>) => {
      const current = get().profile;
      if (!current) return;

      const updated = { ...current, ...updates };
      const data: ProviderPersistedData = { profile: updated };
      await AsyncStorage.setItem(PROVIDER_DATA_KEY, JSON.stringify(data));
      set({ profile: updated });
      console.log('[Provider] Profile updated');
    },

    getOnboardingStep: (): number => {
      const draft = get().onboardingDraft;
      if (!draft) return 0;
      if (!draft.category) return 0;
      if (!draft.serviceTitle || !draft.description) return 1;
      if (!draft.pricePerHourCents) return 2;
      if (!draft.availability) return 3;
      return 4;
    },
  }))
);
