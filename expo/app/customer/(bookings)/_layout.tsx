import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function CustomerBookingsStack() {
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
      <Stack.Screen name="index" options={{ title: t('navigation.customerBookings.root') }} />
      <Stack.Screen name="active-booking" options={{ title: t('navigation.customerBookings.activeBooking') }} />
      <Stack.Screen name="tracking" options={{ title: t('navigation.customerBookings.tracking') }} />
      <Stack.Screen name="history" options={{ title: t('navigation.customerBookings.history') }} />
      <Stack.Screen name="review" options={{ title: t('navigation.customerBookings.review') }} />
    </Stack>
  );
}
