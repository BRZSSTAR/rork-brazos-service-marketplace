import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function CustomerHomeStack() {
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
      <Stack.Screen name="category-browse" options={{ title: t('navigation.customerHome.categoryBrowse') }} />
      <Stack.Screen name="provider-detail" options={{ title: t('navigation.customerHome.providerDetail') }} />
      <Stack.Screen name="booking-flow" options={{ title: t('navigation.customerHome.bookingFlow') }} />
    </Stack>
  );
}
