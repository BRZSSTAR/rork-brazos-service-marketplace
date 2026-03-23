import React, { useRef, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  ChevronRight,
  Zap,
  Droplets,
  Thermometer,
  Sparkles,
  Wifi,
  Hammer,
  Flame,
  Shield,
  Bug,
  Truck,
  Wrench,
  Car,
  Shirt,
  PawPrint,
  Scissors,
  Hand,
  Eye,
  Heart,
  Leaf,
  Activity,
  Brain,
  Baby,
  ChefHat,
  Globe,
  GraduationCap,
  Gem,
  Cake,
  HeartPulse,
  TreePine,
  DoorOpen,
  HardHat,
  Paintbrush,
  Star,
  Smile,
  UserCheck,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import { getCategoryById } from '@/constants/serviceCatalog';
import type { ServiceCategoryId, SubCategory } from '@/constants/serviceCatalog';

const ICON_MAP: Record<string, typeof Zap> = {
  Zap,
  Droplets,
  Thermometer,
  Sparkles,
  Wifi,
  Hammer,
  Flame,
  Shield,
  Bug,
  Truck,
  Wrench,
  Car,
  Shirt,
  PawPrint,
  Scissors,
  Hand,
  Eye,
  Heart,
  Leaf,
  Activity,
  Brain,
  Baby,
  ChefHat,
  Globe,
  GraduationCap,
  Gem,
  Cake,
  HeartPulse,
  TreePine,
  DoorOpen,
  HardHat,
  Paintbrush,
  Star,
  Smile,
  UserCheck,
  Refrigerator: Wrench,
  Palette: Paintbrush,
  Sparkle: Sparkles,
  HandHeart: Heart,
  TestTube: Activity,
  Apple: Leaf,
  Stethoscope: HeartPulse,
  CookingPot: ChefHat,
  Salad: Leaf,
  PartyPopper: Star,
  HandPlatter: ChefHat,
};

function getIcon(iconName: string) {
  return ICON_MAP[iconName] ?? Star;
}

function SubCategoryCard({
  sub,
  catColor,
  catBg,
  serviceName,
  serviceCount,
  onPress,
}: {
  sub: SubCategory;
  catColor: string;
  catBg: string;
  serviceName: string;
  serviceCount: number;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const IconComp = getIcon(sub.icon);

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} testID={`subcat-${sub.id}`}>
      <Animated.View style={[styles.subCard, { transform: [{ scale }] }]}>
        <View style={[styles.subIconWrap, { backgroundColor: catBg }]}>
          <IconComp size={22} color={catColor} />
        </View>
        <View style={styles.subCardContent}>
          <View style={styles.subCardHeader}>
            <Text style={styles.subCardName} numberOfLines={1}>{serviceName}</Text>
            {sub.isMvp && (
              <View style={styles.mvpBadge}>
                <Text style={styles.mvpBadgeText}>MVP</Text>
              </View>
            )}
          </View>
          <Text style={styles.subCardCount}>
            {serviceCount} {serviceCount === 1 ? 'service' : 'services'}
          </Text>
        </View>
        <ChevronRight size={18} color={colors.textTertiary} />
      </Animated.View>
    </Pressable>
  );
}

function ServiceListItem({
  serviceName,
  catColor,
  onPress,
}: {
  serviceName: string;
  catColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.serviceItem}>
      <View style={[styles.serviceDot, { backgroundColor: catColor }]} />
      <Text style={styles.serviceName} numberOfLines={1}>{serviceName}</Text>
      <ChevronRight size={16} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function CategoryBrowseScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const categoryId = (params.categoryId ?? 'HOME') as ServiceCategoryId;

  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const catName = t(`catalog.categories.${categoryId}.name`);
  const catColor = category?.color ?? colors.primary;
  const catBg = category?.bg ?? colors.background;

  const filteredSubs = useMemo(() => {
    if (!category) return [];
    if (!searchQuery.trim()) return category.subcategories;

    const q = searchQuery.toLowerCase().trim();
    return category.subcategories.filter((sub) => {
      const subName = t(`catalog.subcategories.${sub.id}.name`);
      if (subName.toLowerCase().includes(q)) return true;
      return sub.services.some((svc) => {
        const svcName = t(`catalog.services.${svc.id}`);
        return svcName.toLowerCase().includes(q);
      });
    });
  }, [category, searchQuery, t]);

  const handleToggleSub = useCallback((subId: string) => {
    setExpandedSub((prev) => (prev === subId ? null : subId));
  }, []);

  const handleServicePress = useCallback((serviceId: string, subId: string) => {
    console.log('[CategoryBrowse] Service tapped:', serviceId, 'sub:', subId);
  }, []);

  if (!category) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Category not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: catName }} />

      <View style={[styles.headerBand, { backgroundColor: catColor }]}>
        <Text style={styles.headerTitle}>{catName}</Text>
        <Text style={styles.headerSubtitle}>
          {t(`catalog.categories.${categoryId}.desc`)}
        </Text>
        <Text style={styles.headerCount}>
          {category.subcategories.length} {t('catalog.subcategories.electrical.name') ? 'subcategories' : ''}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('customer.explore.searchPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="category-search-input"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredSubs.map((sub) => {
          const subName = t(`catalog.subcategories.${sub.id}.name`);
          const isExpanded = expandedSub === sub.id;

          return (
            <View key={sub.id}>
              <SubCategoryCard
                sub={sub}
                catColor={catColor}
                catBg={catBg}
                serviceName={subName}
                serviceCount={sub.services.length}
                onPress={() => handleToggleSub(sub.id)}
              />
              {isExpanded && (
                <View style={styles.servicesList}>
                  {sub.services.map((svc) => (
                    <ServiceListItem
                      key={svc.id}
                      serviceName={t(`catalog.services.${svc.id}`)}
                      catColor={catColor}
                      onPress={() => handleServicePress(svc.id, sub.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {filteredSubs.length === 0 && (
          <View style={styles.emptySearch}>
            <Search size={40} color={colors.border} strokeWidth={1.2} />
            <Text style={styles.emptySearchTitle}>No results</Text>
            <Text style={styles.emptySearchSubtitle}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { ...typography.body, color: colors.textSecondary },
  headerBand: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  headerCount: {
    ...typography.small,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    ...typography.caption,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    ...shadow.sm,
  },
  subIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subCardContent: { flex: 1, gap: 2 },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  subCardName: { ...typography.bodyMedium, color: colors.text, flex: 1 },
  subCardCount: { ...typography.small, color: colors.textTertiary },
  mvpBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  mvpBadgeText: {
    ...typography.small,
    fontSize: 10,
    fontWeight: '700' as const,
    color: colors.primary,
  },
  servicesList: {
    backgroundColor: colors.surface,
    marginTop: -spacing.xs,
    marginBottom: spacing.xs,
    borderBottomLeftRadius: radius.md,
    borderBottomRightRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    ...shadow.sm,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  serviceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceName: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  emptySearchTitle: { ...typography.h3, color: colors.text },
  emptySearchSubtitle: { ...typography.caption, color: colors.textSecondary },
});
