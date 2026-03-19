import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Inbox } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography } from '@/constants/theme';

const tabs = ['new', 'accepted', 'completed'] as const;
type TabKey = (typeof tabs)[number];

export default function OrdersScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>('new');

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {t(`provider.orders.tabs.${tab}`)}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyState}>
          <Inbox size={48} color={colors.border} strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>{t('provider.orders.emptyTitle')}</Text>
          <Text style={styles.emptySubtext}>
            {t('provider.orders.emptySubtitle', { tab: t(`provider.orders.tabs.${activeTab}`).toLowerCase() })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  tab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.background,
  },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.captionMedium, color: colors.textSecondary },
  tabTextActive: { color: colors.accent },
  scrollContent: { flexGrow: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    minHeight: 400,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
