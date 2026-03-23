import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Home,
  Scissors,
  Heart,
  ChefHat,
  ChevronRight,
  X,
} from 'lucide-react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { SERVICE_CATALOG, searchServices } from '@/constants/serviceCatalog';
import type { ServiceCategoryId } from '@/constants/serviceCatalog';

const CATEGORY_ICONS: Record<ServiceCategoryId, typeof Home> = {
  HOME: Home,
  BEAUTY: Scissors,
  HEALTH: Heart,
  CHEF: ChefHat,
};

function CategoryChip({
  id,
  name,
  color,
  bg,
  onPress,
}: {
  id: ServiceCategoryId;
  name: string;
  color: string;
  bg: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const IconComp = CATEGORY_ICONS[id];

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} testID={`explore-cat-${id}`}>
      <Animated.View style={[styles.chip, { backgroundColor: bg, transform: [{ scale }] }]}>
        <IconComp size={18} color={color} />
        <Text style={[styles.chipText, { color }]}>{name}</Text>
        <ChevronRight size={14} color={color} />
      </Animated.View>
    </Pressable>
  );
}

function SearchResultItem({
  serviceName,
  subCategoryName,
  categoryName,
  catColor,
  onPress,
}: {
  serviceName: string;
  subCategoryName: string;
  categoryName: string;
  catColor: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.resultItem}>
      <View style={[styles.resultDot, { backgroundColor: catColor }]} />
      <View style={styles.resultContent}>
        <Text style={styles.resultName} numberOfLines={1}>{serviceName}</Text>
        <Text style={styles.resultPath} numberOfLines={1}>{categoryName} › {subCategoryName}</Text>
      </View>
      <ChevronRight size={16} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<string>('');

  const catColors: Record<ServiceCategoryId, string> = useMemo(() => ({
    HOME: '#3B82F6',
    BEAUTY: '#EC4899',
    HEALTH: '#10B981',
    CHEF: '#F59E0B',
  }), []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchServices(query, t).slice(0, 50);
  }, [query, t]);

  const handleCategoryPress = useCallback((catId: ServiceCategoryId) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: catId } });
  }, [router]);

  const handleResultPress = useCallback((catId: ServiceCategoryId) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: catId } });
  }, [router]);

  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('customer.explore.searchPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            testID="explore-search-input"
          />
          {hasQuery && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <X size={18} color={colors.textTertiary} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {!hasQuery ? (
          <>
            <Text style={styles.sectionTitle}>{t('customer.explore.title')}</Text>
            <Text style={styles.sectionSubtitle}>{t('customer.explore.subtitle')}</Text>

            <View style={styles.categoriesGrid}>
              {SERVICE_CATALOG.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  id={cat.id}
                  name={t(`catalog.categories.${cat.id}.name`)}
                  color={cat.color}
                  bg={cat.bg}
                  onPress={() => handleCategoryPress(cat.id)}
                />
              ))}
            </View>

            <Text style={styles.popularTitle}>MVP Services</Text>
            {SERVICE_CATALOG.map((cat) => {
              const mvpSubs = cat.subcategories.filter((s) => s.isMvp);
              if (mvpSubs.length === 0) return null;
              return (
                <View key={cat.id} style={styles.mvpSection}>
                  <Text style={[styles.mvpCatLabel, { color: cat.color }]}>
                    {t(`catalog.categories.${cat.id}.name`)}
                  </Text>
                  {mvpSubs.map((sub) => (
                    <Pressable
                      key={sub.id}
                      style={styles.mvpItem}
                      onPress={() => handleCategoryPress(cat.id)}
                    >
                      <View style={[styles.mvpDot, { backgroundColor: cat.color }]} />
                      <Text style={styles.mvpName} numberOfLines={1}>
                        {t(`catalog.subcategories.${sub.id}.name`)}
                      </Text>
                      <View style={styles.mvpBadge}>
                        <Text style={styles.mvpBadgeText}>{sub.services.length}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              );
            })}
          </>
        ) : (
          <>
            {results.length > 0 ? (
              <>
                <Text style={styles.resultCount}>
                  {results.length} result{results.length !== 1 ? 's' : ''}
                </Text>
                {results.map((r, idx) => (
                  <SearchResultItem
                    key={`${r.serviceId}-${idx}`}
                    serviceName={r.serviceName}
                    subCategoryName={r.subCategoryName}
                    categoryName={r.categoryName}
                    catColor={catColors[r.categoryId]}
                    onPress={() => handleResultPress(r.categoryId)}
                  />
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Search size={48} color={colors.border} strokeWidth={1.2} />
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptySubtext}>Try searching for a different service</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
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
    minHeight: 46,
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
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  categoriesGrid: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  chipText: {
    ...typography.bodyMedium,
    flex: 1,
  },
  popularTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  mvpSection: {
    marginBottom: spacing.lg,
  },
  mvpCatLabel: {
    ...typography.captionMedium,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  mvpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  mvpDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  mvpName: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  mvpBadge: {
    backgroundColor: colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  mvpBadgeText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  resultCount: {
    ...typography.captionMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
    gap: spacing.sm,
  },
  resultDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  resultContent: { flex: 1, gap: 2 },
  resultName: { ...typography.bodyMedium, color: colors.text },
  resultPath: { ...typography.small, color: colors.textTertiary },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
