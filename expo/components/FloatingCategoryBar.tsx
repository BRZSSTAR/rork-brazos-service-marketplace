import React, { useRef, useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { colors, spacing, radius, typography } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DIAL_SIZE = 300;
const ITEM_SIZE = 60;
const ORBIT_RADIUS = 106;

type CategoryKey = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

interface CategoryItem {
  key: CategoryKey;
  icon: typeof Home;
  color: string;
  bg: string;
  labelKey: string;
}

const categoryList: CategoryItem[] = [
  {
    key: 'HOME', icon: Home, color: '#145A4A', bg: '#E8F5F0',
    labelKey: 'customer.home.categories.home.label',
  },
  {
    key: 'BEAUTY', icon: Scissors, color: '#C95858', bg: '#FCEEEE',
    labelKey: 'customer.home.categories.beauty.label',
  },
  {
    key: 'HEALTH', icon: Heart, color: '#C9A84C', bg: '#FFF9EC',
    labelKey: 'customer.home.categories.health.label',
  },
  {
    key: 'CHEF', icon: ChefHat, color: '#2D6A8F', bg: '#EDF5FD',
    labelKey: 'customer.home.categories.chef.label',
  },
];

/** Fixed angular positions for the 4 items (clockwise from top): 0°, 90°, 180°, 270° */
const ITEM_ANGLES_DEG = [0, 90, 180, 270];

/** Pre-computed x/y offsets for items at ORBIT_RADIUS from center */
function getItemOffset(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: ORBIT_RADIUS * Math.sin(rad),
    y: -ORBIT_RADIUS * Math.cos(rad),
  };
}

const ITEM_OFFSETS = ITEM_ANGLES_DEG.map(getItemOffset);

export default function FloatingCategoryBar() {
  const router = useRouter();
  const { t } = useTranslation();

  const rotationAnim = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const snapToItem = useCallback((targetIndex: number) => {
    const targetAngle = -targetIndex * 90;
    let delta = targetAngle - currentAngle.current;
    while (delta > 180) delta -= 360;
    while (delta < -180) delta += 360;
    const finalTarget = currentAngle.current + delta;

    setActiveIndex(targetIndex);
    Animated.spring(rotationAnim, {
      toValue: finalTarget,
      useNativeDriver: true,
      tension: 70,
      friction: 12,
      speed: 14,
    }).start();
    currentAngle.current = finalTarget;
  }, [rotationAnim]);

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dx) > 4,
    onPanResponderGrant: () => {
      rotationAnim.setValue(currentAngle.current);
    },
    onPanResponderMove: (_, gs) => {
      const newAngle = currentAngle.current + gs.dx * 0.55;
      rotationAnim.setValue(newAngle);
      const mod = ((newAngle % 360) + 360) % 360;
      const closest = Math.round(mod / 90) % 4;
      setActiveIndex(closest);
    },
    onPanResponderRelease: (_, gs) => {
      const momentum = gs.vx * 0.12;
      const projected = currentAngle.current + gs.dx * 0.55 + momentum;
      const mod = ((projected % 360) + 360) % 360;
      const closest = Math.round(mod / 90) % 4;
      snapToItem(closest);
    },
  }), [rotationAnim, snapToItem]);

  const handleItemPress = useCallback((key: CategoryKey) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: key } });
  }, [router]);

  const rotationDeg = rotationAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
    extrapolate: 'extend',
  });

  const glassAvailable = isLiquidGlassAvailable();

  const dial = (
    <View style={styles.dialArea} {...panResponder.panHandlers}>
      {/* Subtle ring track */}
      <View style={styles.trackRing} pointerEvents="none" />
      <View style={styles.trackRingInner} pointerEvents="none" />

      {/* Top indicator dot */}
      <View style={styles.indicatorDot} pointerEvents="none" />

      {/* Rotating container holding all 4 items */}
      <Animated.View
        style={[
          styles.orbitContainer,
          { transform: [{ rotate: rotationDeg }] },
        ]}
      >
        {categoryList.map((cat, i) => {
          const IconComp = cat.icon;
          const offset = ITEM_OFFSETS[i];
          const isTop = activeIndex === i;

          return (
            <Animated.View
              key={cat.key}
              style={[
                styles.orbitItem,
                {
                  width: ITEM_SIZE,
                  height: ITEM_SIZE,
                  transform: [
                    { translateX: offset.x },
                    { translateY: offset.y },
                    { rotate: rotationAnim.interpolate({
                        inputRange: [-360, 360],
                        outputRange: ['360deg', '-360deg'],
                        extrapolate: 'extend',
                      })
                    },
                  ],
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  snapToItem(i);
                  setTimeout(() => handleItemPress(cat.key), 300);
                }}
                style={[
                  styles.itemBtn,
                  { backgroundColor: isTop ? cat.color : `${cat.color}15` },
                  isTop && styles.itemBtnActive,
                ]}
              >
                <IconComp
                  size={isTop ? 26 : 22}
                  color={isTop ? '#FFFFFF' : cat.color}
                  strokeWidth={isTop ? 2.4 : 2}
                />
              </Pressable>
              <Text
                style={[
                  styles.itemLabel,
                  { color: isTop ? colors.text : colors.textSecondary },
                  isTop && styles.itemLabelActive,
                ]}
                numberOfLines={1}
              >
                {t(cat.labelKey)}
              </Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );

  const dialWithGlass = glassAvailable ? (
    <GlassView
      style={styles.glassWrapper}
      glassEffectStyle="clear"
      tintColor="rgba(255,255,255,0.06)"
      isInteractive
    >
      {dial}
    </GlassView>
  ) : (
    <View style={styles.fallbackWrapper}>
      {dial}
    </View>
  );

  return (
    <View style={styles.container}>
      {dialWithGlass}
      <Text style={styles.hint}>{t('customer.home.categories.dialHint', { defaultValue: 'Gire ou toque para escolher' })}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  glassWrapper: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackWrapper: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  dialArea: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackRing: {
    position: 'absolute',
    width: ORBIT_RADIUS * 2 + ITEM_SIZE,
    height: ORBIT_RADIUS * 2 + ITEM_SIZE,
    borderRadius: ORBIT_RADIUS + ITEM_SIZE / 2,
    borderWidth: 1.5,
    borderColor: 'rgba(201,168,76,0.20)',
  },
  trackRingInner: {
    position: 'absolute',
    width: ORBIT_RADIUS * 2 - ITEM_SIZE,
    height: ORBIT_RADIUS * 2 - ITEM_SIZE,
    borderRadius: ORBIT_RADIUS - ITEM_SIZE / 2,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.10)',
    borderStyle: 'dashed' as const,
  },
  indicatorDot: {
    position: 'absolute',
    top: ORBIT_RADIUS - ITEM_SIZE / 2 - 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    zIndex: 20,
  },
  orbitContainer: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitItem: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  itemBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  itemBtnActive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  itemLabel: {
    ...typography.smallMedium,
    fontSize: 10,
    textAlign: 'center' as const,
    maxWidth: ITEM_SIZE + 20,
  },
  itemLabelActive: {
    fontWeight: '700' as const,
    fontSize: 11,
  },
  hint: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: spacing.sm,
    textAlign: 'center' as const,
  },
});
