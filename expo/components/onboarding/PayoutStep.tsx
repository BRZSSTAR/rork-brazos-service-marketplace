import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { QrCode } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { PayoutSetup, PixKeyType } from '@/types';

interface PayoutStepProps {
  payout: PayoutSetup;
  onChange: (patch: Partial<PayoutSetup>) => void;
  onNext: () => void;
}

const KEY_TYPES: PixKeyType[] = ['CPF', 'CNPJ', 'EMAIL', 'PHONE', 'RANDOM'];

export default function PayoutStep({ payout, onChange, onNext }: PayoutStepProps) {
  const { t } = useTranslation();
  const selected = payout.pixKeyType ?? 'CPF';

  const select = useCallback((type: PixKeyType) => onChange({ pixKeyType: type }), [onChange]);

  const canContinue = (payout.pixKey ?? '').trim().length >= 3 && (payout.holderName ?? '').trim().length >= 2;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <QrCode size={26} color="#00B894" strokeWidth={1.8} />
          </View>
        </View>
        <Text style={styles.title}>{t('onboarding.payout.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.payout.subtitle')}</Text>

        <Text style={styles.label}>{t('onboarding.payout.keyTypeLabel')}</Text>
        <View style={styles.chipRow}>
          {KEY_TYPES.map((k) => {
            const active = selected === k;
            return (
              <Pressable
                key={k}
                onPress={() => select(k)}
                style={[styles.chip, active && styles.chipActive]}
                testID={`pix-type-${k}`}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t(`onboarding.payout.keyTypes.${k}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>{t('onboarding.payout.keyLabel')}</Text>
        <TextInput
          style={styles.input}
          value={payout.pixKey ?? ''}
          onChangeText={(v) => onChange({ pixKey: v })}
          placeholder={t('onboarding.payout.keyPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="none"
          autoCorrect={false}
          testID="pix-key"
        />

        <Text style={styles.label}>{t('onboarding.payout.holderLabel')}</Text>
        <TextInput
          style={styles.input}
          value={payout.holderName ?? ''}
          onChangeText={(v) => onChange({ holderName: v })}
          placeholder={t('onboarding.payout.holderPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          testID="pix-holder"
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{t('onboarding.payout.infoTitle')}</Text>
          <Text style={styles.infoBody}>{t('onboarding.payout.infoBody')}</Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="payout-next"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  iconRow: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#E6FFF5',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  label: { ...typography.captionMedium, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs + 2 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.small, color: colors.text },
  chipTextActive: { color: '#FFFFFF' },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 4,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: colors.text,
  },
  infoCard: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.logo,
    borderRadius: radius.md,
    ...shadow.sm,
  },
  infoTitle: { ...typography.captionMedium, color: colors.primary, marginBottom: 4 },
  infoBody: { ...typography.small, color: colors.textSecondary, lineHeight: 18 },
  footer: { marginTop: spacing.lg },
});
