import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { colors } from '@/constants/theme';

export default function CustomerTabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          ...(Platform.OS === 'web'
            ? {}
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }),
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_500Medium',
          fontSize: 11,
          fontWeight: '500' as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: t('tabs.customer.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(explore)"
        options={{
          title: t('tabs.customer.explore'),
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(bookings)"
        options={{
          title: t('tabs.customer.bookings'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: t('tabs.customer.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
