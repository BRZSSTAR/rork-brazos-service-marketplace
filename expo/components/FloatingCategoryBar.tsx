import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { colors, spacing, typography, shadow } from '@/constants/theme';

type CategoryKey = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

interface CategoryItem {
  key: CategoryKey;
  icon: typeof Home;
  color: string;
  bg: string;
  glowColor: string;
  labelKey: string;
}

const categories: CategoryItem[] = [
  { key: 'HOME', icon: Home, color: '#2D6A8F', bg: '#2D6A8F', glowColor: 'rgba(45,106,143,0.3)', labelKey: 'customer.home.categories.home.label' },
  { key: 'BEAUTY', icon: Scissors, color: '#C95858', bg: '#C95858', glowColor: 'rgba(201,88,88,0.3)', labelKey: 'customer.home.categories.beauty.label' },
  { key: 'HEALTH', icon: Heart, color: '#2D8A5A', bg: '#2D8A5A', glowColor: 'rgba(45,138,90,0.3)', labelKey: 'customer.home.categories.health.label' },
  { key: 'CHEF', icon: ChefHat, color: '#C8A84B', bg: '#C8A84B', glowColor: 'rgba(200,168,75,0.3)', labelKey: 'customer.home.categories.chef.label' },
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
        <IconComp size={24} color={'#FFFFFF'} strokeWidth={2.4} />
      </Animated.View>
      <Text style={[styles.circleLabel, { color: colors.text }]} numberOfLines={1}>
        {t(item.labelKey)}
      </Text>
    </Pressable>
  );
}

export default function FloatingCategoryBar() {
  const router = useRouter();

  const handleCategoryPress = (key: CategoryKey) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  };

  const barContent = (
    <View style={styles.bar}>
      {categories.map((cat) => (
        <CategoryCircle
          key={cat.key}
          item={cat}
          onPress={() => handleCategoryPress(cat.key)}
        />
      ))}
    </View>
  );

  const glassAvailable = isLiquidGlassAvailable();

  if (glassAvailable) {
    return (
      <View style={styles.container}>
        <GlassView
          style={styles.glassBar}
          glassEffectStyle="clear"
          tintColor="rgba(255,255,255,0.15)"
          isInteractive
        >
          {barContent}
        </GlassView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.fallbackBar}>
        {barContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
    zIndex: 10,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: spacing.md,
  },
  glassBar: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  fallbackBar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      default: {},
    }),
  },
  circleWrapper: {
    alignItems: 'center',
    gap: 8,
    width: 68,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  circleLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 14,
    textAlign: 'center' as const,
  },
});
