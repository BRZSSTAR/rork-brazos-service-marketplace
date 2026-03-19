import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

function StepDot({ label, index, currentStep }: { label: string; index: number; currentStep: number }) {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.85)).current;
  const opacityAnim = useRef(new Animated.Value(isActive || isCompleted ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.85,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive || isCompleted ? 1 : 0.4,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive, isCompleted, scaleAnim, opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.stepItem,
        { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View
        style={[
          styles.dot,
          isCompleted && styles.dotCompleted,
          isActive && styles.dotActive,
        ]}
      >
        {isCompleted ? (
          <Check size={14} color={colors.surface} strokeWidth={3} />
        ) : (
          <Text
            style={[
              styles.dotNumber,
              isActive && styles.dotNumberActive,
            ]}
          >
            {index + 1}
          </Text>
        )}
      </View>
      <Text
        style={[
          styles.stepLabel,
          isActive && styles.stepLabelActive,
          isCompleted && styles.stepLabelCompleted,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Animated.View>
  );
}

function ConnectorLine({ completed }: { completed: boolean }) {
  const widthAnim = useRef(new Animated.Value(completed ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: completed ? 1 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [completed, widthAnim]);

  return (
    <View style={styles.connectorContainer}>
      <View style={styles.connectorTrack} />
      <Animated.View
        style={[
          styles.connectorFill,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      {steps.map((label, index) => (
        <React.Fragment key={index}>
          <StepDot label={label} index={index} currentStep={currentStep} />
          {index < steps.length - 1 && (
            <ConnectorLine completed={index < currentStep} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  stepItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotCompleted: {
    backgroundColor: colors.success,
  },
  dotNumber: {
    ...typography.smallMedium,
    color: colors.textTertiary,
  },
  dotNumberActive: {
    color: colors.primary,
  },
  stepLabel: {
    ...typography.small,
    color: colors.textTertiary,
    maxWidth: 64,
    textAlign: 'center' as const,
  },
  stepLabelActive: {
    color: colors.text,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  stepLabelCompleted: {
    color: colors.success,
  },
  connectorContainer: {
    flex: 1,
    height: 3,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.lg,
    position: 'relative' as const,
  },
  connectorTrack: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
  },
  connectorFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
});
