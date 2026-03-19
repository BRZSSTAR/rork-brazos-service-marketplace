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
import type { Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, Briefcase, ChevronLeft } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SafeAreaWrapper from '@/components/SafeAreaWrapper';
import type { UserRole } from '@/types';

export default function RegisterScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);

  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      Alert.alert(t('auth.register.errorTitle'), t('auth.register.fillAllFields'));
      return;
    }

    try {
      await register(name.trim(), email.trim(), password, role);
      const authenticatedUser = useAuthStore.getState().user;
      const destination: Href = authenticatedUser?.role === 'PROVIDER' ? '/provider/(home)' : '/customer/(home)';
      console.log('[Register] Success, navigating to:', destination, 'role:', authenticatedUser?.role);
      router.replace(destination);
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
              {step === 'role' ? (
                <>
                  <Text style={styles.formTitle}>{t('auth.register.roleTitle')}</Text>
                  <Text style={styles.formSubtitle}>{t('auth.register.roleSubtitle')}</Text>

                  <Pressable
                    style={[styles.roleCard, role === 'CUSTOMER' && styles.roleCardActive]}
                    onPress={() => setRole('CUSTOMER')}
                    testID="register-role-customer"
                  >
                    <View style={[styles.roleIcon, role === 'CUSTOMER' && styles.roleIconActive]}>
                      <Home size={24} color={role === 'CUSTOMER' ? colors.primary : colors.textSecondary} />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[styles.roleTitle, role === 'CUSTOMER' && styles.roleTitleActive]}>{t('auth.register.customerTitle')}</Text>
                      <Text style={styles.roleDesc}>{t('auth.register.customerDescription')}</Text>
                    </View>
                  </Pressable>

                  <Pressable
                    style={[styles.roleCard, role === 'PROVIDER' && styles.roleCardActive]}
                    onPress={() => setRole('PROVIDER')}
                    testID="register-role-provider"
                  >
                    <View style={[styles.roleIcon, role === 'PROVIDER' && styles.roleIconActive]}>
                      <Briefcase size={24} color={role === 'PROVIDER' ? colors.primary : colors.textSecondary} />
                    </View>
                    <View style={styles.roleInfo}>
                      <Text style={[styles.roleTitle, role === 'PROVIDER' && styles.roleTitleActive]}>{t('auth.register.providerTitle')}</Text>
                      <Text style={styles.roleDesc}>{t('auth.register.providerDescription')}</Text>
                    </View>
                  </Pressable>

                  <View style={styles.spacer} />

                  <PrimaryButton
                    title={t('auth.register.continue')}
                    onPress={() => setStep('details')}
                    disabled={!role}
                    testID="register-continue-button"
                  />
                </>
              ) : (
                <>
                  <Pressable onPress={() => setStep('role')} style={styles.stepBack}>
                    <ChevronLeft size={20} color={colors.textSecondary} />
                    <Text style={styles.stepBackText}>{t('common.back')}</Text>
                  </Pressable>

                  <Text style={styles.formTitle}>{t('auth.register.detailsTitle')}</Text>
                  <Text style={styles.formSubtitle}>
                    {role === 'CUSTOMER' ? t('auth.register.detailsSubtitleCustomer') : t('auth.register.detailsSubtitleProvider')}
                  </Text>

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
                </>
              )}
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
  stepBack: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  stepBackText: { ...typography.captionMedium, color: colors.textSecondary },
  formTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.xs },
  formSubtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  roleCardActive: { borderColor: colors.accent, backgroundColor: '#F0FAF9' },
  roleIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleIconActive: { backgroundColor: colors.accent },
  roleInfo: { flex: 1, gap: spacing.xs - 2 },
  roleTitle: { ...typography.bodyMedium, color: colors.text },
  roleTitleActive: { color: colors.primary, fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
  roleDesc: { ...typography.caption, color: colors.textSecondary },
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
