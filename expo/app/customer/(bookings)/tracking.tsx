import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { MapPin } from 'lucide-react-native';

export default function TrackingScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.tracking.title')}
      subtitle={t('placeholders.customer.tracking.subtitle')}
      icon={MapPin}
    />
  );
}
