import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PILL_GAP = 12;
const PILL_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - PILL_GAP) / 2;
const PILL_HEIGHT = 88;

type CategoryKey = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

interface CategoryItem {
  key: CategoryKey;
  icon: typeof Home;
  gradientColors: readonly [string, string];
  iconBg: string;
  labelKey: string;
}

const categories: CategoryItem[] = [
  {
    key: 'HOME',
    icon: Home,
    gradientColors: ['#2D6A8F', '#1B4F6E'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.home.label',
  },
  {
    key: 'BEAUTY',
    icon: Scissors,
    gradientColors: ['#C95858', '#A34343'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.beauty.label',
  },
  {
    key: 'HEALTH',
    icon: Heart,
    gradientColors: ['#2D8A5A', '#1B6B42'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.health.label',
  },
  {
    key: 'CHEF',
    icon: ChefHat,
    gradientColors: ['#C8A84B', '#A8893D'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.chef.label',
  },
];

function PillCard({ item, onPress }: { item: CategoryItem; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const { t } = useTranslation();
  const IconComp = item.icon;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 60, bounciness: 3 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 3 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      testID={`category-pill-${item.key.toLowerCase()}`}
    >
      <Animated.View
        style={[
          styles.pill,
          {
            width: PILL_WIDTH,
            height: PILL_HEIGHT,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.pillGradientBg}>
          <View style={[styles.pillGradient, { backgroundColor: item.gradientColors[0] }]} />
          <View style={[styles.pillGradientBottom, { backgroundColor: item.gradientColors[1] }]} />
        </View>
        <View style={styles.pillContent}>
          <View style={[styles.pillIconWrap, { backgroundColor: item.iconBg }]}>
            <IconComp size={28} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <Text style={styles.pillLabel} numberOfLines={1}>
            {t(item.labelKey)}
          </Text>
        </View>
        <View style={styles.pillShine} pointerEvents="none" />
      </Animated.View>
    </Pressable>
  );
}

export default function FloatingCategoryBar() {
  const router = useRouter();

  const handleCategoryPress = (key: CategoryKey) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  };

  const gridContent = (
    <View style={styles.grid}>
      {categories.map((cat) => (
        <PillCard key={cat.key} item={cat} onPress={() => handleCategoryPress(cat.key)} />
      ))}
    </View>
  );

  const glassAvailable = isLiquidGlassAvailable();

  if (glassAvailable) {
    return (
      <View style={styles.container}>
        <GlassView
          style={styles.glassWrapper}
          glassEffectStyle="clear"
          tintColor="rgba(255,255,255,0.08)"
          isInteractive
        >
          {gridContent}
        </GlassView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.fallbackWrapper}>
        {gridContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    zIndex: 10,
  },
  glassWrapper: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    padding: spacing.md,
  },
  fallbackWrapper: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: PILL_GAP,
  },
  pill: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
      default: {},
    }),
  },
  pillGradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  pillGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  pillGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pillContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  pillIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  pillLabel: {
    ...typography.captionMedium,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    textAlign: 'center' as const,
  },
  pillShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
