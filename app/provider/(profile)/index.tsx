import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  User,
  Settings,
  Star,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
  Languages,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import type { Locale } from '@/types';

const menuIcons = [Shield, Star, Settings, CreditCard, Bell, HelpCircle] as const;
const localeOptions: Locale[] = ['pt-BR', 'en'];

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setLocale = useAuthStore((s) => s.setLocale);
  const appLocale = useAuthStore((s) => s.appLocale);

  const currentLocale: Locale = appLocale;
  const menuLabels = [
    t('provider.profile.menu.professionalProfile'),
    t('provider.profile.menu.reviews'),
    t('provider.profile.menu.settings'),
    t('provider.profile.menu.bankData'),
    t('provider.profile.menu.notifications'),
    t('provider.profile.menu.support'),
  ];

  const handleLocaleChange = async (locale: Locale) => {
    if (locale === currentLocale) return;
    await setLocale(locale);
    await i18n.changeLanguage(locale);
    console.log('[Profile] Provider locale changed:', locale);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color={colors.accent} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name ?? t('provider.profile.fallbackName')}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{t('provider.profile.roleLabel')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuLabels.map((label, index) => {
          const IconComp = menuIcons[index];
          return (
            <Pressable key={label} style={styles.menuItem}>
              <View style={styles.menuLeft}>
                <IconComp size={20} color={colors.textSecondary} />
                <Text style={styles.menuLabel}>{label}</Text>
              </View>
              <ChevronRight size={18} color={colors.textTertiary} />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.languageSection}>
        <View style={styles.languageTitleRow}>
          <Languages size={18} color={colors.textSecondary} />
          <Text style={styles.languageTitle}>{t('provider.profile.languageSection')}</Text>
        </View>
        <View style={styles.localeRow}>
          {localeOptions.map((locale) => {
            const isActive = currentLocale === locale;
            const label = locale === 'pt-BR' ? t('locale.portuguese') : t('locale.english');
            return (
              <Pressable
                key={locale}
                style={[styles.localeButton, isActive && styles.localeButtonActive]}
                onPress={() => void handleLocaleChange(locale)}
                testID={`provider-locale-${locale}`}
              >
                <Text style={[styles.localeButtonText, isActive && styles.localeButtonTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout} testID="provider-logout-button">
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>{t('provider.profile.logout')}</Text>
      </Pressable>

      <Text style={styles.version}>{t('provider.profile.version')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingVertical: spacing.md, paddingBottom: spacing.xxl },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: { flex: 1, gap: spacing.xs - 2 },
  profileName: { ...typography.h3, color: colors.text },
  profileEmail: { ...typography.caption, color: colors.textSecondary },
  roleBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.xs - 2,
  },
  roleBadgeText: { ...typography.smallMedium, color: colors.accentDark },
  menuSection: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuLabel: { ...typography.body, color: colors.text },
  languageSection: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  languageTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  languageTitle: { ...typography.bodyMedium, color: colors.text },
  localeRow: { flexDirection: 'row', gap: spacing.sm },
  localeButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  localeButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  localeButtonText: { ...typography.captionMedium, color: colors.textSecondary },
  localeButtonTextActive: { color: colors.accent },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    ...shadow.sm,
  },
  logoutText: { ...typography.bodyMedium, color: colors.error },
  version: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
