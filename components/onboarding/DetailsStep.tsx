import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';

interface DetailsStepProps {
  serviceTitle: string;
  description: string;
  serviceArea: string;
  yearsExperience: number;
  onChangeTitle: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangeArea: (v: string) => void;
  onChangeExperience: (v: number) => void;
  onNext: () => void;
}

export default function DetailsStep({
  serviceTitle,
  description,
  serviceArea,
  yearsExperience,
  onChangeTitle,
  onChangeDescription,
  onChangeArea,
  onChangeExperience,
  onNext,
}: DetailsStepProps) {
  const { t } = useTranslation();
  const canContinue = serviceTitle.trim().length >= 3 && description.trim().length >= 10;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={120}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('onboarding.details.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.details.subtitle')}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{t('onboarding.details.serviceTitleLabel')}</Text>
          <TextInput
            style={styles.input}
            value={serviceTitle}
            onChangeText={onChangeTitle}
            placeholder={t('onboarding.details.serviceTitlePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            maxLength={80}
            testID="onboarding-service-title"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('onboarding.details.descriptionLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={onChangeDescription}
            placeholder={t('onboarding.details.descriptionPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
            testID="onboarding-description"
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('onboarding.details.serviceAreaLabel')}</Text>
          <TextInput
            style={styles.input}
            value={serviceArea}
            onChangeText={onChangeArea}
            placeholder={t('onboarding.details.serviceAreaPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            maxLength={100}
            testID="onboarding-service-area"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t('onboarding.details.experienceLabel')}</Text>
          <View style={styles.experienceRow}>
            <TextInput
              style={[styles.input, styles.experienceInput]}
              value={yearsExperience > 0 ? String(yearsExperience) : ''}
              onChangeText={(v) => {
                const num = parseInt(v.replace(/\D/g, ''), 10);
                onChangeExperience(isNaN(num) ? 0 : Math.min(num, 50));
              }}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={2}
              testID="onboarding-experience"
            />
            <Text style={styles.experienceUnit}>{t('onboarding.review.yearsUnit')}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="onboarding-details-next"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  label: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs + 2 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    minHeight: 48,
  },
  textArea: {
    minHeight: 110,
    paddingTop: spacing.sm + 4,
  },
  charCount: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  experienceInput: { width: 80, textAlign: 'center' },
  experienceUnit: { ...typography.body, color: colors.textSecondary },
  footer: { marginTop: spacing.lg },
});
