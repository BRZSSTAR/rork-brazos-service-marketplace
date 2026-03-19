import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import { applyAppLanguage } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import type { Locale } from '@/types';

interface LanguageOption {
  value: Locale;
  label: string;
}

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const completeLanguageSelection = useAuthStore((s) => s.completeLanguageSelection);
  const appLocale = useAuthStore((s) => s.appLocale);
  const [selectedLocale, setSelectedLocale] = useState<Locale>(appLocale);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const options = useMemo<LanguageOption[]>(() => [
    { value: 'en', label: t('locale.english') },
    { value: 'pt-BR', label: t('locale.portuguese') },
  ], [t]);

  const handleSelect = async (locale: Locale) => {
    setSelectedLocale(locale);
    await applyAppLanguage(locale);
  };

  const handleContinue = async () => {
    try {
      setIsSaving(true);
      await completeLanguageSelection(selectedLocale);
      await applyAppLanguage(selectedLocale);
      console.log('[Language] Selection saved:', selectedLocale);
      router.replace('/login');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={[colors.primary, '#0E4B52', '#F5F7F7']} locations={[0, 0.45, 1]} style={styles.gradient}>
        <SafeAreaWrapper backgroundColor="transparent" edges={['top', 'bottom']}>
          <View style={styles.container}>
            <View style={styles.logoWrap}>
              <Text style={styles.logo}>{t('common.appName')}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{t('languageSelection.title')}</Text>
              <Text style={styles.subtitle}>{t('languageSelection.subtitle')}</Text>

              <View style={styles.options}>
                {options.map((option) => {
                  const isActive = selectedLocale === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => void handleSelect(option.value)}
                      style={[styles.optionCard, isActive && styles.optionCardActive]}
                      testID={`language-option-${option.value}`}
                    >
                      <View>
                        <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>{option.label}</Text>
                      </View>

                      <View style={[styles.radio, isActive && styles.radioActive]}>
                        {isActive ? <Check size={16} color={colors.logo} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              <PrimaryButton
                title={t('languageSelection.confirm')}
                onPress={() => void handleContinue()}
                loading={isSaving}
                testID="language-continue-button"
              />
            </View>
          </View>
        </SafeAreaWrapper>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700' as const,
    color: colors.logo,
    letterSpacing: 6,
    fontFamily: 'Inter_700Bold',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.lg,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  options: {
    gap: spacing.md,
  },
  optionCard: {
    minHeight: 84,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(10,61,66,0.08)',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F2FAF9',
  },
  optionLabel: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  optionLabelActive: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  radio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  radioActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});