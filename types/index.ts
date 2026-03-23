export type UserRole = 'CUSTOMER' | 'PROVIDER';
export type ActiveMode = 'customer' | 'provider';
export type Locale = 'pt-BR' | 'en' | 'es';
export type ProviderOnboardingStatus = 'NONE' | 'ONBOARDING' | 'PENDING_APPROVAL' | 'APPROVED' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  locale: Locale;
  isProvider: boolean;
  providerStatus: ProviderOnboardingStatus;
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

export interface ProviderProfile {
  id: string;
  userId: string;
  cpf: string;
  category: ServiceCategory;
  subcategory: string;
  selectedServices: string[];
  serviceTitle: string;
  description: string;
  pricePerHourCents: number;
  serviceArea: string;
  yearsExperience: number;
  availability: WeeklyAvailability;
  addOns: ServiceAddOn[];
  status: ProviderOnboardingStatus;
  createdAt: string;
}

export interface DayAvailability {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export interface WeeklyAvailability {
  monday: DayAvailability;
  tuesday: DayAvailability;
  wednesday: DayAvailability;
  thursday: DayAvailability;
  friday: DayAvailability;
  saturday: DayAvailability;
  sunday: DayAvailability;
}

export interface ProviderOnboardingDraft {
  cpf?: string;
  category?: ServiceCategory;
  subcategory?: string;
  selectedServices?: string[];
  serviceTitle?: string;
  description?: string;
  pricePerHourCents?: number;
  serviceArea?: string;
  yearsExperience?: number;
  availability?: WeeklyAvailability;
}

export type PricingType = 'hourly' | 'fixed' | 'per_job' | 'per_session' | 'per_unit';

export interface ServiceAddOn {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  pricingType: PricingType;
  isSelected?: boolean;
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
  selectedAddOns?: ServiceAddOn[];
}
