import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { colors, typography, spacing } from '@/constants/theme';

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isLoading, user, hasSelectedLanguage } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    console.log('[Router] Auth state:', { isAuthenticated, role: user?.role });

    if (!hasSelectedLanguage) {
      router.replace('/language');
      return;
    }

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    const { activeMode } = useAuthStore.getState();
    if (activeMode === 'provider' && user?.providerStatus === 'APPROVED') {
      router.replace('/provider/(home)');
    } else {
      router.replace('/customer/(home)');
    }
  }, [hasSelectedLanguage, isLoading, isAuthenticated, user, router]);

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.logo}>{t('common.appName')}</Text>
        <Text style={styles.tagline}>{t('bootstrap.tagline')}</Text>
      </View>
      <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    fontSize: 42,
    fontWeight: '700' as const,
    color: colors.logo,
    letterSpacing: 6,
    fontFamily: 'Inter_700Bold',
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
  },
  loader: {
    marginTop: spacing.xxl,
  },
});
