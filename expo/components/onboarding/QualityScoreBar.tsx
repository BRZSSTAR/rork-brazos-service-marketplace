import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import type { QualityScoreBreakdown } from '@/constants/ranking';

interface QualityScoreBarProps {
  breakdown: QualityScoreBreakdown;
}

export default function QualityScoreBar({ breakdown }: QualityScoreBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: breakdown.percent,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [breakdown.percent, widthAnim]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  const tierColor =
    breakdown.percent >= 80
      ? colors.success
      : breakdown.percent >= 50
        ? colors.accent
        : colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Profile quality</Text>
        <Text style={[styles.percent, { color: tierColor }]}>
          {breakdown.percent}%
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { width, backgroundColor: tierColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xs,
    gap: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...typography.smallMedium, color: colors.textSecondary },
  percent: { ...typography.smallMedium },
  track: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  fill: { height: 6, borderRadius: radius.full },
});
