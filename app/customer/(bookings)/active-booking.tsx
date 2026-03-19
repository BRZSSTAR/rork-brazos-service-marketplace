import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { Clock } from 'lucide-react-native';

export default function ActiveBookingScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.activeBooking.title')}
      subtitle={t('placeholders.customer.activeBooking.subtitle')}
      icon={Clock}
    />
  );
}
