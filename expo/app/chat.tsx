import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Send, User, ArrowLeft } from 'lucide-react-native';
import { useChatStore } from '@/store/chatStore';
import type { Chat, ChatMessage } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/constants/theme';

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

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function ChatListItem({ chat, onPress }: { chat: Chat; onPress: () => void }) {
  return (
    <Pressable style={styles.chatItem} onPress={onPress} testID={`chat-item-${chat.id}`}>
      <View style={styles.chatAvatar}>
        <User size={20} color={colors.accent} />
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, chat.unreadCount > 0 && styles.chatNameUnread]}>
            {chat.participantName}
          </Text>
          <Text style={styles.chatTime}>{chat.lastMessageAt ? timeAgo(chat.lastMessageAt) : ''}</Text>
        </View>
        <Text style={[styles.chatLastMsg, chat.unreadCount > 0 && styles.chatLastMsgUnread]} numberOfLines={1}>
          {chat.lastMessage ?? ''}
        </Text>
      </View>
      {chat.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{chat.unreadCount}</Text>
        </View>
      )}
    </Pressable>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.bubbleWrap, message.isOwn ? styles.bubbleWrapOwn : styles.bubbleWrapOther]}>
      <View style={[styles.bubble, message.isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        <Text style={[styles.bubbleText, message.isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther]}>
          {message.text}
        </Text>
        <Text style={[styles.bubbleTime, message.isOwn ? styles.bubbleTimeOwn : styles.bubbleTimeOther]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const { chatId } = useLocalSearchParams<{ chatId?: string }>();
  const chats = useChatStore((s) => s.chats);
  const messages = useChatStore((s) => s.messages);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markChatRead = useChatStore((s) => s.markChatRead);
  const user = useAuthStore((s) => s.user);

  const [activeChatId, setActiveChatId] = useState<string | null>(chatId ?? null);
  const [inputText, setInputText] = useState<string>('');
  const scrollRef = useRef<ScrollView>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const chatMessages = activeChatId ? (messages[activeChatId] ?? []) : [];

  useEffect(() => {
    if (activeChatId) {
      void markChatRead(activeChatId);
    }
  }, [activeChatId, markChatRead]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [chatMessages.length]);

  const handleSend = useCallback(() => {
    if (!inputText.trim() || !activeChatId) return;
    void sendMessage(activeChatId, inputText.trim(), user?.name ?? 'You');
    setInputText('');
  }, [inputText, activeChatId, sendMessage, user]);

  const handleOpenChat = useCallback((id: string) => {
    setActiveChatId(id);
  }, []);

  const handleBack = useCallback(() => {
    setActiveChatId(null);
  }, []);

  if (!activeChatId) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            presentation: 'modal',
            headerShown: true,
            title: t('navigation.chatTitle'),
            headerTintColor: colors.text,
            headerStyle: { backgroundColor: colors.surface },
            headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
          }}
        />
        <ScrollView contentContainerStyle={styles.listContent}>
          {chats.length === 0 ? (
            <View style={styles.emptyState}>
              <User size={48} color={colors.border} strokeWidth={1.2} />
              <Text style={styles.emptyTitle}>Nenhuma conversa</Text>
              <Text style={styles.emptySubtext}>Suas conversas com clientes e profissionais aparecerão aqui.</Text>
            </View>
          ) : (
            chats
              .sort((a, b) => new Date(b.lastMessageAt ?? 0).getTime() - new Date(a.lastMessageAt ?? 0).getTime())
              .map((chat) => (
                <ChatListItem key={chat.id} chat={chat} onPress={() => handleOpenChat(chat.id)} />
              ))
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: true,
          title: activeChat?.participantName ?? 'Chat',
          headerTintColor: colors.text,
          headerStyle: { backgroundColor: colors.surface },
          headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
          headerLeft: () => (
            <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={12}>
              <ArrowLeft size={22} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          {chatMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </ScrollView>

        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={500}
            testID="chat-input"
          />
          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
            testID="chat-send"
          >
            <Send size={20} color={inputText.trim() ? colors.surface : colors.textTertiary} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  backBtn: { paddingRight: spacing.sm },
  listContent: { flexGrow: 1, paddingBottom: spacing.xxl },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  chatAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatInfo: { flex: 1, gap: 4 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatName: { ...typography.bodyMedium, color: colors.text },
  chatNameUnread: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' as const },
  chatTime: { ...typography.small, color: colors.textTertiary },
  chatLastMsg: { ...typography.caption, color: colors.textSecondary },
  chatLastMsgUnread: { color: colors.text, fontFamily: 'Inter_500Medium' },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: { ...typography.small, color: colors.primary, fontWeight: '600' as const, fontSize: 11 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
    gap: spacing.md,
  },
  emptyTitle: { ...typography.h3, color: colors.text },
  emptySubtext: { ...typography.body, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: spacing.xl },
  messagesContainer: { flex: 1 },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  bubbleWrap: {
    maxWidth: '80%',
    marginBottom: spacing.xs,
  },
  bubbleWrapOwn: { alignSelf: 'flex-end' },
  bubbleWrapOther: { alignSelf: 'flex-start' },
  bubble: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 18,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bubbleText: {
    ...typography.body,
    lineHeight: 20,
  },
  bubbleTextOwn: { color: colors.textInverse },
  bubbleTextOther: { color: colors.text },
  bubbleTime: {
    ...typography.small,
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeOwn: { color: 'rgba(255,255,255,0.5)' },
  bubbleTimeOther: { color: colors.textTertiary },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.sm,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: colors.text,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});
