import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  Plus,
  Trash2,
  FileCheck,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { CertificationFile, PortfolioItem, ProviderProfileDraft } from '@/types';

interface ProfileProStepProps {
  profile: ProviderProfileDraft;
  onChange: (patch: Partial<ProviderProfileDraft>) => void;
  onNext: () => void;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

export default function ProfileProStep({ profile, onChange, onNext }: ProfileProStepProps) {
  const { t } = useTranslation();
  const [newCertName, setNewCertName] = useState<string>('');

  const pickPhoto = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (!result.canceled && result.assets[0]) {
        onChange({ photoUri: result.assets[0].uri });
      }
    } catch (error) {
      console.error('[Profile] Photo pick error:', error);
      Alert.alert('', t('onboarding.profilePro.photoError'));
    }
  }, [onChange, t]);

  const pickPortfolio = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsMultipleSelection: true,
        selectionLimit: 6,
      });
      if (!result.canceled) {
        const items: PortfolioItem[] = result.assets.map((a) => ({
          id: genId(),
          uri: a.uri,
          type: 'image',
        }));
        onChange({ portfolio: [...(profile.portfolio ?? []), ...items] });
      }
    } catch (error) {
      console.error('[Profile] Portfolio pick error:', error);
    }
  }, [profile.portfolio, onChange]);

  const removePortfolio = useCallback(
    (id: string) => {
      onChange({
        portfolio: (profile.portfolio ?? []).filter((p) => p.id !== id),
      });
    },
    [profile.portfolio, onChange]
  );

  const addCertification = useCallback(() => {
    if (!newCertName.trim()) return;
    const cert: CertificationFile = {
      id: genId(),
      name: newCertName.trim(),
      verified: false,
    };
    onChange({ certifications: [...(profile.certifications ?? []), cert] });
    setNewCertName('');
  }, [newCertName, profile.certifications, onChange]);

  const pickCertificationFile = useCallback(
    async (certId: string) => {
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
          onChange({
            certifications: (profile.certifications ?? []).map((c) =>
              c.id === certId ? { ...c, uri: result.assets[0].uri } : c
            ),
          });
        }
      } catch (error) {
        console.error('[Profile] Cert file pick error:', error);
      }
    },
    [profile.certifications, onChange]
  );

  const removeCertification = useCallback(
    (id: string) => {
      onChange({
        certifications: (profile.certifications ?? []).filter((c) => c.id !== id),
      });
    },
    [profile.certifications, onChange]
  );

  const canContinue = (profile.bio ?? '').trim().length >= 20;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={120}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('onboarding.profilePro.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.profilePro.subtitle')}</Text>

        <View style={styles.photoBlock}>
          <Pressable onPress={pickPhoto} style={styles.avatarWrap} testID="profile-photo">
            {profile.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <UserIcon size={40} color={colors.primary} />
              </View>
            )}
            <View style={styles.avatarBadge}>
              <Camera size={14} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text style={styles.photoLabel}>{t('onboarding.profilePro.photoLabel')}</Text>
        </View>

        <Text style={styles.label}>{t('onboarding.profilePro.bioLabel')}</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={profile.bio ?? ''}
          onChangeText={(v) => onChange({ bio: v })}
          placeholder={t('onboarding.profilePro.bioPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
          testID="profile-bio"
        />
        <Text style={styles.charCount}>{(profile.bio ?? '').length}/500</Text>

        <Text style={styles.label}>{t('onboarding.profilePro.experienceLabel')}</Text>
        <View style={styles.expRow}>
          <TextInput
            style={[styles.input, { width: 80, textAlign: 'center' }]}
            value={profile.yearsExperience ? String(profile.yearsExperience) : ''}
            onChangeText={(v) => {
              const n = parseInt(v.replace(/\D/g, ''), 10);
              onChange({ yearsExperience: Number.isNaN(n) ? 0 : Math.min(n, 50) });
            }}
            placeholder="0"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
            maxLength={2}
          />
          <Text style={styles.expUnit}>{t('onboarding.review.yearsUnit')}</Text>
        </View>

        <Text style={[styles.sectionHead, { marginTop: spacing.lg }]}>
          {t('onboarding.profilePro.portfolioTitle')}
        </Text>
        <Text style={styles.sectionDesc}>
          {t('onboarding.profilePro.portfolioDesc')}
        </Text>
        <View style={styles.portfolioGrid}>
          {(profile.portfolio ?? []).map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <Image source={{ uri: item.uri }} style={styles.portfolioImage} />
              <Pressable
                onPress={() => removePortfolio(item.id)}
                style={styles.portfolioRemove}
                hitSlop={8}
              >
                <Trash2 size={14} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}
          <Pressable onPress={pickPortfolio} style={styles.portfolioAdd}>
            <Plus size={22} color={colors.primary} />
            <Text style={styles.portfolioAddText}>
              {t('onboarding.profilePro.addPhotos')}
            </Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionHead, { marginTop: spacing.lg }]}>
          {t('onboarding.profilePro.certsTitle')}
        </Text>
        <Text style={styles.sectionDesc}>{t('onboarding.profilePro.certsDesc')}</Text>

        <View style={styles.certAddRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={newCertName}
            onChangeText={setNewCertName}
            placeholder={t('onboarding.profilePro.certNamePlaceholder')}
            placeholderTextColor={colors.textTertiary}
            maxLength={80}
          />
          <Pressable
            onPress={addCertification}
            disabled={!newCertName.trim()}
            style={[
              styles.certAddBtn,
              !newCertName.trim() && { opacity: 0.5 },
            ]}
          >
            <Plus size={18} color={colors.primary} />
          </Pressable>
        </View>

        {(profile.certifications ?? []).map((cert) => (
          <View key={cert.id} style={styles.certCard}>
            <View style={styles.certHead}>
              <FileCheck size={18} color={colors.primary} />
              <Text style={styles.certName} numberOfLines={1}>
                {cert.name}
              </Text>
              {cert.verified && <CheckCircle2 size={16} color={colors.success} />}
              <Pressable
                onPress={() => removeCertification(cert.id)}
                hitSlop={8}
                style={styles.certDelete}
              >
                <Trash2 size={14} color={colors.error} />
              </Pressable>
            </View>
            {cert.uri ? (
              <Image source={{ uri: cert.uri }} style={styles.certPreview} />
            ) : (
              <Pressable
                onPress={() => pickCertificationFile(cert.id)}
                style={styles.certUpload}
              >
                <Camera size={14} color={colors.primary} />
                <Text style={styles.certUploadText}>
                  {t('onboarding.profilePro.uploadDoc')}
                </Text>
              </Pressable>
            )}
          </View>
        ))}

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="profile-next"
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
  title: { ...typography.h2, color: colors.text, marginTop: spacing.md, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  photoBlock: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.md },
  avatarWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    ...shadow.md,
  },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.logo,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface,
  },
  photoLabel: { ...typography.caption, color: colors.textSecondary },
  label: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs + 2, marginTop: spacing.sm },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },
  textarea: { minHeight: 100 },
  charCount: { ...typography.small, color: colors.textTertiary, textAlign: 'right', marginTop: 4 },
  expRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  expUnit: { ...typography.body, color: colors.textSecondary },
  sectionHead: { ...typography.h3, color: colors.text, marginBottom: spacing.xs },
  sectionDesc: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  portfolioItem: {
    width: 94,
    height: 94,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.borderLight,
  },
  portfolioImage: { width: '100%', height: '100%' },
  portfolioRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioAdd: {
    width: 94,
    height: 94,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 4,
  },
  portfolioAddText: { ...typography.small, color: colors.primary, textAlign: 'center', fontSize: 10 },
  certAddRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.sm },
  certAddBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.logo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: spacing.xs,
  },
  certHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  certName: { flex: 1, ...typography.captionMedium, color: colors.text },
  certDelete: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.logo,
    alignSelf: 'flex-start',
  },
  certUploadText: { ...typography.smallMedium, color: colors.primary },
  certPreview: { width: '100%', height: 120, borderRadius: radius.sm },
  footer: { marginTop: spacing.lg },
});
