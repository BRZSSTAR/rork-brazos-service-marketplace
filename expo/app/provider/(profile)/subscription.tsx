import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Switch } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, Sparkles, Zap, TrendingUp, Rocket } from 'lucide-react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SUBSCRIPTION_TIERS, type SubscriptionTier, type SubscriptionTierId } from '@/constants/subscription';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';

function formatPrice(cents: number): string {
  if (cents === 0) return 'R$ 0';
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

const tierIcons: Record<SubscriptionTierId, typeof Crown> = {
  STARTER: Sparkles,
  PRO: Rocket,
  ELITE: Crown,
};

export default function SubscriptionScreen() {
  const router = useRouter();
  const currentTierId = useSubscriptionStore((s) => s.tierId);
  const renewsAt = useSubscriptionStore((s) => s.renewsAt);
  const autoRenew = useSubscriptionStore((s) => s.autoRenew);
  const selectTier = useSubscriptionStore((s) => s.selectTier);
  const toggleAutoRenew = useSubscriptionStore((s) => s.toggleAutoRenew);

  const [selectedId, setSelectedId] = useState<SubscriptionTierId>(currentTierId);

  const selectedTier = useMemo<SubscriptionTier>(
    () => SUBSCRIPTION_TIERS.find((t) => t.id === selectedId) ?? SUBSCRIPTION_TIERS[0],
    [selectedId]
  );

  const isCurrent = selectedId === currentTierId;

  const handleConfirm = () => {
    if (isCurrent) return;
    const tier = selectedTier;
    const message = tier.monthlyFeeCents > 0
      ? `Você será cobrado ${formatPrice(tier.monthlyFeeCents)}/mês. Comissão: ${tier.commissionPercent}% por serviço.`
      : `Sem mensalidade. Comissão: ${tier.commissionPercent}% por serviço.`;

    const run = async () => {
      await selectTier(tier.id);
      if (Platform.OS === 'web') {
        router.back();
      } else {
        Alert.alert('Plano ativado', `Seu plano ${tier.name} está ativo.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    };

    if (Platform.OS === 'web') {
      void run();
      return;
    }

    Alert.alert(
      `Mudar para ${tier.name}?`,
      message,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', style: 'default', onPress: () => void run() },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Planos & Comissão' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#145A4A', '#0A2D25']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroBadge}>
              <TrendingUp size={14} color={colors.accent} />
              <Text style={styles.heroBadgeText}>PROFISSIONAL</Text>
            </View>
            <Text style={styles.heroTitle}>Ganhe mais com o plano certo</Text>
            <Text style={styles.heroSubtitle}>
              Mensalidades menores = menos comissão por serviço. Escolha o que faz sentido para o seu volume.
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.tiersWrap}>
          {SUBSCRIPTION_TIERS.map((tier) => {
            const active = selectedId === tier.id;
            const IsCurrent = currentTierId === tier.id;
            const Icon = tierIcons[tier.id];
            return (
              <Pressable
                key={tier.id}
                onPress={() => setSelectedId(tier.id)}
                style={[
                  styles.tierCard,
                  active && styles.tierCardActive,
                  tier.highlight && styles.tierCardHighlight,
                ]}
                testID={`tier-${tier.id}`}
              >
                {tier.highlight && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>MAIS POPULAR</Text>
                  </View>
                )}
                <View style={styles.tierHeader}>
                  <View style={[styles.tierIconWrap, { backgroundColor: tier.color + '20' }]}>
                    <Icon size={20} color={tier.color} />
                  </View>
                  <View style={styles.tierHeaderText}>
                    <View style={styles.tierNameRow}>
                      <Text style={styles.tierName}>{tier.name}</Text>
                      {IsCurrent && (
                        <View style={styles.currentPill}>
                          <Text style={styles.currentPillText}>ATUAL</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.tierTagline}>{tier.tagline}</Text>
                  </View>
                  <View style={[styles.radio, active && styles.radioActive]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceValue}>
                    {formatPrice(tier.monthlyFeeCents)}
                  </Text>
                  <Text style={styles.priceUnit}>
                    {tier.monthlyFeeCents === 0 ? '/ sempre' : '/ mês'}
                  </Text>
                </View>

                <View style={[styles.commissionRow, { backgroundColor: tier.color + '12' }]}>
                  <Text style={[styles.commissionValue, { color: tier.color }]}>
                    {tier.commissionPercent}%
                  </Text>
                  <Text style={styles.commissionLabel}>de comissão por serviço concluído</Text>
                </View>

                <View style={styles.featuresList}>
                  {tier.features.map((feature) => (
                    <View key={feature} style={styles.featureRow}>
                      <View style={[styles.checkWrap, { backgroundColor: tier.color + '20' }]}>
                        <Check size={12} color={tier.color} strokeWidth={3} />
                      </View>
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {currentTierId !== 'STARTER' && renewsAt && (
          <View style={styles.renewCard}>
            <View style={styles.renewRow}>
              <View style={styles.renewInfo}>
                <Text style={styles.renewLabel}>Próxima cobrança</Text>
                <Text style={styles.renewValue}>{formatDate(renewsAt)}</Text>
              </View>
              <View style={styles.renewToggle}>
                <Text style={styles.renewToggleLabel}>Renovação automática</Text>
                <Switch
                  value={autoRenew}
                  onValueChange={() => void toggleAutoRenew()}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.accent}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.promoTeaser}>
          <View style={styles.promoTeaserIcon}>
            <Zap size={18} color={colors.accent} />
          </View>
          <View style={styles.promoTeaserText}>
            <Text style={styles.promoTeaserTitle}>Impulsione seu perfil</Text>
            <Text style={styles.promoTeaserSubtitle}>
              A partir de R$ 3/dia — apareça no topo das buscas.
            </Text>
          </View>
          <Pressable
            style={styles.promoTeaserBtn}
            onPress={() => router.push('/provider/(profile)/promote')}
            testID="go-to-promote"
          >
            <Text style={styles.promoTeaserBtnText}>Ver</Text>
          </Pressable>
        </View>

        <Text style={styles.fineprint}>
          Os valores de mensalidade são cobrados automaticamente via Pix ou cartão cadastrado. Você pode alterar ou cancelar seu plano a qualquer momento. As comissões são descontadas do valor recebido em cada serviço concluído.
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.confirmBtn, isCurrent && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={isCurrent}
          testID="confirm-subscription"
        >
          <Text style={[styles.confirmBtnText, isCurrent && styles.confirmBtnTextDisabled]}>
            {isCurrent
              ? `Plano ${selectedTier.name} ativo`
              : selectedTier.monthlyFeeCents === 0
                ? `Mudar para ${selectedTier.name} (grátis)`
                : `Assinar ${selectedTier.name} · ${formatPrice(selectedTier.monthlyFeeCents)}/mês`}
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
  heroGradient: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201,168,76,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.35)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  heroBadgeText: { ...typography.small, color: colors.accent, letterSpacing: 1, fontWeight: '700' as const },
  heroTitle: { ...typography.h2, color: colors.textInverse, fontSize: 24, lineHeight: 30 },
  heroSubtitle: { ...typography.caption, color: 'rgba(255,255,255,0.75)' },
  tiersWrap: { gap: spacing.md },
  tierCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: spacing.md,
    ...shadow.sm,
  },
  tierCardActive: { borderColor: colors.primary, ...shadow.md },
  tierCardHighlight: { borderColor: colors.accent },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  popularBadgeText: {
    ...typography.small,
    color: colors.primary,
    fontWeight: '700' as const,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  tierHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tierIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tierHeaderText: { flex: 1, gap: 2 },
  tierNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  tierName: { ...typography.h3, color: colors.text },
  tierTagline: { ...typography.small, color: colors.textSecondary },
  currentPill: {
    backgroundColor: colors.success + '20',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  currentPillText: { ...typography.small, color: colors.success, fontSize: 10, fontWeight: '700' as const },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.xs },
  priceValue: { fontSize: 32, fontWeight: '800' as const, color: colors.text, fontFamily: 'Inter_700Bold', lineHeight: 36 },
  priceUnit: { ...typography.caption, color: colors.textSecondary },
  commissionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
  },
  commissionValue: { fontSize: 18, fontWeight: '700' as const, fontFamily: 'Inter_700Bold' },
  commissionLabel: { ...typography.small, color: colors.textSecondary, flex: 1 },
  featuresList: { gap: spacing.xs + 2 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { ...typography.caption, color: colors.text, flex: 1 },
  renewCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    ...shadow.sm,
  },
  renewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  renewInfo: { gap: 2 },
  renewLabel: { ...typography.small, color: colors.textSecondary },
  renewValue: { ...typography.bodyMedium, color: colors.text },
  renewToggle: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  renewToggleLabel: { ...typography.caption, color: colors.textSecondary },
  promoTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  promoTeaserIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTeaserText: { flex: 1, gap: 2 },
  promoTeaserTitle: { ...typography.bodyMedium, color: colors.textInverse },
  promoTeaserSubtitle: { ...typography.small, color: 'rgba(255,255,255,0.7)' },
  promoTeaserBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  promoTeaserBtnText: { ...typography.smallMedium, color: colors.primary, fontWeight: '700' as const },
  fineprint: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: spacing.lg,
    lineHeight: 16,
  },
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
  confirmBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: colors.borderLight },
  confirmBtnText: { ...typography.button, color: colors.accent },
  confirmBtnTextDisabled: { color: colors.textTertiary },
});
