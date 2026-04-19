import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  { key: 'HOME', icon: Home, color: '#2D6A8F', bg: '#2D6A8F', labelKey: 'customer.home.categories.home.label' },
  { key: 'BEAUTY', icon: Scissors, color: '#C95858', bg: '#C95858', labelKey: 'customer.home.categories.beauty.label' },
  { key: 'HEALTH', icon: Heart, color: '#2D8A5A', bg: '#2D8A5A', labelKey: 'customer.home.categories.health.label' },
  { key: 'CHEF', icon: ChefHat, color: '#C8A84B', bg: '#C8A84B', labelKey: 'customer.home.categories.chef.label' },
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
      <Animated.View style={[styles.circle, { backgroundColor: item.bg, borderColor: item.color, transform: [{ scale }], shadowColor: item.color }]}>
        <IconComp size={24} color={'#FFFFFF'} strokeWidth={2.4} />
      </Animated.View>
      <Text style={[styles.circleLabel, { color: item.color }]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 49 : 56;

export default function FloatingCategoryBar() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleCategoryPress = (key: CategoryKey) => {
    console.log('[FloatingCategoryBar] Category pressed:', key);
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  };

  const bottomOffset = TAB_BAR_HEIGHT + insets.bottom + spacing.md;

  return (
    <View style={[styles.container, { bottom: bottomOffset }]} pointerEvents="box-none">
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
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
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
    borderWidth: 0,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 4,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
    } : {}),
  },
  circleLabel: {
    ...typography.smallMedium,
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center' as const,
  },
});
