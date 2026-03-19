import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { ShieldCheck } from 'lucide-react-native';

export default function ApprovalPendingScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.provider.approvalPending.title')}
      subtitle={t('placeholders.provider.approvalPending.subtitle')}
      icon={ShieldCheck}
    />
  );
}
