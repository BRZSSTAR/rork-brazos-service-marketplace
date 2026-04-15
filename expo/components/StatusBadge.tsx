import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, radius, spacing, typography } from '@/constants/theme';
import type { BookingStatus } from '@/types';

const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
  PENDING: { bg: '#FFF3CD', text: '#856404' },
  CONFIRMED: { bg: '#D4EDDA', text: '#155724' },
  IN_PROGRESS: { bg: '#CCE5FF', text: '#004085' },
  COMPLETED: { bg: colors.successLight, text: colors.success },
  CANCELLED: { bg: colors.errorLight, text: colors.error },
};

const statusKey: Record<BookingStatus, string> = {
  PENDING: 'status.pending',
  CONFIRMED: 'status.confirmed',
  IN_PROGRESS: 'status.inProgress',
  COMPLETED: 'status.completed',
  CANCELLED: 'status.cancelled',
};

interface StatusBadgeProps {
  status: BookingStatus;
  testID?: string;
}

export default function StatusBadge({ status, testID }: StatusBadgeProps) {
  const { t } = useTranslation();
  const config = statusColors[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]} testID={testID}>
      <Text style={[styles.text, { color: config.text }]}>{t(statusKey[status])}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.smallMedium,
  },
});
