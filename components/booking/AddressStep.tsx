import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Plus,
  Home,
  Briefcase,
  Plane,
  Tag,
  Trash2,
  Edit3,
  Navigation,
  Check,
  ChevronDown,
  User,
  Phone,
  X,
} from 'lucide-react-native';
import { colors, spacing, typography, radius, shadow } from '@/constants/theme';
import { useBookingStore } from '@/store/bookingStore';
import type { SavedAddress, AddressLabel } from '@/types';

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

const ADDRESS_LABELS: { key: AddressLabel; icon: typeof Home }[] = [
  { key: 'HOME', icon: Home },
  { key: 'WORK', icon: Briefcase },
  { key: 'TRAVEL', icon: Plane },
  { key: 'OTHER', icon: Tag },
];

function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const scale = useRef(new Animated.Value(1)).current;
  const labelKey = address.label.toLowerCase();
  const labelIcon = ADDRESS_LABELS.find((l) => l.key === address.label);
  const LabelIcon = labelIcon?.icon ?? Tag;

  return (
    <Pressable
      onPress={onSelect}
      onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
    >
      <Animated.View
        style={[
          styles.addressCard,
          isSelected && styles.addressCardSelected,
          { transform: [{ scale }] },
        ]}
      >
        <View style={styles.addressCardHeader}>
          <View style={[styles.labelBadge, isSelected && styles.labelBadgeSelected]}>
            <LabelIcon size={14} color={isSelected ? colors.surface : colors.accent} />
            <Text style={[styles.labelBadgeText, isSelected && styles.labelBadgeTextSelected]}>
              {address.customLabel ?? t(`booking.address.labels.${labelKey}`)}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.selectedCheck}>
              <Check size={14} color={colors.surface} strokeWidth={3} />
            </View>
          )}
        </View>

        <Text style={[styles.addressText, isSelected && styles.addressTextSelected]} numberOfLines={2}>
          {address.street}, {address.number}
          {address.complement ? ` - ${address.complement}` : ''}
        </Text>
        <Text style={[styles.addressSubtext, isSelected && styles.addressSubtextSelected]} numberOfLines={1}>
          {address.neighborhood}, {address.city} - {address.state}
        </Text>

        {address.recipientName ? (
          <View style={styles.recipientRow}>
            <User size={12} color={isSelected ? 'rgba(255,255,255,0.7)' : colors.textTertiary} />
            <Text style={[styles.recipientText, isSelected && styles.recipientTextSelected]}>
              {address.recipientName}
            </Text>
          </View>
        ) : null}

        <View style={styles.addressActions}>
          <Pressable onPress={onEdit} style={styles.actionBtn} hitSlop={8}>
            <Edit3 size={14} color={isSelected ? 'rgba(255,255,255,0.8)' : colors.textTertiary} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.actionBtn} hitSlop={8}>
            <Trash2 size={14} color={isSelected ? 'rgba(255,255,255,0.8)' : colors.error} />
          </Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

interface AddressFormData {
  label: AddressLabel;
  customLabel: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  recipientName: string;
  recipientPhone: string;
}

const EMPTY_FORM: AddressFormData = {
  label: 'HOME',
  customLabel: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  zipCode: '',
  recipientName: '',
  recipientPhone: '',
};

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const { t } = useTranslation();
  const addresses = useBookingStore((s) => s.addresses);
  const addAddress = useBookingStore((s) => s.addAddress);
  const updateAddress = useBookingStore((s) => s.updateAddress);
  const deleteAddress = useBookingStore((s) => s.deleteAddress);
  const draft = useBookingStore((s) => s.currentDraft);
  const updateDraft = useBookingStore((s) => s.updateDraft);

  const [selectedId, setSelectedId] = useState<string>(draft?.addressId ?? addresses[0]?.id ?? '');
  const [showForm, setShowForm] = useState<boolean>(addresses.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressFormData>(EMPTY_FORM);
  const [showRecipient, setShowRecipient] = useState<boolean>(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const updateField = useCallback((field: keyof AddressFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isFormValid =
    form.street.trim().length > 0 &&
    form.number.trim().length > 0 &&
    form.neighborhood.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0 &&
    form.zipCode.replace(/\D/g, '').length >= 5;

  const handleSaveAddress = useCallback(async () => {
    if (!isFormValid) return;

    const addressData = {
      label: form.label,
      customLabel: form.label === 'OTHER' && form.customLabel.trim() ? form.customLabel.trim() : undefined,
      street: form.street.trim(),
      number: form.number.trim(),
      complement: form.complement.trim() || undefined,
      neighborhood: form.neighborhood.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      zipCode: form.zipCode.trim(),
      recipientName: form.recipientName.trim() || undefined,
      recipientPhone: form.recipientPhone.trim() || undefined,
    };

    if (editingId) {
      await updateAddress(editingId, addressData);
      setSelectedId(editingId);
      setEditingId(null);
    } else {
      const newAddr = await addAddress(addressData);
      setSelectedId(newAddr.id);
    }

    setForm(EMPTY_FORM);
    setShowForm(false);
    setShowRecipient(false);
  }, [form, isFormValid, editingId, addAddress, updateAddress]);

  const handleEdit = useCallback(
    (address: SavedAddress) => {
      setForm({
        label: address.label,
        customLabel: address.customLabel ?? '',
        street: address.street,
        number: address.number,
        complement: address.complement ?? '',
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        recipientName: address.recipientName ?? '',
        recipientPhone: address.recipientPhone ?? '',
      });
      setEditingId(address.id);
      setShowForm(true);
      setShowRecipient(!!address.recipientName || !!address.recipientPhone);
    },
    []
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert(t('booking.address.deleteTitle'), t('booking.address.deleteMessage'), [
        { text: t('common.back'), style: 'cancel' },
        {
          text: t('booking.address.deleteConfirm'),
          style: 'destructive',
          onPress: async () => {
            await deleteAddress(id);
            if (selectedId === id) {
              const remaining = addresses.filter((a) => a.id !== id);
              setSelectedId(remaining[0]?.id ?? '');
            }
          },
        },
      ]);
    },
    [deleteAddress, selectedId, addresses, t]
  );

  const handleContinue = useCallback(() => {
    if (!selectedId) return;
    updateDraft({ addressId: selectedId });
    onNext();
  }, [selectedId, updateDraft, onNext]);

  const handleUseLocation = useCallback(async () => {
    if (Platform.OS === 'web') {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('[Booking] GPS location:', position.coords);
            updateField('street', t('booking.address.gpsDetected'));
          },
          (err) => {
            console.log('[Booking] GPS error:', err);
            Alert.alert(t('booking.address.gpsError'));
          }
        );
      }
    } else {
      try {
        const Location = await import('expo-location');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(t('booking.address.gpsPermission'));
          return;
        }
        const loc = await Location.getCurrentPositionAsync({});
        console.log('[Booking] GPS location:', loc.coords);
        updateField('street', t('booking.address.gpsDetected'));
      } catch (e) {
        console.log('[Booking] Location unavailable:', e);
        Alert.alert(t('booking.address.gpsError'));
      }
    }
  }, [updateField, t]);

  if (showForm) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={120}
      >
        <ScrollView
          style={styles.formScroll}
          contentContainerStyle={styles.formScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {editingId ? t('booking.address.editTitle') : t('booking.address.addTitle')}
            </Text>
            <Pressable onPress={() => { setShowForm(false); setEditingId(null); setForm(EMPTY_FORM); }} hitSlop={12}>
              <X size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text style={styles.fieldLabel}>{t('booking.address.labelField')}</Text>
          <View style={styles.labelsRow}>
            {ADDRESS_LABELS.map(({ key, icon: Icon }) => {
              const active = form.label === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => updateField('label', key)}
                  style={[styles.labelChip, active && styles.labelChipActive]}
                >
                  <Icon size={16} color={active ? colors.surface : colors.textSecondary} />
                  <Text style={[styles.labelChipText, active && styles.labelChipTextActive]}>
                    {t(`booking.address.labels.${key.toLowerCase()}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {form.label === 'OTHER' && (
            <TextInput
              style={styles.textInput}
              value={form.customLabel}
              onChangeText={(v) => updateField('customLabel', v)}
              placeholder={t('booking.address.customLabelPlaceholder')}
              placeholderTextColor={colors.textTertiary}
            />
          )}

          <Pressable onPress={handleUseLocation} style={styles.gpsButton}>
            <Navigation size={16} color={colors.accent} />
            <Text style={styles.gpsButtonText}>{t('booking.address.useGps')}</Text>
          </Pressable>

          <Text style={styles.fieldLabel}>{t('booking.address.streetField')}</Text>
          <TextInput
            style={styles.textInput}
            value={form.street}
            onChangeText={(v) => updateField('street', v)}
            placeholder={t('booking.address.streetPlaceholder')}
            placeholderTextColor={colors.textTertiary}
            testID="address-street"
          />

          <View style={styles.rowInputs}>
            <View style={styles.rowInputSmall}>
              <Text style={styles.fieldLabel}>{t('booking.address.numberField')}</Text>
              <TextInput
                style={styles.textInput}
                value={form.number}
                onChangeText={(v) => updateField('number', v)}
                placeholder="123"
                placeholderTextColor={colors.textTertiary}
                keyboardType="default"
                testID="address-number"
              />
            </View>
            <View style={styles.rowInputLarge}>
              <Text style={styles.fieldLabel}>{t('booking.address.complementField')}</Text>
              <TextInput
                style={styles.textInput}
                value={form.complement}
                onChangeText={(v) => updateField('complement', v)}
                placeholder={t('booking.address.complementPlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>{t('booking.address.neighborhoodField')}</Text>
          <TextInput
            style={styles.textInput}
            value={form.neighborhood}
            onChangeText={(v) => updateField('neighborhood', v)}
            placeholder={t('booking.address.neighborhoodPlaceholder')}
            placeholderTextColor={colors.textTertiary}
          />

          <View style={styles.rowInputs}>
            <View style={styles.rowInputLarge}>
              <Text style={styles.fieldLabel}>{t('booking.address.cityField')}</Text>
              <TextInput
                style={styles.textInput}
                value={form.city}
                onChangeText={(v) => updateField('city', v)}
                placeholder={t('booking.address.cityPlaceholder')}
                placeholderTextColor={colors.textTertiary}
              />
            </View>
            <View style={styles.rowInputSmall}>
              <Text style={styles.fieldLabel}>{t('booking.address.stateField')}</Text>
              <TextInput
                style={styles.textInput}
                value={form.state}
                onChangeText={(v) => updateField('state', v)}
                placeholder="SP"
                placeholderTextColor={colors.textTertiary}
                maxLength={2}
                autoCapitalize="characters"
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>{t('booking.address.zipField')}</Text>
          <TextInput
            style={styles.textInput}
            value={form.zipCode}
            onChangeText={(v) => updateField('zipCode', v)}
            placeholder="00000-000"
            placeholderTextColor={colors.textTertiary}
            keyboardType="number-pad"
          />

          <Pressable
            onPress={() => setShowRecipient(!showRecipient)}
            style={styles.recipientToggle}
          >
            <ChevronDown
              size={16}
              color={colors.accent}
              style={showRecipient ? { transform: [{ rotate: '180deg' }] } : undefined}
            />
            <Text style={styles.recipientToggleText}>{t('booking.address.recipientToggle')}</Text>
          </Pressable>

          {showRecipient && (
            <View style={styles.recipientFields}>
              <View style={styles.recipientInputRow}>
                <User size={16} color={colors.textTertiary} />
                <TextInput
                  style={styles.recipientInput}
                  value={form.recipientName}
                  onChangeText={(v) => updateField('recipientName', v)}
                  placeholder={t('booking.address.recipientNamePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.recipientInputRow}>
                <Phone size={16} color={colors.textTertiary} />
                <TextInput
                  style={styles.recipientInput}
                  value={form.recipientPhone}
                  onChangeText={(v) => updateField('recipientPhone', v)}
                  placeholder={t('booking.address.recipientPhonePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            onPress={handleSaveAddress}
            disabled={!isFormValid}
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
          >
            <Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>
              {editingId ? t('booking.address.saveChanges') : t('booking.address.addButton')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconRow}>
          <View style={styles.iconCircle}>
            <MapPin size={28} color={colors.accent} strokeWidth={1.8} />
          </View>
        </View>

        <Text style={styles.title}>{t('booking.address.title')}</Text>
        <Text style={styles.subtitle}>{t('booking.address.subtitle')}</Text>

        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            isSelected={selectedId === addr.id}
            onSelect={() => setSelectedId(addr.id)}
            onEdit={() => handleEdit(addr)}
            onDelete={() => handleDelete(addr.id)}
          />
        ))}

        <Pressable
          onPress={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(true);
          }}
          style={styles.addButton}
        >
          <Plus size={18} color={colors.accent} />
          <Text style={styles.addButtonText}>{t('booking.address.addNew')}</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </Pressable>
          <Pressable
            onPress={handleContinue}
            onPressIn={() => Animated.spring(buttonScale, { toValue: 0.97, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start()}
            disabled={!selectedId}
          >
            <Animated.View
              style={[
                styles.button,
                styles.buttonFlex,
                !selectedId && styles.buttonDisabled,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <Text style={[styles.buttonText, !selectedId && styles.buttonTextDisabled]}>
                {t('common.continue')}
              </Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.lg },
  formScroll: { flex: 1 },
  formScrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl },
  iconRow: { alignItems: 'center', marginBottom: spacing.md },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center' as const,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    marginBottom: spacing.lg,
  },
  addressCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.sm,
  },
  addressCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  labelBadgeSelected: {
    backgroundColor: 'rgba(201,168,76,0.25)',
  },
  labelBadgeText: {
    ...typography.smallMedium,
    color: colors.accent,
  },
  labelBadgeTextSelected: {
    color: colors.accent,
  },
  selectedCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressText: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  addressTextSelected: { color: colors.textInverse },
  addressSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addressSubtextSelected: { color: 'rgba(255,255,255,0.7)' },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  recipientText: {
    ...typography.small,
    color: colors.textTertiary,
  },
  recipientTextSelected: { color: 'rgba(255,255,255,0.7)' },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionBtn: { padding: 4 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  addButtonText: {
    ...typography.captionMedium,
    color: colors.accent,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h3,
    color: colors.text,
  },
  fieldLabel: {
    ...typography.smallMedium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  textInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  labelsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  labelChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.borderLight,
  },
  labelChipActive: {
    backgroundColor: colors.primary,
  },
  labelChipText: {
    ...typography.smallMedium,
    color: colors.textSecondary,
  },
  labelChipTextActive: {
    color: colors.surface,
  },
  gpsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: '#FFF9E6',
  },
  gpsButtonText: {
    ...typography.captionMedium,
    color: colors.accent,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowInputSmall: { flex: 1 },
  rowInputLarge: { flex: 2 },
  recipientToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  recipientToggleText: {
    ...typography.captionMedium,
    color: colors.accent,
  },
  recipientFields: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  recipientInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  recipientInput: {
    ...typography.body,
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonFlex: { flex: 1 },
  buttonDisabled: { backgroundColor: colors.disabled },
  buttonText: { ...typography.button, color: colors.primary },
  buttonTextDisabled: { color: colors.textTertiary },
});
