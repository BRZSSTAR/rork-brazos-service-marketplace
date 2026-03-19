import React, { useMemo, useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react-native';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import { colors, radius, shadow, spacing, typography } from '@/constants/theme';
import { applyAppLanguage } from '@/i18n';
import { useAuthStore } from '@/store/authStore';
import type { Locale } from '@/types';

interface LanguageOption {
  value: Locale;
  labelKey: string;
  nativeLabel: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: 'en', labelKey: 'locale.english', nativeLabel: 'English' },
  { value: 'pt-BR', labelKey: 'locale.portuguese', nativeLabel: 'Português' },
  { value: 'es', labelKey: 'locale.spanish', nativeLabel: 'Español' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const completeLanguageSelection = useAuthStore((s) => s.completeLanguageSelection);
  const appLocale = useAuthStore((s) => s.appLocale);
  const [selectedLocale, setSelectedLocale] = useState<Locale>(appLocale);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnims = useRef(LANGUAGE_OPTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    const stagger = cardAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + i * 120,
        useNativeDriver: true,
      })
    );
    Animated.stagger(0, stagger).start();
  }, []);

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
            <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <Text style={styles.logo}>{t('common.appName')}</Text>
              <View style={styles.globeWrap}>
                <Globe size={20} color={colors.logo} strokeWidth={1.5} />
              </View>
            </Animated.View>

            <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{t('languageSelection.title')}</Text>
                <Text style={styles.subtitle}>{t('languageSelection.subtitle')}</Text>
              </View>

              <View style={styles.options}>
                {LANGUAGE_OPTIONS.map((option, index) => {
                  const isActive = selectedLocale === option.value;
                  const animValue = cardAnims[index];

                  return (
                    <Animated.View
                      key={option.value}
                      style={{
                        opacity: animValue,
                        transform: [
                          {
                            translateY: animValue.interpolate({
                              inputRange: [0, 1],
                              outputRange: [16, 0],
                            }),
                          },
                        ],
                      }}
                    >
                      <Pressable
                        onPress={() => void handleSelect(option.value)}
                        style={({ pressed }) => [
                          styles.optionCard,
                          isActive && styles.optionCardActive,
                          pressed && styles.optionCardPressed,
                        ]}
                        testID={`language-option-${option.value}`}
                      >
                        <View style={styles.optionContent}>
                          <Text style={[styles.optionNative, isActive && styles.optionNativeActive]}>
                            {option.nativeLabel}
                          </Text>
                          <Text style={[styles.optionTranslated, isActive && styles.optionTranslatedActive]}>
                            {t(option.labelKey)}
                          </Text>
                        </View>

                        <View style={[styles.radio, isActive && styles.radioActive]}>
                          {isActive ? <Check size={14} color="#FFFFFF" strokeWidth={2.5} /> : null}
                        </View>
                      </Pressable>
                    </Animated.View>
                  );
                })}
              </View>

              <PrimaryButton
                title={t('languageSelection.confirm')}
                onPress={() => void handleContinue()}
                loading={isSaving}
                testID="language-continue-button"
              />
            </Animated.View>
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
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  logo: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '700' as const,
    color: colors.logo,
    letterSpacing: 6,
    fontFamily: 'Inter_700Bold',
  },
  globeWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 28,
    padding: spacing.lg,
    gap: spacing.lg,
    ...shadow.lg,
  },
  cardHeader: {
    gap: spacing.xs + 2,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  options: {
    gap: spacing.sm + 2,
  },
  optionCard: {
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(10,61,66,0.06)',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#EEF7F6',
  },
  optionCardPressed: {
    opacity: 0.85,
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionNative: {
    ...typography.bodyMedium,
    color: colors.text,
    fontSize: 16,
  },
  optionNativeActive: {
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
  optionTranslated: {
    ...typography.small,
    color: colors.textTertiary,
  },
  optionTranslatedActive: {
    color: '#2A7A7F',
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
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
