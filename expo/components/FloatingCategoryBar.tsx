import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { colors, spacing, typography, shadow } from '@/constants/theme';

type CategoryKey = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

interface CategoryItem {
  key: CategoryKey;
  icon: typeof Home;
  color: string;
  bg: string;
  labelKey: string;
}

const categories: CategoryItem[] = [
  { key: 'HOME', icon: Home, color: '#3B82F6', bg: '#EFF6FF', labelKey: 'customer.home.categories.home.label' },
  { key: 'BEAUTY', icon: Scissors, color: '#EC4899', bg: '#FDF2F8', labelKey: 'customer.home.categories.beauty.label' },
  { key: 'HEALTH', icon: Heart, color: '#10B981', bg: '#ECFDF5', labelKey: 'customer.home.categories.health.label' },
  { key: 'CHEF', icon: ChefHat, color: '#F59E0B', bg: '#FFFBEB', labelKey: 'customer.home.categories.chef.label' },
];

function CategoryCircle({ item, onPress }: { item: CategoryItem; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();
  const IconComp = item.icon;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`category-float-${item.key.toLowerCase()}`}
      style={styles.circleWrapper}
    >
      <Animated.View style={[styles.circle, { backgroundColor: item.bg, borderColor: item.color, transform: [{ scale }] }]}>
        <IconComp size={22} color={item.color} />
      </Animated.View>
      <Text style={[styles.circleLabel, { color: item.color }]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
}

export default function FloatingCategoryBar() {
  const router = useRouter();

  const handleCategoryPress = (key: CategoryKey) => {
    console.log('[FloatingCategoryBar] Category pressed:', key);
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {categories.map((cat) => (
          <CategoryCircle
            key={cat.key}
            item={cat}
            onPress={() => handleCategoryPress(cat.key)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
    pointerEvents: 'box-none',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    gap: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    ...shadow.lg,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 -2px 20px rgba(0,0,0,0.10)',
    } : {}),
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  circleWrapper: {
    alignItems: 'center',
    gap: 4,
    width: 58,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  circleLabel: {
    ...typography.smallMedium,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center' as const,
  },
});
