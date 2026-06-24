import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';

export default function CustomerTabLayout() {
  const { t } = useTranslation();

  return (
    <View style={layoutStyles.container}>
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
    </View>
  );
}

const layoutStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
