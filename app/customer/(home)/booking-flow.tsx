import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useAddressStore } from '@/store/addressStore';
import StepIndicator from '@/components/booking/StepIndicator';
import CpfStep from '@/components/booking/CpfStep';
import AddressStep from '@/components/booking/AddressStep';
import PaymentStep from '@/components/booking/PaymentStep';
import SummaryStep from '@/components/booking/SummaryStep';

export default function BookingFlowScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    providerId?: string;
    providerName?: string;
    serviceName?: string;
    serviceCategory?: string;
    scheduledAt?: string;
    durationMinutes?: string;
    totalCents?: string;
  }>();

  const getInitialStep = useBookingStore((s) => s.getInitialStep);
  const setDraft = useBookingStore((s) => s.setDraft);
  const hydrate = useBookingStore((s) => s.hydrate);
  const isHydrated = useBookingStore((s) => s.isHydrated);

  const hydrateAddresses = useAddressStore((s) => s.hydrate);
  const isAddressHydrated = useAddressStore((s) => s.isHydrated);

  const [currentStep, setCurrentStep] = useState<number>(0);

  useEffect(() => {
    if (!isHydrated) {
      void hydrate();
    }
    if (!isAddressHydrated) {
      void hydrateAddresses();
    }
  }, [isHydrated, hydrate, isAddressHydrated, hydrateAddresses]);

  useEffect(() => {
    if (!isHydrated || !isAddressHydrated) return;

    const initial = getInitialStep();
    console.log('[BookingFlow] Initial step:', initial, 'from params:', params);
    setCurrentStep(initial);

    setDraft({
      providerId: params.providerId ?? 'demo-provider-1',
      providerName: params.providerName ?? 'Maria Silva',
      serviceName: params.serviceName ?? t('booking.flow.demoService'),
      serviceCategory: (params.serviceCategory as 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF') ?? 'HOME',
      scheduledAt: params.scheduledAt ?? new Date(Date.now() + 86400000 * 3).toISOString(),
      durationMinutes: params.durationMinutes ? parseInt(params.durationMinutes, 10) : 120,
      totalCents: params.totalCents ? parseInt(params.totalCents, 10) : 15000,
      notes: '',
    });
  }, [isHydrated, isAddressHydrated, getInitialStep, setDraft, params, t]);

  const stepLabels = [
    t('booking.steps.cpf'),
    t('booking.steps.address'),
    t('booking.steps.payment'),
    t('booking.steps.summary'),
  ];

  const goNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }, []);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev <= 0) {
        router.back();
        return prev;
      }
      return prev - 1;
    });
  }, [router]);

  const handleConfirm = useCallback(() => {
    console.log('[BookingFlow] Booking confirmed!');
    Alert.alert(t('booking.summary.successTitle'), t('booking.summary.successMessage'), [
      {
        text: 'OK',
        onPress: () => {
          setDraft(null);
          router.back();
        },
      },
    ]);
  }, [router, setDraft, t]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CpfStep onNext={goNext} />;
      case 1:
        return <AddressStep onNext={goNext} onBack={goBack} />;
      case 2:
        return <PaymentStep onNext={goNext} onBack={goBack} />;
      case 3:
        return <SummaryStep onBack={goBack} onConfirm={handleConfirm} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: t('navigation.customerHome.bookingFlow'),
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerShadowVisible: false,
        }}
      />
      <StepIndicator steps={stepLabels} currentStep={currentStep} />
      <View style={styles.stepContent}>{renderStep()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  stepContent: {
    flex: 1,
  },
});
