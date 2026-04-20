import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, FileText, Camera, FileCheck, Lock } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { TrustConsents } from '@/types';

interface TrustStepProps {
  trust: TrustConsents;
  onChange: (patch: Partial<TrustConsents>) => void;
  onNext: () => void;
}

export default function TrustStep({ trust, onChange, onNext }: TrustStepProps) {
  const { t } = useTranslation();

  const pickSelfie = useCallback(async () => {
    try {
      const r = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
        cameraType: ImagePicker.CameraType.front,
      });
      if (!r.canceled && r.assets[0]) {
        onChange({ selfieVerificationUri: r.assets[0].uri });
      }
    } catch {
      try {
        const r = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
          allowsEditing: true,
          aspect: [1, 1],
        });
        if (!r.canceled && r.assets[0]) {
          onChange({ selfieVerificationUri: r.assets[0].uri });
        }
      } catch (e) {
        console.error('[Trust] selfie error', e);
        Alert.alert('', t('onboarding.trust.selfieError'));
      }
    }
  }, [onChange, t]);

  const pickBg = useCallback(async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });
      if (!r.canceled && r.assets[0]) {
        onChange({ backgroundCheckUri: r.assets[0].uri });
      }
    } catch (e) {
      console.error('[Trust] bg error', e);
    }
  }, [onChange]);

  const canContinue = !!(trust.lgpdAccepted && trust.tosAccepted && trust.contractorAgreementAccepted);

  const handleContinue = useCallback(() => {
    onChange({ consentAt: new Date().toISOString() });
    onNext();
  }, [onChange, onNext]);

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.iconRow}>
        <View style={styles.iconCircle}>
          <Lock size={26} color={colors.primary} strokeWidth={1.8} />
        </View>
      </View>
      <Text style={styles.title}>{t('onboarding.trust.title')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.trust.subtitle')}</Text>

      <Text style={styles.section}>{t('onboarding.trust.verificationTitle')}</Text>

      <Pressable style={styles.verifyCard} onPress={pickSelfie} testID="trust-selfie">
        <View style={styles.verifyIconWrap}>
          {trust.selfieVerificationUri ? (
            <Image source={{ uri: trust.selfieVerificationUri }} style={styles.verifyThumb} />
          ) : (
            <Camera size={22} color={colors.primary} />
          )}
        </View>
        <View style={styles.verifyBody}>
          <Text style={styles.verifyTitle}>{t('onboarding.trust.selfieTitle')}</Text>
          <Text style={styles.verifyDesc}>
            {trust.selfieVerificationUri
              ? t('onboarding.trust.uploaded')
              : t('onboarding.trust.selfieDesc')}
          </Text>
        </View>
      </Pressable>

      <Pressable style={styles.verifyCard} onPress={pickBg} testID="trust-bg">
        <View style={styles.verifyIconWrap}>
          {trust.backgroundCheckUri ? (
            <Image source={{ uri: trust.backgroundCheckUri }} style={styles.verifyThumb} />
          ) : (
            <FileCheck size={22} color={colors.primary} />
          )}
        </View>
        <View style={styles.verifyBody}>
          <Text style={styles.verifyTitle}>{t('onboarding.trust.bgTitle')}</Text>
          <Text style={styles.verifyDesc}>
            {trust.backgroundCheckUri
              ? t('onboarding.trust.uploaded')
              : t('onboarding.trust.bgDesc')}
          </Text>
        </View>
      </Pressable>

      <View style={styles.toggleRow}>
        <View style={styles.toggleBody}>
          <Text style={styles.toggleTitle}>{t('onboarding.trust.insuranceTitle')}</Text>
          <Text style={styles.toggleDesc}>{t('onboarding.trust.insuranceDesc')}</Text>
        </View>
        <Switch
          value={!!trust.liabilityInsurance}
          onValueChange={(v) => onChange({ liabilityInsurance: v })}
          trackColor={{ true: colors.primary, false: colors.border }}
          thumbColor="#fff"
        />
      </View>

      <Text style={styles.section}>{t('onboarding.trust.consentsTitle')}</Text>

      <ConsentRow
        icon={<ShieldCheck size={18} color={colors.primary} />}
        title={t('onboarding.trust.lgpdTitle')}
        desc={t('onboarding.trust.lgpdDesc')}
        value={!!trust.lgpdAccepted}
        onChange={(v) => onChange({ lgpdAccepted: v })}
      />
      <ConsentRow
        icon={<FileText size={18} color={colors.primary} />}
        title={t('onboarding.trust.tosTitle')}
        desc={t('onboarding.trust.tosDesc')}
        value={!!trust.tosAccepted}
        onChange={(v) => onChange({ tosAccepted: v })}
      />
      <ConsentRow
        icon={<FileCheck size={18} color={colors.primary} />}
        title={t('onboarding.trust.contractorTitle')}
        desc={t('onboarding.trust.contractorDesc')}
        value={!!trust.contractorAgreementAccepted}
        onChange={(v) => onChange({ contractorAgreementAccepted: v })}
      />

      <View style={styles.footer}>
        <PrimaryButton
          title={t('common.continue')}
          onPress={handleContinue}
          disabled={!canContinue}
          testID="trust-next"
        />
      </View>
    </ScrollView>
  );
}

function ConsentRow({
  icon,
  title,
  desc,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Pressable style={[styles.consentCard, value && styles.consentCardActive]} onPress={() => onChange(!value)}>
      <View style={styles.consentIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={styles.consentTitle}>{title}</Text>
        <Text style={styles.consentDesc}>{desc}</Text>
      </View>
      <View style={[styles.checkbox, value && styles.checkboxActive]}>
        {value && <View style={styles.checkDot} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  iconRow: { alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.md },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.logo,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { ...typography.h2, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  subtitle: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.md },
  section: { ...typography.h3, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  verifyCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.sm + 4, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  verifyIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.logo,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden',
  },
  verifyThumb: { width: 44, height: 44 },
  verifyBody: { flex: 1, gap: 2 },
  verifyTitle: { ...typography.captionMedium, color: colors.text },
  verifyDesc: { ...typography.small, color: colors.textSecondary },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
    marginTop: spacing.sm,
  },
  toggleBody: { flex: 1, gap: 2 },
  toggleTitle: { ...typography.captionMedium, color: colors.text },
  toggleDesc: { ...typography.small, color: colors.textSecondary },
  consentCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    padding: spacing.sm + 4, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  consentCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.logo,
  },
  consentIcon: { marginTop: 2 },
  consentTitle: { ...typography.captionMedium, color: colors.text },
  consentDesc: { ...typography.small, color: colors.textSecondary, marginTop: 2, lineHeight: 16 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: '#fff' },
  footer: { marginTop: spacing.lg },
});
