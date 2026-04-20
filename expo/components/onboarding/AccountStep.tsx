import React, { useCallback, useMemo, useState } from 'react';
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
import { User, Briefcase, Building2, ShieldCheck, AlertCircle } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { AccountRegistration, AccountRegistrationType } from '@/types';

interface AccountStepProps {
  account: AccountRegistration;
  onChange: (patch: Partial<AccountRegistration>) => void;
  onNext: () => void;
}

function formatCpf(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCnpj(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function validateCpf(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d.charAt(i), 10) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10) r = 0;
  if (r !== parseInt(d.charAt(9), 10)) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d.charAt(i), 10) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10) r = 0;
  return r === parseInt(d.charAt(10), 10);
}

function validateCnpj(cnpj: string): boolean {
  const d = cnpj.replace(/\D/g, '');
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const calc = (len: number) => {
    const w = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let s = 0;
    for (let i = 0; i < len; i++) s += parseInt(d.charAt(i), 10) * w[i];
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === parseInt(d.charAt(12), 10) && calc(13) === parseInt(d.charAt(13), 10);
}

const TYPES: { id: AccountRegistrationType; icon: typeof User }[] = [
  { id: 'CPF', icon: User },
  { id: 'MEI', icon: Briefcase },
  { id: 'CNPJ', icon: Building2 },
];

export default function AccountStep({ account, onChange, onNext }: AccountStepProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const type = account.type ?? 'CPF';

  const docValue = type === 'CPF' ? (account.cpf ?? '') : (account.cnpj ?? '');

  const setType = useCallback(
    (next: AccountRegistrationType) => {
      onChange({ type: next });
      setError('');
    },
    [onChange]
  );

  const handleDoc = useCallback(
    (text: string) => {
      if (type === 'CPF') {
        onChange({ cpf: formatCpf(text) });
      } else {
        onChange({ cnpj: formatCnpj(text) });
      }
      setError('');
    },
    [type, onChange]
  );

  const isValid = useMemo(() => {
    if (type === 'CPF') return validateCpf(account.cpf ?? '');
    if (!validateCnpj(account.cnpj ?? '')) return false;
    if (type === 'MEI' || type === 'CNPJ') {
      return (account.razaoSocial ?? '').trim().length >= 3;
    }
    return true;
  }, [type, account]);

  const handleContinue = useCallback(() => {
    if (!isValid) {
      setError(
        type === 'CPF'
          ? t('onboarding.account.invalidCpf')
          : t('onboarding.account.invalidCnpj')
      );
      return;
    }
    onNext();
  }, [isValid, type, t, onNext]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <ShieldCheck size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={styles.title}>{t('onboarding.account.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.account.subtitle')}</Text>

        <View style={styles.typeRow}>
          {TYPES.map(({ id, icon: Icon }) => {
            const selected = type === id;
            return (
              <Pressable
                key={id}
                onPress={() => setType(id)}
                style={[styles.typeCard, selected && styles.typeCardActive]}
                testID={`account-type-${id}`}
              >
                <Icon size={22} color={selected ? colors.surface : colors.primary} />
                <Text style={[styles.typeLabel, selected && styles.typeLabelActive]}>
                  {t(`onboarding.account.types.${id}`)}
                </Text>
                <Text style={[styles.typeDesc, selected && styles.typeDescActive]}>
                  {t(`onboarding.account.typesDesc.${id}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>
          {type === 'CPF' ? t('onboarding.account.cpfLabel') : t('onboarding.account.cnpjLabel')}
        </Text>
        <View style={[styles.inputWrap, error && styles.inputError]}>
          <TextInput
            style={styles.input}
            value={docValue}
            onChangeText={handleDoc}
            placeholder={type === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
            maxLength={type === 'CPF' ? 14 : 18}
            testID="account-doc-input"
          />
        </View>

        {type !== 'CPF' && (
          <>
            <Text style={styles.label}>{t('onboarding.account.razaoSocialLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={account.razaoSocial ?? ''}
                onChangeText={(v) => onChange({ razaoSocial: v })}
                placeholder={t('onboarding.account.razaoSocialPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                maxLength={120}
              />
            </View>

            <Text style={styles.label}>{t('onboarding.account.nomeFantasiaLabel')}</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                value={account.nomeFantasia ?? ''}
                onChangeText={(v) => onChange({ nomeFantasia: v })}
                placeholder={t('onboarding.account.nomeFantasiaPlaceholder')}
                placeholderTextColor={colors.textTertiary}
                maxLength={120}
              />
            </View>
          </>
        )}

        {error ? (
          <View style={styles.errorRow}>
            <AlertCircle size={14} color={colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.hint}>{t('onboarding.account.hint')}</Text>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={handleContinue}
            disabled={!isValid}
            testID="account-next"
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
    backgroundColor: '#FFF9E6',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.lg },
  typeRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.md },
  typeCard: {
    flex: 1,
    padding: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 4,
    ...shadow.sm,
  },
  typeCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeLabel: { ...typography.captionMedium, color: colors.text, marginTop: 4 },
  typeLabelActive: { color: colors.surface },
  typeDesc: { ...typography.small, color: colors.textTertiary, textAlign: 'center', fontSize: 10 },
  typeDescActive: { color: 'rgba(255,255,255,0.75)' },
  label: { ...typography.captionMedium, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  inputWrap: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
  inputError: { borderColor: colors.error },
  input: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    letterSpacing: 0.5,
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.xs },
  errorText: { ...typography.small, color: colors.error },
  hint: { ...typography.small, color: colors.textTertiary, textAlign: 'center', marginTop: spacing.md, lineHeight: 18 },
  footer: { marginTop: spacing.lg },
});
