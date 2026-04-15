import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface OnboardingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export default function OnboardingStepIndicator({ currentStep, totalSteps, labels }: OnboardingStepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.barSegment,
              i <= currentStep ? styles.barActive : styles.barInactive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.label}>{labels[currentStep] ?? ''}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  barRow: {
    flexDirection: 'row',
    gap: 4,
  },
  barSegment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  barActive: {
    backgroundColor: colors.accent,
  },
  barInactive: {
    backgroundColor: colors.border,
  },
  label: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
