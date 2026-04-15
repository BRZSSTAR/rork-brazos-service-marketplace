import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Plus, Check, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { getAddOnsForService } from '@/constants/serviceAddOns';
import type { ServiceAddOn, PricingType } from '@/types';

interface AddOnsStepProps {
  onNext: () => void;
  onBack: () => void;
}

function formatPrice(cents: number): string {
  if (cents === 0) return '—';
  return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
}

function pricingLabel(type: PricingType, t: (key: string) => string): string {
  switch (type) {
    case 'hourly':
      return t('booking.addOns.perHour');
    case 'fixed':
      return t('booking.addOns.fixed');
    case 'per_job':
      return t('booking.addOns.perJob');
    case 'per_session':
      return t('booking.addOns.perSession');
    case 'per_unit':
      return t('booking.addOns.perUnit');
    default:
      return '';
  }
}

function AddOnCard({
  addOn,
  isSelected,
  onToggle,
  t,
}: {
  addOn: ServiceAddOn;
  isSelected: boolean;
  onToggle: (addOn: ServiceAddOn) => void;
  t: (key: string) => string;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={() => onToggle(addOn)}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start()}
      testID={`addon-${addOn.id}`}
    >
      <Animated.View
        style={[
          styles.addOnCard,
          isSelected && styles.addOnCardSelected,
          { transform: [{ scale }] },
        ]}
      >
        <View style={styles.addOnLeft}>
          <View style={[styles.addOnCheck, isSelected && styles.addOnCheckSelected]}>
            {isSelected ? (
              <Check size={14} color={colors.surface} />
            ) : (
              <Plus size={14} color={colors.textTertiary} />
            )}
          </View>
          <View style={styles.addOnInfo}>
            <Text style={[styles.addOnName, isSelected && styles.addOnNameSelected]}>
              {addOn.name}
            </Text>
            {addOn.description ? (
              <Text style={styles.addOnDesc} numberOfLines={2}>{addOn.description}</Text>
            ) : null}
            <Text style={styles.addOnPricingType}>
              {pricingLabel(addOn.pricingType, t)}
            </Text>
          </View>
        </View>
        <View style={styles.addOnRight}>
          <Text style={[styles.addOnPrice, isSelected && styles.addOnPriceSelected]}>
            {addOn.priceCents > 0 ? `+${formatPrice(addOn.priceCents)}` : t('booking.addOns.quoteOnRequest')}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function AddOnsStep({ onNext, onBack }: AddOnsStepProps) {
  const { t } = useTranslation();
  const draft = useBookingStore((s) => s.currentDraft);
  const updateDraft = useBookingStore((s) => s.updateDraft);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const categoryId = draft?.serviceCategory ?? 'HOME';

  const availableAddOns: ServiceAddOn[] = useMemo(() => {
    const templates = getAddOnsForService(categoryId);
    return templates.map((tmpl) => ({
      id: tmpl.id,
      name: t(`booking.addOns.items.${tmpl.id}.name`),
      description: t(`booking.addOns.items.${tmpl.id}.desc`),
      priceCents: tmpl.defaultPriceCents,
      pricingType: tmpl.pricingType,
    }));
  }, [categoryId, t]);

  const selectedIds = useMemo(() => {
    return new Set((draft?.selectedAddOns ?? []).map((a) => a.id));
  }, [draft?.selectedAddOns]);

  const handleToggle = useCallback(
    (addOn: ServiceAddOn) => {
      const current = draft?.selectedAddOns ?? [];
      const exists = current.find((a) => a.id === addOn.id);
      const updated = exists
        ? current.filter((a) => a.id !== addOn.id)
        : [...current, addOn];
      updateDraft({ selectedAddOns: updated });
    },
    [draft?.selectedAddOns, updateDraft]
  );

  const addOnsTotal = useMemo(() => {
    return (draft?.selectedAddOns ?? []).reduce((sum, a) => sum + a.priceCents, 0);
  }, [draft?.selectedAddOns]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Sparkles size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('booking.addOns.title')}</Text>
        <Text style={styles.subtitle}>{t('booking.addOns.subtitle')}</Text>

        <View style={styles.addOnsList}>
          {availableAddOns.map((addOn) => (
            <AddOnCard
              key={addOn.id}
              addOn={addOn}
              isSelected={selectedIds.has(addOn.id)}
              onToggle={handleToggle}
              t={t}
            />
          ))}
        </View>

        {addOnsTotal > 0 && (
          <View style={styles.totalBar}>
            <Text style={styles.totalLabel}>{t('booking.addOns.addOnsTotal')}</Text>
            <Text style={styles.totalValue}>+{formatPrice(addOnsTotal)}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
          <Pressable
            onPress={onNext}
            onPressIn={() =>
              Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start()
            }
            onPressOut={() =>
              Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start()
            }
          >
            <Animated.View
              style={[styles.continueButton, { transform: [{ scale: buttonScale }] }]}
            >
              <Text style={styles.continueButtonText}>
                {(draft?.selectedAddOns ?? []).length > 0
                  ? t('booking.addOns.continueWith', { count: (draft?.selectedAddOns ?? []).length })
                  : t('booking.addOns.skip')}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  iconRow: { alignItems: 'center', marginBottom: spacing.md },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center' as const,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: spacing.lg,
  },
  addOnsList: {
    gap: spacing.sm,
  },
  addOnCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  addOnCardSelected: {
    borderColor: colors.accent,
    backgroundColor: '#FFFDF5',
  },
  addOnLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  addOnCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  addOnCheckSelected: {
    backgroundColor: colors.accent,
  },
  addOnInfo: {
    flex: 1,
    gap: 2,
  },
  addOnName: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  addOnNameSelected: {
    color: colors.text,
  },
  addOnDesc: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  addOnPricingType: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: 2,
  },
  addOnRight: {
    marginLeft: spacing.sm,
  },
  addOnPrice: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  addOnPriceSelected: {
    color: colors.accent,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  totalLabel: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
  },
  totalValue: {
    ...typography.h3,
    color: colors.accent,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: { ...typography.button, color: colors.textSecondary },
  continueButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  continueButtonText: {
    ...typography.button,
    color: colors.primary,
  },
});
