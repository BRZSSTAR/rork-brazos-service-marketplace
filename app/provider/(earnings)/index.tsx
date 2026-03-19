import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

export default function EarningsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t('provider.earnings.balanceLabel')}</Text>
        <Text style={styles.balanceValue}>R$ 0,00</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <ArrowDownCircle size={16} color={colors.success} />
            <Text style={styles.balanceStatText}>{t('provider.earnings.received')}</Text>
          </View>
          <View style={styles.balanceStat}>
            <ArrowUpCircle size={16} color={colors.textTertiary} />
            <Text style={styles.balanceStatText}>{t('provider.earnings.withdrawn')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('provider.earnings.transactions')}</Text>
        <View style={styles.emptyState}>
          <Wallet size={40} color={colors.border} strokeWidth={1.2} />
          <Text style={styles.emptyText}>{t('provider.earnings.emptyTitle')}</Text>
          <Text style={styles.emptySubtext}>{t('provider.earnings.emptySubtitle')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  balanceCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  balanceLabel: { ...typography.captionMedium, color: 'rgba(255,255,255,0.6)' },
  balanceValue: {
    fontSize: 36,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    color: colors.accent,
    lineHeight: 44,
  },
  balanceRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
  balanceStat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  balanceStatText: { ...typography.small, color: 'rgba(255,255,255,0.7)' },
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
