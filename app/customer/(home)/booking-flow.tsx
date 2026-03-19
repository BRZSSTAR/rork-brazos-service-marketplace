import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { CalendarPlus } from 'lucide-react-native';

export default function BookingFlowScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.bookingFlow.title')}
      subtitle={t('placeholders.customer.bookingFlow.subtitle')}
      icon={CalendarPlus}
    />
  );
}
