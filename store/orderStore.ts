import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import type { BookingStatus, ServiceCategory } from '@/types';

const ORDERS_DATA_KEY = 'brazos_orders_data';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  providerId: string;
  providerName: string;
  status: BookingStatus;
  category: ServiceCategory;
  serviceName: string;
  scheduledAt: string;
  durationMinutes: number;
  totalCents: number;
  address: string;
  notes?: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'order_1',
    customerId: 'cust_1',
    customerName: 'Maria Silva',
    customerPhone: '(11) 99999-1234',
    providerId: 'prov_1',
    providerName: 'Professional',
    status: 'PENDING',
    category: 'HOME',
    serviceName: 'Limpeza residencial',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    durationMinutes: 120,
    totalCents: 18000,
    address: 'Rua Augusta, 1200 - Consolação, São Paulo',
    notes: 'Apartamento 3 quartos, 2 banheiros',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'order_2',
    customerId: 'cust_2',
    customerName: 'João Santos',
    providerId: 'prov_1',
    providerName: 'Professional',
    status: 'PENDING',
    category: 'HOME',
    serviceName: 'Limpeza pós-obra',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(),
    durationMinutes: 180,
    totalCents: 27000,
    address: 'Av. Paulista, 500 - Bela Vista, São Paulo',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'order_3',
    customerId: 'cust_3',
    customerName: 'Ana Costa',
    customerPhone: '(11) 98888-5678',
    providerId: 'prov_1',
    providerName: 'Professional',
    status: 'CONFIRMED',
    category: 'HOME',
    serviceName: 'Limpeza residencial',
    scheduledAt: new Date(Date.now() + 43200000).toISOString(),
    durationMinutes: 90,
    totalCents: 13500,
    address: 'Rua Oscar Freire, 300 - Jardins, São Paulo',
    notes: 'Trazer produtos de limpeza',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    acceptedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'order_4',
    customerId: 'cust_4',
    customerName: 'Pedro Lima',
    providerId: 'prov_1',
    providerName: 'Professional',
    status: 'COMPLETED',
    category: 'HOME',
    serviceName: 'Limpeza residencial',
    scheduledAt: new Date(Date.now() - 172800000).toISOString(),
    durationMinutes: 120,
    totalCents: 18000,
    address: 'Rua Haddock Lobo, 800 - Cerqueira César, São Paulo',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    acceptedAt: new Date(Date.now() - 259200000).toISOString(),
    startedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 165600000).toISOString(),
  },
];

const initialState = {
  orders: [] as Order[],
  isHydrated: false,
};

export const useOrderStore = create(
  combine(initialState, (set, get) => ({
    hydrate: async () => {
      try {
        console.log('[Orders] Hydrating...');
        const raw = await AsyncStorage.getItem(ORDERS_DATA_KEY);
        if (raw) {
          const orders: Order[] = JSON.parse(raw);
          set({ orders, isHydrated: true });
          console.log('[Orders] Hydrated:', orders.length, 'orders');
        } else {
          set({ orders: MOCK_ORDERS, isHydrated: true });
          await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(MOCK_ORDERS));
          console.log('[Orders] Loaded mock orders');
        }
      } catch (error) {
        console.error('[Orders] Hydration error:', error);
        set({ orders: MOCK_ORDERS, isHydrated: true });
      }
    },

    persist: async () => {
      const { orders } = get();
      await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(orders));
    },

    acceptOrder: async (orderId: string) => {
      console.log('[Orders] Accepting order:', orderId);
      const orders = get().orders.map((o) =>
        o.id === orderId ? { ...o, status: 'CONFIRMED' as BookingStatus, acceptedAt: new Date().toISOString() } : o
      );
      set({ orders });
      await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(orders));
    },

    declineOrder: async (orderId: string) => {
      console.log('[Orders] Declining order:', orderId);
      const orders = get().orders.map((o) =>
        o.id === orderId ? { ...o, status: 'CANCELLED' as BookingStatus, cancelledAt: new Date().toISOString() } : o
      );
      set({ orders });
      await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(orders));
    },

    startOrder: async (orderId: string) => {
      console.log('[Orders] Starting order:', orderId);
      const orders = get().orders.map((o) =>
        o.id === orderId ? { ...o, status: 'IN_PROGRESS' as BookingStatus, startedAt: new Date().toISOString() } : o
      );
      set({ orders });
      await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(orders));
    },

    completeOrder: async (orderId: string) => {
      console.log('[Orders] Completing order:', orderId);
      const orders = get().orders.map((o) =>
        o.id === orderId ? { ...o, status: 'COMPLETED' as BookingStatus, completedAt: new Date().toISOString() } : o
      );
      set({ orders });
      await AsyncStorage.setItem(ORDERS_DATA_KEY, JSON.stringify(orders));
    },

    getOrdersByStatus: (status: BookingStatus): Order[] => {
      return get().orders.filter((o) => o.status === status);
    },

    getOrderById: (id: string): Order | undefined => {
      return get().orders.find((o) => o.id === id);
    },
  }))
);
