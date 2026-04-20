import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { CancellationPolicy, LanguageCode, ProviderPolicies } from '@/types';

interface PoliciesStepProps {
  policies: ProviderPolicies;
  onChange: (patch: Partial<ProviderPolicies>) => void;
  onNext: () => void;
}

const CANCELLATION: CancellationPolicy[] = ['FLEXIBLE', 'MODERATE', 'STRICT'];
const LANGUAGES: LanguageCode[] = ['PT', 'EN', 'ES'];

export default function PoliciesStep({ policies, onChange, onNext }: PoliciesStepProps) {
  const { t } = useTranslation();
  const selectedLangs = policies.languages ?? ['PT'];
  const cancellation = policies.cancellation ?? 'MODERATE';

  const toggleLang = useCallback(
    (l: LanguageCode) => {
      const has = selectedLangs.includes(l);
      const next = has ? selectedLangs.filter((x) => x !== l) : [...selectedLangs, l];
      onChange({ languages: next.length > 0 ? next : ['PT'] });
    },
    [selectedLangs, onChange]
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120}
    >
      <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <Sparkles size={24} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>
        <Text style={styles.title}>{t('onboarding.policies.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.policies.subtitle')}</Text>

        <Text style={styles.section}>{t('onboarding.policies.cancellationTitle')}</Text>
        <View style={styles.cancelCol}>
          {CANCELLATION.map((c) => {
            const active = cancellation === c;
            return (
              <Pressable
                key={c}
                onPress={() => onChange({ cancellation: c })}
                style={[styles.cancelCard, active && styles.cancelCardActive]}
                testID={`policy-${c}`}
              >
                <Text style={[styles.cancelTitle, active && { color: colors.primary }]}>
                  {t(`onboarding.policies.cancellation.${c}.title`)}
                </Text>
                <Text style={styles.cancelDesc}>
                  {t(`onboarding.policies.cancellation.${c}.desc`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t('onboarding.policies.languagesTitle')}</Text>
        <View style={styles.chipRow}>
          {LANGUAGES.map((l) => {
            const active = selectedLangs.includes(l);
            return (
              <Pressable
                key={l}
                onPress={() => toggleLang(l)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t(`onboarding.policies.languages.${l}`)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.toggleCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.toggleTitle}>{t('onboarding.policies.emergencyTitle')}</Text>
            <Text style={styles.toggleDesc}>{t('onboarding.policies.emergencyDesc')}</Text>
          </View>
          <Switch
            value={!!policies.emergencyAvailable}
            onValueChange={(v) => onChange({ emergencyAvailable: v })}
            trackColor={{ true: colors.accent, false: colors.border }}
            thumbColor="#fff"
          />
        </View>

        <Text style={styles.section}>{t('onboarding.policies.travelTitle')}</Text>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.policies.freeRadiusLabel')}</Text>
            <TextInput
              style={styles.input}
              value={policies.freeTravelRadiusKm ? String(policies.freeTravelRadiusKm) : ''}
              onChangeText={(v) => {
                const n = parseInt(v.replace(/\D/g, ''), 10);
                onChange({ freeTravelRadiusKm: Number.isNaN(n) ? 0 : Math.min(n, 200) });
              }}
              placeholder="10"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.policies.perKmLabel')}</Text>
            <TextInput
              style={styles.input}
              value={policies.travelFeePerKmCents ? (policies.travelFeePerKmCents / 100).toFixed(2).replace('.', ',') : ''}
              onChangeText={(v) => {
                const n = parseFloat(v.replace(/\D/g, '')) / 100;
                onChange({ travelFeePerKmCents: Number.isNaN(n) ? 0 : Math.round(n * 100) });
              }}
              placeholder="R$ 2,00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <Text style={styles.section}>{t('onboarding.policies.referralTitle')}</Text>
        <TextInput
          style={styles.input}
          value={policies.referralCode ?? ''}
          onChangeText={(v) => onChange({ referralCode: v.toUpperCase().slice(0, 16) })}
          placeholder={t('onboarding.policies.referralPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <Text style={styles.hint}>{t('onboarding.policies.referralHint')}</Text>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            testID="policies-next"
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
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  section: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  cancelCol: { gap: spacing.xs },
  cancelCard: {
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 2,
    ...shadow.sm,
  },
  cancelCardActive: { borderColor: colors.primary, backgroundColor: colors.logo },
  cancelTitle: { ...typography.bodyMedium, color: colors.text },
  cancelDesc: { ...typography.small, color: colors.textSecondary, lineHeight: 16 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: radius.full,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.captionMedium, color: colors.text },
  chipTextActive: { color: '#FFFFFF' },
  toggleCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: spacing.md,
  },
  toggleTitle: { ...typography.captionMedium, color: colors.text },
  toggleDesc: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  label: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm + 2,
    fontSize: 15, fontFamily: 'Inter_400Regular', color: colors.text,
  },
  hint: { ...typography.small, color: colors.textTertiary, marginTop: spacing.xs },
  footer: { marginTop: spacing.xl },
});
