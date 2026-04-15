import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const CHATS_KEY = 'brazos_chats';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  isOwn: boolean;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

const MOCK_CHATS: Chat[] = [
  {
    id: 'chat_1',
    participantId: 'cust_1',
    participantName: 'Maria Silva',
    lastMessage: 'Olá, confirmo o horário de amanhã!',
    lastMessageAt: new Date(Date.now() - 1800000).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'chat_2',
    participantId: 'cust_3',
    participantName: 'Ana Costa',
    lastMessage: 'Preciso que traga produtos de limpeza.',
    lastMessageAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'chat_3',
    participantId: 'cust_4',
    participantName: 'Pedro Lima',
    lastMessage: 'Obrigado pelo serviço! Ficou ótimo.',
    lastMessageAt: new Date(Date.now() - 172800000).toISOString(),
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  chat_1: [
    { id: 'msg_1', chatId: 'chat_1', senderId: 'cust_1', senderName: 'Maria Silva', text: 'Olá! Vi seu perfil e gostaria de agendar uma limpeza.', createdAt: new Date(Date.now() - 86400000).toISOString(), isOwn: false },
    { id: 'msg_2', chatId: 'chat_1', senderId: 'prov_1', senderName: 'Profissional', text: 'Olá Maria! Claro, qual o melhor horário para você?', createdAt: new Date(Date.now() - 82800000).toISOString(), isOwn: true },
    { id: 'msg_3', chatId: 'chat_1', senderId: 'cust_1', senderName: 'Maria Silva', text: 'Amanhã às 14h seria perfeito.', createdAt: new Date(Date.now() - 79200000).toISOString(), isOwn: false },
    { id: 'msg_4', chatId: 'chat_1', senderId: 'prov_1', senderName: 'Profissional', text: 'Perfeito! Confirmado para amanhã às 14h.', createdAt: new Date(Date.now() - 75600000).toISOString(), isOwn: true },
    { id: 'msg_5', chatId: 'chat_1', senderId: 'cust_1', senderName: 'Maria Silva', text: 'Olá, confirmo o horário de amanhã!', createdAt: new Date(Date.now() - 1800000).toISOString(), isOwn: false },
  ],
  chat_2: [
    { id: 'msg_6', chatId: 'chat_2', senderId: 'cust_3', senderName: 'Ana Costa', text: 'Oi, tudo bem? O serviço está confirmado para hoje?', createdAt: new Date(Date.now() - 14400000).toISOString(), isOwn: false },
    { id: 'msg_7', chatId: 'chat_2', senderId: 'prov_1', senderName: 'Profissional', text: 'Sim, confirmado! Estarei aí às 15h.', createdAt: new Date(Date.now() - 10800000).toISOString(), isOwn: true },
    { id: 'msg_8', chatId: 'chat_2', senderId: 'cust_3', senderName: 'Ana Costa', text: 'Preciso que traga produtos de limpeza.', createdAt: new Date(Date.now() - 7200000).toISOString(), isOwn: false },
  ],
  chat_3: [
    { id: 'msg_9', chatId: 'chat_3', senderId: 'cust_4', senderName: 'Pedro Lima', text: 'Obrigado pelo serviço! Ficou ótimo.', createdAt: new Date(Date.now() - 172800000).toISOString(), isOwn: false },
    { id: 'msg_10', chatId: 'chat_3', senderId: 'prov_1', senderName: 'Profissional', text: 'Obrigado Pedro! Fico feliz que tenha gostado. 😊', createdAt: new Date(Date.now() - 169200000).toISOString(), isOwn: true },
  ],
};

const initialState = {
  chats: [] as Chat[],
  messages: {} as Record<string, ChatMessage[]>,
  isHydrated: false,
};

export const useChatStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[Chat] Hydrating...');
        const raw = await AsyncStorage.getItem(CHATS_KEY);
        if (raw) {
          const data = JSON.parse(raw);
          set({ chats: data.chats ?? [], messages: data.messages ?? {}, isHydrated: true });
        } else {
          set({ chats: MOCK_CHATS, messages: MOCK_MESSAGES, isHydrated: true });
          await AsyncStorage.setItem(CHATS_KEY, JSON.stringify({ chats: MOCK_CHATS, messages: MOCK_MESSAGES }));
        }
      } catch (error) {
        console.error('[Chat] Hydration error:', error);
        set({ chats: MOCK_CHATS, messages: MOCK_MESSAGES, isHydrated: true });
      }
    },

    sendMessage: async (chatId: string, text: string, senderName: string) => {
      const msg: ChatMessage = {
        id: generateId(),
        chatId,
        senderId: 'self',
        senderName,
        text,
        createdAt: new Date().toISOString(),
        isOwn: true,
      };

      const currentMessages = get().messages[chatId] ?? [];
      const updatedMessages = { ...get().messages, [chatId]: [...currentMessages, msg] };
      const updatedChats = get().chats.map((c) =>
        c.id === chatId ? { ...c, lastMessage: text, lastMessageAt: msg.createdAt } : c
      );

      set({ messages: updatedMessages, chats: updatedChats });
      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify({ chats: updatedChats, messages: updatedMessages }));
      console.log('[Chat] Message sent in chat:', chatId);
    },

    markChatRead: async (chatId: string) => {
      const updatedChats = get().chats.map((c) =>
        c.id === chatId ? { ...c, unreadCount: 0 } : c
      );
      set({ chats: updatedChats });
      await AsyncStorage.setItem(CHATS_KEY, JSON.stringify({ chats: updatedChats, messages: get().messages }));
    },

    getTotalUnread: (): number => {
      return get().chats.reduce((sum, c) => sum + c.unreadCount, 0);
    },
  }))
);
