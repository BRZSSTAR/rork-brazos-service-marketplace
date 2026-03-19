import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { Clock } from 'lucide-react-native';

export default function ProviderActiveBookingScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.provider.activeBooking.title')}
      subtitle={t('placeholders.provider.activeBooking.subtitle')}
      icon={Clock}
    />
  );
}
