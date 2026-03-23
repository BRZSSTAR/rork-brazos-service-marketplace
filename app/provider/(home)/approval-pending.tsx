import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function ApprovalPendingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <View style={styles.outer}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaWrapper backgroundColor={colors.primary}>
        <View style={styles.container}>
          <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulseAnim }] }]}>
            <Clock size={56} color={colors.accent} />
          </Animated.View>

          <Text style={styles.title}>{t('onboarding.submitted.title')}</Text>
          <Text style={styles.subtitle}>{t('onboarding.submitted.subtitle')}</Text>

          <View style={styles.statusCard}>
            <ShieldCheck size={20} color={colors.accent} />
            <Text style={styles.statusText}>
              {user?.providerStatus === 'PENDING_APPROVAL'
                ? t('customer.profile.approvalPendingDesc')
                : t('customer.profile.approvalPendingDesc')}
            </Text>
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              title={t('onboarding.submitted.backToHome')}
              onPress={() => router.replace('/customer/(home)')}
              testID="approval-back-home"
            />
          </View>
        </View>
      </SafeAreaWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { flex: 1, backgroundColor: colors.primary },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.textInverse,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 12,
    marginTop: spacing.md,
  },
  statusText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    flex: 1,
  },
  footer: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
