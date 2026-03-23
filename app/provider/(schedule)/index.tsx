import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react-native';
import { useProviderStore } from '@/store/providerStore';
import { useOrderStore } from '@/store/orderStore';
import type { WeeklyAvailability } from '@/types';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

type DayKey = keyof WeeklyAvailability;
const dayKeys: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const timeSlots = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

function getWeekDates(offset: number): Date[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekRange(dates: Date[]): string {
  if (dates.length < 7) return '';
  const start = dates[0];
  const end = dates[6];
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  return `${start.toLocaleDateString('pt-BR', opts)} — ${end.toLocaleDateString('pt-BR', opts)}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function ScheduleScreen() {
  const { t } = useTranslation();
  const profile = useProviderStore((s) => s.profile);
  const updateProfile = useProviderStore((s) => s.updateProfile);
  const orders = useOrderStore((s) => s.orders);

  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [editMode, setEditMode] = useState<boolean>(false);

  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);
  const selectedDate = weekDates[selectedDayIndex];
  const selectedDayKey = dayKeys[selectedDayIndex];

  const availability = profile?.availability;
  const dayAvailability = availability?.[selectedDayKey];

  const dayOrders = useMemo(() => {
    if (!selectedDate) return [];
    return orders.filter((o) => {
      const orderDate = new Date(o.scheduledAt);
      return isSameDay(orderDate, selectedDate) && (o.status === 'CONFIRMED' || o.status === 'IN_PROGRESS');
    });
  }, [orders, selectedDate]);

  const handleToggleDay = useCallback((enabled: boolean) => {
    if (!availability) return;
    const updated: WeeklyAvailability = {
      ...availability,
      [selectedDayKey]: { ...availability[selectedDayKey], enabled },
    };
    void updateProfile({ availability: updated });
  }, [availability, selectedDayKey, updateProfile]);

  const handleTimeChange = useCallback((field: 'startTime' | 'endTime', value: string) => {
    if (!availability) return;
    const updated: WeeklyAvailability = {
      ...availability,
      [selectedDayKey]: { ...availability[selectedDayKey], [field]: value },
    };
    void updateProfile({ availability: updated });
  }, [availability, selectedDayKey, updateProfile]);

  const isToday = (date: Date): boolean => isSameDay(date, new Date());

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.weekNav}>
        <Pressable onPress={() => setWeekOffset((w) => w - 1)} style={styles.navButton} hitSlop={12}>
          <ChevronLeft size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.weekLabel}>{formatWeekRange(weekDates)}</Text>
        <Pressable onPress={() => setWeekOffset((w) => w + 1)} style={styles.navButton} hitSlop={12}>
          <ChevronRight size={22} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.daysRow}>
        {weekDates.map((date, i) => {
          const isSelected = i === selectedDayIndex;
          const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();
          const dayNum = date.getDate();
          const today = isToday(date);

          return (
            <Pressable
              key={i}
              style={[styles.dayPill, isSelected && styles.dayPillSelected, today && !isSelected && styles.dayPillToday]}
              onPress={() => setSelectedDayIndex(i)}
            >
              <Text style={[styles.dayPillLabel, isSelected && styles.dayPillLabelSelected]}>{dayLabel}</Text>
              <Text style={[styles.dayPillNum, isSelected && styles.dayPillNumSelected]}>{dayNum}</Text>
            </Pressable>
          );
        })}
      </View>

      {availability ? (
        <>
          <View style={styles.availabilityCard}>
            <View style={styles.availabilityHeader}>
              <View style={styles.availabilityHeaderLeft}>
                <Calendar size={18} color={colors.accent} />
                <Text style={styles.availabilityTitle}>
                  {t(`onboarding.availability.days.${selectedDayKey}`)}
                </Text>
              </View>
              <View style={styles.availabilityActions}>
                <Pressable onPress={() => setEditMode(!editMode)} hitSlop={8}>
                  <Edit3 size={16} color={colors.textSecondary} />
                </Pressable>
                <Switch
                  value={dayAvailability?.enabled ?? false}
                  onValueChange={handleToggleDay}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              </View>
            </View>

            {dayAvailability?.enabled ? (
              <View style={styles.timeDisplay}>
                <View style={styles.timeBlock}>
                  <Clock size={14} color={colors.textTertiary} />
                  <Text style={styles.timeText}>{dayAvailability.startTime} — {dayAvailability.endTime}</Text>
                </View>
                {editMode && (
                  <View style={styles.timeEditSection}>
                    <View style={styles.timeEditRow}>
                      <Text style={styles.timeEditLabel}>{t('onboarding.availability.start')}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {timeSlots.filter((ts) => ts < (dayAvailability.endTime ?? '22:00')).map((ts) => (
                          <Pressable
                            key={ts}
                            style={[styles.timeChip, dayAvailability.startTime === ts && styles.timeChipActive]}
                            onPress={() => handleTimeChange('startTime', ts)}
                          >
                            <Text style={[styles.timeChipText, dayAvailability.startTime === ts && styles.timeChipTextActive]}>{ts}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                    <View style={styles.timeEditRow}>
                      <Text style={styles.timeEditLabel}>{t('onboarding.availability.end')}</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {timeSlots.filter((ts) => ts > (dayAvailability.startTime ?? '06:00')).map((ts) => (
                          <Pressable
                            key={ts}
                            style={[styles.timeChip, dayAvailability.endTime === ts && styles.timeChipActive]}
                            onPress={() => handleTimeChange('endTime', ts)}
                          >
                            <Text style={[styles.timeChipText, dayAvailability.endTime === ts && styles.timeChipTextActive]}>{ts}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.dayOffText}>Dia de folga</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Agendamentos — {selectedDate?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
            </Text>
            {dayOrders.length === 0 ? (
              <View style={styles.emptyBookings}>
                <Calendar size={32} color={colors.border} strokeWidth={1.2} />
                <Text style={styles.emptyBookingsText}>Nenhum agendamento</Text>
              </View>
            ) : (
              <View style={styles.bookingsList}>
                {dayOrders.map((order) => (
                  <View key={order.id} style={styles.bookingCard}>
                    <View style={styles.bookingTime}>
                      <Text style={styles.bookingTimeText}>
                        {new Date(order.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <Text style={styles.bookingDuration}>{order.durationMinutes}min</Text>
                    </View>
                    <View style={styles.bookingInfo}>
                      <Text style={styles.bookingCustomer}>{order.customerName}</Text>
                      <Text style={styles.bookingService}>{order.serviceName}</Text>
                      <Text style={styles.bookingAddress} numberOfLines={1}>{order.address}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.noProfileState}>
          <Calendar size={48} color={colors.border} strokeWidth={1.2} />
          <Text style={styles.noProfileTitle}>Agenda indisponível</Text>
          <Text style={styles.noProfileSubtext}>Complete seu cadastro profissional para gerenciar sua agenda.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  navButton: { padding: spacing.xs },
  weekLabel: { ...typography.bodyMedium, color: colors.text },
  daysRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    gap: 2,
  },
  dayPillSelected: { backgroundColor: colors.primary },
  dayPillToday: { backgroundColor: colors.accent + '15' },
  dayPillLabel: { ...typography.small, color: colors.textTertiary },
  dayPillLabelSelected: { color: colors.accent },
  dayPillNum: { ...typography.bodyMedium, color: colors.text },
  dayPillNumSelected: { color: colors.textInverse },
  availabilityCard: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadow.sm,
  },
  availabilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  availabilityTitle: { ...typography.bodyMedium, color: colors.text },
  availabilityActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  timeDisplay: { marginTop: spacing.sm, gap: spacing.sm },
  timeBlock: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  timeText: { ...typography.caption, color: colors.textSecondary },
  dayOffText: { ...typography.caption, color: colors.textTertiary, marginTop: spacing.sm, fontStyle: 'italic' as const },
  timeEditSection: { gap: spacing.sm, marginTop: spacing.sm },
  timeEditRow: { gap: spacing.xs },
  timeEditLabel: { ...typography.small, color: colors.textSecondary },
  timeChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { ...typography.small, color: colors.textSecondary },
  timeChipTextActive: { color: colors.accent },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  emptyBookings: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  emptyBookingsText: { ...typography.body, color: colors.textSecondary },
  bookingsList: { gap: spacing.sm },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadow.sm,
  },
  bookingTime: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  bookingTimeText: { ...typography.bodyMedium, color: colors.accent },
  bookingDuration: { ...typography.small, color: 'rgba(255,255,255,0.5)' },
  bookingInfo: {
    flex: 1,
    padding: spacing.md,
    gap: 2,
  },
  bookingCustomer: { ...typography.bodyMedium, color: colors.text },
  bookingService: { ...typography.caption, color: colors.textSecondary },
  bookingAddress: { ...typography.small, color: colors.textTertiary },
  noProfileState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  noProfileTitle: { ...typography.h3, color: colors.text },
  noProfileSubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
