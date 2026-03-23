import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProviderStore, DEFAULT_AVAILABILITY } from '@/store/providerStore';
import { colors, spacing, typography } from '@/constants/theme';
import OnboardingStepIndicator from '@/components/onboarding/OnboardingStepIndicator';
import CategoryStep from '@/components/onboarding/CategoryStep';
import DetailsStep from '@/components/onboarding/DetailsStep';
import PricingStep from '@/components/onboarding/PricingStep';
import AvailabilityStep from '@/components/onboarding/AvailabilityStep';
import ReviewStep from '@/components/onboarding/ReviewStep';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import type { ServiceCategory, WeeklyAvailability, DayAvailability } from '@/types';

type DayKey = keyof WeeklyAvailability;

const TOTAL_STEPS = 5;

export default function OnboardingWizardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setProviderStatus = useAuthStore((s) => s.setProviderStatus);
  const { onboardingDraft, updateOnboardingDraft, submitOnboarding } = useProviderStore();

  const [currentStep, setCurrentStep] = useState<number>(() => {
    return useProviderStore.getState().getOnboardingStep();
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [category, setCategory] = useState<ServiceCategory | undefined>(onboardingDraft?.category);
  const [serviceTitle, setServiceTitle] = useState<string>(onboardingDraft?.serviceTitle ?? '');
  const [description, setDescription] = useState<string>(onboardingDraft?.description ?? '');
  const [serviceArea, setServiceArea] = useState<string>(onboardingDraft?.serviceArea ?? '');
  const [yearsExperience, setYearsExperience] = useState<number>(onboardingDraft?.yearsExperience ?? 0);
  const [pricePerHourCents, setPricePerHourCents] = useState<number>(onboardingDraft?.pricePerHourCents ?? 0);
  const [availability, setAvailability] = useState<WeeklyAvailability>(onboardingDraft?.availability ?? DEFAULT_AVAILABILITY);

  const stepLabels = [
    t('onboarding.steps.category'),
    t('onboarding.steps.details'),
    t('onboarding.steps.pricing'),
    t('onboarding.steps.availability'),
    t('onboarding.steps.review'),
  ];

  const goNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const handleCategorySelect = useCallback((cat: ServiceCategory) => {
    setCategory(cat);
    void updateOnboardingDraft({ category: cat });
  }, [updateOnboardingDraft]);

  const handleCategoryNext = useCallback(() => {
    if (category) {
      void updateOnboardingDraft({ category });
      goNext();
    }
  }, [category, updateOnboardingDraft, goNext]);

  const handleDetailsNext = useCallback(() => {
    void updateOnboardingDraft({ serviceTitle, description, serviceArea, yearsExperience });
    goNext();
  }, [serviceTitle, description, serviceArea, yearsExperience, updateOnboardingDraft, goNext]);

  const handlePricingNext = useCallback(() => {
    void updateOnboardingDraft({ pricePerHourCents });
    goNext();
  }, [pricePerHourCents, updateOnboardingDraft, goNext]);

  const handleAvailabilityUpdate = useCallback((day: DayKey, updates: Partial<DayAvailability>) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  }, []);

  const handleAvailabilityNext = useCallback(() => {
    void updateOnboardingDraft({ availability });
    goNext();
  }, [availability, updateOnboardingDraft, goNext]);

  const handleEditStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!user?.id || !category) return;

    setIsSubmitting(true);
    try {
      await updateOnboardingDraft({
        category,
        serviceTitle,
        description,
        serviceArea,
        yearsExperience,
        pricePerHourCents,
        availability,
      });
      await submitOnboarding(user.id);
      await setProviderStatus('PENDING_APPROVAL');
      setIsSubmitted(true);
      console.log('[Onboarding] Submitted successfully');
    } catch (error) {
      console.error('[Onboarding] Submit error:', error);
      Alert.alert('Error', 'Could not submit your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, category, serviceTitle, description, serviceArea, yearsExperience, pricePerHourCents, availability, updateOnboardingDraft, submitOnboarding, setProviderStatus]);

  if (isSubmitted) {
    return (
      <View style={styles.outerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaWrapper backgroundColor={colors.primary}>
          <View style={styles.successContainer}>
            <View style={styles.successIconWrap}>
              <CheckCircle size={64} color={colors.accent} />
            </View>
            <Text style={styles.successTitle}>{t('onboarding.submitted.title')}</Text>
            <Text style={styles.successSubtitle}>{t('onboarding.submitted.subtitle')}</Text>
            <View style={styles.successFooter}>
              <PrimaryButton
                title={t('onboarding.submitted.backToHome')}
                onPress={() => router.replace('/customer/(home)')}
                testID="onboarding-back-home"
              />
            </View>
          </View>
        </SafeAreaWrapper>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaWrapper backgroundColor={colors.surface}>
        <View style={styles.header}>
          <Pressable onPress={goBack} style={styles.backButton} hitSlop={12}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('onboarding.title')}</Text>
          <View style={styles.backButton} />
        </View>

        <OnboardingStepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} labels={stepLabels} />

        <View style={styles.stepContainer}>
          {currentStep === 0 && (
            <CategoryStep
              selected={category}
              onSelect={handleCategorySelect}
              onNext={handleCategoryNext}
            />
          )}
          {currentStep === 1 && (
            <DetailsStep
              serviceTitle={serviceTitle}
              description={description}
              serviceArea={serviceArea}
              yearsExperience={yearsExperience}
              onChangeTitle={setServiceTitle}
              onChangeDescription={setDescription}
              onChangeArea={setServiceArea}
              onChangeExperience={setYearsExperience}
              onNext={handleDetailsNext}
            />
          )}
          {currentStep === 2 && (
            <PricingStep
              pricePerHourCents={pricePerHourCents}
              onChangePrice={setPricePerHourCents}
              onNext={handlePricingNext}
            />
          )}
          {currentStep === 3 && (
            <AvailabilityStep
              availability={availability}
              onUpdate={handleAvailabilityUpdate}
              onNext={handleAvailabilityNext}
            />
          )}
          {currentStep === 4 && category && (
            <ReviewStep
              category={category}
              serviceTitle={serviceTitle}
              description={description}
              serviceArea={serviceArea}
              yearsExperience={yearsExperience}
              pricePerHourCents={pricePerHourCents}
              availability={availability}
              onEdit={handleEditStep}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </View>
      </SafeAreaWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  stepContainer: { flex: 1 },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  successIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  successTitle: {
    ...typography.h1,
    color: colors.textInverse,
    textAlign: 'center',
  },
  successSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  successFooter: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
