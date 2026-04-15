import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Inbox, MapPin, Clock, User, Check, X } from 'lucide-react-native';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/store/orderStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import type { BookingStatus } from '@/types';

const tabs = ['new', 'accepted', 'completed'] as const;
type TabKey = (typeof tabs)[number];

const tabToStatus: Record<TabKey, BookingStatus[]> = {
  new: ['PENDING'],
  accepted: ['CONFIRMED', 'IN_PROGRESS'],
  completed: ['COMPLETED', 'CANCELLED'],
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
}

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function OrderCard({ order, onPress, onAccept, onDecline }: {
  order: Order;
  onPress: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const isPending = order.status === 'PENDING';

  return (
    <Pressable style={styles.orderCard} onPress={onPress} testID={`order-card-${order.id}`}>
      <View style={styles.orderHeader}>
        <View style={styles.customerRow}>
          <View style={styles.customerAvatar}>
            <User size={16} color={colors.accent} />
          </View>
          <Text style={styles.customerName}>{order.customerName}</Text>
        </View>
        <Text style={styles.orderPrice}>{formatPrice(order.totalCents)}</Text>
      </View>

      <Text style={styles.serviceName}>{order.serviceName}</Text>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Clock size={14} color={colors.textTertiary} />
          <Text style={styles.detailText}>{formatDateTime(order.scheduledAt)} · {order.durationMinutes}min</Text>
        </View>
        <View style={styles.detailRow}>
          <MapPin size={14} color={colors.textTertiary} />
          <Text style={styles.detailText} numberOfLines={1}>{order.address}</Text>
        </View>
      </View>

      {order.notes && (
        <Text style={styles.notes} numberOfLines={2}>{order.notes}</Text>
      )}

      {isPending && onAccept && onDecline && (
        <View style={styles.actionRow}>
          <Pressable style={styles.declineButton} onPress={onDecline} testID={`decline-${order.id}`}>
            <X size={18} color={colors.error} />
            <Text style={styles.declineText}>Recusar</Text>
          </Pressable>
          <Pressable style={styles.acceptButton} onPress={onAccept} testID={`accept-${order.id}`}>
            <Check size={18} color={colors.surface} />
            <Text style={styles.acceptText}>Aceitar</Text>
          </Pressable>
        </View>
      )}
    </Pressable>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const orders = useOrderStore((s) => s.orders);
  const acceptOrder = useOrderStore((s) => s.acceptOrder);
  const declineOrder = useOrderStore((s) => s.declineOrder);
  const hydrate = useOrderStore((s) => s.hydrate);

  const [activeTab, setActiveTab] = useState<TabKey>('new');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const filteredOrders = orders.filter((o) => tabToStatus[activeTab].includes(o.status));

  const handleAccept = useCallback((orderId: string) => {
    Alert.alert(
      'Aceitar pedido?',
      'Deseja aceitar este pedido?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Aceitar', onPress: () => void acceptOrder(orderId) },
      ]
    );
  }, [acceptOrder]);

  const handleDecline = useCallback((orderId: string) => {
    Alert.alert(
      'Recusar pedido?',
      'Deseja recusar este pedido?',
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Recusar', style: 'destructive', onPress: () => void declineOrder(orderId) },
      ]
    );
  }, [declineOrder]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await hydrate();
    setRefreshing(false);
  }, [hydrate]);

  const handleOrderPress = useCallback((orderId: string) => {
    router.push({ pathname: '/provider/(orders)/active-booking', params: { orderId } });
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const count = orders.filter((o) => tabToStatus[tab].includes(o.status)).length;
          return (
            <Pressable
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {t(`provider.orders.tabs.${tab}`)}
              </Text>
              {count > 0 && (
                <View style={[styles.badge, activeTab === tab && styles.badgeActive]}>
                  <Text style={[styles.badgeText, activeTab === tab && styles.badgeTextActive]}>{count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />}
      >
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Inbox size={48} color={colors.border} strokeWidth={1.2} />
            <Text style={styles.emptyTitle}>{t('provider.orders.emptyTitle')}</Text>
            <Text style={styles.emptySubtext}>
              {t('provider.orders.emptySubtitle', { tab: t(`provider.orders.tabs.${activeTab}`).toLowerCase() })}
            </Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onPress={() => handleOrderPress(order.id)}
                onAccept={order.status === 'PENDING' ? () => handleAccept(order.id) : undefined}
                onDecline={order.status === 'PENDING' ? () => handleDecline(order.id) : undefined}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.captionMedium, color: colors.textSecondary },
  tabTextActive: { color: colors.accent },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeActive: { backgroundColor: colors.accent },
  badgeText: { ...typography.small, color: colors.textSecondary, fontSize: 11 },
  badgeTextActive: { color: colors.primary, fontWeight: '600' as const },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.xxl },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    minHeight: 400,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  ordersList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.md,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: { ...typography.bodyMedium, color: colors.text },
  orderPrice: { ...typography.h3, color: colors.accent },
  serviceName: { ...typography.caption, color: colors.textSecondary },
  orderDetails: { gap: spacing.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { ...typography.small, color: colors.textTertiary, flex: 1 },
  notes: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.sm,
    fontStyle: 'italic' as const,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  declineText: { ...typography.captionMedium, color: colors.error },
  acceptButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.success,
  },
  acceptText: { ...typography.captionMedium, color: colors.surface },
});
