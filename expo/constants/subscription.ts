export type SubscriptionTierId = 'STARTER' | 'PRO' | 'ELITE';

export interface SubscriptionTier {
  id: SubscriptionTierId;
  name: string;
  tagline: string;
  monthlyFeeCents: number;
  commissionPercent: number;
  color: string;
  gradient: [string, string];
  features: string[];
  highlight?: boolean;
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'STARTER',
    name: 'Starter',
    tagline: 'Comece sem mensalidade',
    monthlyFeeCents: 0,
    commissionPercent: 20,
    color: '#6B7280',
    gradient: ['#4B5563', '#1F2937'],
    features: [
      'Sem mensalidade',
      '20% de comissão por serviço',
      'Perfil básico',
      'Suporte via e-mail',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    tagline: 'Para profissionais ativos',
    monthlyFeeCents: 3900,
    commissionPercent: 15,
    color: '#C9A84C',
    gradient: ['#D4BA6A', '#A8893D'],
    features: [
      'Mensalidade R$ 39,00',
      '15% de comissão por serviço',
      'Destaque nas buscas',
      'Badge "Pro" verificado',
      'Suporte prioritário',
      '3 impulsionamentos grátis / mês',
    ],
    highlight: true,
  },
  {
    id: 'ELITE',
    name: 'Elite',
    tagline: 'Máxima visibilidade e menor taxa',
    monthlyFeeCents: 9900,
    commissionPercent: 10,
    color: '#145A4A',
    gradient: ['#145A4A', '#0A2D25'],
    features: [
      'Mensalidade R$ 99,00',
      '10% de comissão por serviço',
      'Topo dos resultados (prioridade máxima)',
      'Badge "Elite" exclusivo',
      'Suporte dedicado 24/7',
      '10 impulsionamentos grátis / mês',
      'Analytics avançados',
      'Acesso antecipado a recursos',
    ],
  },
];

export interface PromotionPackage {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  durationDays: number;
  color: string;
  icon: 'zap' | 'rocket' | 'star' | 'crown';
}

export const PROMOTION_PACKAGES: PromotionPackage[] = [
  {
    id: 'daily',
    name: 'Boost Diário',
    description: 'Destaque seu perfil por 1 dia nas buscas',
    priceCents: 300,
    durationDays: 1,
    color: '#F59E0B',
    icon: 'zap',
  },
  {
    id: 'weekly',
    name: 'Boost Semanal',
    description: '7 dias no topo — melhor custo-benefício',
    priceCents: 1500,
    durationDays: 7,
    color: '#C9A84C',
    icon: 'rocket',
  },
  {
    id: 'biweekly',
    name: 'Boost Quinzenal',
    description: '15 dias de destaque premium',
    priceCents: 2700,
    durationDays: 15,
    color: '#145A4A',
    icon: 'star',
  },
  {
    id: 'monthly',
    name: 'Boost Mensal',
    description: 'Visibilidade máxima por 30 dias',
    priceCents: 4900,
    durationDays: 30,
    color: '#7C3AED',
    icon: 'crown',
  },
];

export function getTierById(id: SubscriptionTierId): SubscriptionTier {
  const tier = SUBSCRIPTION_TIERS.find((t) => t.id === id);
  if (!tier) {
    return SUBSCRIPTION_TIERS[0];
  }
  return tier;
}

export function calculateCommission(grossCents: number, tierId: SubscriptionTierId): {
  commissionCents: number;
  netCents: number;
  percent: number;
} {
  const tier = getTierById(tierId);
  const commissionCents = Math.round((grossCents * tier.commissionPercent) / 100);
  return {
    commissionCents,
    netCents: grossCents - commissionCents,
    percent: tier.commissionPercent,
  };
}
