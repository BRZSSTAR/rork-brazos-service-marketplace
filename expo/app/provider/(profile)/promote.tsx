import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, Rocket, Star, Crown, TrendingUp, Eye, Target, Clock } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { PROMOTION_PACKAGES, type PromotionPackage } from '@/constants/subscription';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

const ICON_MAP = {
  zap: Zap,
  rocket: Rocket,
  star: Star,
  crown: Crown,
} as const;

function formatPrice(cents: number): string {
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatPricePerDay(cents: number, days: number): string {
  return `R$ ${(cents / 100 / days).toFixed(2).replace('.', ',')}/dia`;
}

function formatExpiresAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ' · ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function timeRemaining(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 'Expirado';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `${days}d ${hours}h restantes`;
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m restantes`;
}

export default function PromoteScreen() {
  const router = useRouter();
  const activePromotions = useSubscriptionStore((s) => s.activePromotions);
  const activatePromotion = useSubscriptionStore((s) => s.activatePromotion);
  const cancelPromotion = useSubscriptionStore((s) => s.cancelPromotion);

  const [selectedId, setSelectedId] = useState<string>(PROMOTION_PACKAGES[1].id);

  const selectedPkg = useMemo<PromotionPackage>(
    () => PROMOTION_PACKAGES.find((p) => p.id === selectedId) ?? PROMOTION_PACKAGES[0],
    [selectedId]
  );

  const handleActivate = () => {
    const run = async () => {
      const promo = await activatePromotion({
        id: selectedPkg.id,
        name: selectedPkg.name,
        priceCents: selectedPkg.priceCents,
        durationDays: selectedPkg.durationDays,
      });
      if (Platform.OS === 'web') {
        router.back();
      } else {
        Alert.alert(
          'Impulso ativado!',
          `Seu perfil está em destaque até ${formatExpiresAt(promo.expiresAt)}.`,
          [{ text: 'Entendi', onPress: () => router.back() }]
        );
      }
    };

    if (Platform.OS === 'web') {
      void run();
      return;
    }

    Alert.alert(
      `Ativar ${selectedPkg.name}?`,
      `Você será cobrado ${formatPrice(selectedPkg.priceCents)}. Seu perfil aparecerá no topo das buscas por ${selectedPkg.durationDays} ${selectedPkg.durationDays === 1 ? 'dia' : 'dias'}.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ativar', onPress: () => void run() },
      ]
    );
  };

  const handleCancel = (id: string) => {
    if (Platform.OS === 'web') {
      void cancelPromotion(id);
      return;
    }
    Alert.alert('Cancelar impulso', 'Tem certeza? O valor pago não será reembolsado.', [
      { text: 'Manter', style: 'cancel' },
      { text: 'Cancelar impulso', style: 'destructive', onPress: () => void cancelPromotion(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Impulsionar perfil' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#C9A84C', '#A8893D']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroIconWrap}>
              <Rocket size={24} color={colors.primary} />
            </View>
            <Text style={styles.heroTitle}>Apareça no topo{'\n'}das buscas</Text>
            <Text style={styles.heroSubtitle}>
              Perfis impulsionados recebem em média 3x mais visualizações.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.benefitsRow}>
          <View style={styles.benefit}>
            <View style={styles.benefitIconWrap}>
              <Eye size={16} color={colors.primary} />
            </View>
            <Text style={styles.benefitValue}>+300%</Text>
            <Text style={styles.benefitLabel}>visualizações</Text>
          </View>
          <View style={styles.benefit}>
            <View style={styles.benefitIconWrap}>
              <Target size={16} color={colors.primary} />
            </View>
            <Text style={styles.benefitValue}>Top 3</Text>
            <Text style={styles.benefitLabel}>resultados</Text>
          </View>
          <View style={styles.benefit}>
            <View style={styles.benefitIconWrap}>
              <TrendingUp size={16} color={colors.primary} />
            </View>
            <Text style={styles.benefitValue}>+2x</Text>
            <Text style={styles.benefitLabel}>reservas</Text>
          </View>
        </View>

        {activePromotions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Impulsos ativos</Text>
            <View style={styles.activeList}>
              {activePromotions.map((promo) => (
                <View key={promo.id} style={styles.activeItem}>
                  <View style={styles.activeDot} />
                  <View style={styles.activeInfo}>
                    <Text style={styles.activeName}>{promo.packageName}</Text>
                    <View style={styles.activeMetaRow}>
                      <Clock size={12} color={colors.textSecondary} />
                      <Text style={styles.activeMeta}>{timeRemaining(promo.expiresAt)}</Text>
                    </View>
                  </View>
                  <Pressable onPress={() => handleCancel(promo.id)} style={styles.activeCancelBtn} testID={`cancel-promo-${promo.id}`}>
                    <Text style={styles.activeCancelText}>Cancelar</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escolha um pacote</Text>
          <View style={styles.packageGrid}>
            {PROMOTION_PACKAGES.map((pkg) => {
              const Icon = ICON_MAP[pkg.icon];
              const active = selectedId === pkg.id;
              const isBestValue = pkg.id === 'weekly';
              return (
                <Pressable
                  key={pkg.id}
                  onPress={() => setSelectedId(pkg.id)}
                  style={[styles.pkgCard, active && styles.pkgCardActive, { borderColor: active ? pkg.color : colors.border }]}
                  testID={`pkg-${pkg.id}`}
                >
                  {isBestValue && (
                    <View style={[styles.pkgBadge, { backgroundColor: pkg.color }]}>
                      <Text style={styles.pkgBadgeText}>MELHOR CUSTO</Text>
                    </View>
                  )}
                  <View style={[styles.pkgIconWrap, { backgroundColor: pkg.color + '20' }]}>
                    <Icon size={20} color={pkg.color} />
                  </View>
                  <Text style={styles.pkgName}>{pkg.name}</Text>
                  <Text style={styles.pkgDescription}>{pkg.description}</Text>
                  <View style={styles.pkgPriceBlock}>
                    <Text style={styles.pkgPrice}>{formatPrice(pkg.priceCents)}</Text>
                    <Text style={styles.pkgPerDay}>{formatPricePerDay(pkg.priceCents, pkg.durationDays)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Como funciona?</Text>
          <Text style={styles.infoBody}>
            • Seu perfil aparece no topo das buscas da sua categoria e região{'\n'}
            • Badge "Destaque" visível para clientes{'\n'}
            • Você pode empilhar vários impulsos para prolongar a duração{'\n'}
            • Pagamento via Pix ou cartão cadastrado
          </Text>
        </View>

        <Text style={styles.fineprint}>
          Os impulsos são cumulativos mas não reembolsáveis. Assinantes Pro e Elite recebem impulsos mensais grátis inclusos no plano.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.activateBtn} onPress={handleActivate} testID="activate-promotion">
          <Text style={styles.activateBtnText}>
            Ativar {selectedPkg.name} · {formatPrice(selectedPkg.priceCents)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: 140 },
  heroCard: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadow.md,
  },
  heroGradient: { padding: spacing.lg, gap: spacing.sm },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: { ...typography.h2, color: colors.primary, fontSize: 26, lineHeight: 32 },
  heroSubtitle: { ...typography.caption, color: 'rgba(10,45,37,0.75)' },
  benefitsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  benefit: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadow.sm,
  },
  benefitIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitValue: { ...typography.h3, color: colors.text },
  benefitLabel: { ...typography.small, color: colors.textSecondary },
  section: { marginBottom: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.md },
  activeList: { gap: spacing.sm },
  activeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.success + '40',
  },
  activeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  activeInfo: { flex: 1, gap: 2 },
  activeName: { ...typography.bodyMedium, color: colors.text },
  activeMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  activeMeta: { ...typography.small, color: colors.textSecondary },
  activeCancelBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
  },
  activeCancelText: { ...typography.small, color: colors.error, fontWeight: '600' as const },
  packageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  pkgCard: {
    width: '48%' as unknown as number,
    flexGrow: 1,
    flexBasis: '45%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    gap: spacing.xs + 2,
    ...shadow.sm,
  },
  pkgCardActive: { ...shadow.md },
  pkgBadge: {
    position: 'absolute',
    top: -8,
    right: spacing.sm,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  pkgBadgeText: { ...typography.small, color: colors.primary, fontSize: 9, fontWeight: '700' as const, letterSpacing: 0.8 },
  pkgIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pkgName: { ...typography.bodyMedium, color: colors.text },
  pkgDescription: { ...typography.small, color: colors.textSecondary, minHeight: 32 },
  pkgPriceBlock: { marginTop: spacing.xs, gap: 2 },
  pkgPrice: { ...typography.h3, color: colors.text, fontSize: 20 },
  pkgPerDay: { ...typography.small, color: colors.accentDark },
  infoBox: {
    backgroundColor: colors.primary + '08',
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    gap: spacing.xs,
  },
  infoTitle: { ...typography.bodyMedium, color: colors.primary },
  infoBody: { ...typography.caption, color: colors.text, lineHeight: 20 },
  fineprint: { ...typography.small, color: colors.textTertiary, marginTop: spacing.md, lineHeight: 16 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    paddingBottom: spacing.lg + (Platform.OS === 'ios' ? 20 : 0),
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  activateBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activateBtnText: { ...typography.button, color: colors.primary },
});
