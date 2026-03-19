import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { LayoutGrid } from 'lucide-react-native';

export default function CategoryBrowseScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.customer.categoryBrowse.title')}
      subtitle={t('placeholders.customer.categoryBrowse.subtitle')}
      icon={LayoutGrid}
    />
  );
}
