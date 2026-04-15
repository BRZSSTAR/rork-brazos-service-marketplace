import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Animated,
  Modal,
  Platform,
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
  SlidersHorizontal,
  Star,
  Clock,
  ArrowUpDown,
  DollarSign,
  MapPin,
  Zap,
  Check,
  RotateCcw,
} from 'lucide-react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import { SERVICE_CATALOG, searchServices } from '@/constants/serviceCatalog';
import type { ServiceCategoryId } from '@/constants/serviceCatalog';

type SortOption = 'relevance' | 'rating_high' | 'price_low' | 'price_high' | 'distance' | 'newest';
type AvailabilityFilter = 'any' | 'now' | 'today' | 'this_week';
type RatingFilter = 'any' | '4plus' | '4_5plus' | '5only';
type PriceFilter = 'any' | 'budget' | 'mid' | 'premium';

interface FilterState {
  sort: SortOption;
  availability: AvailabilityFilter;
  rating: RatingFilter;
  price: PriceFilter;
  category: ServiceCategoryId | 'ALL';
}

const DEFAULT_FILTERS: FilterState = {
  sort: 'relevance',
  availability: 'any',
  rating: 'any',
  price: 'any',
  category: 'ALL',
};

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

function FilterChipRow({
  label,
  icon: IconComp,
  isActive,
  onPress,
}: {
  label: string;
  icon: typeof Star;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterQuickChip,
        isActive && styles.filterQuickChipActive,
      ]}
    >
      <IconComp size={14} color={isActive ? colors.surface : colors.primary} />
      <Text style={[styles.filterQuickChipText, isActive && styles.filterQuickChipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function FilterOptionButton({
  label,
  isSelected,
  onPress,
}: {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterOption, isSelected && styles.filterOptionSelected]}
    >
      <Text style={[styles.filterOptionText, isSelected && styles.filterOptionTextSelected]}>
        {label}
      </Text>
      {isSelected && <Check size={14} color={colors.surface} />}
    </Pressable>
  );
}

function FilterModal({
  visible,
  filters,
  onClose,
  onApply,
  onReset,
  t,
}: {
  visible: boolean;
  filters: FilterState;
  onClose: () => void;
  onApply: (f: FilterState) => void;
  onReset: () => void;
  t: (key: string, opts?: Record<string, string>) => string;
}) {
  const [draft, setDraft] = useState<FilterState>(filters);

  const updateDraft = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleApply = useCallback(() => {
    onApply(draft);
    onClose();
  }, [draft, onApply, onClose]);

  const handleReset = useCallback(() => {
    setDraft(DEFAULT_FILTERS);
    onReset();
    onClose();
  }, [onReset, onClose]);

  React.useEffect(() => {
    if (visible) setDraft(filters);
  }, [visible, filters]);

  const activeCount = useMemo(() => {
    let count = 0;
    if (draft.sort !== 'relevance') count++;
    if (draft.availability !== 'any') count++;
    if (draft.rating !== 'any') count++;
    if (draft.price !== 'any') count++;
    if (draft.category !== 'ALL') count++;
    return count;
  }, [draft]);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'relevance', label: t('customer.explore.filters.sortRelevance') },
    { value: 'rating_high', label: t('customer.explore.filters.sortRatingHigh') },
    { value: 'price_low', label: t('customer.explore.filters.sortPriceLow') },
    { value: 'price_high', label: t('customer.explore.filters.sortPriceHigh') },
    { value: 'distance', label: t('customer.explore.filters.sortDistance') },
    { value: 'newest', label: t('customer.explore.filters.sortNewest') },
  ];

  const availabilityOptions: { value: AvailabilityFilter; label: string }[] = [
    { value: 'any', label: t('customer.explore.filters.availAny') },
    { value: 'now', label: t('customer.explore.filters.availNow') },
    { value: 'today', label: t('customer.explore.filters.availToday') },
    { value: 'this_week', label: t('customer.explore.filters.availWeek') },
  ];

  const ratingOptions: { value: RatingFilter; label: string }[] = [
    { value: 'any', label: t('customer.explore.filters.ratingAny') },
    { value: '4plus', label: '4.0+' },
    { value: '4_5plus', label: '4.5+' },
    { value: '5only', label: '5.0' },
  ];

  const priceOptions: { value: PriceFilter; label: string }[] = [
    { value: 'any', label: t('customer.explore.filters.priceAny') },
    { value: 'budget', label: t('customer.explore.filters.priceBudget') },
    { value: 'mid', label: t('customer.explore.filters.priceMid') },
    { value: 'premium', label: t('customer.explore.filters.pricePremium') },
  ];

  const categoryOptions: { value: ServiceCategoryId | 'ALL'; label: string }[] = [
    { value: 'ALL', label: t('customer.explore.filters.catAll') },
    ...SERVICE_CATALOG.map((cat) => ({
      value: cat.id,
      label: t(`catalog.categories.${cat.id}.name`),
    })),
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Pressable onPress={onClose} hitSlop={12} testID="filter-close">
            <X size={22} color={colors.text} />
          </Pressable>
          <Text style={styles.modalTitle}>{t('customer.explore.filters.title')}</Text>
          <Pressable onPress={handleReset} hitSlop={12} style={styles.resetButton} testID="filter-reset">
            <RotateCcw size={16} color={colors.primary} />
            <Text style={styles.resetText}>{t('customer.explore.filters.reset')}</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.modalScroll}
          contentContainerStyle={styles.modalScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <ArrowUpDown size={16} color={colors.primary} />
              <Text style={styles.filterSectionTitle}>{t('customer.explore.filters.sortBy')}</Text>
            </View>
            <View style={styles.filterOptionsWrap}>
              {sortOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={draft.sort === opt.value}
                  onPress={() => updateDraft('sort', opt.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Clock size={16} color={colors.primary} />
              <Text style={styles.filterSectionTitle}>{t('customer.explore.filters.availability')}</Text>
            </View>
            <View style={styles.filterOptionsWrap}>
              {availabilityOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={draft.availability === opt.value}
                  onPress={() => updateDraft('availability', opt.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Star size={16} color={colors.primary} />
              <Text style={styles.filterSectionTitle}>{t('customer.explore.filters.rating')}</Text>
            </View>
            <View style={styles.filterOptionsWrap}>
              {ratingOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={draft.rating === opt.value}
                  onPress={() => updateDraft('rating', opt.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <DollarSign size={16} color={colors.primary} />
              <Text style={styles.filterSectionTitle}>{t('customer.explore.filters.priceRange')}</Text>
            </View>
            <View style={styles.filterOptionsWrap}>
              {priceOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={draft.price === opt.value}
                  onPress={() => updateDraft('price', opt.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterDivider} />

          <View style={styles.filterSection}>
            <View style={styles.filterSectionHeader}>
              <Home size={16} color={colors.primary} />
              <Text style={styles.filterSectionTitle}>{t('customer.explore.filters.category')}</Text>
            </View>
            <View style={styles.filterOptionsWrap}>
              {categoryOptions.map((opt) => (
                <FilterOptionButton
                  key={opt.value}
                  label={opt.label}
                  isSelected={draft.category === opt.value}
                  onPress={() => updateDraft('category', opt.value)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <Pressable style={styles.applyButton} onPress={handleApply} testID="filter-apply">
            <Text style={styles.applyButtonText}>
              {t('customer.explore.filters.apply')}
              {activeCount > 0 ? ` (${activeCount})` : ''}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function ExploreScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

  const catColors: Record<ServiceCategoryId, string> = useMemo(() => ({
    HOME: '#3B82F6',
    BEAUTY: '#EC4899',
    HEALTH: '#10B981',
    CHEF: '#F59E0B',
  }), []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.sort !== 'relevance') count++;
    if (filters.availability !== 'any') count++;
    if (filters.rating !== 'any') count++;
    if (filters.price !== 'any') count++;
    if (filters.category !== 'ALL') count++;
    return count;
  }, [filters]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    let items = searchServices(query, t).slice(0, 50);
    if (filters.category !== 'ALL') {
      items = items.filter((r) => r.categoryId === filters.category);
    }
    return items;
  }, [query, t, filters.category]);

  const handleCategoryPress = useCallback((catId: ServiceCategoryId) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: catId } });
  }, [router]);

  const handleResultPress = useCallback((catId: ServiceCategoryId) => {
    router.push({ pathname: '/customer/category-browse', params: { categoryId: catId } });
  }, [router]);

  const handleQuickAvailability = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability === 'now' ? 'any' : 'now',
    }));
  }, []);

  const handleQuickRating = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === '4plus' ? 'any' : '4plus',
    }));
  }, []);

  const handleQuickPriceLow = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sort: prev.sort === 'price_low' ? 'relevance' : 'price_low',
    }));
  }, []);

  const handleQuickNearby = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sort: prev.sort === 'distance' ? 'relevance' : 'distance',
    }));
  }, []);

  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
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
          <Pressable
            style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilterModal(true)}
            testID="explore-filter-button"
          >
            <SlidersHorizontal size={18} color={activeFilterCount > 0 ? colors.surface : colors.primary} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickFiltersRow}
          style={styles.quickFiltersScroll}
        >
          <FilterChipRow
            label={t('customer.explore.filters.availNow')}
            icon={Zap}
            isActive={filters.availability === 'now'}
            onPress={handleQuickAvailability}
          />
          <FilterChipRow
            label={t('customer.explore.filters.topRated')}
            icon={Star}
            isActive={filters.rating === '4plus'}
            onPress={handleQuickRating}
          />
          <FilterChipRow
            label={t('customer.explore.filters.lowestPrice')}
            icon={DollarSign}
            isActive={filters.sort === 'price_low'}
            onPress={handleQuickPriceLow}
          />
          <FilterChipRow
            label={t('customer.explore.filters.nearby')}
            icon={MapPin}
            isActive={filters.sort === 'distance'}
            onPress={handleQuickNearby}
          />
        </ScrollView>
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

            <View style={styles.popularHeader}>
              <Text style={styles.popularTitle}>{t('customer.explore.popularServices')}</Text>
              <View style={styles.popularBadgeWrap}>
                <Zap size={12} color={colors.accent} />
                <Text style={styles.popularBadgeLabel}>{t('customer.explore.trending')}</Text>
              </View>
            </View>

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
                  {results.length} {t('customer.explore.results')}
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
                <Text style={styles.emptyTitle}>{t('customer.explore.noResults')}</Text>
                <Text style={styles.emptySubtext}>{t('customer.explore.noResultsHint')}</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        filters={filters}
        onClose={() => setShowFilterModal(false)}
        onApply={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
        t={t}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    ...typography.small,
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700' as const,
  },
  quickFiltersScroll: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  quickFiltersRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  filterQuickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterQuickChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterQuickChipText: {
    ...typography.small,
    fontWeight: '500' as const,
    color: colors.text,
  },
  filterQuickChipTextActive: {
    color: colors.surface,
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
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  popularTitle: {
    ...typography.h3,
    color: colors.text,
  },
  popularBadgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  popularBadgeLabel: {
    ...typography.small,
    fontWeight: '600' as const,
    color: colors.accent,
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
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' as const },

  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? spacing.lg : spacing.xl + spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    ...typography.captionMedium,
    color: colors.primary,
  },
  modalScroll: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: spacing.xxl,
  },
  filterSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  filterSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterSectionTitle: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  filterOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    ...typography.caption,
    fontWeight: '500' as const,
    color: colors.text,
  },
  filterOptionTextSelected: {
    color: colors.surface,
  },
  filterDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.lg,
  },
  modalFooter: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    ...typography.button,
    color: colors.surface,
  },
});
