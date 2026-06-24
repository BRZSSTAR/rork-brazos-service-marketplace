import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 150;
const CARD_GAP = 10;
const SIDE_PADDING = spacing.lg;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

type CategoryKey = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

interface CategoryConfig {
  key: CategoryKey;
  icon: typeof Home;
  gradientColors: readonly [string, string];
  iconBg: string;
  labelKey: string;
}

const categories: CategoryConfig[] = [
  {
    key: 'HOME',
    icon: Home,
    gradientColors: ['#145A4A', '#0E3F34'] as const,
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
    gradientColors: ['#2E7D54', '#1B5E3A'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.health.label',
  },
  {
    key: 'CHEF',
    icon: ChefHat,
    gradientColors: ['#D4A43A', '#B8891F'] as const,
    iconBg: 'rgba(255,255,255,0.2)',
    labelKey: 'customer.home.categories.chef.label',
  },
];

function CategoryCard({
  config,
  onPress,
  t,
}: {
  config: CategoryConfig;
  onPress: () => void;
  t: (key: string) => string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const IconComp = config.icon;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 60,
      bounciness: 3,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[cardStyles.card, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={config.gradientColors as unknown as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={cardStyles.gradient}
        >
          <View style={[cardStyles.iconCircle, { backgroundColor: config.iconBg }]}>
            <IconComp size={28} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={cardStyles.label}>{t(config.labelKey)}</Text>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

export default function FloatingCategoryBar() {
  const router = useRouter();
  const { t } = useTranslation();
  const glassAvailable = isLiquidGlassAvailable();

  const handlePress = (key: CategoryKey) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  };

  const row = (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={SNAP_INTERVAL}
      decelerationRate="fast"
      contentContainerStyle={styles.scrollContent}
    >
      {categories.map((cat) => (
        <CategoryCard
          key={cat.key}
          config={cat}
          t={t}
          onPress={() => handlePress(cat.key)}
        />
      ))}
    </ScrollView>
  );

  if (glassAvailable) {
    return (
      <GlassView
        style={styles.glassContainer}
        glassEffectStyle="regular"
        tintColor="rgba(255,255,255,0.04)"
        isInteractive
      >
        {row}
      </GlassView>
    );
  }

  return (
    <View style={styles.fallbackContainer}>
      {row}
    </View>
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    marginTop: spacing.md,
    marginHorizontal: 0,
    paddingVertical: spacing.md,
    overflow: 'visible' as const,
  },
  fallbackContainer: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: SIDE_PADDING,
    gap: CARD_GAP,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: 108,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
      },
      android: { elevation: 5 },
      default: {},
    }),
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  label: {
    ...typography.captionMedium,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center' as const,
  },
});
