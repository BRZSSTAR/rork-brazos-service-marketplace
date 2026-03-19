import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function ProviderScheduleStack() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: t('navigation.providerSchedule.root') }} />
    </Stack>
  );
}
