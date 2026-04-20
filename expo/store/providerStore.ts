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
      const account = draft?.account;
      const docId = draft?.cpf ?? account?.cpf ?? account?.cnpj;
      if (!draft || !docId) {
        throw new Error('Incomplete onboarding data');
      }

      const primarySelection = draft.categorySelections?.[0];
      const effectiveCategory = draft.category ?? primarySelection?.category;
      if (!effectiveCategory) {
        throw new Error('No category selected');
      }

      const primaryService = draft.services?.[0];
      const fallbackTitle = draft.serviceTitle ?? primaryService?.title ?? 'Service';
      const fallbackDescription = draft.description ?? primaryService?.description ?? draft.profile?.bio ?? '';
      const fallbackPrice = draft.pricePerHourCents
        ?? (primaryService && primaryService.pricingModel === 'HOURLY' ? primaryService.priceCents : primaryService?.priceCents ?? 0);

      const profile: ProviderProfile = {
        id: generateId(),
        userId,
        cpf: docId,
        category: effectiveCategory,
        subcategory: draft.subcategory ?? primarySelection?.subcategoryIds[0] ?? '',
        selectedServices: draft.selectedServices ?? primarySelection?.serviceIds ?? [],
        serviceTitle: fallbackTitle,
        description: fallbackDescription,
        pricePerHourCents: fallbackPrice,
        serviceArea: draft.serviceArea ?? draft.coverage?.city ?? '',
        yearsExperience: draft.yearsExperience ?? draft.profile?.yearsExperience ?? 0,
        availability: draft.availability ?? DEFAULT_AVAILABILITY,
        addOns: [],
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
      if (!draft.cpf) return 0;
      if (!draft.categorySelections || draft.categorySelections.length === 0) {
        if (!draft.category) return 1;
      }
      if (!draft.questionnaire || Object.keys(draft.questionnaire).length === 0) return 2;
      if (!draft.services || draft.services.length === 0) return 3;
      if (!draft.profile || !draft.profile.bio) return 4;
      if (!draft.coverage || !draft.coverage.city) return 5;
      if (!draft.availability) return 6;
      return 7;
    },
  }))
);
