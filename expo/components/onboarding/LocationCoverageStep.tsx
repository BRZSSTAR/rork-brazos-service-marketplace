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
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, X, Navigation } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import type { BookingModel, ServiceCoverage } from '@/types';

interface LocationCoverageStepProps {
  coverage: ServiceCoverage;
  bookingModel: BookingModel;
  onChange: (patch: Partial<ServiceCoverage>) => void;
  onChangeBookingModel: (m: BookingModel) => void;
  onNext: () => void;
}

const RADIUS_PRESETS = [5, 10, 20, 50];

export default function LocationCoverageStep({
  coverage,
  bookingModel,
  onChange,
  onChangeBookingModel,
  onNext,
}: LocationCoverageStepProps) {
  const { t } = useTranslation();
  const [zipInput, setZipInput] = useState<string>('');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const useCurrentLocation = useCallback(async () => {
    if (Platform.OS === 'web') {
      if (!navigator.geolocation) {
        Alert.alert('', t('onboarding.coverage.gpsUnavailable'));
        return;
      }
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          setIsLocating(false);
        },
        (err) => {
          console.error('[Coverage] web geo error:', err);
          setIsLocating(false);
          Alert.alert('', t('onboarding.coverage.gpsError'));
        }
      );
      return;
    }
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('', t('onboarding.coverage.gpsPermission'));
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      onChange({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    } catch (error) {
      console.error('[Coverage] GPS error:', error);
      Alert.alert('', t('onboarding.coverage.gpsError'));
    } finally {
      setIsLocating(false);
    }
  }, [onChange, t]);

  const addZip = useCallback(() => {
    const digits = zipInput.replace(/\D/g, '');
    if (digits.length < 5) return;
    const current = coverage.zipCodes ?? [];
    if (current.includes(digits)) {
      setZipInput('');
      return;
    }
    onChange({ zipCodes: [...current, digits] });
    setZipInput('');
  }, [zipInput, coverage.zipCodes, onChange]);

  const removeZip = useCallback(
    (zip: string) => {
      onChange({ zipCodes: (coverage.zipCodes ?? []).filter((z) => z !== zip) });
    },
    [coverage.zipCodes, onChange]
  );

  const canContinue = !!(coverage.city && coverage.city.trim().length >= 2);

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
        <Text style={styles.title}>{t('onboarding.coverage.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.coverage.subtitle')}</Text>

        <Text style={styles.label}>{t('onboarding.coverage.baseAddressLabel')}</Text>
        <View style={styles.inputWrap}>
          <MapPin size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.flexInput}
            value={coverage.baseAddress ?? ''}
            onChangeText={(v) => onChange({ baseAddress: v })}
            placeholder={t('onboarding.coverage.baseAddressPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            maxLength={120}
          />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 2 }}>
            <Text style={styles.label}>{t('onboarding.coverage.cityLabel')}</Text>
            <TextInput
              style={styles.input}
              value={coverage.city ?? ''}
              onChangeText={(v) => onChange({ city: v })}
              placeholder={t('onboarding.coverage.cityPlaceholder')}
              placeholderTextColor={colors.textTertiary}
              maxLength={60}
            />
          </View>
          <View style={{ width: spacing.sm }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{t('onboarding.coverage.stateLabel')}</Text>
            <TextInput
              style={styles.input}
              value={coverage.state ?? ''}
              onChangeText={(v) => onChange({ state: v.toUpperCase().slice(0, 2) })}
              placeholder="SP"
              placeholderTextColor={colors.textTertiary}
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>

        <Pressable onPress={useCurrentLocation} style={styles.gpsBtn} disabled={isLocating}>
          <Navigation size={14} color={colors.primary} />
          <Text style={styles.gpsBtnText}>
            {isLocating
              ? t('onboarding.coverage.locating')
              : t('onboarding.coverage.useGps')}
          </Text>
        </Pressable>

        <Text style={[styles.label, { marginTop: spacing.md }]}>
          {t('onboarding.coverage.radiusLabel')}
        </Text>
        <Text style={styles.smallHint}>{t('onboarding.coverage.radiusHint')}</Text>
        <View style={styles.chipRow}>
          {RADIUS_PRESETS.map((km) => {
            const selected = coverage.radiusKm === km;
            return (
              <Pressable
                key={km}
                onPress={() => onChange({ radiusKm: km })}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {km} km
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: spacing.md }]}>
          {t('onboarding.coverage.zipLabel')}
        </Text>
        <View style={styles.zipAddRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={zipInput}
            onChangeText={setZipInput}
            placeholder={t('onboarding.coverage.zipPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
            maxLength={9}
            onSubmitEditing={addZip}
          />
          <Pressable
            onPress={addZip}
            disabled={zipInput.replace(/\D/g, '').length < 5}
            style={[
              styles.zipAddBtn,
              zipInput.replace(/\D/g, '').length < 5 && { opacity: 0.5 },
            ]}
          >
            <Plus size={18} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.zipTags}>
          {(coverage.zipCodes ?? []).map((z) => (
            <View key={z} style={styles.zipTag}>
              <Text style={styles.zipTagText}>{z}</Text>
              <Pressable onPress={() => removeZip(z)} hitSlop={8}>
                <X size={12} color={colors.textSecondary} />
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: spacing.lg }]}>
          {t('onboarding.coverage.bookingModelLabel')}
        </Text>
        <Text style={styles.smallHint}>
          {t('onboarding.coverage.bookingModelHint')}
        </Text>
        <View style={styles.bookingOptions}>
          <Pressable
            onPress={() => onChangeBookingModel('INSTANT')}
            style={[
              styles.bookingCard,
              bookingModel === 'INSTANT' && styles.bookingCardActive,
            ]}
          >
            <Text
              style={[
                styles.bookingTitle,
                bookingModel === 'INSTANT' && { color: colors.primary },
              ]}
            >
              {t('onboarding.coverage.instantTitle')}
            </Text>
            <Text style={styles.bookingDesc}>
              {t('onboarding.coverage.instantDesc')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onChangeBookingModel('REQUEST')}
            style={[
              styles.bookingCard,
              bookingModel === 'REQUEST' && styles.bookingCardActive,
            ]}
          >
            <Text
              style={[
                styles.bookingTitle,
                bookingModel === 'REQUEST' && { color: colors.primary },
              ]}
            >
              {t('onboarding.coverage.requestTitle')}
            </Text>
            <Text style={styles.bookingDesc}>
              {t('onboarding.coverage.requestDesc')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="coverage-next"
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
  label: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs + 2 },
  smallHint: { ...typography.small, color: colors.textTertiary, marginBottom: spacing.xs },
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
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
  },
  flexInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginTop: spacing.sm },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.logo,
    marginTop: spacing.xs,
  },
  gpsBtnText: { ...typography.smallMedium, color: colors.primary },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.small, color: colors.text },
  chipTextSelected: { color: '#FFFFFF' },
  zipAddRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  zipAddBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.logo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zipTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.xs,
  },
  zipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
  },
  zipTagText: { ...typography.smallMedium, color: colors.text },
  bookingOptions: { gap: spacing.sm },
  bookingCard: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  bookingCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.logo,
  },
  bookingTitle: { ...typography.bodyMedium, color: colors.text },
  bookingDesc: { ...typography.caption, color: colors.textSecondary },
  footer: { marginTop: spacing.lg },
});
