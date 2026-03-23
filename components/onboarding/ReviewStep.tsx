import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat, Edit3 } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { ServiceCategory, WeeklyAvailability } from '@/types';

type DayKey = keyof WeeklyAvailability;
const dayKeys: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const categoryIcons: Record<ServiceCategory, typeof Home> = {
  HOME: Home,
  BEAUTY: Scissors,
  HEALTH: Heart,
  CHEF: ChefHat,
};

const categoryColors: Record<ServiceCategory, string> = {
  HOME: '#3B82F6',
  BEAUTY: '#EC4899',
  HEALTH: '#10B981',
  CHEF: '#F59E0B',
};

interface ReviewStepProps {
  cpf?: string;
  category: ServiceCategory;
  subcategory?: string;
  selectedServices?: string[];
  serviceTitle: string;
  description: string;
  serviceArea: string;
  yearsExperience: number;
  pricePerHourCents: number;
  availability: WeeklyAvailability;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ReviewRow({ label, value, stepIndex, onEdit }: { label: string; value: string; stepIndex: number; onEdit: (s: number) => void }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={3}>{value}</Text>
      </View>
      <Pressable onPress={() => onEdit(stepIndex)} style={styles.editButton} hitSlop={8}>
        <Edit3 size={16} color={colors.accent} />
      </Pressable>
    </View>
  );
}

export default function ReviewStep({
  cpf,
  category,
  subcategory,
  selectedServices,
  serviceTitle,
  description,
  serviceArea,
  yearsExperience,
  pricePerHourCents,
  availability,
  onEdit,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const { t } = useTranslation();

  const IconComp = categoryIcons[category];
  const iconColor = categoryColors[category];
  const priceDisplay = `R$ ${(pricePerHourCents / 100).toFixed(2).replace('.', ',')}`;

  const subName = subcategory ? t(`catalog.subcategories.${subcategory}.name`) : '';
  const servicesDisplay = (selectedServices ?? []).map((s) => t(`catalog.services.${s}`)).join(', ');

  const enabledDays = dayKeys
    .filter((day) => availability[day].enabled)
    .map((day) => `${t(`onboarding.availability.days.${day}`)} ${availability[day].startTime}-${availability[day].endTime}`)
    .join('\n');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('onboarding.review.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.review.subtitle')}</Text>

      <View style={styles.card}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: iconColor + '15' }]}>
            <IconComp size={24} color={iconColor} />
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryLabel}>{t(`catalog.categories.${category}.name`)}</Text>
            <Text style={styles.serviceTitle}>{serviceTitle}</Text>
          </View>
        </View>

        {!!cpf && (
          <>
            <View style={styles.divider} />
            <ReviewRow label="CPF" value={cpf} stepIndex={0} onEdit={onEdit} />
          </>
        )}

        {(!!subName || !!servicesDisplay) && (
          <>
            <View style={styles.divider} />
            {!!subName && (
              <ReviewRow label={t('onboarding.review.subcategoryLabel')} value={subName} stepIndex={1} onEdit={onEdit} />
            )}
            {!!servicesDisplay && (
              <ReviewRow label={t('onboarding.review.servicesLabel')} value={servicesDisplay} stepIndex={1} onEdit={onEdit} />
            )}
          </>
        )}

        <View style={styles.divider} />

        <ReviewRow label={t('onboarding.review.descriptionLabel')} value={description} stepIndex={2} onEdit={onEdit} />
        <ReviewRow label={t('onboarding.review.areaLabel')} value={serviceArea || '\u2014'} stepIndex={2} onEdit={onEdit} />
        <ReviewRow label={t('onboarding.review.experienceLabel')} value={`${yearsExperience} ${t('onboarding.review.yearsUnit')}`} stepIndex={2} onEdit={onEdit} />
        <ReviewRow label={t('onboarding.review.priceLabel')} value={priceDisplay} stepIndex={3} onEdit={onEdit} />

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Text style={styles.rowLabel}>{t('onboarding.review.availabilityLabel')}</Text>
            <Text style={styles.rowValue}>{enabledDays || '\u2014'}</Text>
          </View>
          <Pressable onPress={() => onEdit(4)} style={styles.editButton} hitSlop={8}>
            <Edit3 size={16} color={colors.accent} />
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={t('onboarding.review.submit')}
          onPress={onSubmit}
          loading={isSubmitting}
          testID="onboarding-submit"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: { flex: 1, gap: 2 },
  categoryLabel: { ...typography.caption, color: colors.textSecondary },
  serviceTitle: { ...typography.h3, color: colors.text },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
  },
  rowLeft: { flex: 1, gap: 2 },
  rowLabel: { ...typography.small, color: colors.textTertiary },
  rowValue: { ...typography.body, color: colors.text },
  editButton: {
    padding: spacing.xs,
  },
  footer: { marginTop: spacing.lg },
});
