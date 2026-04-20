import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {
  Home,
  Scissors,
  Heart,
  ChefHat,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import { SERVICE_CATALOG } from '@/constants/serviceCatalog';
import { useCategorySuggestionsStore } from '@/store/categorySuggestionsStore';
import { useAuthStore } from '@/store/authStore';
import type { CategorySelection, ServiceCategory } from '@/types';

interface MultiCategoryStepProps {
  selections: CategorySelection[];
  onChange: (selections: CategorySelection[]) => void;
  onNext: () => void;
}

const CATEGORY_META: Record<ServiceCategory, { icon: typeof Home; color: string }> = {
  HOME: { icon: Home, color: '#2D6A8F' },
  BEAUTY: { icon: Scissors, color: '#C95858' },
  HEALTH: { icon: Heart, color: '#2D8A5A' },
  CHEF: { icon: ChefHat, color: '#C8A84B' },
};

export default function MultiCategoryStep({
  selections,
  onChange,
  onNext,
}: MultiCategoryStepProps) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const submitSuggestion = useCategorySuggestionsStore((s) => s.submitSuggestion);

  const [expandedCategory, setExpandedCategory] = useState<ServiceCategory | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [suggestCategory, setSuggestCategory] = useState<ServiceCategory | null>(null);
  const [suggestionText, setSuggestionText] = useState<string>('');

  const getSelection = useCallback(
    (cat: ServiceCategory): CategorySelection => {
      return (
        selections.find((s) => s.category === cat) ?? {
          category: cat,
          subcategoryIds: [],
          serviceIds: [],
        }
      );
    },
    [selections]
  );

  const updateSelection = useCallback(
    (next: CategorySelection) => {
      const without = selections.filter((s) => s.category !== next.category);
      const hasAny = next.subcategoryIds.length > 0 || next.serviceIds.length > 0;
      onChange(hasAny ? [...without, next] : without);
    },
    [selections, onChange]
  );

  const toggleSubcategory = useCallback(
    (cat: ServiceCategory, subId: string) => {
      const current = getSelection(cat);
      const isIn = current.subcategoryIds.includes(subId);
      const subIds = isIn
        ? current.subcategoryIds.filter((s) => s !== subId)
        : [...current.subcategoryIds, subId];
      updateSelection({ ...current, subcategoryIds: subIds });
    },
    [getSelection, updateSelection]
  );

  const toggleService = useCallback(
    (cat: ServiceCategory, serviceId: string) => {
      const current = getSelection(cat);
      const isIn = current.serviceIds.includes(serviceId);
      const serviceIds = isIn
        ? current.serviceIds.filter((s) => s !== serviceId)
        : [...current.serviceIds, serviceId];
      updateSelection({ ...current, serviceIds });
    },
    [getSelection, updateSelection]
  );

  const handleSendSuggestion = useCallback(async () => {
    if (!suggestionText.trim() || !suggestCategory || !user?.id) {
      return;
    }
    try {
      await submitSuggestion({
        userId: user.id,
        suggestedName: suggestionText.trim(),
        suggestedType: 'subcategory',
        parentCategory: suggestCategory,
      });
      setSuggestionText('');
      setSuggestCategory(null);
      Alert.alert(
        t('onboarding.categories.suggestionSentTitle'),
        t('onboarding.categories.suggestionSentDesc')
      );
    } catch (error) {
      console.error('[MultiCategory] Suggestion error:', error);
    }
  }, [suggestionText, suggestCategory, user, submitSuggestion, t]);

  const totalServices = selections.reduce((acc, s) => acc + s.serviceIds.length, 0);
  const canContinue = selections.length > 0 && totalServices > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>{t('onboarding.categories.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.categories.subtitle')}</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryText}>
          {t('onboarding.categories.summary', {
            categories: selections.length,
            services: totalServices,
          })}
        </Text>
      </View>

      {SERVICE_CATALOG.map((cat) => {
        const meta = CATEGORY_META[cat.id];
        const Icon = meta.icon;
        const selection = getSelection(cat.id);
        const isExpanded = expandedCategory === cat.id;
        const selectedSubCount = selection.subcategoryIds.length;
        const selectedServiceCount = selection.serviceIds.length;
        const isActive = selectedSubCount > 0 || selectedServiceCount > 0;

        return (
          <View key={cat.id} style={styles.catBlock}>
            <Pressable
              onPress={() => setExpandedCategory(isExpanded ? null : cat.id)}
              style={[styles.catHeader, isActive && styles.catHeaderActive]}
              testID={`mc-cat-${cat.id}`}
            >
              <View style={[styles.catIcon, { backgroundColor: meta.color }]}>
                <Icon size={20} color="#FFFFFF" />
              </View>
              <View style={styles.catInfo}>
                <Text style={styles.catName}>
                  {t(`catalog.categories.${cat.id}.name`)}
                </Text>
                <Text style={styles.catMeta}>
                  {isActive
                    ? t('onboarding.categories.catMeta', {
                        subs: selectedSubCount,
                        services: selectedServiceCount,
                      })
                    : t('onboarding.categories.tapToPick')}
                </Text>
              </View>
              {isExpanded ? (
                <ChevronDown size={18} color={colors.textSecondary} />
              ) : (
                <ChevronRight size={18} color={colors.textSecondary} />
              )}
            </Pressable>

            {isExpanded && (
              <View style={styles.subBlock}>
                {cat.subcategories.map((sub) => {
                  const subChecked = selection.subcategoryIds.includes(sub.id);
                  const subExpanded = expandedSub === sub.id;
                  const selectedInSub = selection.serviceIds.filter((sid) =>
                    sub.services.some((s) => s.id === sid)
                  ).length;

                  return (
                    <View key={sub.id}>
                      <View style={styles.subRow}>
                        <Pressable
                          onPress={() => toggleSubcategory(cat.id, sub.id)}
                          style={[styles.checkbox, subChecked && styles.checkboxChecked]}
                          hitSlop={8}
                        >
                          {subChecked && <Check size={14} color="#FFFFFF" />}
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            setExpandedSub(subExpanded ? null : sub.id)
                          }
                          style={styles.subRowBody}
                        >
                          <Text style={styles.subName}>
                            {t(`catalog.subcategories.${sub.id}.name`)}
                          </Text>
                          {selectedInSub > 0 && (
                            <Text style={[styles.subMeta, { color: meta.color }]}>
                              {t('onboarding.categories.selectedCount', {
                                n: selectedInSub,
                              })}
                            </Text>
                          )}
                        </Pressable>
                        {subExpanded ? (
                          <ChevronDown size={16} color={colors.textTertiary} />
                        ) : (
                          <ChevronRight size={16} color={colors.textTertiary} />
                        )}
                      </View>

                      {subExpanded && (
                        <View style={styles.tagsWrap}>
                          {sub.services.map((svc) => {
                            const isChecked = selection.serviceIds.includes(svc.id);
                            return (
                              <Pressable
                                key={svc.id}
                                onPress={() => toggleService(cat.id, svc.id)}
                                style={[
                                  styles.tag,
                                  isChecked && {
                                    backgroundColor: meta.color,
                                    borderColor: meta.color,
                                  },
                                ]}
                                testID={`mc-svc-${svc.id}`}
                              >
                                <Text
                                  style={[
                                    styles.tagText,
                                    isChecked && { color: '#FFFFFF' },
                                  ]}
                                  numberOfLines={1}
                                >
                                  {t(`catalog.services.${svc.id}`)}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  );
                })}

                <Pressable
                  onPress={() =>
                    setSuggestCategory(
                      suggestCategory === cat.id ? null : cat.id
                    )
                  }
                  style={styles.suggestToggle}
                >
                  <Sparkles size={14} color={colors.accent} />
                  <Text style={styles.suggestToggleText}>
                    {t('onboarding.categories.suggestNew')}
                  </Text>
                </Pressable>

                {suggestCategory === cat.id && (
                  <View style={styles.suggestBox}>
                    <TextInput
                      style={styles.suggestInput}
                      placeholder={t('onboarding.categories.suggestPlaceholder')}
                      placeholderTextColor={colors.textTertiary}
                      value={suggestionText}
                      onChangeText={setSuggestionText}
                      maxLength={80}
                    />
                    <Pressable
                      onPress={handleSendSuggestion}
                      disabled={!suggestionText.trim()}
                      style={[
                        styles.suggestSend,
                        !suggestionText.trim() && styles.suggestSendDisabled,
                      ]}
                    >
                      <Plus size={14} color={colors.primary} />
                      <Text style={styles.suggestSendText}>
                        {t('onboarding.categories.suggestSend')}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>
        );
      })}

      <View style={styles.footer}>
        <PrimaryButton
          title={t('common.continue')}
          onPress={onNext}
          disabled={!canContinue}
          testID="mc-next"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  summaryRow: {
    backgroundColor: colors.logo,
    padding: spacing.sm + 2,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
  },
  summaryText: { ...typography.smallMedium, color: colors.primary },
  catBlock: { marginBottom: spacing.sm },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.sm,
  },
  catHeaderActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7F6',
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catInfo: { flex: 1, gap: 2 },
  catName: { ...typography.bodyMedium, color: colors.text },
  catMeta: { ...typography.small, color: colors.textSecondary },
  subBlock: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs + 2,
  },
  subRowBody: { flex: 1, gap: 2 },
  subName: { ...typography.captionMedium, color: colors.text },
  subMeta: { ...typography.small },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingLeft: 30,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tagText: { ...typography.small, color: colors.text },
  suggestToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
    paddingLeft: 30,
  },
  suggestToggleText: { ...typography.small, color: colors.accent },
  suggestBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingLeft: 30,
    paddingVertical: spacing.xs,
  },
  suggestInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
  },
  suggestSend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.accent,
  },
  suggestSendDisabled: { opacity: 0.5 },
  suggestSendText: {
    ...typography.smallMedium,
    color: colors.primary,
  },
  footer: { marginTop: spacing.lg },
});
