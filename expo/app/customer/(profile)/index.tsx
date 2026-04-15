import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import {
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Bell,
  Languages,
  Briefcase,
  ArrowRightLeft,
  Clock,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import type { Locale } from '@/types';

const menuIcons = [Settings, CreditCard, Bell, HelpCircle] as const;
const localeOptions: Locale[] = ['en', 'pt-BR', 'es'];

export default function CustomerProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setLocale = useAuthStore((s) => s.setLocale);
  const appLocale = useAuthStore((s) => s.appLocale);
  const setActiveMode = useAuthStore((s) => s.setActiveMode);

  const currentLocale: Locale = appLocale;
  const menuLabels = [
    t('customer.profile.menu.settings'),
    t('customer.profile.menu.paymentMethods'),
    t('customer.profile.menu.notifications'),
    t('customer.profile.menu.support'),
  ];

  const providerStatus = user?.providerStatus ?? 'NONE';
  const isApprovedProvider = providerStatus === 'APPROVED';
  const isPendingApproval = providerStatus === 'PENDING_APPROVAL';
  const isOnboarding = providerStatus === 'ONBOARDING';

  const handleLocaleChange = async (locale: Locale) => {
    if (locale === currentLocale) return;
    await setLocale(locale);
    await i18n.changeLanguage(locale);
    console.log('[Profile] Customer locale changed:', locale);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleProviderAction = async () => {
    if (isApprovedProvider) {
      await setActiveMode('provider');
      router.replace('/provider/(home)');
    } else if (isPendingApproval) {
      router.push('/provider/(home)/approval-pending');
    } else {
      router.push('/provider/(home)/onboarding-wizard');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color={colors.accent} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name ?? t('customer.profile.fallbackName')}</Text>
          <Text style={styles.profileEmail}>{user?.email ?? ''}</Text>
        </View>
      </View>

      <Pressable
        style={styles.providerCard}
        onPress={handleProviderAction}
        testID="become-provider-button"
      >
        <View style={styles.providerCardLeft}>
          <View style={styles.providerIconWrap}>
            {isApprovedProvider ? (
              <ArrowRightLeft size={22} color={colors.surface} />
            ) : isPendingApproval ? (
              <Clock size={22} color={colors.surface} />
            ) : (
              <Briefcase size={22} color={colors.surface} />
            )}
          </View>
          <View style={styles.providerCardText}>
            <Text style={styles.providerCardTitle}>
              {isApprovedProvider
                ? t('customer.profile.switchToProvider')
                : isPendingApproval
                  ? t('customer.profile.approvalPending')
                  : isOnboarding
                    ? t('customer.profile.continueOnboarding')
                    : t('customer.profile.becomeProvider')}
            </Text>
            <Text style={styles.providerCardSubtitle}>
              {isApprovedProvider
                ? t('customer.profile.switchToProviderDesc')
                : isPendingApproval
                  ? t('customer.profile.approvalPendingDesc')
                  : t('customer.profile.becomeProviderDesc')}
            </Text>
          </View>
        </View>
        <ChevronRight size={20} color={colors.accent} />
      </Pressable>

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
          <Text style={styles.languageTitle}>{t('customer.profile.languageSection')}</Text>
        </View>
        <View style={styles.localeRow}>
          {localeOptions.map((locale) => {
            const isActive = currentLocale === locale;
            const label = locale === 'pt-BR' ? t('locale.portuguese') : locale === 'es' ? t('locale.spanish') : t('locale.english');
            return (
              <Pressable
                key={locale}
                style={[styles.localeButton, isActive && styles.localeButtonActive]}
                onPress={() => void handleLocaleChange(locale)}
                testID={`customer-locale-${locale}`}
              >
                <Text style={[styles.localeButtonText, isActive && styles.localeButtonTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout} testID="logout-button">
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>{t('customer.profile.logout')}</Text>
      </Pressable>

      <Text style={styles.version}>{t('customer.profile.version')}</Text>
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
    marginBottom: spacing.md,
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
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    ...shadow.md,
  },
  providerCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  providerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerCardText: { flex: 1, gap: 2 },
  providerCardTitle: {
    ...typography.bodyMedium,
    color: colors.textInverse,
  },
  providerCardSubtitle: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
  },
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
  localeRow: { flexDirection: 'row', gap: spacing.xs + 2, flexWrap: 'wrap' },
  localeButton: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
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
