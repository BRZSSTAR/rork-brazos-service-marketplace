import React, { useRef, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import {
  Home, Scissors, Heart, ChefHat, ChevronRight, ChevronDown, Check,
  Zap, Droplets, Thermometer, Sparkles, Wifi, Hammer, Flame, Shield,
  Bug, Truck, Wrench, Car, Shirt, PawPrint, Hand, Eye, Leaf, Activity,
  Brain, Baby, HeartPulse, TreePine, DoorOpen, HardHat, Paintbrush,
  Star, Smile, UserCheck, Globe, GraduationCap, Gem, Cake,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import { getCategoryById } from '@/constants/serviceCatalog';
import type { ServiceCategory } from '@/types';
import type { ServiceCategoryId } from '@/constants/serviceCatalog';

interface CategoryStepProps {
  selected: ServiceCategory | undefined;
  selectedSubcategory: string | undefined;
  selectedServices: string[];
  onSelect: (category: ServiceCategory) => void;
  onSelectSubcategory: (subId: string) => void;
  onToggleService: (serviceId: string) => void;
  onNext: () => void;
}

const CATEGORY_ICONS: Record<ServiceCategoryId, typeof Home> = {
  HOME: Home,
  BEAUTY: Scissors,
  HEALTH: Heart,
  CHEF: ChefHat,
};

const ICON_MAP: Record<string, typeof Zap> = {
  Zap, Droplets, Thermometer, Sparkles, Wifi, Hammer, Flame, Shield,
  Bug, Truck, Wrench, Car, Shirt, PawPrint, Scissors, Hand, Eye, Heart,
  Leaf, Activity, Brain, Baby, ChefHat, Globe, GraduationCap, Gem, Cake,
  HeartPulse, TreePine, DoorOpen, HardHat, Paintbrush, Star, Smile, UserCheck,
  Refrigerator: Wrench, Palette: Paintbrush, Sparkle: Sparkles, HandHeart: Heart,
  TestTube: Activity, Apple: Leaf, Stethoscope: HeartPulse, CookingPot: ChefHat,
  Salad: Leaf, PartyPopper: Star, HandPlatter: ChefHat,
};

function getIcon(iconName: string) {
  return ICON_MAP[iconName] ?? Star;
}

const categories: { key: ServiceCategory; color: string; bg: string }[] = [
  { key: 'HOME', color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'BEAUTY', color: '#EC4899', bg: '#FDF2F8' },
  { key: 'HEALTH', color: '#10B981', bg: '#ECFDF5' },
  { key: 'CHEF', color: '#F59E0B', bg: '#FFFBEB' },
];

function CategoryCard({
  catKey,
  color,
  bg,
  label,
  desc,
  isSelected,
  onPress,
}: {
  catKey: ServiceCategory;
  color: string;
  bg: string;
  label: string;
  desc: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const IconComp = CATEGORY_ICONS[catKey];

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, isSelected && styles.cardSelected, { transform: [{ scale }] }]}>
        <View style={[styles.iconWrap, { backgroundColor: bg }]}>
          <IconComp size={28} color={color} />
        </View>
        <View style={styles.cardText}>
          <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{label}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function CategoryStep({
  selected,
  selectedSubcategory,
  selectedServices,
  onSelect,
  onSelectSubcategory,
  onToggleService,
  onNext,
}: CategoryStepProps) {
  const { t } = useTranslation();
  const [expandedSub, setExpandedSub] = useState<string | null>(selectedSubcategory ?? null);

  const categoryDef = useMemo(() => {
    if (!selected) return null;
    return getCategoryById(selected);
  }, [selected]);

  const canContinue = !!selected && !!selectedSubcategory && selectedServices.length > 0;

  const handleSubPress = useCallback((subId: string) => {
    if (expandedSub === subId) {
      setExpandedSub(null);
    } else {
      setExpandedSub(subId);
      onSelectSubcategory(subId);
    }
  }, [expandedSub, onSelectSubcategory]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('onboarding.category.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.category.subtitle')}</Text>

      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            catKey={cat.key}
            color={cat.color}
            bg={cat.bg}
            label={t(`catalog.categories.${cat.key}.name`)}
            desc={t(`catalog.categories.${cat.key}.desc`)}
            isSelected={selected === cat.key}
            onPress={() => {
              onSelect(cat.key);
              setExpandedSub(null);
            }}
          />
        ))}
      </View>

      {selected && categoryDef && (
        <>
          <View style={styles.sectionDivider} />
          <Text style={styles.subTitle}>{t('onboarding.category.selectSubcategory')}</Text>
          <Text style={styles.subSubtitle}>{t('onboarding.category.selectServices')}</Text>

          <View style={styles.subList}>
            {categoryDef.subcategories.map((sub) => {
              const SubIcon = getIcon(sub.icon);
              const isExpanded = expandedSub === sub.id;
              const isSelectedSub = selectedSubcategory === sub.id;
              const subServiceIds = sub.services.map((s) => s.id);
              const selectedInSub = selectedServices.filter((s) => subServiceIds.includes(s)).length;

              return (
                <View key={sub.id}>
                  <Pressable
                    onPress={() => handleSubPress(sub.id)}
                    style={[
                      styles.subCard,
                      isSelectedSub && styles.subCardSelected,
                    ]}
                  >
                    <View style={[styles.subIconWrap, { backgroundColor: categoryDef.bg }]}>
                      <SubIcon size={18} color={categoryDef.color} />
                    </View>
                    <View style={styles.subCardContent}>
                      <Text style={[styles.subCardName, isSelectedSub && { color: colors.primary }]} numberOfLines={1}>
                        {t(`catalog.subcategories.${sub.id}.name`)}
                      </Text>
                      {selectedInSub > 0 && (
                        <Text style={styles.subSelectedCount}>
                          {selectedInSub} selected
                        </Text>
                      )}
                    </View>
                    {sub.isMvp && (
                      <View style={styles.mvpBadge}>
                        <Text style={styles.mvpBadgeText}>MVP</Text>
                      </View>
                    )}
                    {isExpanded ? (
                      <ChevronDown size={18} color={colors.textTertiary} />
                    ) : (
                      <ChevronRight size={18} color={colors.textTertiary} />
                    )}
                  </Pressable>

                  {isExpanded && (
                    <View style={styles.servicesList}>
                      {sub.services.map((svc) => {
                        const isChecked = selectedServices.includes(svc.id);
                        return (
                          <Pressable
                            key={svc.id}
                            style={styles.serviceItem}
                            onPress={() => onToggleService(svc.id)}
                          >
                            <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                              {isChecked && <Check size={14} color="#FFFFFF" />}
                            </View>
                            <Text style={[styles.serviceName, isChecked && styles.serviceNameChecked]} numberOfLines={1}>
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
          </View>
        </>
      )}

      <View style={styles.footer}>
        <PrimaryButton
          title={t('common.continue')}
          onPress={onNext}
          disabled={!canContinue}
          testID="onboarding-category-next"
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
  list: { gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.sm,
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FEFCF3',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: 2 },
  cardLabel: { ...typography.bodyMedium, color: colors.text },
  cardLabelSelected: { color: colors.primary },
  cardDesc: { ...typography.caption, color: colors.textSecondary },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.accent },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  subTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  subSubtitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  subList: { gap: spacing.xs },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    padding: spacing.sm + 2,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  subCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FEFCF3',
  },
  subIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardContent: { flex: 1, gap: 1 },
  subCardName: { ...typography.captionMedium, color: colors.text },
  subSelectedCount: { ...typography.small, color: colors.accent, fontSize: 11 },
  mvpBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radius.full,
  },
  mvpBadgeText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  servicesList: {
    backgroundColor: colors.background,
    marginTop: -1,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.borderLight,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: spacing.sm,
  },
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
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  serviceName: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  serviceNameChecked: {
    color: colors.primary,
    fontWeight: '500' as const,
  },
  footer: { marginTop: spacing.lg },
});
