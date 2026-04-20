import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { CategorySuggestion, ServiceCategory } from '@/types';

const STORAGE_KEY = 'brazos_category_suggestions';

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const initialState = {
  suggestions: [] as CategorySuggestion[],
  isHydrated: false,
};

export const useCategorySuggestionsStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const suggestions: CategorySuggestion[] = raw ? JSON.parse(raw) : [];
        set({ suggestions, isHydrated: true });
        console.log('[CategorySuggestions] Hydrated:', suggestions.length);
      } catch (error) {
        console.error('[CategorySuggestions] Hydration error:', error);
        set({ isHydrated: true });
      }
    },

    submitSuggestion: async (input: {
      userId: string;
      suggestedName: string;
      suggestedType: CategorySuggestion['suggestedType'];
      parentCategory?: ServiceCategory;
      parentSubcategoryId?: string;
      description?: string;
    }) => {
      const suggestion: CategorySuggestion = {
        id: genId(),
        userId: input.userId,
        parentCategory: input.parentCategory,
        parentSubcategoryId: input.parentSubcategoryId,
        suggestedName: input.suggestedName,
        suggestedType: input.suggestedType,
        description: input.description,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      };
      const next = [suggestion, ...get().suggestions];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      set({ suggestions: next });
      console.log('[CategorySuggestions] Submitted:', suggestion.suggestedName);
      return suggestion;
    },

    updateSuggestionStatus: async (id: string, status: CategorySuggestion['status']) => {
      const next = get().suggestions.map((s) => (s.id === id ? { ...s, status } : s));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      set({ suggestions: next });
    },
  }))
);
