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
  ArrowRightLeft,
  Crown,
  Rocket,
  Sparkles,
  Zap,
  QrCode,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { getTierById } from '@/constants/subscription';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import type { Locale } from '@/types';

const menuIcons = [Shield, Star, Settings, CreditCard, Bell, HelpCircle] as const;
const localeOptions: Locale[] = ['en', 'pt-BR', 'es'];

export default function ProviderProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setLocale = useAuthStore((s) => s.setLocale);
  const appLocale = useAuthStore((s) => s.appLocale);
  const setActiveMode = useAuthStore((s) => s.setActiveMode);
  const tierId = useSubscriptionStore((s) => s.tierId);
  const activePromotions = useSubscriptionStore((s) => s.activePromotions);
  const tier = getTierById(tierId);
  const TierIcon = tierId === 'ELITE' ? Crown : tierId === 'PRO' ? Rocket : Sparkles;
  const hasActivePromo = activePromotions.length > 0;

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

  const handleSwitchToCustomer = async () => {
    await setActiveMode('customer');
    router.replace('/customer/(home)');
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

      <Pressable
        style={styles.planCard}
        onPress={() => router.push('/provider/(profile)/subscription')}
        testID="provider-plan-card"
      >
        <LinearGradient
          colors={tier.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.planGradient}
        >
          <View style={styles.planHeader}>
            <View style={styles.planIconWrap}>
              <TierIcon size={20} color={colors.accent} />
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planLabel}>PLANO ATUAL</Text>
              <Text style={styles.planName}>{tier.name}</Text>
            </View>
            <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
          </View>
          <View style={styles.planStatsRow}>
            <View style={styles.planStat}>
              <Text style={styles.planStatValue}>{tier.commissionPercent}%</Text>
              <Text style={styles.planStatLabel}>comissão</Text>
            </View>
            <View style={styles.planDivider} />
            <View style={styles.planStat}>
              <Text style={styles.planStatValue}>
                {tier.monthlyFeeCents === 0 ? 'R$ 0' : `R$ ${(tier.monthlyFeeCents / 100).toFixed(0)}`}
              </Text>
              <Text style={styles.planStatLabel}>por mês</Text>
            </View>
            {tierId !== 'ELITE' && (
              <>
                <View style={styles.planDivider} />
                <View style={styles.planUpgradeBtn}>
                  <Text style={styles.planUpgradeBtnText}>Upgrade</Text>
                </View>
              </>
            )}
          </View>
        </LinearGradient>
      </Pressable>

      <Pressable
        style={styles.shareCard}
        onPress={() => router.push('/provider/(profile)/share')}
        testID="provider-share-card"
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shareGradient}
        >
          <View style={styles.shareIconWrap}>
            <QrCode size={22} color={colors.accent} />
          </View>
          <View style={styles.shareInfo}>
            <Text style={styles.shareTitle}>Meu QR Code</Text>
            <Text style={styles.shareSubtitle}>Compartilhe e receba reservas direto pelo app</Text>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.6)" />
        </LinearGradient>
      </Pressable>

      <Pressable
        style={styles.promoteCard}
        onPress={() => router.push('/provider/(profile)/promote')}
        testID="provider-promote-card"
      >
        <View style={[styles.promoteIconWrap, hasActivePromo && styles.promoteIconActive]}>
          <Zap size={18} color={hasActivePromo ? colors.success : colors.accent} fill={hasActivePromo ? colors.success : 'transparent'} />
        </View>
        <View style={styles.promoteInfo}>
          <View style={styles.promoteTitleRow}>
            <Text style={styles.promoteTitle}>Impulsionar perfil</Text>
            {hasActivePromo && (
              <View style={styles.promoteActivePill}>
                <Text style={styles.promoteActivePillText}>ATIVO</Text>
              </View>
            )}
          </View>
          <Text style={styles.promoteSubtitle}>
            {hasActivePromo
              ? `${activePromotions.length} impulso${activePromotions.length > 1 ? 's' : ''} ativo${activePromotions.length > 1 ? 's' : ''}`
              : 'A partir de R$ 3/dia — apareça no topo'}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textTertiary} />
      </Pressable>

      <Pressable
        style={styles.switchCard}
        onPress={handleSwitchToCustomer}
        testID="switch-to-customer-button"
      >
        <View style={styles.switchCardLeft}>
          <View style={styles.switchIconWrap}>
            <ArrowRightLeft size={20} color={colors.primary} />
          </View>
          <View style={styles.switchCardText}>
            <Text style={styles.switchCardTitle}>{t('provider.profile.switchToCustomer')}</Text>
            <Text style={styles.switchCardSubtitle}>{t('provider.profile.switchToCustomerDesc')}</Text>
          </View>
        </View>
        <ChevronRight size={18} color={colors.textTertiary} />
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
          <Text style={styles.languageTitle}>{t('provider.profile.languageSection')}</Text>
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
  roleBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
    marginTop: spacing.xs - 2,
  },
  roleBadgeText: { ...typography.smallMedium, color: colors.accentDark },
  planCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.md,
  },
  planGradient: { padding: spacing.md, gap: spacing.md },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  planIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: { flex: 1, gap: 2 },
  planLabel: { ...typography.small, color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1, fontWeight: '700' as const },
  planName: { ...typography.h3, color: colors.textInverse },
  planStatsRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planStat: { gap: 2 },
  planStatValue: { ...typography.h3, color: colors.accent },
  planStatLabel: { ...typography.small, color: 'rgba(255,255,255,0.6)' },
  planDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  planUpgradeBtn: {
    marginLeft: 'auto',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  planUpgradeBtnText: { ...typography.smallMedium, color: colors.primary, fontWeight: '700' as const },
  shareCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.md,
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  shareIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201,168,76,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareInfo: { flex: 1, gap: 2 },
  shareTitle: { ...typography.bodyMedium, color: colors.logo },
  shareSubtitle: { ...typography.small, color: 'rgba(255,255,255,0.65)' },
  promoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  promoteIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoteIconActive: { backgroundColor: colors.successLight },
  promoteInfo: { flex: 1, gap: 2 },
  promoteTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  promoteTitle: { ...typography.bodyMedium, color: colors.text },
  promoteActivePill: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  promoteActivePillText: { fontSize: 9, fontWeight: '700' as const, color: colors.success, letterSpacing: 0.8 },
  promoteSubtitle: { ...typography.small, color: colors.textSecondary },
  switchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  switchCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  switchIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchCardText: { flex: 1, gap: 2 },
  switchCardTitle: { ...typography.bodyMedium, color: colors.text },
  switchCardSubtitle: { ...typography.small, color: colors.textSecondary },
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
