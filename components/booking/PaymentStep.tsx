import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  CreditCard,
  Wallet,
  Plus,
  Check,
  Trash2,
  X,
  QrCode,
} from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import type { SavedPaymentMethod, PaymentMethodType } from '@/types';

interface PaymentStepProps {
  onNext: () => void;
  onBack: () => void;
}

function PaymentCard({
  method,
  isSelected,
  onSelect,
  onDelete,
}: {
  method: SavedPaymentMethod;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const isPix = method.type === 'PIX';

  return (
    <Pressable
      onPress={onSelect}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.paymentCard,
          isSelected && styles.paymentCardSelected,
          { transform: [{ scale }] },
        ]}
      >
        <View style={styles.paymentCardRow}>
          <View style={[styles.paymentIconWrap, isPix ? styles.pixIconBg : styles.cardIconBg]}>
            {isPix ? (
              <QrCode size={20} color="#00B894" />
            ) : (
              <CreditCard size={20} color="#3B82F6" />
            )}
          </View>
          <View style={styles.paymentInfo}>
            <Text style={[styles.paymentLabel, isSelected && styles.paymentLabelSelected]}>
              {method.label}
            </Text>
            {method.lastFour && (
              <Text style={[styles.paymentDetail, isSelected && styles.paymentDetailSelected]}>
                •••• {method.lastFour}
              </Text>
            )}
            {method.pixKey && (
              <Text style={[styles.paymentDetail, isSelected && styles.paymentDetailSelected]} numberOfLines={1}>
                {method.pixKey}
              </Text>
            )}
          </View>
          <View style={styles.paymentCardActions}>
            {isSelected && (
              <View style={styles.selectedCheck}>
                <Check size={14} color={colors.surface} strokeWidth={3} />
              </View>
            )}
            <Pressable onPress={onDelete} hitSlop={12} style={styles.deleteBtn}>
              <Trash2 size={14} color={isSelected ? 'rgba(255,255,255,0.7)' : colors.error} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const { t } = useTranslation();
  const paymentMethods = useBookingStore((s) => s.paymentMethods);
  const addPaymentMethod = useBookingStore((s) => s.addPaymentMethod);
  const deletePaymentMethod = useBookingStore((s) => s.deletePaymentMethod);
  const draft = useBookingStore((s) => s.currentDraft);
  const updateDraft = useBookingStore((s) => s.updateDraft);

  const [selectedId, setSelectedId] = useState<string>(
    draft?.paymentMethodId ?? paymentMethods.find((m) => m.isDefault)?.id ?? paymentMethods[0]?.id ?? ''
  );
  const [showForm, setShowForm] = useState<boolean>(paymentMethods.length === 0);
  const [formType, setFormType] = useState<PaymentMethodType>('PIX');
  const [cardLabel, setCardLabel] = useState<string>('');
  const [cardLastFour, setCardLastFour] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [isDefault, setIsDefault] = useState<boolean>(paymentMethods.length === 0);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const isFormValid =
    formType === 'PIX'
      ? pixKey.trim().length > 3
      : cardLabel.trim().length > 0 && cardLastFour.replace(/\D/g, '').length === 4;

  const handleSave = useCallback(async () => {
    if (!isFormValid) return;

    const data =
      formType === 'PIX'
        ? {
            type: 'PIX' as const,
            label: 'Pix',
            pixKey: pixKey.trim(),
            isDefault,
          }
        : {
            type: 'CARD' as const,
            label: cardLabel.trim(),
            lastFour: cardLastFour.replace(/\D/g, ''),
            isDefault,
          };

    const newMethod = await addPaymentMethod(data);
    setSelectedId(newMethod.id);
    setShowForm(false);
    setCardLabel('');
    setCardLastFour('');
    setPixKey('');
    setIsDefault(false);
  }, [formType, pixKey, cardLabel, cardLastFour, isDefault, isFormValid, addPaymentMethod]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('booking.payment.deleteTitle'), t('booking.payment.deleteMessage'), [
        { text: t('common.back'), style: 'cancel' },
        {
          text: t('booking.payment.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            await deletePaymentMethod(id);
            if (selectedId === id) {
              const remaining = paymentMethods.filter((m) => m.id !== id);
              setSelectedId(remaining[0]?.id ?? '');
            }
          },
        },
      ]);
    },
    [deletePaymentMethod, selectedId, paymentMethods, t]
  );

  const handleContinue = useCallback(() => {
    if (!selectedId) return;
    updateDraft({ paymentMethodId: selectedId });
    onNext();
  }, [selectedId, updateDraft, onNext]);

  if (showForm) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>{t('booking.payment.addTitle')}</Text>
            <Pressable
              onPress={() => {
                setShowForm(false);
                setCardLabel('');
                setCardLastFour('');
                setPixKey('');
              }}
              hitSlop={12}
            >
              <X size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>{t('booking.payment.typeLabel')}</Text>
          <View style={styles.typeRow}>
            <Pressable
              onPress={() => setFormType('PIX')}
              style={[styles.typeCard, formType === 'PIX' && styles.typeCardActive]}
            >
              <QrCode size={28} color={formType === 'PIX' ? colors.surface : '#00B894'} />
              <Text style={[styles.typeCardLabel, formType === 'PIX' && styles.typeCardLabelActive]}>Pix</Text>
            </Pressable>
            <Pressable
              onPress={() => setFormType('CARD')}
              style={[styles.typeCard, formType === 'CARD' && styles.typeCardActive]}
            >
              <CreditCard size={28} color={formType === 'CARD' ? colors.surface : '#3B82F6'} />
              <Text style={[styles.typeCardLabel, formType === 'CARD' && styles.typeCardLabelActive]}>
                {t('booking.payment.card')}
              </Text>
            </Pressable>
          </View>

          {formType === 'PIX' ? (
            <>
              <Text style={styles.fieldLabel}>{t('booking.payment.pixKeyLabel')}</Text>
              <TextInput
                style={styles.textInput}
                value={pixKey}
                onChangeText={setPixKey}
                placeholder={t('booking.payment.pixKeyPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                testID="pix-key-input"
              />
              <Text style={styles.hint}>{t('booking.payment.pixHint')}</Text>
            </>
          ) : (
            <>
              <Text style={styles.fieldLabel}>{t('booking.payment.cardLabelField')}</Text>
              <TextInput
                style={styles.textInput}
                value={cardLabel}
                onChangeText={setCardLabel}
                placeholder={t('booking.payment.cardLabelPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                testID="card-label-input"
              />
              <Text style={styles.fieldLabel}>{t('booking.payment.lastFourField')}</Text>
              <TextInput
                style={styles.textInput}
                value={cardLastFour}
                onChangeText={(v) => setCardLastFour(v.replace(/\D/g, '').substring(0, 4))}
                placeholder="0000"
                placeholderTextColor={colors.textTertiary}
                keyboardType="number-pad"
                maxLength={4}
                testID="card-last-four-input"
              />
              <Text style={styles.hint}>{t('booking.payment.cardHint')}</Text>
            </>
          )}

          <Pressable
            onPress={() => setIsDefault(!isDefault)}
            style={styles.defaultToggle}
          >
            <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
              {isDefault && <Check size={12} color={colors.surface} strokeWidth={3} />}
            </View>
            <Text style={styles.defaultToggleText}>{t('booking.payment.setDefault')}</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleSave}
            disabled={!isFormValid}
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
              {t('booking.payment.addButton')}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Wallet size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('booking.payment.title')}</Text>
        <Text style={styles.subtitle}>{t('booking.payment.subtitle')}</Text>

        {paymentMethods.map((method) => (
          <PaymentCard
            key={method.id}
            method={method}
            isSelected={selectedId === method.id}
            onSelect={() => setSelectedId(method.id)}
            onDelete={() => handleDelete(method.id)}
          />
        ))}

        <Pressable
          onPress={() => setShowForm(true)}
          style={styles.addButton}
        >
          <Plus size={18} color={colors.accent} />
          <Text style={styles.addButtonText}>{t('booking.payment.addNew')}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
          <Pressable
            onPress={handleContinue}
            onPressIn={() => Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start()}
            disabled={!selectedId}
          >
            <Animated.View
              style={[
                styles.button,
                styles.buttonFlex,
                !selectedId && styles.buttonDisabled,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <Text style={[styles.buttonText, !selectedId && styles.buttonTextDisabled]}>
                {t('common.continue')}
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
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
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
  paymentCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  paymentCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  pixIconBg: { backgroundColor: '#E6FFF5' },
  cardIconBg: { backgroundColor: '#EFF6FF' },
  paymentInfo: { flex: 1 },
  paymentLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  paymentLabelSelected: { color: colors.textInverse },
  paymentDetail: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  paymentDetailSelected: { color: 'rgba(255,255,255,0.7)' },
  paymentCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  selectedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: { padding: 4 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.captionMedium,
    color: colors.accent,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: { ...typography.h3, color: colors.text },
  fieldLabel: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  textInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  typeCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeCardLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  typeCardLabelActive: { color: colors.textInverse },
  hint: {
    ...typography.small,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  defaultToggleText: {
    ...typography.caption,
    color: colors.textSecondary,
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
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonFlex: { flex: 1 },
  buttonDisabled: { backgroundColor: colors.disabled },
  buttonText: { ...typography.button, color: colors.primary },
  buttonTextDisabled: { color: colors.textTertiary },
});
