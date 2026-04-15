import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertCircle } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';

interface ProviderCpfStepProps {
  cpf: string;
  onChangeCpf: (cpf: string) => void;
  onNext: () => void;
}

function formatCpfValue(raw: string): string {
  const digits = raw.replace(/\D/g, '').substring(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validateCpfValue(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i), 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(10), 10)) return false;

  return true;
}

export default function ProviderCpfStep({ cpf, onChangeCpf, onNext }: ProviderCpfStepProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleChange = useCallback(
    (text: string) => {
      const formatted = formatCpfValue(text);
      onChangeCpf(formatted);
      if (touched) {
        const digits = formatted.replace(/\D/g, '');
        if (digits.length === 11 && !validateCpfValue(formatted)) {
          setError(t('booking.cpf.invalid'));
        } else {
          setError('');
        }
      }
    },
    [onChangeCpf, touched, t]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    const digits = cpf.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 11) {
      setError(t('booking.cpf.incomplete'));
    } else if (digits.length === 11 && !validateCpfValue(cpf)) {
      setError(t('booking.cpf.invalid'));
    } else {
      setError('');
    }
  }, [cpf, t]);

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const isValid = cpf.replace(/\D/g, '').length === 11 && validateCpfValue(cpf);

  const handleContinue = useCallback(() => {
    if (!isValid) {
      setTouched(true);
      setError(t('booking.cpf.invalid'));
      triggerShake();
      return;
    }
    onNext();
  }, [isValid, onNext, t, triggerShake]);

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={120}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('onboarding.cpf.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.cpf.subtitle')}</Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={handleChange}
              onBlur={handleBlur}
              placeholder="000.000.000-00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={14}
              testID="onboarding-cpf-input"
            />
          </View>
        </Animated.View>

        {error ? (
          <View style={styles.errorRow}>
            <AlertCircle size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.hint}>{t('onboarding.cpf.hint')}</Text>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={handleContinue}
            disabled={!isValid}
            testID="onboarding-cpf-next"
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
  iconRow: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center' as const,
    paddingVertical: spacing.md + 4,
    paddingHorizontal: spacing.lg,
    letterSpacing: 2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  errorText: {
    ...typography.small,
    color: colors.error,
  },
  hint: {
    ...typography.small,
    color: colors.textTertiary,
    textAlign: 'center' as const,
    marginTop: spacing.lg,
    lineHeight: 18,
  },
  footer: { marginTop: spacing.xl },
});
