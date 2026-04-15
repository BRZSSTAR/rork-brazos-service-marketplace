import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { Star } from 'lucide-react-native';

export default function ReviewScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.review.title')}
      subtitle={t('placeholders.customer.review.subtitle')}
      icon={Star}
    />
  );
}
