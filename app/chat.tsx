import React from 'react';
import { useTranslation } from 'react-i18next';
import PlaceholderScreen from '@/components/PlaceholderScreen';
import { MessageCircle } from 'lucide-react-native';

export default function ChatScreen() {
  const { t } = useTranslation();

  return (
    <PlaceholderScreen
      title={t('placeholders.chat.title')}
      subtitle={t('placeholders.chat.subtitle')}
      icon={MessageCircle}
    />
  );
}
