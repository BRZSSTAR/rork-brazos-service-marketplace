import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { ClipboardList } from 'lucide-react-native';

export default function OnboardingWizardScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.provider.onboardingWizard.title')}
      subtitle={t('placeholders.provider.onboardingWizard.subtitle')}
      icon={ClipboardList}
    />
  );
}
