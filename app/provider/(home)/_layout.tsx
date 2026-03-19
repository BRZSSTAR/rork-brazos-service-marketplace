import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function ProviderHomeStack() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
        headerShadowVisible: false,
        headerBackTitle: t('common.back'),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding-wizard" options={{ title: t('navigation.providerHome.onboardingWizard') }} />
      <Stack.Screen name="approval-pending" options={{ title: t('navigation.providerHome.approvalPending'), headerBackVisible: false }} />
    </Stack>
  );
}
