import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { applyAppLanguage } from "@/i18n";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { useAuthStore } from "@/store/authStore";
import { colors } from "@/constants/theme";

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { t } = useTranslation();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="language" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="customer" options={{ headerShown: false }} />
      <Stack.Screen name="provider" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat"
        options={{
          presentation: "modal",
          headerShown: true,
          title: t('navigation.chatTitle'),
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.surface },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const loadStoredAuth = useAuthStore((s) => s.loadStoredAuth);
  const appLocale = useAuthStore((s) => s.appLocale);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    void loadStoredAuth();
  }, [loadStoredAuth]);

  useEffect(() => {
    if (!fontsLoaded || isLoading) {
      return;
    }

    void SplashScreen.hideAsync();
  }, [fontsLoaded, isLoading]);

  useEffect(() => {
    void applyAppLanguage(appLocale);
  }, [appLocale]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootLayoutNav />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
