import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { WeeklyAvailability, DayAvailability } from '@/types';

type DayKey = keyof WeeklyAvailability;

const dayKeys: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const timeOptions = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

interface AvailabilityStepProps {
  availability: WeeklyAvailability;
  onUpdate: (day: DayKey, updates: Partial<DayAvailability>) => void;
  onNext: () => void;
}

function TimePicker({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timePicker}>
      {options.map((time) => (
        <Pressable
          key={time}
          style={[styles.timeChip, value === time && styles.timeChipActive]}
          onPress={() => onChange(time)}
        >
          <Text style={[styles.timeChipText, value === time && styles.timeChipTextActive]}>{time}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function AvailabilityStep({ availability, onUpdate, onNext }: AvailabilityStepProps) {
  const { t } = useTranslation();

  const hasAtLeastOneDay = dayKeys.some((day) => availability[day].enabled);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('onboarding.availability.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.availability.subtitle')}</Text>

      <View style={styles.daysList}>
        {dayKeys.map((day) => {
          const dayData = availability[day];
          return (
            <View key={day} style={[styles.dayCard, dayData.enabled && styles.dayCardEnabled]}>
              <View style={styles.dayHeader}>
                <Text style={[styles.dayLabel, dayData.enabled && styles.dayLabelEnabled]}>
                  {t(`onboarding.availability.days.${day}`)}
                </Text>
                <Switch
                  value={dayData.enabled}
                  onValueChange={(v) => onUpdate(day, { enabled: v })}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.surface}
                />
              </View>
              {dayData.enabled && (
                <View style={styles.timeSection}>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>{t('onboarding.availability.start')}</Text>
                    <TimePicker
                      value={dayData.startTime}
                      options={timeOptions.filter((t) => t < dayData.endTime)}
                      onChange={(v) => onUpdate(day, { startTime: v })}
                    />
                  </View>
                  <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>{t('onboarding.availability.end')}</Text>
                    <TimePicker
                      value={dayData.endTime}
                      options={timeOptions.filter((t) => t > dayData.startTime)}
                      onChange={(v) => onUpdate(day, { endTime: v })}
                    />
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={t('common.continue')}
          onPress={onNext}
          disabled={!hasAtLeastOneDay}
          testID="onboarding-availability-next"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  daysList: { gap: spacing.sm },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadow.sm,
  },
  dayCardEnabled: {
    borderColor: colors.accent,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLabel: { ...typography.bodyMedium, color: colors.textSecondary },
  dayLabelEnabled: { color: colors.text },
  timeSection: {
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  timeRow: {
    gap: spacing.xs,
  },
  timeLabel: { ...typography.small, color: colors.textSecondary },
  timePicker: {
    flexGrow: 0,
  },
  timeChip: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeChipText: { ...typography.small, color: colors.textSecondary },
  timeChipTextActive: { color: colors.accent },
  footer: { marginTop: spacing.lg },
});
