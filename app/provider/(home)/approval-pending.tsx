import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Pressable, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProviderStore } from '@/store/providerStore';
import { colors, spacing, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function ApprovalPendingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setProviderStatus = useAuthStore((s) => s.setProviderStatus);
  const setActiveMode = useAuthStore((s) => s.setActiveMode);
  const updateProfile = useProviderStore((s) => s.updateProfile);
  const [approving, setApproving] = useState(false);
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

          <Pressable
            style={[styles.approveButton, approving && styles.approveButtonDisabled]}
            onPress={async () => {
              try {
                setApproving(true);
                console.log('[Approval] Manually approving provider...');
                await setProviderStatus('APPROVED');
                await updateProfile({ status: 'APPROVED' });
                await setActiveMode('provider');
                console.log('[Approval] Provider approved, redirecting...');
                router.replace('/provider/(home)');
              } catch (err) {
                console.error('[Approval] Error:', err);
                Alert.alert('Error', 'Failed to approve. Try again.');
                setApproving(false);
              }
            }}
            disabled={approving}
          >
            <CheckCircle size={20} color="#fff" />
            <Text style={styles.approveButtonText}>
              {approving ? 'Approving...' : 'Dev: Approve Now'}
            </Text>
          </Pressable>

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
    marginTop: spacing.md,
  },
  approveButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: spacing.sm,
    backgroundColor: '#10B981',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    marginTop: spacing.xl,
  },
  approveButtonDisabled: {
    opacity: 0.6,
  },
  approveButtonText: {
    ...typography.bodyMedium,
    color: '#fff',
    fontWeight: '600' as const,
  },
});
