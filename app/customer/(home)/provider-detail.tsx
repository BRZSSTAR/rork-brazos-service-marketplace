import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { UserCheck } from 'lucide-react-native';

export default function ProviderDetailScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.providerDetail.title')}
      subtitle={t('placeholders.customer.providerDetail.subtitle')}
      icon={UserCheck}
    />
  );
}
