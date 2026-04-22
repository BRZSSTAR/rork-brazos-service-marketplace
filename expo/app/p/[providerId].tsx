import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Shield,
  Star,
  MapPin,
  BadgeCheck,
  Sparkles,
  Apple,
  Download,
  Calendar,
  ArrowRight,
  MessageCircle,
} from 'lucide-react-native';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import BrazosLogo from '@/components/BrazosLogo';
import { useProviderStore } from '@/store/providerStore';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';

const APP_STORE_URL = 'https://apps.apple.com/app/brazos';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=app.rork.brazos_service_marketplace_v6lg1c3';

function getStoreUrl(): string {
  if (Platform.OS === 'ios') return APP_STORE_URL;
  if (Platform.OS === 'android') return PLAY_STORE_URL;
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent ?? '';
    if (/android/i.test(ua)) return PLAY_STORE_URL;
    if (/iphone|ipad|ipod/i.test(ua)) return APP_STORE_URL;
  }
  return APP_STORE_URL;
}

export default function PublicProviderLanding() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const router = useRouter();
  const profile = useProviderStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const providerName = useMemo(() => {
    if (profile && profile.id === providerId) {
      return user?.name ?? 'Profissional BRAZOS';
    }
    return 'Profissional BRAZOS';
  }, [profile, providerId, user]);

  const bio = profile?.description ?? 'Profissional verificado pela BRAZOS, pronto para atender você com qualidade e transparência.';
  const serviceTitle = profile?.serviceTitle ?? 'Serviços profissionais';
  const serviceArea = profile?.serviceArea ?? 'São Paulo, SP';
  const pricePerHour = profile?.pricePerHourCents ? (profile.pricePerHourCents / 100).toFixed(0) : '—';
  const yearsExperience = profile?.yearsExperience ?? 0;

  useEffect(() => {
    console.log('[PublicLanding] Loaded for provider:', providerId);
  }, [providerId]);

  const handleBookNow = () => {
    if (isAuthenticated) {
      router.push('/customer/(home)');
      return;
    }
    const url = getStoreUrl();
    console.log('[PublicLanding] Redirecting to store:', url);
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined') window.location.href = url;
      return;
    }
    void Linking.openURL(url);
  };

  const handleOpenInApp = () => {
    router.replace('/');
  };

  const handleChat = () => {
    if (isAuthenticated) {
      router.push('/chat');
    } else {
      handleBookNow();
    }
  };

  return (
    <SafeAreaWrapper backgroundColor={colors.primary} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <BrazosLogo size={28} variant="full" tone="onDark" />
          <Pressable style={styles.openAppBtn} onPress={handleOpenInApp} testID="open-in-app">
            <Text style={styles.openAppBtnText}>Abrir app</Text>
          </Pressable>
        </View>

        <LinearGradient
          colors={[colors.primary, colors.primaryDeep]}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.heroTopDecor}>
            <Sparkles size={14} color={colors.accent} />
            <Text style={styles.heroDecorText}>CONVITE PESSOAL</Text>
          </View>

          <View style={styles.avatarRing}>
            <View style={styles.avatarInner}>
              <Image
                source={{ uri: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(providerName)}&backgroundColor=145A4A&textColor=C9A84C` }}
                style={styles.avatarImg}
              />
            </View>
            <View style={styles.verifiedBadge}>
              <BadgeCheck size={16} color={colors.primary} fill={colors.accent} />
            </View>
          </View>

          <Text style={styles.providerName}>{providerName}</Text>
          <Text style={styles.providerService}>{serviceTitle}</Text>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <Star size={14} color={colors.accent} fill={colors.accent} />
              </View>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>avaliação</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <Shield size={14} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>Verificado</Text>
              <Text style={styles.statLabel}>pela BRAZOS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconWrap}>
                <Calendar size={14} color={colors.accent} />
              </View>
              <Text style={styles.statValue}>{yearsExperience > 0 ? `${yearsExperience}+` : '—'}</Text>
              <Text style={styles.statLabel}>anos</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.ctaCard}>
            <View style={styles.ctaIconWrap}>
              <Download size={20} color={colors.primary} />
            </View>
            <View style={styles.ctaText}>
              <Text style={styles.ctaTitle}>Reserve pelo app BRAZOS</Text>
              <Text style={styles.ctaSubtitle}>
                Pagamento seguro, chat direto e garantia de serviço — só funciona dentro do app.
              </Text>
            </View>
          </View>

          <Pressable style={styles.primaryCta} onPress={handleBookNow} testID="book-now-cta">
            <Text style={styles.primaryCtaText}>Reservar com {providerName.split(' ')[0]}</Text>
            <ArrowRight size={18} color={colors.primary} />
          </Pressable>

          <View style={styles.storeRow}>
            <Pressable
              style={styles.storeBtn}
              onPress={() => {
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(APP_STORE_URL, '_blank');
                } else {
                  void Linking.openURL(APP_STORE_URL);
                }
              }}
              testID="app-store-btn"
            >
              <Apple size={18} color={colors.text} />
              <View>
                <Text style={styles.storeSmall}>Baixar na</Text>
                <Text style={styles.storeBig}>App Store</Text>
              </View>
            </Pressable>
            <Pressable
              style={styles.storeBtn}
              onPress={() => {
                if (Platform.OS === 'web' && typeof window !== 'undefined') {
                  window.open(PLAY_STORE_URL, '_blank');
                } else {
                  void Linking.openURL(PLAY_STORE_URL);
                }
              }}
              testID="play-store-btn"
            >
              <View style={styles.playIcon}>
                <Text style={styles.playIconText}>▶</Text>
              </View>
              <View>
                <Text style={styles.storeSmall}>Disponível no</Text>
                <Text style={styles.storeBig}>Google Play</Text>
              </View>
            </Pressable>
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>SOBRE</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.bio}>{bio}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.infoRowText}>{serviceArea}</Text>
            </View>
            <View style={styles.infoRow}>
              <Sparkles size={16} color={colors.primary} />
              <Text style={styles.infoRowText}>A partir de R$ {pricePerHour}/h</Text>
            </View>
          </View>

          <View style={styles.trustSection}>
            <Text style={styles.trustTitle}>Por que BRAZOS?</Text>
            <View style={styles.trustItem}>
              <Shield size={16} color={colors.success} />
              <Text style={styles.trustText}>Profissionais verificados com antecedentes</Text>
            </View>
            <View style={styles.trustItem}>
              <BadgeCheck size={16} color={colors.success} />
              <Text style={styles.trustText}>Pagamento seguro via Pix ou cartão</Text>
            </View>
            <View style={styles.trustItem}>
              <Star size={16} color={colors.success} />
              <Text style={styles.trustText}>Avaliações reais e suporte 24/7</Text>
            </View>
          </View>

          <Pressable style={styles.secondaryCta} onPress={handleChat} testID="chat-provider">
            <MessageCircle size={18} color={colors.primary} />
            <Text style={styles.secondaryCtaText}>Conversar antes de reservar</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Este perfil é exclusivo BRAZOS. Reservas e pagamentos acontecem somente dentro do app para sua proteção.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.stickyFooter}>
        <Pressable style={styles.stickyCta} onPress={handleBookNow} testID="sticky-book-cta">
          <Download size={18} color={colors.primary} />
          <Text style={styles.stickyCtaText}>Baixar app e reservar</Text>
        </Pressable>
      </View>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scrollContent: { paddingBottom: 120 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  openAppBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  openAppBtnText: { ...typography.smallMedium, color: colors.logo },
  heroGradient: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  heroTopDecor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.lg,
  },
  heroDecorText: { ...typography.small, color: colors.accent, letterSpacing: 1.5, fontWeight: '700' as const, fontSize: 10 },
  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDeep,
    marginBottom: spacing.md,
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    overflow: 'hidden',
  },
  avatarImg: { width: 96, height: 96 },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  providerName: { ...typography.h2, color: colors.logo, fontSize: 24, textAlign: 'center' },
  providerService: { ...typography.caption, color: 'rgba(255,255,255,0.7)', marginTop: 4, marginBottom: spacing.lg, textAlign: 'center' },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  statIconWrap: { marginBottom: 2 },
  statValue: { ...typography.bodyMedium, color: colors.logo, fontSize: 14 },
  statLabel: { ...typography.small, color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 0.5 },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.12)' },
  sheet: {
    backgroundColor: colors.surface,
    marginTop: -spacing.xl,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.accent + '18',
    borderWidth: 1,
    borderColor: colors.accent + '30',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  ctaIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { flex: 1, gap: 2 },
  ctaTitle: { ...typography.bodyMedium, color: colors.text },
  ctaSubtitle: { ...typography.small, color: colors.textSecondary, lineHeight: 16 },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md + 2,
    borderRadius: radius.full,
    ...shadow.md,
  },
  primaryCtaText: { ...typography.button, color: colors.primary },
  storeRow: { flexDirection: 'row', gap: spacing.sm },
  storeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.text,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.sm + 4,
    borderRadius: radius.md,
  },
  playIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconText: { color: colors.accent, fontSize: 14 },
  storeSmall: { ...typography.small, color: 'rgba(255,255,255,0.7)', fontSize: 9, letterSpacing: 0.5 },
  storeBig: { ...typography.bodyMedium, color: colors.logo, fontSize: 13 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.small, color: colors.textTertiary, letterSpacing: 2, fontSize: 10, fontWeight: '700' as const },
  bio: { ...typography.body, color: colors.text, lineHeight: 22 },
  infoGrid: { gap: spacing.sm },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
  infoRowText: { ...typography.caption, color: colors.text },
  trustSection: { gap: spacing.sm, marginTop: spacing.sm },
  trustTitle: { ...typography.h3, color: colors.text, fontSize: 16 },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  trustText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  secondaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    marginTop: spacing.sm,
  },
  secondaryCtaText: { ...typography.button, color: colors.primary, fontSize: 14 },
  footerText: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: spacing.md,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    ...shadow.lg,
  },
  stickyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  stickyCtaText: { ...typography.button, color: colors.primary },
});
