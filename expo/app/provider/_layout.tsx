import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Inbox, Calendar, Wallet, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';
import { Platform, StyleSheet } from 'react-native';

export default function ProviderTabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="(home)"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={85}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'rgba(255,255,255,0.55)',
          borderTopColor: 'rgba(229,231,235,0.3)',
          borderTopWidth: Platform.OS === 'web' ? 0 : StyleSheet.hairlineWidth,
          ...(Platform.OS === 'web'
            ? {}
            : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
              }),
          elevation: 0,
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
          title: t('tabs.provider.home'),
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(orders)"
        options={{
          title: t('tabs.provider.orders'),
          tabBarIcon: ({ color, size }) => <Inbox size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(schedule)"
        options={{
          title: t('tabs.provider.schedule'),
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(earnings)"
        options={{
          title: t('tabs.provider.earnings'),
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: t('tabs.provider.profile'),
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
