import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TrendingUp, Star, Calendar, Clock, Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useAuthStore } from '@/store/authStore';
import { useProviderStore } from '@/store/providerStore';
import { useOrderStore } from '@/store/orderStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import type { ServiceCategory } from '@/types';

const categoryIcons: Record<ServiceCategory, typeof Home> = {
  HOME: Home,
  BEAUTY: Scissors,
  HEALTH: Heart,
  CHEF: ChefHat,
};

const categoryColors: Record<ServiceCategory, string> = {
  HOME: '#3B82F6',
  BEAUTY: '#EC4899',
  HEALTH: '#10B981',
  CHEF: '#F59E0B',
};

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const day = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day} · ${time}`;
}

export default function ProviderHomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const profile = useProviderStore((s) => s.profile);
  const orders = useOrderStore((s) => s.orders);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? t('provider.home.fallbackName');

  const completedOrders = useMemo(() => orders.filter((o) => o.status === 'COMPLETED'), [orders]);
  const upcomingOrders = useMemo(
    () => orders.filter((o) => (o.status === 'CONFIRMED' || o.status === 'IN_PROGRESS') && new Date(o.scheduledAt) > new Date())
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
      .slice(0, 3),
    [orders]
  );
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'PENDING'), [orders]);

  const totalEarnings = useMemo(
    () => completedOrders.reduce((sum, o) => sum + o.totalCents, 0),
    [completedOrders]
  );
  const totalHours = useMemo(
    () => Math.round(completedOrders.reduce((sum, o) => sum + o.durationMinutes, 0) / 60),
    [completedOrders]
  );

  const stats = [
    { icon: TrendingUp, label: t('provider.home.stats.earningsMonth'), value: formatPrice(totalEarnings), color: colors.success },
    { icon: Star, label: t('provider.home.stats.rating'), value: profile ? '4.8' : '—', color: '#F59E0B' },
    { icon: Calendar, label: t('provider.home.stats.bookings'), value: String(completedOrders.length), color: '#3B82F6' },
    { icon: Clock, label: t('provider.home.stats.hours'), value: `${totalHours}h`, color: '#8B5CF6' },
  ];

  const CategoryIcon = profile ? categoryIcons[profile.category] : null;
  const categoryColor = profile ? categoryColors[profile.category] : colors.textTertiary;

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{t('provider.home.greeting', { name: firstName })}</Text>
              <Text style={styles.heroTitle}>{t('provider.home.title')}</Text>
            </View>
            {profile && CategoryIcon && (
              <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                <CategoryIcon size={18} color={categoryColor} />
              </View>
            )}
          </View>
          {pendingOrders.length > 0 && (
            <Pressable
              style={styles.pendingBanner}
              onPress={() => router.push('/provider/(orders)')}
            >
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>
                {pendingOrders.length} novo{pendingOrders.length > 1 ? 's' : ''} pedido{pendingOrders.length > 1 ? 's' : ''}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => {
            const IconComp = stat.icon;
            return (
              <View key={stat.label} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                  <IconComp size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('provider.home.nextBookings')}</Text>
          {upcomingOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Calendar size={40} color={colors.border} strokeWidth={1.2} />
              <Text style={styles.emptyText}>{t('provider.home.noSchedule')}</Text>
              <Text style={styles.emptySubtext}>{t('provider.home.noScheduleDescription')}</Text>
            </View>
          ) : (
            <View style={styles.bookingsList}>
              {upcomingOrders.map((order) => (
                <Pressable
                  key={order.id}
                  style={styles.bookingCard}
                  onPress={() => router.push({ pathname: '/provider/(orders)/active-booking', params: { orderId: order.id } })}
                >
                  <View style={styles.bookingTimeBlock}>
                    <Text style={styles.bookingTime}>
                      {new Date(order.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.bookingDuration}>{order.durationMinutes}min</Text>
                  </View>
                  <View style={styles.bookingDetails}>
                    <Text style={styles.bookingCustomer}>{order.customerName}</Text>
                    <Text style={styles.bookingService}>{order.serviceName}</Text>
                    <Text style={styles.bookingDate}>{formatDateTime(order.scheduledAt)}</Text>
                  </View>
                  <Text style={styles.bookingPrice}>{formatPrice(order.totalCents)}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('provider.home.recentActivity')}</Text>
          {completedOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{t('provider.home.noRecentActivity')}</Text>
              <Text style={styles.emptySubtext}>{t('provider.home.noRecentActivityDescription')}</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {completedOrders.slice(0, 5).map((order) => (
                <View key={order.id} style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{order.serviceName} — {order.customerName}</Text>
                    <Text style={styles.activityDate}>
                      {order.completedAt ? new Date(order.completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : ''}
                    </Text>
                  </View>
                  <Text style={styles.activityPrice}>{formatPrice(order.totalCents)}</Text>
                </View>
              ))}
            </View>
          )}
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
    gap: spacing.sm,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { ...typography.captionMedium, color: colors.accent },
  heroTitle: { ...typography.h1, color: colors.textInverse, fontSize: 24, lineHeight: 30 },
  categoryBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  pendingText: { ...typography.captionMedium, color: colors.textInverse },
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
  bookingsList: { gap: spacing.sm },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  bookingTimeBlock: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  bookingTime: { ...typography.bodyMedium, color: colors.accent },
  bookingDuration: { ...typography.small, color: 'rgba(255,255,255,0.5)' },
  bookingDetails: { flex: 1, padding: spacing.sm, gap: 2 },
  bookingCustomer: { ...typography.captionMedium, color: colors.text },
  bookingService: { ...typography.small, color: colors.textSecondary },
  bookingDate: { ...typography.small, color: colors.textTertiary },
  bookingPrice: { ...typography.bodyMedium, color: colors.accent, paddingRight: spacing.md },
  activityList: { gap: spacing.xs },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  activityInfo: { flex: 1, gap: 2 },
  activityTitle: { ...typography.caption, color: colors.text },
  activityDate: { ...typography.small, color: colors.textTertiary },
  activityPrice: { ...typography.captionMedium, color: colors.success },
});
