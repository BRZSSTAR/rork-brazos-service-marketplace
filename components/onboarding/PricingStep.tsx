import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';

interface PricingStepProps {
  pricePerHourCents: number;
  onChangePrice: (cents: number) => void;
  onNext: () => void;
}

function centsToInitialText(cents: number): string {
  if (cents === 0) return '';
  return (cents / 100).toFixed(2).replace('.', ',');
}

export default function PricingStep({ pricePerHourCents, onChangePrice, onNext }: PricingStepProps) {
  const { t } = useTranslation();
  const [rawText, setRawText] = useState<string>(() => centsToInitialText(pricePerHourCents));
  const canContinue = pricePerHourCents >= 1000;

  const handleTextChange = useCallback((text: string) => {
    const digitsOnly = text.replace(/[^\d]/g, '');
    if (digitsOnly === '') {
      setRawText('');
      onChangePrice(0);
      return;
    }

    const totalCents = parseInt(digitsOnly, 10);
    const reais = Math.floor(totalCents / 100);
    const centavos = totalCents % 100;
    const formatted = `${reais},${centavos.toString().padStart(2, '0')}`;

    setRawText(formatted);
    onChangePrice(totalCents);
  }, [onChangePrice]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={120}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('onboarding.pricing.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.pricing.subtitle')}</Text>

        <View style={styles.priceContainer}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            style={styles.priceInput}
            value={rawText}
            onChangeText={handleTextChange}
            placeholder={t('onboarding.pricing.pricePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            keyboardType="decimal-pad"
            maxLength={8}
            testID="onboarding-price"
          />
          <Text style={styles.perHour}>/h</Text>
        </View>

        <View style={styles.hintRow}>
          <Info size={16} color={colors.textTertiary} />
          <Text style={styles.hintText}>{t('onboarding.pricing.hint')}</Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="onboarding-pricing-next"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  currency: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    color: colors.textSecondary,
  },
  priceInput: {
    fontSize: 48,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
    color: colors.text,
    minWidth: 160,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
    paddingBottom: spacing.xs,
  },
  perHour: {
    fontSize: 20,
    fontWeight: '500' as const,
    fontFamily: 'Inter_500Medium',
    color: colors.textTertiary,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: radius.sm,
    marginTop: spacing.md,
  },
  hintText: { ...typography.caption, color: colors.textSecondary, flex: 1 },
  footer: { marginTop: spacing.xl },
});
