import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { SubscriptionTierId } from '@/constants/subscription';

const SUBSCRIPTION_KEY = 'brazos_provider_subscription';

export interface ActivePromotion {
  id: string;
  packageId: string;
  packageName: string;
  startedAt: string;
  expiresAt: string;
  priceCents: number;
}

export interface SubscriptionState {
  tierId: SubscriptionTierId;
  renewsAt: string | null;
  startedAt: string | null;
  autoRenew: boolean;
  activePromotions: ActivePromotion[];
  promotionHistory: ActivePromotion[];
}

const initialState: SubscriptionState & { isHydrated: boolean } = {
  tierId: 'STARTER',
  renewsAt: null,
  startedAt: null,
  autoRenew: true,
  activePromotions: [],
  promotionHistory: [],
  isHydrated: false,
};

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export const useSubscriptionStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        const raw = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SubscriptionState;
          const now = new Date();
          const active = parsed.activePromotions.filter((p) => new Date(p.expiresAt) > now);
          const expired = parsed.activePromotions.filter((p) => new Date(p.expiresAt) <= now);
          set({
            ...parsed,
            activePromotions: active,
            promotionHistory: [...expired, ...(parsed.promotionHistory ?? [])],
            isHydrated: true,
          });
        } else {
          set({ isHydrated: true });
        }
        console.log('[Subscription] Hydrated');
      } catch (error) {
        console.error('[Subscription] Hydration error:', error);
        set({ isHydrated: true });
      }
    },

    persist: async () => {
      const state = get();
      const payload: SubscriptionState = {
        tierId: state.tierId,
        renewsAt: state.renewsAt,
        startedAt: state.startedAt,
        autoRenew: state.autoRenew,
        activePromotions: state.activePromotions,
        promotionHistory: state.promotionHistory,
      };
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(payload));
    },

    selectTier: async (tierId: SubscriptionTierId) => {
      const now = new Date();
      const renews = tierId === 'STARTER' ? null : addMonths(now, 1).toISOString();
      set({
        tierId,
        startedAt: now.toISOString(),
        renewsAt: renews,
        autoRenew: tierId !== 'STARTER',
      });
      const state = get();
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({
        tierId: state.tierId,
        renewsAt: state.renewsAt,
        startedAt: state.startedAt,
        autoRenew: state.autoRenew,
        activePromotions: state.activePromotions,
        promotionHistory: state.promotionHistory,
      } as SubscriptionState));
      console.log('[Subscription] Selected tier:', tierId);
    },

    toggleAutoRenew: async () => {
      set({ autoRenew: !get().autoRenew });
      const state = get();
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({
        tierId: state.tierId,
        renewsAt: state.renewsAt,
        startedAt: state.startedAt,
        autoRenew: state.autoRenew,
        activePromotions: state.activePromotions,
        promotionHistory: state.promotionHistory,
      } as SubscriptionState));
    },

    activatePromotion: async (pkg: { id: string; name: string; priceCents: number; durationDays: number }) => {
      const now = new Date();
      const promo: ActivePromotion = {
        id: generateId(),
        packageId: pkg.id,
        packageName: pkg.name,
        startedAt: now.toISOString(),
        expiresAt: addDays(now, pkg.durationDays).toISOString(),
        priceCents: pkg.priceCents,
      };
      const current = get().activePromotions;
      set({ activePromotions: [...current, promo] });
      const state = get();
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({
        tierId: state.tierId,
        renewsAt: state.renewsAt,
        startedAt: state.startedAt,
        autoRenew: state.autoRenew,
        activePromotions: state.activePromotions,
        promotionHistory: state.promotionHistory,
      } as SubscriptionState));
      console.log('[Subscription] Activated promotion:', promo.packageName);
      return promo;
    },

    cancelPromotion: async (id: string) => {
      const current = get().activePromotions;
      const promo = current.find((p) => p.id === id);
      if (!promo) return;
      const history = get().promotionHistory;
      set({
        activePromotions: current.filter((p) => p.id !== id),
        promotionHistory: [promo, ...history],
      });
      const state = get();
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({
        tierId: state.tierId,
        renewsAt: state.renewsAt,
        startedAt: state.startedAt,
        autoRenew: state.autoRenew,
        activePromotions: state.activePromotions,
        promotionHistory: state.promotionHistory,
      } as SubscriptionState));
    },

    hasActivePromotion: (): boolean => {
      const now = new Date();
      return get().activePromotions.some((p) => new Date(p.expiresAt) > now);
    },
  }))
);
