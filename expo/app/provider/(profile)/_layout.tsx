import React from 'react';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function ProviderProfileStack() {
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
      <Stack.Screen name="index" options={{ title: t('navigation.providerProfile.root') }} />
      <Stack.Screen name="subscription" options={{ title: 'Planos & Comissão' }} />
      <Stack.Screen name="promote" options={{ title: 'Impulsionar perfil' }} />
      <Stack.Screen name="share" options={{ title: 'Compartilhar perfil' }} />
    </Stack>
  );
}
