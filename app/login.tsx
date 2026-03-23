import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert(t('auth.login.errorTitle'), t('auth.login.fillAllFields'));
      return;
    }

    try {
      await login(email.trim(), password);
      const { activeMode } = useAuthStore.getState();
      const destination = activeMode === 'provider' ? '/provider/(home)' : '/customer/(home)';
      console.log('[Login] Success, navigating to:', destination);
      router.replace(destination);
    } catch (error) {
      console.error('[Login] Error:', error);
      Alert.alert(t('auth.login.errorTitle'), t('auth.login.failure'));
    }
  };

  return (
    <View style={styles.outerContainer}>
      <SafeAreaWrapper backgroundColor={colors.primary} edges={['top']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.header}>
              <Text style={styles.logo}>{t('common.appName')}</Text>
              <Text style={styles.headerSubtitle}>{t('auth.tagline')}</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{t('auth.login.title')}</Text>
              <Text style={styles.formSubtitle}>{t('auth.login.subtitle')}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.login.email')}</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('auth.register.emailPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="login-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.login.password')}</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  testID="login-password-input"
                />
              </View>

              <Pressable style={styles.forgotButton}>
                <Text style={styles.forgotText}>{t('auth.login.forgotPassword')}</Text>
              </Pressable>

              <PrimaryButton
                title={t('auth.login.submit')}
                onPress={handleLogin}
                loading={isLoading}
                disabled={!email.trim() || !password.trim()}
                testID="login-submit-button"
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{t('common.or')}</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={styles.registerLink}
                onPress={() => router.push('/register')}
                testID="login-register-link"
              >
                <Text style={styles.registerLinkText}>
                  {t('auth.login.noAccount')}{' '}
                  <Text style={styles.registerLinkAccent}>{t('auth.login.createAccount')}</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  logo: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: colors.logo,
    letterSpacing: 5,
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },
  formCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  formTitle: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  formSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputGroup: { marginBottom: spacing.md },
  label: {
    ...typography.captionMedium,
    color: colors.text,
    marginBottom: spacing.xs + 2,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    minHeight: 48,
  },
  forgotButton: { alignSelf: 'flex-end', marginBottom: spacing.lg },
  forgotText: { ...typography.captionMedium, color: colors.accent },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  dividerText: { ...typography.caption, color: colors.textTertiary },
  registerLink: { alignItems: 'center', paddingVertical: spacing.sm },
  registerLinkText: { ...typography.body, color: colors.textSecondary },
  registerLinkAccent: {
    color: colors.accent,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600' as const,
  },
});
