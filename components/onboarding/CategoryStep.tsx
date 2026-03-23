import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { ServiceCategory } from '@/types';

interface CategoryStepProps {
  selected: ServiceCategory | undefined;
  onSelect: (category: ServiceCategory) => void;
  onNext: () => void;
}

const categories: { key: ServiceCategory; icon: typeof Home; color: string; bg: string; labelKey: string; descKey: string }[] = [
  { key: 'HOME', icon: Home, color: '#3B82F6', bg: '#EFF6FF', labelKey: 'onboarding.category.home', descKey: 'onboarding.category.homeDesc' },
  { key: 'BEAUTY', icon: Scissors, color: '#EC4899', bg: '#FDF2F8', labelKey: 'onboarding.category.beauty', descKey: 'onboarding.category.beautyDesc' },
  { key: 'HEALTH', icon: Heart, color: '#10B981', bg: '#ECFDF5', labelKey: 'onboarding.category.health', descKey: 'onboarding.category.healthDesc' },
  { key: 'CHEF', icon: ChefHat, color: '#F59E0B', bg: '#FFFBEB', labelKey: 'onboarding.category.chef', descKey: 'onboarding.category.chefDesc' },
];

function CategoryCard({
  icon: IconComp,
  color,
  bg,
  label,
  desc,
  isSelected,
  onPress,
}: {
  icon: typeof Home;
  color: string;
  bg: string;
  label: string;
  desc: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

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

export default function CategoryStep({ selected, onSelect, onNext }: CategoryStepProps) {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{t('onboarding.category.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.category.subtitle')}</Text>

      <View style={styles.list}>
        {categories.map((cat) => (
          <CategoryCard
            key={cat.key}
            icon={cat.icon}
            color={cat.color}
            bg={cat.bg}
            label={t(cat.labelKey)}
            desc={t(cat.descKey)}
            isSelected={selected === cat.key}
            onPress={() => onSelect(cat.key)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          title={t('common.continue')}
          onPress={onNext}
          disabled={!selected}
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
  footer: { marginTop: spacing.lg },
});
