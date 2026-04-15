import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  TextInput,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  User,
  MapPin,
  Calendar,
  CheckCircle,
  QrCode,
  CreditCard,
  Sparkles,
} from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import { useAddressStore } from '@/store/addressStore';

interface SummaryStepProps {
  onBack: () => void;
  onConfirm: () => void;
}

function SummaryRow({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  subValue,
}: {
  icon: typeof User;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string;
  subValue?: string;
}) {
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryIcon, { backgroundColor: iconBg }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryLabel}>{label}</Text>
        <Text style={styles.summaryValue}>{value}</Text>
        {subValue ? <Text style={styles.summarySubValue}>{subValue}</Text> : null}
      </View>
    </View>
  );
}

export default function SummaryStep({ onBack, onConfirm }: SummaryStepProps) {
  const { t } = useTranslation();
  const draft = useBookingStore((s) => s.currentDraft);
  const addresses = useAddressStore((s) => s.addresses);
  const paymentMethods = useBookingStore((s) => s.paymentMethods);
  const updateDraft = useBookingStore((s) => s.updateDraft);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const addOnsTotal = useMemo(() => {
    return (draft?.selectedAddOns ?? []).reduce((sum, a) => sum + a.priceCents, 0);
  }, [draft?.selectedAddOns]);

  const selectedAddress = addresses.find((a) => a.id === draft?.addressId);
  const selectedPayment = paymentMethods.find((m) => m.id === draft?.paymentMethodId);

  const formatPrice = useCallback((cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace('.', ',')}`;
  }, []);

  const formatDate = useCallback(
    (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    },
    []
  );

  const formatTime = useCallback((isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }, []);

  const addressDisplay = selectedAddress
    ? `${selectedAddress.street}, ${selectedAddress.number}${selectedAddress.complement ? ` - ${selectedAddress.complement}` : ''}`
    : t('booking.summary.noAddress');

  const addressSubDisplay = selectedAddress
    ? `${selectedAddress.neighborhood}, ${selectedAddress.city} - ${selectedAddress.state}`
    : undefined;

  const paymentDisplay = selectedPayment
    ? selectedPayment.type === 'PIX'
      ? `Pix - ${selectedPayment.pixKey ?? ''}`
      : `${selectedPayment.label} •••• ${selectedPayment.lastFour ?? ''}`
    : t('booking.summary.noPayment');

  const handleConfirm = useCallback(() => {
    Alert.alert(t('booking.summary.confirmTitle'), t('booking.summary.confirmMessage'), [
      { text: t('common.back'), style: 'cancel' },
      {
        text: t('booking.summary.confirmButton'),
        onPress: onConfirm,
      },
    ]);
  }, [t, onConfirm]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <CheckCircle size={28} color={colors.success} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('booking.summary.title')}</Text>
        <Text style={styles.subtitle}>{t('booking.summary.subtitle')}</Text>

        <View style={styles.card}>
          <SummaryRow
            icon={User}
            iconColor="#3B82F6"
            iconBg="#EFF6FF"
            label={t('booking.summary.provider')}
            value={draft?.providerName ?? t('booking.summary.noProvider')}
            subValue={draft?.serviceName}
          />

          <View style={styles.divider} />

          <SummaryRow
            icon={Calendar}
            iconColor="#8B5CF6"
            iconBg="#F5F3FF"
            label={t('booking.summary.dateTime')}
            value={draft?.scheduledAt ? formatDate(draft.scheduledAt) : t('booking.summary.noDate')}
            subValue={
              draft?.scheduledAt
                ? `${formatTime(draft.scheduledAt)}${draft.durationMinutes ? ` · ${draft.durationMinutes} min` : ''}`
                : undefined
            }
          />

          <View style={styles.divider} />

          <SummaryRow
            icon={MapPin}
            iconColor="#10B981"
            iconBg="#ECFDF5"
            label={t('booking.summary.address')}
            value={addressDisplay}
            subValue={addressSubDisplay}
          />

          <View style={styles.divider} />

          <SummaryRow
            icon={selectedPayment?.type === 'PIX' ? QrCode : CreditCard}
            iconColor={selectedPayment?.type === 'PIX' ? '#00B894' : '#3B82F6'}
            iconBg={selectedPayment?.type === 'PIX' ? '#E6FFF5' : '#EFF6FF'}
            label={t('booking.summary.payment')}
            value={paymentDisplay}
          />
        </View>

        {(draft?.selectedAddOns ?? []).length > 0 && (
          <View style={styles.addOnsSection}>
            <View style={styles.addOnsHeader}>
              <Sparkles size={16} color={colors.accent} />
              <Text style={styles.addOnsTitle}>{t('booking.addOns.title')}</Text>
            </View>
            {(draft?.selectedAddOns ?? []).map((addOn) => (
              <View key={addOn.id} style={styles.addOnRow}>
                <Text style={styles.addOnName}>{addOn.name}</Text>
                <Text style={styles.addOnPrice}>
                  {addOn.priceCents > 0
                    ? `+R$ ${(addOn.priceCents / 100).toFixed(2).replace('.', ',')}`
                    : '—'}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>{t('booking.summary.notesLabel')}</Text>
          <TextInput
            style={styles.notesInput}
            value={draft?.notes ?? ''}
            onChangeText={(text) => updateDraft({ notes: text })}
            placeholder={t('booking.summary.notesPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            testID="booking-notes"
          />
        </View>

        <View style={styles.priceCard}>
          {addOnsTotal > 0 && (
            <>
              <View style={styles.priceRow}>
                <Text style={styles.priceSubLabel}>{t('booking.summary.service')}</Text>
                <Text style={styles.priceSubValue}>
                  {draft?.totalCents ? formatPrice(draft.totalCents) : 'R$ 0,00'}
                </Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceSubLabel}>{t('booking.addOns.title')}</Text>
                <Text style={styles.priceSubValue}>+{formatPrice(addOnsTotal)}</Text>
              </View>
              <View style={styles.priceDivider} />
            </>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t('booking.summary.total')}</Text>
            <Text style={styles.priceValue}>
              {formatPrice((draft?.totalCents ?? 0) + addOnsTotal)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
          <Pressable
            onPress={handleConfirm}
            onPressIn={() =>
              Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start()
            }
            onPressOut={() =>
              Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start()
            }
          >
            <Animated.View
              style={[styles.confirmButton, { transform: [{ scale: buttonScale }] }]}
            >
              <CheckCircle size={18} color={colors.surface} />
              <Text style={styles.confirmButtonText}>{t('booking.summary.confirmButton')}</Text>
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
    backgroundColor: '#E8F5E9',
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContent: { flex: 1 },
  summaryLabel: {
    ...typography.small,
    color: colors.textTertiary,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  summaryValue: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  summarySubValue: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  notesSection: {
    marginTop: spacing.lg,
  },
  notesLabel: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  notesInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
    minHeight: 80,
  },
  priceCard: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
  },
  priceValue: {
    ...typography.h2,
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
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
  },
  confirmButtonText: {
    ...typography.button,
    color: colors.surface,
  },
  addOnsSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.md,
    ...shadow.sm,
  },
  addOnsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  addOnsTitle: {
    ...typography.captionMedium,
    color: colors.text,
  },
  addOnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
  },
  addOnName: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
  },
  addOnPrice: {
    ...typography.captionMedium,
    color: colors.accent,
  },
  priceSubLabel: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  priceSubValue: {
    ...typography.captionMedium,
    color: 'rgba(255,255,255,0.6)',
  },
  priceDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: spacing.sm,
  },
});
