import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography } from '@/constants/theme';

export default function ExploreScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Search size={20} color={colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('customer.explore.searchPlaceholder')}
          placeholderTextColor={colors.textTertiary}
          testID="explore-search-input"
        />
      </View>
      <View style={styles.emptyState}>
        <Search size={48} color={colors.border} strokeWidth={1.2} />
        <Text style={styles.emptyTitle}>{t('customer.explore.title')}</Text>
        <Text style={styles.emptySubtext}>{t('customer.explore.subtitle')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
