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
import { useRouter, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('auth.register.errorTitle'), t('auth.register.fillAllFields'));
      return;
    }

    try {
      await register(name.trim(), email.trim(), password);
      console.log('[Register] Success, navigating to customer home');
      router.replace('/customer/(home)');
    } catch (error) {
      console.error('[Register] Error:', error);
      Alert.alert(t('auth.register.errorTitle'), t('auth.register.failure'));
    }
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaWrapper backgroundColor={colors.primary} edges={['top']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
            <View style={styles.header}>
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <ChevronLeft size={24} color={colors.logo} />
              </Pressable>
              <Text style={styles.logo}>{t('common.appName')}</Text>
              <Text style={styles.headerSubtitle}>{t('auth.register.headerSubtitle')}</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>{t('auth.register.detailsTitle')}</Text>
              <Text style={styles.formSubtitle}>{t('auth.register.detailsSubtitleCustomer')}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.register.fullName')}</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder={t('auth.register.fullNamePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="words"
                  testID="register-name-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.register.email')}</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('auth.register.emailPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="register-email-input"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('auth.register.password')}</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t('auth.register.passwordPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  secureTextEntry
                  testID="register-password-input"
                />
              </View>

              <View style={styles.spacer} />

              <PrimaryButton
                title={t('auth.register.submit')}
                onPress={handleRegister}
                loading={isLoading}
                disabled={!name.trim() || !email.trim() || !password.trim()}
                testID="register-submit-button"
              />

              <Pressable style={styles.loginLink} onPress={() => router.back()}>
                <Text style={styles.loginLinkText}>
                  {t('auth.register.hasAccount')}{' '}
                  <Text style={styles.loginLinkAccent}>{t('auth.register.login')}</Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  backButton: {
    position: 'absolute' as const,
    left: spacing.md,
    top: spacing.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: colors.logo,
    letterSpacing: 5,
    fontFamily: 'Inter_700Bold',
  },
  headerSubtitle: { ...typography.caption, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5 },
  formCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  formSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  inputGroup: { marginBottom: spacing.md },
  label: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs + 2 },
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
  spacer: { flex: 1, minHeight: spacing.lg },
  loginLink: { alignItems: 'center', paddingVertical: spacing.md },
  loginLinkText: { ...typography.body, color: colors.textSecondary },
  loginLinkAccent: { color: colors.accent, fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
});
