import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import type { ActiveMode, Locale, ProviderOnboardingStatus, User, UserRole } from '@/types';

const APP_LOCALE_KEY = 'brazos_app_locale';
const LANGUAGE_SELECTED_KEY = 'brazos_language_selected';

interface PersistedSession {
  storedLocale: string | null;
  storedLanguageSelected: string | null;
}

interface SupabaseUserMetadata {
  name?: string;
  full_name?: string;
  role?: UserRole;
  locale?: Locale;
  is_provider?: boolean;
  provider_status?: ProviderOnboardingStatus;
}

function detectDeviceLocale(): Locale {
  const resolvedLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  const normalizedLocale = resolvedLocale.toLowerCase();

  console.log('[Locale] Device locale detected:', resolvedLocale);

  if (normalizedLocale.startsWith('pt')) {
    return 'pt-BR';
  }

  if (normalizedLocale.startsWith('es')) {
    return 'es';
  }

  return 'en';
}

function normalizeLocale(locale: string | null | undefined): Locale {
  if (!locale) {
    return detectDeviceLocale();
  }

  if (locale === 'pt-BR') return 'pt-BR';
  if (locale === 'es') return 'es';
  return 'en';
}

function normalizeRole(role: string | null | undefined): UserRole {
  return role === 'PROVIDER' ? 'PROVIDER' : 'CUSTOMER';
}

function getFirstNameFromEmail(email: string | undefined): string {
  if (!email) {
    return 'BRAZOS';
  }

  return email.split('@')[0] ?? 'BRAZOS';
}

function normalizeProviderStatus(status: string | null | undefined): ProviderOnboardingStatus {
  const valid: ProviderOnboardingStatus[] = ['NONE', 'ONBOARDING', 'PENDING_APPROVAL', 'APPROVED', 'SUSPENDED'];
  if (status && valid.includes(status as ProviderOnboardingStatus)) {
    return status as ProviderOnboardingStatus;
  }
  return 'NONE';
}

function buildAppUser(session: Session, fallbackLocale: Locale): User {
  const authUser = session.user;
  const metadata = (authUser.user_metadata ?? {}) as SupabaseUserMetadata;
  const locale = normalizeLocale(metadata.locale ?? fallbackLocale);
  const name = metadata.full_name ?? metadata.name ?? getFirstNameFromEmail(authUser.email);
  const role = normalizeRole(metadata.role);
  const isProvider = metadata.is_provider === true;
  const providerStatus = normalizeProviderStatus(metadata.provider_status);

  const appUser: User = {
    id: authUser.id,
    name,
    email: authUser.email ?? '',
    role,
    createdAt: authUser.created_at,
    locale,
    isProvider,
    providerStatus,
  };

  console.log('[Auth] Built app user from Supabase session:', {
    id: appUser.id,
    email: appUser.email,
    role: appUser.role,
    locale: appUser.locale,
  });

  return appUser;
}

async function secureSet(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function secureGet(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

async function persistLocaleSelection(locale: Locale, hasSelectedLanguage: boolean) {
  await Promise.all([
    secureSet(APP_LOCALE_KEY, locale),
    secureSet(LANGUAGE_SELECTED_KEY, hasSelectedLanguage ? 'true' : 'false'),
  ]);
}

async function loadPersistedSession(): Promise<PersistedSession> {
  const [storedLocale, storedLanguageSelected] = await Promise.all([
    secureGet(APP_LOCALE_KEY),
    secureGet(LANGUAGE_SELECTED_KEY),
  ]);

  return { storedLocale, storedLanguageSelected };
}

const ACTIVE_MODE_KEY = 'brazos_active_mode';

const initialState = {
  user: null as User | null,
  accessToken: null as string | null,
  isLoading: true,
  isAuthenticated: false,
  appLocale: detectDeviceLocale() as Locale,
  hasSelectedLanguage: false,
  activeMode: 'customer' as ActiveMode,
};

export const useAuthStore = create(
  combine(initialState, (set, get) => ({
    loadStoredAuth: async () => {
      try {
        console.log('[Auth] Loading stored auth and locale...');
        const { storedLocale, storedLanguageSelected } = await loadPersistedSession();
        const detectedLocale = detectDeviceLocale();
        const appLocale = normalizeLocale(storedLocale ?? detectedLocale);
        const hasSelectedLanguage = storedLanguageSelected === 'true';

        console.log('[Auth] Locale bootstrap:', { appLocale, hasSelectedLanguage, detectedLocale });

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth] Supabase getSession error:', error);
          throw error;
        }

        if (session?.user) {
          const user = buildAppUser(session, appLocale);
          const storedMode = await secureGet(ACTIVE_MODE_KEY);
          const activeMode: ActiveMode = storedMode === 'provider' && user.providerStatus === 'APPROVED' ? 'provider' : 'customer';

          await persistLocaleSelection(user.locale, hasSelectedLanguage || true);

          console.log('[Auth] Restored Supabase session for:', user.email, 'mode:', activeMode, 'providerStatus:', user.providerStatus);
          set({
            user,
            accessToken: session.access_token,
            isAuthenticated: true,
            isLoading: false,
            appLocale: user.locale,
            hasSelectedLanguage: true,
            activeMode,
          });
          return;
        }

        console.log('[Auth] No Supabase session found');
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          appLocale,
          hasSelectedLanguage,
        });
      } catch (error) {
        console.error('[Auth] Error loading stored auth:', error);
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
          appLocale: detectDeviceLocale(),
          hasSelectedLanguage: false,
        });
      }
    },

    login: async (email: string, password: string) => {
      console.log('[Auth] Login attempt:', email);
      set({ isLoading: true });

      try {
        const normalizedEmail = email.trim().toLowerCase();
        const {
          data: { session },
          error,
        } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          console.error('[Auth] Supabase login error:', error);
          throw error;
        }

        if (!session) {
          throw new Error('No active session returned from Supabase login.');
        }

        const fallbackLocale = get().appLocale;
        const user = buildAppUser(session, fallbackLocale);

        await persistLocaleSelection(user.locale, true);

        console.log('[Auth] Login success:', user.role, 'locale:', user.locale);
        set({
          user,
          accessToken: session.access_token,
          isAuthenticated: true,
          isLoading: false,
          appLocale: user.locale,
          hasSelectedLanguage: true,
        });
      } catch (error) {
        console.error('[Auth] Login error:', error);
        set({ isLoading: false });
        throw error;
      }
    },

    register: async (name: string, email: string, password: string) => {
      console.log('[Auth] Register attempt:', email);
      set({ isLoading: true });

      try {
        const locale = get().appLocale;
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();

        const {
          data: { session, user: authUser },
          error,
        } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              name: trimmedName,
              full_name: trimmedName,
              role: 'CUSTOMER',
              locale,
              is_provider: false,
              provider_status: 'NONE',
            },
          },
        });

        if (error) {
          console.error('[Auth] Supabase register error:', error);
          throw error;
        }

        await persistLocaleSelection(locale, true);

        if (!session) {
          console.log('[Auth] Signup created account without active session. Email confirmation may be enabled.', {
            userId: authUser?.id,
            email: authUser?.email,
          });
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: false,
            appLocale: locale,
            hasSelectedLanguage: true,
          });
          throw new Error('Signup succeeded but email confirmation is required before login.');
        }

        const user = buildAppUser(session, locale);

        console.log('[Auth] Register success:', user.role, 'locale:', user.locale);
        set({
          user,
          accessToken: session.access_token,
          isAuthenticated: true,
          isLoading: false,
          appLocale: user.locale,
          hasSelectedLanguage: true,
        });
      } catch (error) {
        console.error('[Auth] Register error:', error);
        set({ isLoading: false });
        throw error;
      }
    },

    setLocale: async (locale: Locale) => {
      const normalizedLocale = normalizeLocale(locale);
      const currentUser = get().user;

      await persistLocaleSelection(normalizedLocale, true);

      if (!currentUser) {
        console.log('[Auth] App locale updated without authenticated user:', normalizedLocale);
        set({ appLocale: normalizedLocale, hasSelectedLanguage: true });
        return;
      }

      const {
        data: { user: updatedAuthUser },
        error,
      } = await supabase.auth.updateUser({
        data: {
          locale: normalizedLocale,
        },
      });

      if (error) {
        console.error('[Auth] Supabase locale update error:', error);
        throw error;
      }

      const updatedUser: User = {
        ...currentUser,
        locale: normalizeLocale((updatedAuthUser?.user_metadata as SupabaseUserMetadata | undefined)?.locale ?? normalizedLocale),
      };

      console.log('[Auth] Locale updated:', updatedUser.locale);
      set({ user: updatedUser, appLocale: updatedUser.locale, hasSelectedLanguage: true });
    },

    completeLanguageSelection: async (locale: Locale) => {
      const normalizedLocale = normalizeLocale(locale);
      await persistLocaleSelection(normalizedLocale, true);
      console.log('[Auth] Language selection completed:', normalizedLocale);
      set({ appLocale: normalizedLocale, hasSelectedLanguage: true });
    },

    setActiveMode: async (mode: ActiveMode) => {
      console.log('[Auth] Switching active mode to:', mode);
      await secureSet(ACTIVE_MODE_KEY, mode);
      set({ activeMode: mode });
    },

    setProviderStatus: async (status: ProviderOnboardingStatus) => {
      console.log('[Auth] Updating provider status:', status);
      const currentUser = get().user;
      if (!currentUser) return;

      const isProvider = status === 'APPROVED' || status === 'PENDING_APPROVAL' || status === 'ONBOARDING';

      const { error } = await supabase.auth.updateUser({
        data: {
          is_provider: isProvider,
          provider_status: status,
        },
      });

      if (error) {
        console.error('[Auth] Supabase provider status update error:', error);
        throw error;
      }

      set({
        user: { ...currentUser, isProvider: isProvider, providerStatus: status },
      });
    },

    logout: async () => {
      console.log('[Auth] Logging out...');
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('[Auth] Supabase signOut error:', error);
        }
      } catch (error) {
        console.error('[Auth] Error signing out from Supabase:', error);
      }

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        activeMode: 'customer',
      });
    },
  }))
);
