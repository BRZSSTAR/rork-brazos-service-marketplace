export type UserRole = 'CUSTOMER' | 'PROVIDER';
export type Locale = 'pt-BR' | 'en';

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
