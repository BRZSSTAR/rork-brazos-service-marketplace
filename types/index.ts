export type UserRole = 'CUSTOMER' | 'PROVIDER';
export type Locale = 'pt-BR' | 'en' | 'es';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  locale: Locale;
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type ProviderStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type ServiceCategory = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

export interface ServiceProvider {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  category: ServiceCategory;
  description: string;
  rating: number;
  reviewCount: number;
  pricePerHourCents: number;
  status: ProviderStatus;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  status: BookingStatus;
  scheduledAt: string;
  durationMinutes: number;
  totalCents: number;
  category: ServiceCategory;
  notes?: string;
  createdAt: string;
}

export type AddressLabel = 'HOME' | 'WORK' | 'TRAVEL' | 'OTHER';

export interface SavedAddress {
  id: string;
  label: AddressLabel;
  customLabel?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  recipientName?: string;
  recipientPhone?: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
  createdAt: string;
}

export type PaymentMethodType = 'PIX' | 'CARD';

export interface SavedPaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  lastFour?: string;
  pixKey?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface BookingDraft {
  providerId?: string;
  providerName?: string;
  providerAvatar?: string;
  serviceName?: string;
  serviceCategory?: ServiceCategory;
  scheduledAt?: string;
  durationMinutes?: number;
  totalCents?: number;
  notes?: string;
  addressId?: string;
  paymentMethodId?: string;
}
