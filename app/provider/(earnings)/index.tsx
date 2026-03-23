import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Wallet, ArrowDownCircle, TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useOrderStore } from '@/store/orderStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EarningsScreen() {
  const { t } = useTranslation();
  const orders = useOrderStore((s) => s.orders);

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === 'COMPLETED').sort((a, b) =>
      new Date(b.completedAt ?? b.createdAt).getTime() - new Date(a.completedAt ?? a.createdAt).getTime()
    ),
    [orders]
  );

  const totalEarnings = useMemo(
    () => completedOrders.reduce((sum, o) => sum + o.totalCents, 0),
    [completedOrders]
  );

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
            <Text style={styles.balanceStatText}>{formatPrice(totalEarnings)} recebido</Text>
          </View>
          <View style={styles.balanceStat}>
            <TrendingUp size={16} color={colors.accent} />
            <Text style={styles.balanceStatText}>{formatPrice(thisMonthEarnings)} este mês</Text>
          </View>
        </View>
      </View>

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
