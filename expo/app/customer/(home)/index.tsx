import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Star,
  ArrowRight,
  Clock,
  Shield,
  Sparkles,
  Gift,
  TrendingUp,
  Bell,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const BANNER_HEIGHT = 160;
const FLOATING_BAR_HEIGHT = 82;

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  bg: string;
  gradient?: readonly [string, string, ...string[]];
  icon: typeof Star;
}

const promoBanners: PromoBanner[] = [
  {
    id: 'welcome',
    title: 'promos.welcome.title',
    subtitle: 'promos.welcome.subtitle',
    accent: colors.accent,
    bg: colors.primary,
    gradient: ['#145A4A', '#0E3F34', '#0A2D25'] as const,
    icon: Sparkles,
  },
  {
    id: 'referral',
    title: 'promos.referral.title',
    subtitle: 'promos.referral.subtitle',
    accent: '#FFE9A8',
    bg: '#8A6A1F',
    gradient: ['#8A6A1F', '#A6842B', '#C8A84B'] as const,
    icon: Gift,
  },
  {
    id: 'trending',
    title: 'promos.trending.title',
    subtitle: 'promos.trending.subtitle',
    accent: '#FFD9D9',
    bg: '#7A2E2E',
    gradient: ['#7A2E2E', '#A34343', '#C95858'] as const,
    icon: TrendingUp,
  },
];

interface QuickServiceItem {
  id: string;
  labelKey: string;
  categoryId: string;
  emoji: string;
}

const quickServices: QuickServiceItem[] = [
  { id: 'cleaning', labelKey: 'quickServices.cleaning', categoryId: 'HOME', emoji: '🧹' },
  { id: 'haircut', labelKey: 'quickServices.haircut', categoryId: 'BEAUTY', emoji: '💇' },
  { id: 'massage', labelKey: 'quickServices.massage', categoryId: 'HEALTH', emoji: '💆' },
  { id: 'chef', labelKey: 'quickServices.chef', categoryId: 'CHEF', emoji: '👨‍🍳' },
  { id: 'plumbing', labelKey: 'quickServices.plumbing', categoryId: 'HOME', emoji: '🔧' },
  { id: 'nails', labelKey: 'quickServices.nails', categoryId: 'BEAUTY', emoji: '💅' },
];

function BannerCard({ item, t }: { item: PromoBanner; t: (key: string, opts?: Record<string, string>) => string }) {
  const IconComp = item.icon;
  const content = (
    <>
      <View style={bannerStyles.cardContent}>
        <View style={[bannerStyles.iconCircle, { backgroundColor: `${item.accent}22` }]}>
          <IconComp size={24} color={item.accent} />
        </View>
        <Text style={[bannerStyles.cardTitle, { color: '#FFFFFF' }]}>{t(item.title)}</Text>
        <Text style={[bannerStyles.cardSubtitle, { color: 'rgba(255,255,255,0.7)' }]}>{t(item.subtitle)}</Text>
      </View>
      <View style={[bannerStyles.accentBar, { backgroundColor: item.accent }]} />
    </>
  );

  if (item.gradient) {
    return (
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={bannerStyles.card}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View style={[bannerStyles.card, { backgroundColor: item.bg }]}>
      {content}
    </View>
  );
}

function QuickServiceChip({
  item,
  onPress,
  t,
}: {
  item: QuickServiceItem;
  onPress: () => void;
  t: (key: string) => string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[chipStyles.chip, { transform: [{ scale }] }]}>
        <Text style={chipStyles.chipEmoji}>{item.emoji}</Text>
        <Text style={chipStyles.chipLabel}>{t(item.labelKey)}</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [cityName, setCityName] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState<boolean>(true);
  const [locationError, setLocationError] = useState<string>('');
  const [activeBannerIndex, setActiveBannerIndex] = useState<number>(0);
  const bannerScrollRef = useRef<FlatList<PromoBanner>>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bannerTimerRef.current = setInterval(() => {
      setActiveBannerIndex((prev) => {
        const next = (prev + 1) % promoBanners.length;
        bannerScrollRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4500);
    return () => {
      if (bannerTimerRef.current) clearInterval(bannerTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function reverseGeocodeWithNominatim(latitude: number, longitude: number) {
      console.log('[Home] Reverse geocoding coords:', latitude, longitude);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR,pt,en' } }
      );
      const data = await response.json();
      console.log('[Home] Nominatim response:', JSON.stringify(data?.address));
      const city = data?.address?.city || data?.address?.town || data?.address?.municipality || data?.address?.village || '';
      const state = data?.address?.state || '';
      return city && state ? `${city}, ${state}` : city || state || '';
    }

    async function detectCity() {
      try {
        if (Platform.OS === 'web') {
          if (!('geolocation' in navigator)) {
            console.log('[Home] Geolocation API not available');
            if (mounted) { setLocationLoading(false); setLocationError('noapi'); }
            return;
          }
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const name = await reverseGeocodeWithNominatim(latitude, longitude);
                if (mounted) {
                  setCityName(name);
                  setLocationLoading(false);
                  console.log('[Home] City detected (web):', name);
                }
              } catch (e) {
                console.log('[Home] Reverse geocode error:', e);
                if (mounted) { setLocationLoading(false); setLocationError('geocode'); }
              }
            },
            (err) => {
              console.log('[Home] Web geolocation error:', err.code, err.message);
              if (mounted) { setLocationLoading(false); setLocationError('denied'); }
            },
            { timeout: 10000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        } else {
          const Location = await import('expo-location');
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.log('[Home] Location permission denied');
            if (mounted) { setLocationLoading(false); setLocationError('denied'); }
            return;
          }
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
          const [geo] = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          if (mounted && geo) {
            const city = geo.city || geo.subregion || '';
            const state = geo.region || '';
            const name = city && state ? `${city}, ${state}` : city || state;
            setCityName(name);
            setLocationLoading(false);
            console.log('[Home] City detected (native):', name);
          } else if (mounted) {
            const name = await reverseGeocodeWithNominatim(loc.coords.latitude, loc.coords.longitude);
            setCityName(name);
            setLocationLoading(false);
          }
        }
      } catch (e) {
        console.log('[Home] Location detection error:', e);
        if (mounted) { setLocationLoading(false); setLocationError('error'); }
      }
    }
    void detectCity();
    return () => { mounted = false; };
  }, []);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? t('customer.home.fallbackName');

  const handleBannerScroll = useCallback((e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / BANNER_WIDTH);
    setActiveBannerIndex(idx);
  }, []);

  const renderBanner = useCallback(({ item }: { item: PromoBanner }) => (
    <BannerCard item={item} t={t} />
  ), [t]);

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroTop}>
            <View style={styles.heroTextWrap}>
              <Text style={styles.greeting}>{t('customer.home.greeting', { name: firstName })}</Text>
              <Text style={styles.heroTitle}>{t('customer.home.title')}</Text>
            </View>
            <Pressable
              style={styles.notifButton}
              onPress={() => router.push('/notifications')}
              testID="notif-btn"
            >
              <Bell size={20} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.locationRow}>
            <MapPin size={14} color={colors.primary} />
            {cityName ? (
              <Text style={styles.locationText}>{cityName}</Text>
            ) : locationLoading ? (
              <Text style={styles.locationText}>{t('customer.home.detectingLocation', { defaultValue: 'Detecting location...' })}</Text>
            ) : locationError === 'denied' ? (
              <Pressable onPress={() => { setLocationLoading(true); setLocationError(''); }}>
                <Text style={styles.locationTextTap}>{t('customer.home.enableLocation', { defaultValue: 'Tap to enable location' })}</Text>
              </Pressable>
            ) : (
              <Text style={styles.locationText}>{t('customer.home.locationUnavailable', { defaultValue: 'Location unavailable' })}</Text>
            )}
          </View>
        </View>

        <View style={bannerStyles.container}>
          <FlatList
            ref={bannerScrollRef}
            data={promoBanners}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_WIDTH + spacing.md}
            decelerationRate="fast"
            onMomentumScrollEnd={handleBannerScroll}
            contentContainerStyle={bannerStyles.listContent}
            getItemLayout={(_, index) => ({
              length: BANNER_WIDTH + spacing.md,
              offset: (BANNER_WIDTH + spacing.md) * index,
              index,
            })}
          />
          <View style={bannerStyles.dotsRow}>
            {promoBanners.map((_, i) => (
              <View
                key={i}
                style={[
                  bannerStyles.dot,
                  i === activeBannerIndex && bannerStyles.dotActive,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('customer.home.quickServicesTitle', { defaultValue: 'Popular Services' })}</Text>
            <Pressable
              onPress={() => router.push('/customer/(explore)')}
              style={styles.seeAllBtn}
            >
              <Text style={styles.seeAllText}>{t('customer.home.seeAll', { defaultValue: 'See all' })}</Text>
              <ArrowRight size={14} color={colors.accent} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={chipStyles.scrollContent}>
            {quickServices.map((svc) => (
              <QuickServiceChip
                key={svc.id}
                item={svc}
                t={t}
                onPress={() => router.push({ pathname: '/customer/category-browse', params: { categoryId: svc.categoryId } })}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('customer.home.highlights')}</Text>
          </View>
          <View style={styles.promoGrid}>
            <Pressable style={styles.promoCardSmall} onPress={() => router.push('/customer/(explore)')}>
              <View style={[styles.promoIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Clock size={20} color="#3B82F6" />
              </View>
              <Text style={styles.promoCardTitle}>{t('customer.home.promoAvailNow', { defaultValue: 'Available Now' })}</Text>
              <Text style={styles.promoCardDesc}>{t('customer.home.promoAvailNowDesc', { defaultValue: 'Professionals ready to serve you today' })}</Text>
            </Pressable>
            <Pressable style={styles.promoCardSmall} onPress={() => router.push('/customer/(explore)')}>
              <View style={[styles.promoIconWrap, { backgroundColor: '#ECFDF5' }]}>
                <Shield size={20} color="#10B981" />
              </View>
              <Text style={styles.promoCardTitle}>{t('customer.home.promoVerified', { defaultValue: 'Verified Pros' })}</Text>
              <Text style={styles.promoCardDesc}>{t('customer.home.promoVerifiedDesc', { defaultValue: 'Background-checked & certified' })}</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('customer.home.featuredBadge')}</Text>
          </View>
          <View style={styles.featuredCard}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>{t('customer.home.featuredBadge')}</Text>
            </View>
            <Text style={styles.featuredTitle}>{t('customer.home.featuredTitle')}</Text>
            <Text style={styles.featuredDesc}>{t('customer.home.featuredDescription')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('customer.home.nextBookings')}</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('customer.home.noBookings')}</Text>
            <Text style={styles.emptySubtext}>{t('customer.home.noBookingsDescription')}</Text>
          </View>
        </View>

        <View style={{ height: FLOATING_BAR_HEIGHT }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.lg },
  heroSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroTextWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  greeting: { ...typography.captionMedium, color: colors.primary },
  heroTitle: { ...typography.h1, color: colors.text, fontSize: 26, lineHeight: 32 },
  notifButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  locationText: {
    ...typography.small,
    color: colors.textSecondary,
  },
  locationTextTap: {
    ...typography.small,
    color: colors.accent,
    textDecorationLine: 'underline' as const,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.text },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: { ...typography.captionMedium, color: colors.accent },
  promoGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  promoCardSmall: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  promoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCardTitle: { ...typography.bodyMedium, color: colors.text, fontSize: 14 },
  promoCardDesc: { ...typography.small, color: colors.textSecondary },
  featuredCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
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
  emptySubtext: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' as const },
});

const bannerStyles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: radius.lg,
    marginRight: spacing.md,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  cardContent: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    ...typography.h3,
    fontSize: 18,
  },
  cardSubtitle: {
    ...typography.caption,
    lineHeight: 18,
  },
  accentBar: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.disabled,
  },
  dotActive: {
    width: 20,
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
});

const chipStyles = StyleSheet.create({
  scrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  chip: {
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.sm,
  },
  chipEmoji: {
    fontSize: 18,
  },
  chipLabel: {
    ...typography.captionMedium,
    color: colors.text,
  },
});
