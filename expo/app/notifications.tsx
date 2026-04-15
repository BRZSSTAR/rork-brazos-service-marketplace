import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Bell, Package, CheckCircle, XCircle, ShieldCheck, Info, Check } from 'lucide-react-native';
import { useNotificationStore } from '@/store/notificationStore';
import type { AppNotification, NotificationType } from '@/store/notificationStore';
import { colors, spacing, typography } from '@/constants/theme';

const iconMap: Record<NotificationType, typeof Bell> = {
  ORDER_NEW: Package,
  ORDER_ACCEPTED: CheckCircle,
  ORDER_STARTED: Package,
  ORDER_COMPLETED: CheckCircle,
  ORDER_CANCELLED: XCircle,
  APPROVAL: ShieldCheck,
  SYSTEM: Info,
};

const colorMap: Record<NotificationType, string> = {
  ORDER_NEW: '#3B82F6',
  ORDER_ACCEPTED: colors.success,
  ORDER_STARTED: '#F59E0B',
  ORDER_COMPLETED: colors.success,
  ORDER_CANCELLED: colors.error,
  APPROVAL: colors.accent,
  SYSTEM: colors.textSecondary,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'agora';
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function NotificationItem({ notification, onPress }: { notification: AppNotification; onPress: () => void }) {
  const IconComp = iconMap[notification.type] ?? Bell;
  const iconColor = colorMap[notification.type] ?? colors.textSecondary;

  return (
    <Pressable
      style={[styles.notifItem, !notification.read && styles.notifItemUnread]}
      onPress={onPress}
      testID={`notif-${notification.id}`}
    >
      <View style={[styles.notifIcon, { backgroundColor: iconColor + '15' }]}>
        <IconComp size={20} color={iconColor} />
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={[styles.notifTitle, !notification.read && styles.notifTitleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.notifTime}>{timeAgo(notification.createdAt)}</Text>
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{notification.body}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const { t: _t } = useTranslation();
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount = useNotificationStore((s) => s.getUnreadCount());

  const handlePress = useCallback((id: string) => {
    void markAsRead(id);
  }, [markAsRead]);

  const sorted = [...notifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Notificações',
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
          headerRight: unreadCount > 0
            ? () => (
                <Pressable onPress={() => void markAllAsRead()} style={styles.markAllButton} hitSlop={12}>
                  <Check size={18} color={colors.accent} />
                </Pressable>
              )
            : undefined,
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sorted.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color={colors.border} strokeWidth={1.2} />
            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
            <Text style={styles.emptySubtext}>Suas notificações aparecerão aqui.</Text>
          </View>
        ) : (
          sorted.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onPress={() => handlePress(notif.id)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.xxl },
  markAllButton: { paddingHorizontal: spacing.sm },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  notifItemUnread: {
    backgroundColor: '#FEFCF3',
  },
  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  notifContent: { flex: 1, gap: 4 },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: { ...typography.captionMedium, color: colors.text, flex: 1 },
  notifTitleUnread: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
  notifTime: { ...typography.small, color: colors.textTertiary, marginLeft: spacing.sm },
  notifBody: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary },
});
