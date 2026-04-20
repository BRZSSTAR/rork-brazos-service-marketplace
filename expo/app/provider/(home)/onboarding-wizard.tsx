import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CheckCircle, Edit3 } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProviderStore, DEFAULT_AVAILABILITY } from '@/store/providerStore';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import OnboardingStepIndicator from '@/components/onboarding/OnboardingStepIndicator';
import QualityScoreBar from '@/components/onboarding/QualityScoreBar';
import ProviderCpfStep from '@/components/onboarding/CpfStep';
import MultiCategoryStep from '@/components/onboarding/MultiCategoryStep';
import QuestionnaireStep from '@/components/onboarding/QuestionnaireStep';
import ServicesBuilderStep from '@/components/onboarding/ServicesBuilderStep';
import ProfileProStep from '@/components/onboarding/ProfileProStep';
import LocationCoverageStep from '@/components/onboarding/LocationCoverageStep';
import AvailabilityStep from '@/components/onboarding/AvailabilityStep';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { qualityScoreFromDraft } from '@/constants/ranking';
import type {
  BookingModel,
  CategorySelection,
  DayAvailability,
  ProviderProfileDraft,
  ProviderService,
  QuestionnaireResponses,
  ServiceCoverage,
  WeeklyAvailability,
} from '@/types';

type DayKey = keyof WeeklyAvailability;

const TOTAL_STEPS = 8;

export default function OnboardingWizardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setProviderStatus = useAuthStore((s) => s.setProviderStatus);
  const { onboardingDraft, updateOnboardingDraft, submitOnboarding } = useProviderStore();

  const [currentStep, setCurrentStep] = useState<number>(() =>
    Math.min(useProviderStore.getState().getOnboardingStep(), TOTAL_STEPS - 1)
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [cpf, setCpf] = useState<string>(onboardingDraft?.cpf ?? '');
  const [selections, setSelections] = useState<CategorySelection[]>(
    onboardingDraft?.categorySelections ?? []
  );
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponses>(
    onboardingDraft?.questionnaire ?? {}
  );
  const [services, setServices] = useState<ProviderService[]>(
    onboardingDraft?.services ?? []
  );
  const [profile, setProfile] = useState<ProviderProfileDraft>(
    onboardingDraft?.profile ?? {}
  );
  const [coverage, setCoverage] = useState<ServiceCoverage>(
    onboardingDraft?.coverage ?? {}
  );
  const [bookingModel, setBookingModel] = useState<BookingModel>(
    onboardingDraft?.bookingModel ?? 'REQUEST'
  );
  const [availability, setAvailability] = useState<WeeklyAvailability>(
    onboardingDraft?.availability ?? DEFAULT_AVAILABILITY
  );

  const stepLabels = [
    t('onboarding.steps.account'),
    t('onboarding.steps.categories'),
    t('onboarding.steps.questionnaire'),
    t('onboarding.steps.services'),
    t('onboarding.steps.profile'),
    t('onboarding.steps.location'),
    t('onboarding.steps.availability'),
    t('onboarding.steps.review'),
  ];

  const primaryCategory = selections[0]?.category;

  const enabledDaysCount = useMemo(
    () =>
      (Object.keys(availability) as DayKey[]).filter((k) => availability[k].enabled)
        .length,
    [availability]
  );

  const scoreBreakdown = useMemo(
    () =>
      qualityScoreFromDraft({
        cpf,
        categorySelections: selections,
        questionnaire,
        services,
        profile,
        coverage,
        bookingModel,
        availability,
      }),
    [cpf, selections, questionnaire, services, profile, coverage, bookingModel, availability]
  );

  const persistAll = useCallback(() => {
    void updateOnboardingDraft({
      cpf,
      categorySelections: selections,
      questionnaire,
      services,
      profile,
      coverage,
      bookingModel,
      availability,
      category: selections[0]?.category,
      subcategory: selections[0]?.subcategoryIds[0],
      selectedServices: selections[0]?.serviceIds,
    });
  }, [cpf, selections, questionnaire, services, profile, coverage, bookingModel, availability, updateOnboardingDraft]);

  const goNext = useCallback(() => {
    persistAll();
    setCurrentStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }, [persistAll]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const handleAvailabilityUpdate = useCallback(
    (day: DayKey, updates: Partial<DayAvailability>) => {
      setAvailability((prev) => ({ ...prev, [day]: { ...prev[day], ...updates } }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    if (!user?.id) return;
    setIsSubmitting(true);
    try {
      await updateOnboardingDraft({
        cpf,
        categorySelections: selections,
        questionnaire,
        services,
        profile,
        coverage,
        bookingModel,
        availability,
        category: selections[0]?.category,
        subcategory: selections[0]?.subcategoryIds[0],
        selectedServices: selections[0]?.serviceIds,
        serviceTitle: services[0]?.title,
        description: services[0]?.description ?? profile.bio,
        pricePerHourCents: services[0]?.priceCents,
        serviceArea: coverage.city,
        yearsExperience: profile.yearsExperience,
      });
      await submitOnboarding(user.id);
      await setProviderStatus('PENDING_APPROVAL');
      setIsSubmitted(true);
      console.log('[Onboarding] Submitted');
    } catch (error) {
      console.error('[Onboarding] Submit error:', error);
      Alert.alert('', t('onboarding.submitted.failure'));
    } finally {
      setIsSubmitting(false);
    }
  }, [user, cpf, selections, questionnaire, services, profile, coverage, bookingModel, availability, updateOnboardingDraft, submitOnboarding, setProviderStatus, t]);

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
            <Text style={styles.successSubtitle}>
              {t('onboarding.submitted.subtitle')}
            </Text>
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

        <OnboardingStepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={stepLabels}
        />
        <QualityScoreBar breakdown={scoreBreakdown} />

        <View style={styles.stepContainer}>
          {currentStep === 0 && (
            <ProviderCpfStep cpf={cpf} onChangeCpf={setCpf} onNext={goNext} />
          )}
          {currentStep === 1 && (
            <MultiCategoryStep
              selections={selections}
              onChange={setSelections}
              onNext={goNext}
            />
          )}
          {currentStep === 2 && (
            <QuestionnaireStep
              primaryCategory={primaryCategory}
              responses={questionnaire}
              onChange={setQuestionnaire}
              onNext={goNext}
            />
          )}
          {currentStep === 3 && (
            <ServicesBuilderStep
              selections={selections}
              services={services}
              onChange={setServices}
              onNext={goNext}
            />
          )}
          {currentStep === 4 && (
            <ProfileProStep
              profile={profile}
              onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === 5 && (
            <LocationCoverageStep
              coverage={coverage}
              bookingModel={bookingModel}
              onChange={(patch) => setCoverage((c) => ({ ...c, ...patch }))}
              onChangeBookingModel={setBookingModel}
              onNext={goNext}
            />
          )}
          {currentStep === 6 && (
            <AvailabilityStep
              availability={availability}
              onUpdate={handleAvailabilityUpdate}
              onNext={goNext}
            />
          )}
          {currentStep === 7 && (
            <ScrollView
              style={styles.reviewContainer}
              contentContainerStyle={styles.reviewContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.reviewTitle}>{t('onboarding.review.title')}</Text>
              <Text style={styles.reviewSubtitle}>
                {t('onboarding.review.subtitle')}
              </Text>

              <View style={styles.reviewCard}>
                <ReviewItem
                  label={t('onboarding.review.categoriesLabel')}
                  value={`${selections.length} · ${selections.reduce(
                    (acc, s) => acc + s.serviceIds.length,
                    0
                  )} services`}
                  onEdit={() => setCurrentStep(1)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.questionnaireLabel')}
                  value={`${Object.keys(questionnaire).length} answered`}
                  onEdit={() => setCurrentStep(2)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.servicesLabel')}
                  value={`${services.length} services · ${services.reduce(
                    (acc, s) => acc + s.addOns.length,
                    0
                  )} add-ons`}
                  onEdit={() => setCurrentStep(3)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.profileLabel')}
                  value={
                    profile.bio
                      ? `${(profile.bio ?? '').slice(0, 80)}...`
                      : t('onboarding.review.incomplete')
                  }
                  onEdit={() => setCurrentStep(4)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.coverageLabel')}
                  value={`${coverage.city ?? '—'} · ${coverage.radiusKm ?? 0}km · ${
                    bookingModel === 'INSTANT'
                      ? t('onboarding.coverage.instantTitle')
                      : t('onboarding.coverage.requestTitle')
                  }`}
                  onEdit={() => setCurrentStep(5)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.availabilityLabel')}
                  value={`${enabledDaysCount} days/week`}
                  onEdit={() => setCurrentStep(6)}
                />
              </View>

              <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>
                  {t('onboarding.review.qualityScoreLabel')}
                </Text>
                <Text style={styles.scoreValue}>{scoreBreakdown.percent}%</Text>
                <Text style={styles.scoreHint}>
                  {t('onboarding.review.qualityScoreHint')}
                </Text>
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <PrimaryButton
                  title={t('onboarding.review.submit')}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  testID="onboarding-submit"
                />
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaWrapper>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function ReviewItem({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <View style={styles.reviewRow}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={styles.reviewRowLabel}>{label}</Text>
        <Text style={styles.reviewRowValue} numberOfLines={2}>
          {value}
        </Text>
      </View>
      <Pressable onPress={onEdit} hitSlop={8} style={styles.editBtn}>
        <Edit3 size={16} color={colors.accent} />
      </Pressable>
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
  headerTitle: { ...typography.h3, color: colors.text },
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
  successTitle: { ...typography.h1, color: colors.textInverse, textAlign: 'center' },
  successSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  successFooter: { width: '100%', marginTop: spacing.xl },
  reviewContainer: { flex: 1 },
  reviewContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  reviewTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  reviewSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  reviewCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.md,
  },
  reviewRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm },
  reviewRowLabel: { ...typography.small, color: colors.textTertiary },
  reviewRowValue: { ...typography.body, color: colors.text },
  editBtn: { padding: spacing.xs },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  scoreCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  scoreValue: {
    fontSize: 40,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    color: colors.accent,
  },
  scoreHint: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 4,
  },
});
