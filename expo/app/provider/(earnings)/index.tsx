import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Wallet, ArrowDownCircle, TrendingUp, TrendingDown, ChevronRight, Sparkles } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { useOrderStore } from '@/store/orderStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { getTierById, calculateCommission, SUBSCRIPTION_TIERS } from '@/constants/subscription';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EarningsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const orders = useOrderStore((s) => s.orders);
  const tierId = useSubscriptionStore((s) => s.tierId);
  const tier = getTierById(tierId);

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'COMPLETED').sort((a, b) =>
      new Date(b.completedAt ?? b.createdAt).getTime() - new Date(a.completedAt ?? a.createdAt).getTime()
    ),
    [orders]
  );

  const grossEarnings = useMemo(
    () => completedOrders.reduce((sum, o) => sum + o.totalCents, 0),
    [completedOrders]
  );

  const { commissionCents: totalCommission, netCents: totalEarnings } = useMemo(
    () => calculateCommission(grossEarnings, tierId),
    [grossEarnings, tierId]
  );

  const potentialSavings = useMemo(() => {
    if (tierId === 'ELITE') return 0;
    const eliteTier = SUBSCRIPTION_TIERS.find((x) => x.id === 'ELITE');
    if (!eliteTier) return 0;
    const eliteCommission = Math.round((grossEarnings * eliteTier.commissionPercent) / 100);
    const annualSavings = (totalCommission - eliteCommission) * 12 - eliteTier.monthlyFeeCents * 12;
    return Math.max(0, annualSavings);
  }, [grossEarnings, totalCommission, tierId]);

  const thisMonthEarnings = useMemo(() => {
    const now = new Date();
    return completedOrders
      .filter((o) => {
        const d = new Date(o.completedAt ?? o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + o.totalCents, 0);
  }, [completedOrders]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>{t('provider.earnings.balanceLabel')}</Text>
        <Text style={styles.balanceValue}>{formatPrice(totalEarnings)}</Text>
        <View style={styles.balanceRow}>
          <View style={styles.balanceStat}>
            <ArrowDownCircle size={16} color={colors.success} />
            <Text style={styles.balanceStatText}>{formatPrice(totalEarnings)} líquido</Text>
          </View>
          <View style={styles.balanceStat}>
            <TrendingUp size={16} color={colors.accent} />
            <Text style={styles.balanceStatText}>{formatPrice(thisMonthEarnings)} este mês</Text>
          </View>
        </View>
      </View>

      <View style={styles.breakdownCard}>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Faturamento bruto</Text>
          <Text style={styles.breakdownValue}>{formatPrice(grossEarnings)}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownLabelRow}>
            <TrendingDown size={14} color={colors.error} />
            <Text style={styles.breakdownLabel}>
              Comissão BRAZOS ({tier.commissionPercent}% · plano {tier.name})
            </Text>
          </View>
          <Text style={styles.breakdownValueNegative}>-{formatPrice(totalCommission)}</Text>
        </View>
        <View style={styles.breakdownDivider} />
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabelBold}>Seu líquido</Text>
          <Text style={styles.breakdownValueBold}>{formatPrice(totalEarnings)}</Text>
        </View>
      </View>

      {tierId !== 'ELITE' && potentialSavings > 0 && (
        <Pressable
          style={styles.upsellCard}
          onPress={() => router.push('/provider/(profile)/subscription')}
          testID="upgrade-from-earnings"
        >
          <View style={styles.upsellIconWrap}>
            <Sparkles size={18} color={colors.accent} />
          </View>
          <View style={styles.upsellText}>
            <Text style={styles.upsellTitle}>Economize até {formatPrice(potentialSavings)}/ano</Text>
            <Text style={styles.upsellSubtitle}>Faça upgrade para o plano Elite — comissão de apenas 10%.</Text>
          </View>
          <ChevronRight size={18} color={colors.textTertiary} />
        </Pressable>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('provider.earnings.transactions')}</Text>
        {completedOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Wallet size={40} color={colors.border} strokeWidth={1.2} />
            <Text style={styles.emptyText}>{t('provider.earnings.emptyTitle')}</Text>
            <Text style={styles.emptySubtext}>{t('provider.earnings.emptySubtitle')}</Text>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {completedOrders.map((order) => (
              <View key={order.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={styles.transactionIcon}>
                    <ArrowDownCircle size={18} color={colors.success} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{order.serviceName}</Text>
                    <Text style={styles.transactionCustomer}>{order.customerName}</Text>
                    <Text style={styles.transactionDate}>{formatDate(order.completedAt ?? order.createdAt)}</Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>+{formatPrice(order.totalCents)}</Text>
              </View>
            ))}
          </View>
        )}
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
  balanceRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm, flexWrap: 'wrap' },
  breakdownCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  breakdownLabelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flex: 1 },
  breakdownLabel: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  breakdownLabelBold: { ...typography.bodyMedium, color: colors.text },
  breakdownValue: { ...typography.captionMedium, color: colors.text },
  breakdownValueNegative: { ...typography.captionMedium, color: colors.error },
  breakdownValueBold: { ...typography.h3, color: colors.success },
  breakdownDivider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xs },
  upsellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary + '08',
    borderRadius: radius.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  upsellIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsellText: { flex: 1, gap: 2 },
  upsellTitle: { ...typography.bodyMedium, color: colors.primary },
  upsellSubtitle: { ...typography.small, color: colors.textSecondary },
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
  transactionsList: { gap: spacing.xs },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadow.sm,
  },
  transactionLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: { flex: 1, gap: 1 },
  transactionTitle: { ...typography.captionMedium, color: colors.text },
  transactionCustomer: { ...typography.small, color: colors.textSecondary },
  transactionDate: { ...typography.small, color: colors.textTertiary },
  transactionAmount: { ...typography.bodyMedium, color: colors.success },
});
