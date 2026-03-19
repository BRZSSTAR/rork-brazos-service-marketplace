import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { CalendarDays } from 'lucide-react-native';

export default function ScheduleScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.provider.schedule.title')}
      subtitle={t('placeholders.provider.schedule.subtitle')}
      icon={CalendarDays}
    />
  );
}
