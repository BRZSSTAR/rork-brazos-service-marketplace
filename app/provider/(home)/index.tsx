import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, Star, Calendar, Clock } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const stats = [
  { icon: TrendingUp, labelKey: 'provider.home.stats.earningsMonth', value: 'R$ 0,00', color: colors.success },
  { icon: Star, labelKey: 'provider.home.stats.rating', value: '—', color: '#F59E0B' },
  { icon: Calendar, labelKey: 'provider.home.stats.bookings', value: '0', color: '#3B82F6' },
  { icon: Clock, labelKey: 'provider.home.stats.hours', value: '0h', color: '#8B5CF6' },
] as const;

export default function ProviderHomeScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.trim().split(/\s+/)[0] ?? t('provider.home.fallbackName');

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>{t('provider.home.greeting', { name: firstName })}</Text>
          <Text style={styles.heroTitle}>{t('provider.home.title')}</Text>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <View key={stat.labelKey} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <IconComp size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{t(stat.labelKey)}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('provider.home.nextBookings')}</Text>
          <View style={styles.emptyState}>
            <Calendar size={40} color={colors.border} strokeWidth={1.2} />
            <Text style={styles.emptyText}>{t('provider.home.noSchedule')}</Text>
            <Text style={styles.emptySubtext}>{t('provider.home.noScheduleDescription')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('provider.home.recentActivity')}</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('provider.home.noRecentActivity')}</Text>
            <Text style={styles.emptySubtext}>{t('provider.home.noRecentActivityDescription')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  heroSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
    gap: spacing.xs,
  },
  greeting: { ...typography.captionMedium, color: colors.accent },
  heroTitle: { ...typography.h1, color: colors.textInverse, fontSize: 24, lineHeight: 30 },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    width: '48%' as unknown as number,
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
    ...shadow.md,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: { ...typography.h3, color: colors.text },
  statLabel: { ...typography.small, color: colors.textSecondary },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  emptyText: { ...typography.bodyMedium, color: colors.text },
  emptySubtext: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
