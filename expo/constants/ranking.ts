import type {
  ProviderProfile,
  ProviderOnboardingDraft,
  CategorySelection,
  QuestionnaireResponses,
  ProviderService,
  ProviderProfileDraft,
  ServiceCoverage,
} from '@/types';

export interface QualityScoreBreakdown {
  total: number;
  maxTotal: number;
  percent: number;
  sections: {
    id: string;
    label: string;
    score: number;
    max: number;
  }[];
}

interface ScoreInput {
  cpf?: string;
  categorySelections?: CategorySelection[];
  questionnaire?: QuestionnaireResponses;
  services?: ProviderService[];
  profile?: ProviderProfileDraft;
  coverage?: ServiceCoverage;
  availabilityEnabledDays?: number;
}

export function computeQualityScore(input: ScoreInput): QualityScoreBreakdown {
  const sections: QualityScoreBreakdown['sections'] = [];

  const accountScore = input.cpf && input.cpf.replace(/\D/g, '').length === 11 ? 10 : 0;
  sections.push({ id: 'account', label: 'Account', score: accountScore, max: 10 });

  const selections = input.categorySelections ?? [];
  const totalSubs = selections.reduce((acc, s) => acc + s.subcategoryIds.length, 0);
  const totalServices = selections.reduce((acc, s) => acc + s.serviceIds.length, 0);
  let categoryScore = 0;
  if (selections.length > 0) categoryScore += 5;
  if (totalSubs >= 1) categoryScore += 5;
  if (totalServices >= 3) categoryScore += 5;
  if (totalServices >= 8) categoryScore += 5;
  sections.push({ id: 'categories', label: 'Categories', score: categoryScore, max: 20 });

  const q = input.questionnaire ?? {};
  const answered = Object.values(q).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== ''
  ).length;
  const questionnaireScore = Math.min(15, answered * 2);
  sections.push({ id: 'questionnaire', label: 'Questionnaire', score: questionnaireScore, max: 15 });

  const services = input.services ?? [];
  let servicesScore = 0;
  if (services.length >= 1) servicesScore += 6;
  if (services.length >= 3) servicesScore += 6;
  const withAddOns = services.filter((s) => s.addOns.length > 0).length;
  servicesScore += Math.min(3, withAddOns);
  sections.push({ id: 'services', label: 'Services', score: servicesScore, max: 15 });

  const profile = input.profile ?? {};
  let profileScore = 0;
  if (profile.photoUri) profileScore += 4;
  if ((profile.bio ?? '').trim().length >= 60) profileScore += 4;
  if ((profile.yearsExperience ?? 0) > 0) profileScore += 2;
  if ((profile.portfolio?.length ?? 0) >= 3) profileScore += 3;
  if ((profile.portfolio?.length ?? 0) >= 6) profileScore += 2;
  const verified = (profile.certifications ?? []).filter((c) => c.verified).length;
  profileScore += Math.min(5, verified * 2);
  sections.push({ id: 'profile', label: 'Profile', score: profileScore, max: 20 });

  const coverage = input.coverage ?? {};
  let coverageScore = 0;
  if (coverage.city) coverageScore += 3;
  if ((coverage.zipCodes?.length ?? 0) > 0) coverageScore += 3;
  if ((coverage.radiusKm ?? 0) > 0) coverageScore += 4;
  sections.push({ id: 'coverage', label: 'Coverage', score: coverageScore, max: 10 });

  const availDays = input.availabilityEnabledDays ?? 0;
  const availScore = Math.min(10, availDays * 2);
  sections.push({ id: 'availability', label: 'Availability', score: availScore, max: 10 });

  const total = sections.reduce((acc, s) => acc + s.score, 0);
  const maxTotal = sections.reduce((acc, s) => acc + s.max, 0);
  const percent = maxTotal === 0 ? 0 : Math.round((total / maxTotal) * 100);

  return { total, maxTotal, percent, sections };
}

export interface RankingSignals {
  categoryMatch: boolean;
  subcategoryMatch: boolean;
  qualityPercent: number;
  rating?: number;
  reviewCount?: number;
  isAvailable?: boolean;
  isVerified?: boolean;
  servicesCount: number;
  addOnsCount: number;
  distanceKm?: number;
}

export function computeRankingScore(s: RankingSignals): number {
  let score = 0;
  if (s.categoryMatch) score += 30;
  if (s.subcategoryMatch) score += 20;
  score += s.qualityPercent * 0.25;
  if (s.rating) score += Math.min(10, s.rating * 2);
  if (s.reviewCount) score += Math.min(5, Math.log2(1 + s.reviewCount));
  if (s.isAvailable) score += 5;
  if (s.isVerified) score += 8;
  score += Math.min(5, s.servicesCount);
  score += Math.min(3, s.addOnsCount);
  if (typeof s.distanceKm === 'number') {
    score += Math.max(0, 8 - s.distanceKm * 0.3);
  }
  return Math.round(score * 100) / 100;
}

export function qualityScoreFromProfile(profile: ProviderProfile): QualityScoreBreakdown {
  return computeQualityScore({
    cpf: profile.cpf,
    categorySelections: [
      {
        category: profile.category,
        subcategoryIds: profile.subcategory ? [profile.subcategory] : [],
        serviceIds: profile.selectedServices ?? [],
      },
    ],
    services: [],
    profile: { yearsExperience: profile.yearsExperience },
    availabilityEnabledDays: Object.values(profile.availability).filter((d) => d.enabled).length,
  });
}

export function qualityScoreFromDraft(draft: ProviderOnboardingDraft): QualityScoreBreakdown {
  return computeQualityScore({
    cpf: draft.cpf,
    categorySelections: draft.categorySelections ?? (draft.category
      ? [
          {
            category: draft.category,
            subcategoryIds: draft.subcategory ? [draft.subcategory] : [],
            serviceIds: draft.selectedServices ?? [],
          },
        ]
      : []),
    questionnaire: draft.questionnaire,
    services: draft.services,
    profile: draft.profile,
    coverage: draft.coverage,
    availabilityEnabledDays: draft.availability
      ? Object.values(draft.availability).filter((d) => d.enabled).length
      : 0,
  });
}
