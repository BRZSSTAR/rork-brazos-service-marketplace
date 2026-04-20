import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CheckCircle, Edit3, Zap, Target, Sparkles, Clock } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useProviderStore, DEFAULT_AVAILABILITY } from '@/store/providerStore';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import OnboardingStepIndicator from '@/components/onboarding/OnboardingStepIndicator';
import QualityScoreBar from '@/components/onboarding/QualityScoreBar';
import AccountStep from '@/components/onboarding/AccountStep';
import MultiCategoryStep from '@/components/onboarding/MultiCategoryStep';
import QuestionnaireStep from '@/components/onboarding/QuestionnaireStep';
import ServicesBuilderStep from '@/components/onboarding/ServicesBuilderStep';
import ProfileProStep from '@/components/onboarding/ProfileProStep';
import LocationCoverageStep from '@/components/onboarding/LocationCoverageStep';
import AvailabilityStep from '@/components/onboarding/AvailabilityStep';
import PayoutStep from '@/components/onboarding/PayoutStep';
import PoliciesStep from '@/components/onboarding/PoliciesStep';
import TrustStep from '@/components/onboarding/TrustStep';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { qualityScoreFromDraft } from '@/constants/ranking';
import type {
  AccountRegistration,
  BookingModel,
  CategorySelection,
  DayAvailability,
  PayoutSetup,
  ProviderPolicies,
  ProviderProfileDraft,
  ProviderService,
  QuestionnaireResponses,
  ServiceCoverage,
  TrustConsents,
  WeeklyAvailability,
} from '@/types';

type DayKey = keyof WeeklyAvailability;

type Phase = 'SIGNUP' | 'ACTIVATION' | 'ENHANCEMENT';

interface PhaseDef {
  id: Phase;
  steps: number[];
  icon: typeof Zap;
  color: string;
}

const STEP_ACCOUNT = 0;
const STEP_CATEGORIES = 1;
const STEP_TRUST = 2;
const STEP_PHASE1_COMPLETE = 3;
const STEP_QUESTIONNAIRE = 4;
const STEP_SERVICES = 5;
const STEP_COVERAGE = 6;
const STEP_AVAILABILITY = 7;
const STEP_PAYOUT = 8;
const STEP_PHASE2_COMPLETE = 9;
const STEP_PROFILE = 10;
const STEP_POLICIES = 11;
const STEP_VERIFICATION = 12;
const STEP_REVIEW = 13;

const TOTAL_STEPS = 14;

const PHASES: PhaseDef[] = [
  { id: 'SIGNUP', steps: [STEP_ACCOUNT, STEP_CATEGORIES, STEP_TRUST, STEP_PHASE1_COMPLETE], icon: Zap, color: '#C9A84C' },
  { id: 'ACTIVATION', steps: [STEP_QUESTIONNAIRE, STEP_SERVICES, STEP_COVERAGE, STEP_AVAILABILITY, STEP_PAYOUT, STEP_PHASE2_COMPLETE], icon: Target, color: '#2D8A5A' },
  { id: 'ENHANCEMENT', steps: [STEP_PROFILE, STEP_POLICIES, STEP_VERIFICATION, STEP_REVIEW], icon: Sparkles, color: '#8B6FE0' },
];

function phaseForStep(step: number): PhaseDef {
  return PHASES.find((p) => p.steps.includes(step)) ?? PHASES[0];
}

export default function OnboardingWizardScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setProviderStatus = useAuthStore((s) => s.setProviderStatus);
  const { onboardingDraft, updateOnboardingDraft, submitOnboarding } = useProviderStore();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const [account, setAccount] = useState<AccountRegistration>(
    onboardingDraft?.account ?? { type: 'MEI', cpf: onboardingDraft?.cpf }
  );
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
  const [payout, setPayout] = useState<PayoutSetup>(
    onboardingDraft?.payout ?? { pixKeyType: 'CPF' }
  );
  const [policies, setPolicies] = useState<ProviderPolicies>(
    onboardingDraft?.policies ?? { cancellation: 'MODERATE', languages: ['PT'] }
  );
  const [trust, setTrust] = useState<TrustConsents>(onboardingDraft?.trust ?? {});

  const currentPhase = phaseForStep(currentStep);
  const stepInPhase = currentPhase.steps.indexOf(currentStep);

  const primaryCategory = selections[0]?.category;
  const effectiveCpf = account.type === 'CPF' ? account.cpf : (account.cnpj ?? account.cpf);

  const enabledDaysCount = useMemo(
    () => (Object.keys(availability) as DayKey[]).filter((k) => availability[k].enabled).length,
    [availability]
  );

  const scoreBreakdown = useMemo(
    () =>
      qualityScoreFromDraft({
        cpf: account.cpf ?? effectiveCpf,
        categorySelections: selections,
        questionnaire,
        services,
        profile,
        coverage,
        bookingModel,
        availability,
      }),
    [account, effectiveCpf, selections, questionnaire, services, profile, coverage, bookingModel, availability]
  );

  const persistAll = useCallback(() => {
    void updateOnboardingDraft({
      cpf: account.cpf,
      account,
      categorySelections: selections,
      questionnaire,
      services,
      profile,
      coverage,
      bookingModel,
      availability,
      payout,
      policies,
      trust,
      category: selections[0]?.category,
      subcategory: selections[0]?.subcategoryIds[0],
      selectedServices: selections[0]?.serviceIds,
    });
  }, [account, selections, questionnaire, services, profile, coverage, bookingModel, availability, payout, policies, trust, updateOnboardingDraft]);

  const goNext = useCallback(() => {
    persistAll();
    setCurrentStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }, [persistAll]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
    else router.back();
  }, [currentStep, router]);

  const handleSaveForLater = useCallback(async () => {
    persistAll();
    await setProviderStatus('ONBOARDING');
    router.replace('/customer/(profile)');
  }, [persistAll, setProviderStatus, router]);

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
        cpf: account.cpf ?? effectiveCpf,
        account,
        categorySelections: selections,
        questionnaire,
        services,
        profile,
        coverage,
        bookingModel,
        availability,
        payout,
        policies,
        trust,
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
    } catch (error) {
      console.error('[Onboarding] Submit error:', error);
      Alert.alert('', t('onboarding.submitted.failure'));
    } finally {
      setIsSubmitting(false);
    }
  }, [user, account, effectiveCpf, selections, questionnaire, services, profile, coverage, bookingModel, availability, payout, policies, trust, updateOnboardingDraft, submitOnboarding, setProviderStatus, t]);

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
          <Pressable onPress={handleSaveForLater} hitSlop={12} style={styles.laterBtn}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={styles.laterText}>{t('onboarding.saveLater')}</Text>
          </Pressable>
        </View>

        <PhaseBanner phase={currentPhase} stepInPhase={stepInPhase} totalInPhase={currentPhase.steps.length} />

        <OnboardingStepIndicator
          currentStep={stepInPhase}
          totalSteps={currentPhase.steps.length}
          labels={currentPhase.steps.map(() => '')}
        />
        <QualityScoreBar breakdown={scoreBreakdown} />

        <View style={styles.stepContainer}>
          {currentStep === STEP_ACCOUNT && (
            <AccountStep
              account={account}
              onChange={(patch) => setAccount((a) => ({ ...a, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_CATEGORIES && (
            <MultiCategoryStep selections={selections} onChange={setSelections} onNext={goNext} />
          )}
          {currentStep === STEP_TRUST && (
            <TrustStep
              trust={trust}
              onChange={(patch) => setTrust((tr) => ({ ...tr, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_PHASE1_COMPLETE && (
            <PhaseCompleteScreen
              phase="SIGNUP"
              nextPhase="ACTIVATION"
              title={t('onboarding.phaseComplete.signupTitle')}
              subtitle={t('onboarding.phaseComplete.signupSubtitle')}
              continueLabel={t('onboarding.phaseComplete.continueActivation')}
              onContinue={goNext}
              onSaveLater={handleSaveForLater}
              saveLaterLabel={t('onboarding.phaseComplete.finishLater')}
            />
          )}
          {currentStep === STEP_QUESTIONNAIRE && (
            <QuestionnaireStep
              primaryCategory={primaryCategory}
              responses={questionnaire}
              onChange={setQuestionnaire}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_SERVICES && (
            <ServicesBuilderStep
              selections={selections}
              services={services}
              onChange={setServices}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_COVERAGE && (
            <LocationCoverageStep
              coverage={coverage}
              bookingModel={bookingModel}
              onChange={(patch) => setCoverage((c) => ({ ...c, ...patch }))}
              onChangeBookingModel={setBookingModel}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_AVAILABILITY && (
            <AvailabilityStep
              availability={availability}
              onUpdate={handleAvailabilityUpdate}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_PAYOUT && (
            <PayoutStep
              payout={payout}
              onChange={(patch) => setPayout((p) => ({ ...p, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_PHASE2_COMPLETE && (
            <PhaseCompleteScreen
              phase="ACTIVATION"
              nextPhase="ENHANCEMENT"
              title={t('onboarding.phaseComplete.activationTitle')}
              subtitle={t('onboarding.phaseComplete.activationSubtitle')}
              continueLabel={t('onboarding.phaseComplete.continueEnhancement')}
              onContinue={goNext}
              onSaveLater={() => setCurrentStep(STEP_REVIEW)}
              saveLaterLabel={t('onboarding.phaseComplete.submitNow')}
            />
          )}
          {currentStep === STEP_PROFILE && (
            <ProfileProStep
              profile={profile}
              onChange={(patch) => setProfile((p) => ({ ...p, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_POLICIES && (
            <PoliciesStep
              policies={policies}
              onChange={(patch) => setPolicies((p) => ({ ...p, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_VERIFICATION && (
            <TrustStep
              trust={trust}
              onChange={(patch) => setTrust((tr) => ({ ...tr, ...patch }))}
              onNext={goNext}
            />
          )}
          {currentStep === STEP_REVIEW && (
            <ScrollView
              style={styles.reviewContainer}
              contentContainerStyle={styles.reviewContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.reviewTitle}>{t('onboarding.review.title')}</Text>
              <Text style={styles.reviewSubtitle}>{t('onboarding.review.subtitle')}</Text>

              <View style={styles.reviewCard}>
                <ReviewItem
                  label={t('onboarding.review.accountLabel')}
                  value={`${account.type} · ${account.type === 'CPF' ? (account.cpf ?? '—') : (account.razaoSocial ?? account.cnpj ?? '—')}`}
                  onEdit={() => setCurrentStep(STEP_ACCOUNT)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.categoriesLabel')}
                  value={`${selections.length} · ${selections.reduce((acc, s) => acc + s.serviceIds.length, 0)} services`}
                  onEdit={() => setCurrentStep(STEP_CATEGORIES)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.questionnaireLabel')}
                  value={`${Object.keys(questionnaire).length} answered`}
                  onEdit={() => setCurrentStep(STEP_QUESTIONNAIRE)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.servicesLabel')}
                  value={`${services.length} services · ${services.reduce((acc, s) => acc + s.addOns.length, 0)} add-ons`}
                  onEdit={() => setCurrentStep(STEP_SERVICES)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.profileLabel')}
                  value={profile.bio ? `${(profile.bio ?? '').slice(0, 80)}...` : t('onboarding.review.incomplete')}
                  onEdit={() => setCurrentStep(STEP_PROFILE)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.coverageLabel')}
                  value={`${coverage.city ?? '—'} · ${coverage.radiusKm ?? 0}km · ${bookingModel === 'INSTANT' ? t('onboarding.coverage.instantTitle') : t('onboarding.coverage.requestTitle')}`}
                  onEdit={() => setCurrentStep(STEP_COVERAGE)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.availabilityLabel')}
                  value={`${enabledDaysCount} days/week`}
                  onEdit={() => setCurrentStep(STEP_AVAILABILITY)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.payoutLabel')}
                  value={payout.pixKey ? `Pix · ${payout.pixKeyType} · ${payout.pixKey.slice(0, 12)}...` : t('onboarding.review.incomplete')}
                  onEdit={() => setCurrentStep(STEP_PAYOUT)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.policiesLabel')}
                  value={`${t(`onboarding.policies.cancellation.${policies.cancellation ?? 'MODERATE'}.title`)} · ${(policies.languages ?? ['PT']).join(', ')}`}
                  onEdit={() => setCurrentStep(STEP_POLICIES)}
                />
                <Divider />
                <ReviewItem
                  label={t('onboarding.review.trustLabel')}
                  value={trust.lgpdAccepted && trust.tosAccepted ? t('onboarding.review.accepted') : t('onboarding.review.incomplete')}
                  onEdit={() => setCurrentStep(STEP_TRUST)}
                />
              </View>

              <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>{t('onboarding.review.qualityScoreLabel')}</Text>
                <Text style={styles.scoreValue}>{scoreBreakdown.percent}%</Text>
                <Text style={styles.scoreHint}>{t('onboarding.review.qualityScoreHint')}</Text>
              </View>

              <View style={{ marginTop: spacing.lg }}>
                <PrimaryButton
                  title={t('onboarding.review.submit')}
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  disabled={!trust.lgpdAccepted || !trust.tosAccepted}
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

function PhaseBanner({
  phase,
  stepInPhase,
  totalInPhase,
}: {
  phase: PhaseDef;
  stepInPhase: number;
  totalInPhase: number;
}) {
  const { t } = useTranslation();
  const PhaseIcon = phase.icon;
  return (
    <View style={styles.phaseBannerWrap}>
      <View style={styles.phaseRow}>
        {PHASES.map((p, i) => {
          const active = p.id === phase.id;
          const Icon = p.icon;
          return (
            <View key={p.id} style={styles.phasePillRow}>
              <View
                style={[
                  styles.phasePill,
                  active && { backgroundColor: p.color + '18', borderColor: p.color },
                ]}
              >
                <Icon size={12} color={active ? p.color : colors.textTertiary} strokeWidth={2.2} />
                <Text
                  style={[
                    styles.phasePillText,
                    active && { color: p.color, fontWeight: '700' as const },
                  ]}
                >
                  {t(`onboarding.phases.${p.id}.short`)}
                </Text>
              </View>
              {i < PHASES.length - 1 ? <View style={styles.phaseConnector} /> : null}
            </View>
          );
        })}
      </View>
      <View style={styles.phaseHeaderCard}>
        <View style={[styles.phaseIconWrap, { backgroundColor: phase.color + '18' }]}>
          <PhaseIcon size={16} color={phase.color} strokeWidth={2.2} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.phaseTitle, { color: phase.color }]}>
            {t(`onboarding.phases.${phase.id}.title`)}
          </Text>
          <Text style={styles.phaseSubtitle}>{t(`onboarding.phases.${phase.id}.subtitle`)}</Text>
        </View>
        <Text style={styles.phaseCounter}>
          {stepInPhase + 1}/{totalInPhase}
        </Text>
      </View>
    </View>
  );
}

function PhaseCompleteScreen({
  phase,
  nextPhase,
  title,
  subtitle,
  continueLabel,
  onContinue,
  onSaveLater,
  saveLaterLabel,
}: {
  phase: Phase;
  nextPhase: Phase;
  title: string;
  subtitle: string;
  continueLabel: string;
  onContinue: () => void;
  onSaveLater: () => void;
  saveLaterLabel: string;
}) {
  const current = PHASES.find((p) => p.id === phase) ?? PHASES[0];
  const next = PHASES.find((p) => p.id === nextPhase) ?? PHASES[1];
  const NextIcon = next.icon;

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.phaseCompleteContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.phaseCompleteIcon, { backgroundColor: current.color + '1A' }]}>
        <CheckCircle size={56} color={current.color} strokeWidth={2} />
      </View>
      <Text style={styles.phaseCompleteTitle}>{title}</Text>
      <Text style={styles.phaseCompleteSubtitle}>{subtitle}</Text>

      <View style={[styles.nextPhaseCard, { borderColor: next.color + '40' }]}>
        <View style={[styles.nextPhaseIcon, { backgroundColor: next.color + '15' }]}>
          <NextIcon size={20} color={next.color} />
        </View>
        <Text style={[styles.nextPhaseLabel, { color: next.color }]}>
          {phase === 'SIGNUP' ? 'Próxima fase' : 'Opcional'}
        </Text>
        <Text style={styles.nextPhaseTitle}>
          {/* reuse via t in consumer */}
        </Text>
      </View>

      <View style={styles.phaseCompleteActions}>
        <PrimaryButton title={continueLabel} onPress={onContinue} testID={`phase-complete-${phase}`} />
        <Pressable onPress={onSaveLater} style={styles.phaseLaterBtn}>
          <Text style={styles.phaseLaterText}>{saveLaterLabel}</Text>
        </Pressable>
      </View>
    </ScrollView>
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
        <Text style={styles.reviewRowValue} numberOfLines={2}>{value}</Text>
      </View>
      <Pressable onPress={onEdit} hitSlop={8} style={styles.editBtn}>
        <Edit3 size={16} color={colors.accent} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  outerContainer: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { ...typography.h3, color: colors.text },
  laterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    height: 40,
  },
  laterText: { ...typography.small, color: colors.textSecondary },
  stepContainer: { flex: 1 },

  phaseBannerWrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  phaseRow: { flexDirection: 'row', alignItems: 'center' },
  phasePillRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  phasePillText: { ...typography.small, fontSize: 11, color: colors.textTertiary },
  phaseConnector: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  phaseHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  phaseIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  phaseTitle: { ...typography.captionMedium, fontWeight: '700' as const },
  phaseSubtitle: { ...typography.small, color: colors.textSecondary, marginTop: 1 },
  phaseCounter: { ...typography.smallMedium, color: colors.textTertiary },

  phaseCompleteContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  phaseCompleteIcon: {
    width: 110, height: 110, borderRadius: 55,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  phaseCompleteTitle: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.sm },
  phaseCompleteSubtitle: {
    ...typography.body, color: colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: spacing.xl, paddingHorizontal: spacing.sm,
  },
  nextPhaseCard: {
    width: '100%',
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    padding: spacing.md,
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    gap: 6,
    ...shadow.sm,
  },
  nextPhaseIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  nextPhaseLabel: { ...typography.small, fontWeight: '700' as const, letterSpacing: 0.5, textTransform: 'uppercase' },
  nextPhaseTitle: { ...typography.bodyMedium, color: colors.text },
  phaseCompleteActions: { width: '100%', gap: spacing.sm },
  phaseLaterBtn: { paddingVertical: spacing.sm, alignItems: 'center' },
  phaseLaterText: { ...typography.captionMedium, color: colors.accent },

  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  successIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(201, 168, 76, 0.15)',
    alignItems: 'center', justifyContent: 'center',
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
  reviewTitle: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  reviewSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
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
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border, marginVertical: spacing.xs },
  scoreCard: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: { ...typography.caption, color: 'rgba(255,255,255,0.7)' },
  scoreValue: { fontSize: 40, fontWeight: '700' as const, fontFamily: 'Inter_700Bold', color: colors.accent },
  scoreHint: { ...typography.small, color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 4 },
});
