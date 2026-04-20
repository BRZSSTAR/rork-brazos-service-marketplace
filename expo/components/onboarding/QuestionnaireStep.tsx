import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '@/constants/theme';
import PrimaryButton from '@/components/PrimaryButton';
import { buildQuestionnaire, QuestionDef } from '@/constants/questionnaire';
import type {
  QuestionnaireResponses,
  QuestionnaireValue,
  ServiceCategory,
} from '@/types';

interface QuestionnaireStepProps {
  primaryCategory: ServiceCategory | undefined;
  responses: QuestionnaireResponses;
  onChange: (responses: QuestionnaireResponses) => void;
  onNext: () => void;
}

function Question({
  q,
  value,
  onValueChange,
}: {
  q: QuestionDef;
  value: QuestionnaireValue | undefined;
  onValueChange: (v: QuestionnaireValue) => void;
}) {
  if (q.type === 'single') {
    return (
      <View style={styles.q}>
        <Text style={styles.qLabel}>
          {q.label}
          {q.required && <Text style={styles.required}> *</Text>}
        </Text>
        <View style={styles.optionRow}>
          {q.options?.map((opt) => {
            const selected = value === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => onValueChange(opt.id)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (q.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <View style={styles.q}>
        <Text style={styles.qLabel}>
          {q.label}
          {q.required && <Text style={styles.required}> *</Text>}
        </Text>
        <View style={styles.optionRow}>
          {q.options?.map((opt) => {
            const selected = arr.includes(opt.id);
            return (
              <Pressable
                key={opt.id}
                onPress={() =>
                  onValueChange(
                    selected ? arr.filter((x) => x !== opt.id) : [...arr, opt.id]
                  )
                }
                style={[styles.chip, selected && styles.chipSelected]}
              >
                {selected && <Check size={12} color="#FFFFFF" style={{ marginRight: 4 }} />}
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  if (q.type === 'boolean') {
    const v = value === true;
    return (
      <View style={[styles.q, styles.qRow]}>
        <Text style={[styles.qLabel, { flex: 1 }]}>{q.label}</Text>
        <Switch
          value={v}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
    );
  }

  if (q.type === 'number') {
    const text = typeof value === 'number' ? String(value) : '';
    return (
      <View style={styles.q}>
        <Text style={styles.qLabel}>{q.label}</Text>
        <TextInput
          style={styles.input}
          value={text}
          keyboardType="number-pad"
          onChangeText={(txt) => {
            const n = parseInt(txt.replace(/\D/g, ''), 10);
            onValueChange(Number.isNaN(n) ? 0 : n);
          }}
          placeholder={q.placeholder}
          placeholderTextColor={colors.textTertiary}
        />
      </View>
    );
  }

  return (
    <View style={styles.q}>
      <Text style={styles.qLabel}>{q.label}</Text>
      <TextInput
        style={styles.input}
        value={typeof value === 'string' ? value : ''}
        onChangeText={onValueChange}
        placeholder={q.placeholder}
        placeholderTextColor={colors.textTertiary}
        maxLength={160}
      />
      {q.hint && <Text style={styles.hint}>{q.hint}</Text>}
    </View>
  );
}

export default function QuestionnaireStep({
  primaryCategory,
  responses,
  onChange,
  onNext,
}: QuestionnaireStepProps) {
  const { t } = useTranslation();
  const sections = useMemo(() => buildQuestionnaire(primaryCategory), [primaryCategory]);

  const updateOne = (id: string, value: QuestionnaireValue) => {
    onChange({ ...responses, [id]: value });
  };

  const requiredIds = sections.flatMap((s) => s.questions.filter((q) => q.required).map((q) => q.id));
  const allRequiredAnswered = requiredIds.every((id) => {
    const v = responses[id];
    if (Array.isArray(v)) return v.length > 0;
    return v !== undefined && v !== null && v !== '';
  });

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
        <Text style={styles.title}>{t('onboarding.questionnaire.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.questionnaire.subtitle')}</Text>

        {sections.map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.questions.map((q) => (
              <Question
                key={q.id}
                q={q}
                value={responses[q.id]}
                onValueChange={(v) => updateOne(q.id, v)}
              />
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <PrimaryButton
            title={t('common.continue')}
            onPress={onNext}
            disabled={!allRequiredAnswered}
            testID="qn-next"
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
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  q: { marginBottom: spacing.md },
  qRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  qLabel: { ...typography.captionMedium, color: colors.text, marginBottom: spacing.xs + 2 },
  required: { color: colors.error },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  hint: { ...typography.small, color: colors.textTertiary, marginTop: 4 },
  footer: { marginTop: spacing.md },
});
