import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Linking } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, User, Phone, CheckCircle } from 'lucide-react-native';
import { useOrderStore } from '@/store/orderStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import StatusBadge from '@/components/StatusBadge';

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
}

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

export default function ActiveBookingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const orders = useOrderStore((s) => s.orders);
  const acceptOrder = useOrderStore((s) => s.acceptOrder);
  const declineOrder = useOrderStore((s) => s.declineOrder);
  const startOrder = useOrderStore((s) => s.startOrder);
  const completeOrder = useOrderStore((s) => s.completeOrder);

  const order = useMemo(() => orders.find((o) => o.id === orderId), [orders, orderId]);

  const handleAccept = useCallback(() => {
    if (!orderId) return;
    Alert.alert('Aceitar pedido?', 'Confirma a aceitação deste serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Aceitar', onPress: () => void acceptOrder(orderId) },
    ]);
  }, [orderId, acceptOrder]);

  const handleDecline = useCallback(() => {
    if (!orderId) return;
    Alert.alert('Recusar pedido?', 'Deseja recusar este serviço?', [
      { text: 'Voltar', style: 'cancel' },
      { text: 'Recusar', style: 'destructive', onPress: () => { void declineOrder(orderId); router.back(); } },
    ]);
  }, [orderId, declineOrder, router]);

  const handleStart = useCallback(() => {
    if (!orderId) return;
    Alert.alert('Iniciar serviço?', 'Confirma o início do serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Iniciar', onPress: () => void startOrder(orderId) },
    ]);
  }, [orderId, startOrder]);

  const handleComplete = useCallback(() => {
    if (!orderId) return;
    Alert.alert('Concluir serviço?', 'Confirma a conclusão deste serviço?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Concluir', onPress: () => { void completeOrder(orderId); } },
    ]);
  }, [orderId, completeOrder]);

  const handleCall = useCallback(() => {
    if (order?.customerPhone) {
      void Linking.openURL(`tel:${order.customerPhone}`);
    }
  }, [order]);

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Stack.Screen options={{ title: t('navigation.providerOrders.activeBooking') }} />
        <Text style={styles.emptyText}>Pedido não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: t('navigation.providerOrders.activeBooking') }} />

      <View style={styles.statusSection}>
        <StatusBadge status={order.status} />
        <Text style={styles.price}>{formatPrice(order.totalCents)}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.customerAvatar}>
            <User size={24} color={colors.accent} />
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{order.customerName}</Text>
            {order.customerPhone && (
              <Text style={styles.customerPhone}>{order.customerPhone}</Text>
            )}
          </View>
          {order.customerPhone && (
            <Pressable style={styles.callButton} onPress={handleCall}>
              <Phone size={18} color={colors.accent} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{order.serviceName}</Text>

        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textTertiary} />
          <Text style={styles.infoText}>{formatDateTime(order.scheduledAt)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Clock size={16} color={colors.textTertiary} />
          <Text style={styles.infoText}>{order.durationMinutes} minutos</Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color={colors.textTertiary} />
          <Text style={styles.infoText}>{order.address}</Text>
        </View>

        {order.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Observações:</Text>
            <Text style={styles.notesText}>{order.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {order.status === 'PENDING' && (
          <>
            <Pressable style={styles.declineBtn} onPress={handleDecline}>
              <Text style={styles.declineBtnText}>Recusar</Text>
            </Pressable>
            <PrimaryButton title="Aceitar Pedido" onPress={handleAccept} testID="accept-order-btn" />
          </>
        )}

        {order.status === 'CONFIRMED' && (
          <PrimaryButton title="Iniciar Serviço" onPress={handleStart} testID="start-order-btn" />
        )}

        {order.status === 'IN_PROGRESS' && (
          <PrimaryButton title="Concluir Serviço" onPress={handleComplete} testID="complete-order-btn" />
        )}

        {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
          <View style={styles.completedBanner}>
            <CheckCircle size={20} color={order.status === 'COMPLETED' ? colors.success : colors.textTertiary} />
            <Text style={[styles.completedText, order.status === 'CANCELLED' && { color: colors.textTertiary }]}>
              {order.status === 'COMPLETED' ? 'Serviço concluído' : 'Pedido cancelado'}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.body, color: colors.textSecondary },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  price: { ...typography.h1, color: colors.accent },
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  customerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: { flex: 1, gap: 2 },
  customerName: { ...typography.h3, color: colors.text },
  customerPhone: { ...typography.caption, color: colors.textSecondary },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...typography.h3, color: colors.text },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  infoText: { ...typography.body, color: colors.textSecondary, flex: 1 },
  notesSection: {
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.sm,
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  notesLabel: { ...typography.smallMedium, color: colors.textSecondary },
  notesText: { ...typography.caption, color: colors.text, fontStyle: 'italic' as const },
  actions: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  declineBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  declineBtnText: { ...typography.button, color: colors.error },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: radius.sm,
  },
  completedText: { ...typography.bodyMedium, color: colors.success },
});
