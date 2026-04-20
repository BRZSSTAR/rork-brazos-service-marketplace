import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Clock,
  Package,
  X,
} from 'lucide-react-native';
import { colors, spacing, radius, typography, shadow } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import type {
  CategorySelection,
  ProviderService,
  ProviderServiceAddOn,
  ServicePricingModel,
} from '@/types';
import { SERVICE_CATALOG } from '@/constants/serviceCatalog';

interface ServicesBuilderStepProps {
  selections: CategorySelection[];
  services: ProviderService[];
  onChange: (services: ProviderService[]) => void;
  onNext: () => void;
}

const PRICING_MODELS: { id: ServicePricingModel; labelKey: string }[] = [
  { id: 'FIXED', labelKey: 'onboarding.services.pricingFixed' },
  { id: 'HOURLY', labelKey: 'onboarding.services.pricingHourly' },
  { id: 'STARTING_AT', labelKey: 'onboarding.services.pricingStarting' },
  { id: 'CUSTOM_QUOTE', labelKey: 'onboarding.services.pricingQuote' },
];

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

function centsToText(cents: number): string {
  if (!cents) return '';
  return (cents / 100).toFixed(2).replace('.', ',');
}

function parsePriceText(text: string): number {
  const digits = text.replace(/\D/g, '');
  if (!digits) return 0;
  return parseInt(digits, 10);
}

export default function ServicesBuilderStep({
  selections,
  services,
  onChange,
  onNext,
}: ServicesBuilderStepProps) {
  const { t } = useTranslation();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);
  const [draftService, setDraftService] = useState<ProviderService | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openCreate = useCallback(() => {
    const firstSelection = selections[0];
    if (!firstSelection) {
      Alert.alert('', t('onboarding.services.noCategoryFirst'));
      return;
    }
    setDraftService({
      id: genId(),
      categoryId: firstSelection.category,
      subcategoryId: firstSelection.subcategoryIds[0] ?? '',
      catalogServiceId: firstSelection.serviceIds[0],
      title: '',
      description: '',
      pricingModel: 'FIXED',
      priceCents: 0,
      durationMinutes: 60,
      addOns: [],
    });
    setEditorOpen(true);
  }, [selections, t]);

  const openEdit = useCallback((svc: ProviderService) => {
    setDraftService({ ...svc, addOns: [...svc.addOns] });
    setEditorOpen(true);
  }, []);

  const saveDraft = useCallback(() => {
    if (!draftService) return;
    if (draftService.title.trim().length < 3) {
      Alert.alert('', t('onboarding.services.titleTooShort'));
      return;
    }
    const exists = services.some((s) => s.id === draftService.id);
    const next = exists
      ? services.map((s) => (s.id === draftService.id ? draftService : s))
      : [...services, draftService];
    onChange(next);
    setEditorOpen(false);
    setDraftService(null);
  }, [draftService, services, onChange, t]);

  const removeService = useCallback(
    (id: string) => {
      onChange(services.filter((s) => s.id !== id));
    },
    [services, onChange]
  );

  const updateDraft = useCallback(
    (patch: Partial<ProviderService>) => {
      setDraftService((prev) => (prev ? { ...prev, ...patch } : prev));
    },
    []
  );

  const addAddOn = useCallback(() => {
    setDraftService((prev) =>
      prev
        ? {
            ...prev,
            addOns: [
              ...prev.addOns,
              {
                id: genId(),
                name: '',
                description: '',
                priceCents: 0,
                durationImpactMinutes: 0,
              },
            ],
          }
        : prev
    );
  }, []);

  const updateAddOn = useCallback((id: string, patch: Partial<ProviderServiceAddOn>) => {
    setDraftService((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        addOns: prev.addOns.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      };
    });
  }, []);

  const removeAddOn = useCallback((id: string) => {
    setDraftService((prev) => {
      if (!prev) return prev;
      return { ...prev, addOns: prev.addOns.filter((a) => a.id !== id) };
    });
  }, []);

  const canContinue = services.length > 0;

  const availableSubcategories = draftService
    ? SERVICE_CATALOG.find((c) => c.id === draftService.categoryId)?.subcategories.filter(
        (sub) =>
          selections
            .find((s) => s.category === draftService.categoryId)
            ?.subcategoryIds.includes(sub.id)
      ) ?? []
    : [];

  return (
    <View style={styles.flex}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t('onboarding.services.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.services.subtitle')}</Text>

        {services.length === 0 && (
          <View style={styles.emptyBox}>
            <Package size={28} color={colors.primary} />
            <Text style={styles.emptyTitle}>{t('onboarding.services.emptyTitle')}</Text>
            <Text style={styles.emptyText}>{t('onboarding.services.emptyDesc')}</Text>
          </View>
        )}

        {services.map((svc) => {
          const expanded = expandedId === svc.id;
          const priceLabel =
            svc.pricingModel === 'CUSTOM_QUOTE'
              ? t('onboarding.services.pricingQuoteShort')
              : `R$ ${centsToText(svc.priceCents)}${
                  svc.pricingModel === 'HOURLY' ? '/h' : ''
                }${svc.pricingModel === 'STARTING_AT' ? '+' : ''}`;

          return (
            <View key={svc.id} style={styles.card}>
              <Pressable
                onPress={() => setExpandedId(expanded ? null : svc.id)}
                style={styles.cardHead}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {svc.title || t('onboarding.services.untitled')}
                  </Text>
                  <Text style={styles.cardMeta}>
                    {priceLabel}
                    {svc.addOns.length > 0 ? ` · ${svc.addOns.length} add-ons` : ''}
                  </Text>
                </View>
                {expanded ? (
                  <ChevronDown size={18} color={colors.textSecondary} />
                ) : (
                  <ChevronRight size={18} color={colors.textSecondary} />
                )}
              </Pressable>
              {expanded && (
                <View style={styles.cardBody}>
                  <Text style={styles.cardDesc}>{svc.description}</Text>
                  <View style={styles.cardActions}>
                    <SecondaryButton
                      title={t('onboarding.services.edit')}
                      onPress={() => openEdit(svc)}
                      testID={`svc-edit-${svc.id}`}
                    />
                    <Pressable
                      onPress={() => removeService(svc.id)}
                      style={styles.deleteBtn}
                      hitSlop={8}
                    >
                      <Trash2 size={16} color={colors.error} />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        <Pressable onPress={openCreate} style={styles.addBtn} testID="svc-add">
          <Plus size={18} color={colors.primary} />
          <Text style={styles.addBtnText}>{t('onboarding.services.addService')}</Text>
        </Pressable>

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!canContinue}
            testID="svc-next"
          />
        </View>
      </ScrollView>

      <Modal
        visible={editorOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setEditorOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalFlex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t('onboarding.services.editorTitle')}
            </Text>
            <Pressable
              onPress={() => setEditorOpen(false)}
              style={styles.modalClose}
              hitSlop={8}
            >
              <X size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalContent}
            keyboardShouldPersistTaps="handled"
          >
            {draftService && (
              <>
                <Text style={styles.label}>{t('onboarding.services.titleLabel')}</Text>
                <TextInput
                  style={styles.input}
                  value={draftService.title}
                  onChangeText={(v) => updateDraft({ title: v })}
                  placeholder={t('onboarding.services.titlePlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  maxLength={80}
                />

                <Text style={styles.label}>{t('onboarding.services.descLabel')}</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={draftService.description}
                  onChangeText={(v) => updateDraft({ description: v })}
                  placeholder={t('onboarding.services.descPlaceholder')}
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  maxLength={300}
                />

                {availableSubcategories.length > 0 && (
                  <>
                    <Text style={styles.label}>
                      {t('onboarding.services.subcategoryLabel')}
                    </Text>
                    <View style={styles.chipRow}>
                      {availableSubcategories.map((sub) => {
                        const selected = draftService.subcategoryId === sub.id;
                        return (
                          <Pressable
                            key={sub.id}
                            onPress={() => updateDraft({ subcategoryId: sub.id })}
                            style={[styles.chip, selected && styles.chipSelected]}
                          >
                            <Text
                              style={[
                                styles.chipText,
                                selected && styles.chipTextSelected,
                              ]}
                            >
                              {t(`catalog.subcategories.${sub.id}.name`)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </>
                )}

                <Text style={styles.label}>{t('onboarding.services.pricingLabel')}</Text>
                <View style={styles.chipRow}>
                  {PRICING_MODELS.map((pm) => {
                    const selected = draftService.pricingModel === pm.id;
                    return (
                      <Pressable
                        key={pm.id}
                        onPress={() => updateDraft({ pricingModel: pm.id })}
                        style={[styles.chip, selected && styles.chipSelected]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selected && styles.chipTextSelected,
                          ]}
                        >
                          {t(pm.labelKey)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                {draftService.pricingModel !== 'CUSTOM_QUOTE' && (
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>
                        {t('onboarding.services.priceLabel')}
                      </Text>
                      <View style={styles.priceWrap}>
                        <DollarSign size={16} color={colors.textSecondary} />
                        <TextInput
                          style={styles.priceInput}
                          value={centsToText(draftService.priceCents)}
                          onChangeText={(v) =>
                            updateDraft({ priceCents: parsePriceText(v) })
                          }
                          placeholder="0,00"
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="decimal-pad"
                        />
                      </View>
                    </View>
                    <View style={{ width: spacing.md }} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>
                        {t('onboarding.services.durationLabel')}
                      </Text>
                      <View style={styles.priceWrap}>
                        <Clock size={16} color={colors.textSecondary} />
                        <TextInput
                          style={styles.priceInput}
                          value={String(draftService.durationMinutes ?? '')}
                          onChangeText={(v) => {
                            const n = parseInt(v.replace(/\D/g, ''), 10);
                            updateDraft({ durationMinutes: Number.isNaN(n) ? 0 : n });
                          }}
                          placeholder="60"
                          placeholderTextColor={colors.textTertiary}
                          keyboardType="number-pad"
                          maxLength={4}
                        />
                        <Text style={styles.unit}>min</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.addOnHeader}>
                  <Text style={styles.sectionTitle}>
                    {t('onboarding.services.addOnsTitle')}
                  </Text>
                  <Pressable onPress={addAddOn} style={styles.smallAdd} hitSlop={8}>
                    <Plus size={14} color={colors.primary} />
                    <Text style={styles.smallAddText}>
                      {t('onboarding.services.addAddOn')}
                    </Text>
                  </Pressable>
                </View>

                {draftService.addOns.map((addOn) => (
                  <View key={addOn.id} style={styles.addOnCard}>
                    <TextInput
                      style={styles.input}
                      value={addOn.name}
                      onChangeText={(v) => updateAddOn(addOn.id, { name: v })}
                      placeholder={t('onboarding.services.addOnNamePh')}
                      placeholderTextColor={colors.textTertiary}
                      maxLength={60}
                    />
                    <TextInput
                      style={[styles.input, styles.textarea]}
                      value={addOn.description ?? ''}
                      onChangeText={(v) => updateAddOn(addOn.id, { description: v })}
                      placeholder={t('onboarding.services.addOnDescPh')}
                      placeholderTextColor={colors.textTertiary}
                      multiline
                      numberOfLines={2}
                      textAlignVertical="top"
                      maxLength={180}
                    />
                    <View style={styles.row}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.priceWrap}>
                          <DollarSign size={16} color={colors.textSecondary} />
                          <TextInput
                            style={styles.priceInput}
                            value={centsToText(addOn.priceCents)}
                            onChangeText={(v) =>
                              updateAddOn(addOn.id, { priceCents: parsePriceText(v) })
                            }
                            placeholder="0,00"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="decimal-pad"
                          />
                        </View>
                      </View>
                      <View style={{ width: spacing.sm }} />
                      <View style={{ flex: 1 }}>
                        <View style={styles.priceWrap}>
                          <Clock size={16} color={colors.textSecondary} />
                          <TextInput
                            style={styles.priceInput}
                            value={String(addOn.durationImpactMinutes ?? '')}
                            onChangeText={(v) => {
                              const n = parseInt(v.replace(/\D/g, ''), 10);
                              updateAddOn(addOn.id, {
                                durationImpactMinutes: Number.isNaN(n) ? 0 : n,
                              });
                            }}
                            placeholder="0"
                            placeholderTextColor={colors.textTertiary}
                            keyboardType="number-pad"
                            maxLength={3}
                          />
                          <Text style={styles.unit}>min</Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => removeAddOn(addOn.id)}
                        style={styles.deleteBtn}
                        hitSlop={8}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <PrimaryButton
              title={t('onboarding.services.saveService')}
              onPress={saveDraft}
              testID="svc-save"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  emptyBox: {
    alignItems: 'center',
    gap: spacing.xs,
    padding: spacing.lg,
    backgroundColor: colors.logo,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.primary },
  emptyText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    ...shadow.sm,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.bodyMedium, color: colors.text },
  cardMeta: { ...typography.small, color: colors.textSecondary },
  cardBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  cardDesc: { ...typography.caption, color: colors.textSecondary },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  deleteBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    backgroundColor: colors.errorLight,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: spacing.sm,
  },
  addBtnText: { ...typography.bodyMedium, color: colors.primary },
  footer: { marginTop: spacing.lg },

  modalFlex: { flex: 1, backgroundColor: colors.surface },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: { ...typography.h3, color: colors.text },
  modalClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalScroll: { flex: 1 },
  modalContent: { padding: spacing.lg },
  label: {
    ...typography.captionMedium,
    color: colors.text,
    marginBottom: spacing.xs + 2,
    marginTop: spacing.sm,
  },
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
  textarea: { minHeight: 80 },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
  },
  priceInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: 6,
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: colors.text,
  },
  unit: { ...typography.small, color: colors.textSecondary },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xs,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.small, color: colors.text },
  chipTextSelected: { color: '#FFFFFF' },
  addOnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionTitle: { ...typography.h3, color: colors.text },
  smallAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
    backgroundColor: colors.logo,
  },
  smallAddText: { ...typography.smallMedium, color: colors.primary },
  addOnCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  modalFooter: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
