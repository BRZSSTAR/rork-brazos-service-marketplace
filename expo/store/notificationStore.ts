import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const NOTIFICATIONS_KEY = 'brazos_notifications';

export type NotificationType = 'ORDER_NEW' | 'ORDER_ACCEPTED' | 'ORDER_STARTED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED' | 'APPROVAL' | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'ORDER_NEW',
    title: 'Novo pedido recebido',
    body: 'Maria Silva solicitou limpeza residencial para amanhã às 14h.',
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    data: { orderId: 'order_1' },
  },
  {
    id: 'notif_2',
    type: 'ORDER_NEW',
    title: 'Novo pedido recebido',
    body: 'João Santos solicitou limpeza pós-obra para depois de amanhã.',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    data: { orderId: 'order_2' },
  },
  {
    id: 'notif_3',
    type: 'ORDER_ACCEPTED',
    title: 'Pedido confirmado',
    body: 'Seu serviço com Ana Costa foi confirmado para hoje às 15h.',
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    data: { orderId: 'order_3' },
  },
  {
    id: 'notif_4',
    type: 'SYSTEM',
    title: 'Bem-vindo ao BRAZOS!',
    body: 'Complete seu perfil profissional para começar a receber pedidos.',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif_5',
    type: 'ORDER_COMPLETED',
    title: 'Serviço concluído',
    body: 'O serviço com Pedro Lima foi finalizado. R$ 180,00 adicionados ao seu saldo.',
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    data: { orderId: 'order_4' },
  },
];

const initialState = {
  notifications: [] as AppNotification[],
  isHydrated: false,
};

export const useNotificationStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[Notifications] Hydrating...');
        const raw = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        if (raw) {
          const notifications: AppNotification[] = JSON.parse(raw);
          set({ notifications, isHydrated: true });
        } else {
          set({ notifications: MOCK_NOTIFICATIONS, isHydrated: true });
          await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(MOCK_NOTIFICATIONS));
        }
      } catch (error) {
        console.error('[Notifications] Hydration error:', error);
        set({ notifications: MOCK_NOTIFICATIONS, isHydrated: true });
      }
    },

    markAsRead: async (id: string) => {
      const notifications = get().notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      set({ notifications });
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    },

    markAllAsRead: async () => {
      const notifications = get().notifications.map((n) => ({ ...n, read: true }));
      set({ notifications });
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    },

    getUnreadCount: (): number => {
      return get().notifications.filter((n) => !n.read).length;
    },

    clearAll: async () => {
      set({ notifications: [] });
      await AsyncStorage.removeItem(NOTIFICATIONS_KEY);
    },
  }))
);
