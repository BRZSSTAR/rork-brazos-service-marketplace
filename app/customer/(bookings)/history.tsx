import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { History } from 'lucide-react-native';

export default function BookingHistoryScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.history.title')}
      subtitle={t('placeholders.customer.history.subtitle')}
      icon={History}
    />
  );
}
