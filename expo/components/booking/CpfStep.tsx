import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertCircle } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';

interface CpfStepProps {
  onNext: () => void;
}

export default function CpfStep({ onNext }: CpfStepProps) {
  const { t } = useTranslation();
  const savedCpf = useBookingStore((s) => s.cpf);
  const saveCpf = useBookingStore((s) => s.saveCpf);
  const formatCpf = useBookingStore((s) => s.formatCpf);
  const validateCpf = useBookingStore((s) => s.validateCpf);

  const [cpfInput, setCpfInput] = useState<string>(savedCpf ?? '');
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState<boolean>(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleChange = useCallback(
    (text: string) => {
      const formatted = formatCpf(text);
      setCpfInput(formatted);
      if (touched) {
        const digits = formatted.replace(/\D/g, '');
        if (digits.length === 11 && !validateCpf(formatted)) {
          setError(t('booking.cpf.invalid'));
        } else {
          setError('');
        }
      }
    },
    [formatCpf, validateCpf, touched, t]
  );

  const handleBlur = useCallback(() => {
    setTouched(true);
    const digits = cpfInput.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 11) {
      setError(t('booking.cpf.incomplete'));
    } else if (digits.length === 11 && !validateCpf(cpfInput)) {
      setError(t('booking.cpf.invalid'));
    } else {
      setError('');
    }
  }, [cpfInput, validateCpf, t]);

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  }, [shakeAnim]);

  const isValid = cpfInput.replace(/\D/g, '').length === 11 && validateCpf(cpfInput);

  const handleContinue = useCallback(async () => {
    if (!isValid) {
      setTouched(true);
      setError(t('booking.cpf.invalid'));
      triggerShake();
      return;
    }
    await saveCpf(cpfInput);
    onNext();
  }, [isValid, cpfInput, saveCpf, onNext, t, triggerShake]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={120}
    >
      <View style={styles.content}>
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('booking.cpf.title')}</Text>
        <Text style={styles.subtitle}>{t('booking.cpf.subtitle')}</Text>

        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
            <TextInput
              style={styles.input}
              value={cpfInput}
              onChangeText={handleChange}
              onBlur={handleBlur}
              placeholder="000.000.000-00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={14}
              testID="cpf-input"
            />
          </View>
        </Animated.View>

        {error ? (
          <View style={styles.errorRow}>
            <AlertCircle size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.hint}>{t('booking.cpf.hint')}</Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPress={handleContinue}
          onPressIn={() => {
            Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start();
          }}
          onPressOut={() => {
            Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
          }}
          disabled={!isValid}
          testID="cpf-continue"
        >
          <Animated.View
            style={[
              styles.button,
              !isValid && styles.buttonDisabled,
              { transform: [{ scale: buttonScale }] },
            ]}
          >
            <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
              {t('common.continue')}
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  iconRow: {
    alignItems: 'center',
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
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    ...typography.button,
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textTertiary,
  },
});
