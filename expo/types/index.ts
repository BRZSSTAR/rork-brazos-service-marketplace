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

export type AccountRegistrationType = 'CPF' | 'MEI' | 'CNPJ';

export interface AccountRegistration {
  type: AccountRegistrationType;
  cpf?: string;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  phoneVerified?: boolean;
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM';

export interface PayoutSetup {
  pixKey?: string;
  pixKeyType?: PixKeyType;
  holderName?: string;
}

export type CancellationPolicy = 'FLEXIBLE' | 'MODERATE' | 'STRICT';
export type LanguageCode = 'PT' | 'EN' | 'ES';

export interface ProviderPolicies {
  cancellation?: CancellationPolicy;
  languages?: LanguageCode[];
  emergencyAvailable?: boolean;
  travelFeePerKmCents?: number;
  freeTravelRadiusKm?: number;
  referralCode?: string;
}

export interface TrustConsents {
  lgpdAccepted?: boolean;
  tosAccepted?: boolean;
  contractorAgreementAccepted?: boolean;
  consentAt?: string;
  backgroundCheckUri?: string;
  selfieVerificationUri?: string;
  liabilityInsurance?: boolean;
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
  categorySelections?: CategorySelection[];
  questionnaire?: QuestionnaireResponses;
  services?: ProviderService[];
  profile?: ProviderProfileDraft;
  coverage?: ServiceCoverage;
  bookingModel?: BookingModel;
  account?: AccountRegistration;
  payout?: PayoutSetup;
  policies?: ProviderPolicies;
  trust?: TrustConsents;
}

export interface CategorySelection {
  category: ServiceCategory;
  subcategoryIds: string[];
  serviceIds: string[];
}

export type QuestionnaireValue = string | number | boolean | string[];

export interface QuestionnaireResponses {
  [questionId: string]: QuestionnaireValue;
}

export type ServicePricingModel = 'FIXED' | 'HOURLY' | 'STARTING_AT' | 'CUSTOM_QUOTE';

export interface ProviderServiceAddOn {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  durationImpactMinutes?: number;
}

export interface ProviderService {
  id: string;
  categoryId: ServiceCategory;
  subcategoryId: string;
  catalogServiceId?: string;
  title: string;
  description: string;
  pricingModel: ServicePricingModel;
  priceCents: number;
  durationMinutes?: number;
  addOns: ProviderServiceAddOn[];
}

export interface PortfolioItem {
  id: string;
  uri: string;
  caption?: string;
  type: 'image' | 'video';
}

export interface CertificationFile {
  id: string;
  name: string;
  uri?: string;
  issuer?: string;
  issuedAt?: string;
  expiresAt?: string;
  verified: boolean;
}

export interface ProviderProfileDraft {
  photoUri?: string;
  bio?: string;
  yearsExperience?: number;
  portfolio?: PortfolioItem[];
  certifications?: CertificationFile[];
}

export interface ServiceCoverage {
  baseAddress?: string;
  city?: string;
  state?: string;
  zipCodes?: string[];
  radiusKm?: number;
  latitude?: number;
  longitude?: number;
}

export type BookingModel = 'INSTANT' | 'REQUEST';

export interface CategorySuggestion {
  id: string;
  userId: string;
  parentCategory?: ServiceCategory;
  parentSubcategoryId?: string;
  suggestedName: string;
  suggestedType: 'category' | 'subcategory' | 'tag';
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
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
