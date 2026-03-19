import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Scissors, Heart, ChefHat } from 'lucide-react-native';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = spacing.lg;
const GRID_GAP = spacing.md;
const TILE_SIZE = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

type CategoryKey = 'home' | 'beauty' | 'health' | 'chef';

const categoryMeta: { key: CategoryKey; icon: typeof Home; color: string; bg: string }[] = [
  { key: 'home', icon: Home, color: '#3B82F6', bg: '#EFF6FF' },
  { key: 'beauty', icon: Scissors, color: '#EC4899', bg: '#FDF2F8' },
  { key: 'health', icon: Heart, color: '#10B981', bg: '#ECFDF5' },
  { key: 'chef', icon: ChefHat, color: '#F59E0B', bg: '#FFFBEB' },
];

function CategoryTile({
  label,
  subtitle,
  IconComp,
  color,
  bg,
  onPress,
  testID,
}: {
  label: string;
  subtitle: string;
  IconComp: typeof Home;
  color: string;
  bg: string;
  onPress: () => void;
  testID: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} testID={testID}>
      <Animated.View style={[styles.tile, { transform: [{ scale }] }]}>
        <View style={[styles.tileIconWrap, { backgroundColor: bg }]}>
          <IconComp size={32} color={color} />
        </View>
        <Text style={styles.tileLabel}>{label}</Text>
        <Text style={styles.tileSubtitle}>{subtitle}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? t('customer.home.fallbackName');

  return (
    <SafeAreaWrapper>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Text style={styles.greeting}>{t('customer.home.greeting', { name: firstName })}</Text>
          <Text style={styles.heroTitle}>{t('customer.home.title')}</Text>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <CategoryTile
              label={t('customer.home.categories.home.label')}
              subtitle={t('customer.home.categories.home.subtitle')}
              IconComp={categoryMeta[0].icon}
              color={categoryMeta[0].color}
              bg={categoryMeta[0].bg}
              onPress={() => router.push('/customer/category-browse')}
              testID="category-home"
            />
            <CategoryTile
              label={t('customer.home.categories.beauty.label')}
              subtitle={t('customer.home.categories.beauty.subtitle')}
              IconComp={categoryMeta[1].icon}
              color={categoryMeta[1].color}
              bg={categoryMeta[1].bg}
              onPress={() => router.push('/customer/category-browse')}
              testID="category-beauty"
            />
          </View>
          <View style={styles.gridRow}>
            <CategoryTile
              label={t('customer.home.categories.health.label')}
              subtitle={t('customer.home.categories.health.subtitle')}
              IconComp={categoryMeta[2].icon}
              color={categoryMeta[2].color}
              bg={categoryMeta[2].bg}
              onPress={() => router.push('/customer/category-browse')}
              testID="category-health"
            />
            <CategoryTile
              label={t('customer.home.categories.chef.label')}
              subtitle={t('customer.home.categories.chef.subtitle')}
              IconComp={categoryMeta[3].icon}
              color={categoryMeta[3].color}
              bg={categoryMeta[3].bg}
              onPress={() => router.push('/customer/category-browse')}
              testID="category-chef"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('customer.home.highlights')}</Text>
          <View style={styles.featuredCard}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>{t('customer.home.featuredBadge')}</Text>
            </View>
            <Text style={styles.featuredTitle}>{t('customer.home.featuredTitle')}</Text>
            <Text style={styles.featuredDesc}>{t('customer.home.featuredDescription')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('customer.home.nextBookings')}</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('customer.home.noBookings')}</Text>
            <Text style={styles.emptySubtext}>{t('customer.home.noBookingsDescription')}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  heroSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: spacing.lg,
    borderBottomRightRadius: spacing.lg,
    gap: spacing.xs,
  },
  greeting: { ...typography.captionMedium, color: colors.accent },
  heroTitle: { ...typography.h1, color: colors.textInverse, fontSize: 26, lineHeight: 32 },
  gridContainer: { paddingHorizontal: GRID_PADDING, marginTop: spacing.lg, gap: GRID_GAP },
  gridRow: { flexDirection: 'row', gap: GRID_GAP },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    ...shadow.md,
  },
  tileIconWrap: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  tileLabel: { ...typography.h3, color: colors.text, marginTop: spacing.xs },
  tileSubtitle: { ...typography.small, color: colors.textSecondary, textAlign: 'center' },
  section: { paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md, marginTop: spacing.lg },
  featuredCard: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.lg, gap: spacing.sm },
  featuredBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  featuredBadgeText: { ...typography.smallMedium, color: colors.primary },
  featuredTitle: { ...typography.h3, color: colors.textInverse },
  featuredDesc: { ...typography.caption, color: 'rgba(255,255,255,0.6)' },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  emptyText: { ...typography.bodyMedium, color: colors.text },
  emptySubtext: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
});
