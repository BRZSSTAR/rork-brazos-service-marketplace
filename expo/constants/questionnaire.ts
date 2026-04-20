import type { ServiceCategory } from '@/types';

export type QuestionType = 'single' | 'multi' | 'text' | 'number' | 'boolean' | 'upload';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface QuestionDef {
  id: string;
  type: QuestionType;
  label: string;
  hint?: string;
  required?: boolean;
  options?: QuestionOption[];
  minNumber?: number;
  maxNumber?: number;
  placeholder?: string;
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  questions: QuestionDef[];
}

export interface QuestionnaireConfig {
  appliesToCategory?: ServiceCategory;
  appliesToSubcategoryIds?: string[];
  sections: QuestionnaireSection[];
}

const BASE_SECTION: QuestionnaireSection = {
  id: 'base',
  title: 'About your experience',
  questions: [
    {
      id: 'experience_level',
      type: 'single',
      label: 'Experience level',
      required: true,
      options: [
        { id: 'beginner', label: '0–1 years' },
        { id: 'intermediate', label: '1–3 years' },
        { id: 'advanced', label: '3–7 years' },
        { id: 'expert', label: '7+ years' },
      ],
    },
    {
      id: 'has_team',
      type: 'boolean',
      label: 'Do you work with a team?',
    },
    {
      id: 'languages',
      type: 'multi',
      label: 'Languages spoken',
      options: [
        { id: 'pt', label: 'Português' },
        { id: 'en', label: 'English' },
        { id: 'es', label: 'Español' },
      ],
    },
  ],
};

const CREDENTIALS_SECTION: QuestionnaireSection = {
  id: 'credentials',
  title: 'Credentials & verification',
  questions: [
    {
      id: 'has_license',
      type: 'boolean',
      label: 'Do you hold a professional license / certification?',
    },
    {
      id: 'license_number',
      type: 'text',
      label: 'License / registration number',
      placeholder: 'E.g. CREA, COREN, CRM...',
    },
    {
      id: 'insurance',
      type: 'boolean',
      label: 'Do you carry liability insurance?',
    },
    {
      id: 'background_check',
      type: 'boolean',
      label: 'Willing to complete a background check?',
    },
  ],
};

const CATEGORY_QUESTIONS: Record<ServiceCategory, QuestionnaireSection[]> = {
  HOME: [
    {
      id: 'home_specifics',
      title: 'Home service specifics',
      questions: [
        {
          id: 'tools_owned',
          type: 'multi',
          label: 'Tools & equipment you bring',
          options: [
            { id: 'power_tools', label: 'Power tools' },
            { id: 'ladder', label: 'Ladder' },
            { id: 'vehicle', label: 'Utility vehicle' },
            { id: 'cleaning_supplies', label: 'Cleaning supplies' },
            { id: 'diagnostic_gear', label: 'Diagnostic equipment' },
          ],
        },
        {
          id: 'emergency_service',
          type: 'boolean',
          label: 'Do you accept emergency / same-day jobs?',
        },
        {
          id: 'accepts_custom_quotes',
          type: 'boolean',
          label: 'Accept custom quote requests from clients?',
          hint: 'For non-standard jobs, clients can request a custom quote you approve.',
        },
      ],
    },
  ],
  BEAUTY: [
    {
      id: 'beauty_specifics',
      title: 'Beauty service specifics',
      questions: [
        {
          id: 'location_preference',
          type: 'single',
          label: 'Where do you typically serve clients?',
          required: true,
          options: [
            { id: 'at_home', label: 'At client home' },
            { id: 'my_salon', label: 'At my salon' },
            { id: 'both', label: 'Both' },
          ],
        },
        {
          id: 'products_brand',
          type: 'text',
          label: 'Main product brands you use',
          placeholder: 'E.g. Wella, L’Oréal, OPI...',
        },
        {
          id: 'specialties',
          type: 'multi',
          label: 'Specialties',
          options: [
            { id: 'curly', label: 'Curly hair' },
            { id: 'color', label: 'Coloring / balayage' },
            { id: 'wedding', label: 'Bridal / events' },
            { id: 'men', label: 'Men grooming' },
            { id: 'kids', label: 'Kids' },
          ],
        },
      ],
    },
  ],
  HEALTH: [
    {
      id: 'health_specifics',
      title: 'Health service specifics',
      questions: [
        {
          id: 'license_council',
          type: 'single',
          label: 'Regulatory council',
          required: true,
          options: [
            { id: 'coren', label: 'COREN (Nursing)' },
            { id: 'crefito', label: 'CREFITO (Physio)' },
            { id: 'crm', label: 'CRM (Medical)' },
            { id: 'crn', label: 'CRN (Nutrition)' },
            { id: 'crp', label: 'CRP (Psychology)' },
            { id: 'other', label: 'Other / none' },
          ],
        },
        {
          id: 'patient_groups',
          type: 'multi',
          label: 'Patient groups you serve',
          options: [
            { id: 'elderly', label: 'Elderly' },
            { id: 'post_op', label: 'Post-operative' },
            { id: 'chronic', label: 'Chronic conditions' },
            { id: 'pediatric', label: 'Pediatric' },
            { id: 'maternal', label: 'Maternal / newborn' },
          ],
        },
        {
          id: 'night_shifts',
          type: 'boolean',
          label: 'Available for night shifts?',
        },
      ],
    },
  ],
  CHEF: [
    {
      id: 'chef_specifics',
      title: 'Chef service specifics',
      questions: [
        {
          id: 'cuisines',
          type: 'multi',
          label: 'Cuisines you specialize in',
          required: true,
          options: [
            { id: 'brazilian', label: 'Brazilian' },
            { id: 'italian', label: 'Italian' },
            { id: 'japanese', label: 'Japanese' },
            { id: 'mediterranean', label: 'Mediterranean' },
            { id: 'vegan', label: 'Vegan / plant-based' },
            { id: 'asian_fusion', label: 'Asian fusion' },
            { id: 'desserts', label: 'Desserts / pastry' },
          ],
        },
        {
          id: 'dietary_expertise',
          type: 'multi',
          label: 'Dietary expertise',
          options: [
            { id: 'diabetic', label: 'Diabetic-friendly' },
            { id: 'low_carb', label: 'Low-carb / keto' },
            { id: 'gluten_free', label: 'Gluten-free' },
            { id: 'vegan', label: 'Vegan' },
            { id: 'postpartum', label: 'Postpartum' },
            { id: 'sports', label: 'Sports nutrition' },
          ],
        },
        {
          id: 'brings_ingredients',
          type: 'boolean',
          label: 'Do you source ingredients?',
        },
        {
          id: 'max_guests',
          type: 'number',
          label: 'Maximum guests you can serve',
          minNumber: 1,
          maxNumber: 200,
        },
      ],
    },
  ],
};

export function buildQuestionnaire(
  category: ServiceCategory | undefined,
): QuestionnaireSection[] {
  if (!category) return [BASE_SECTION, CREDENTIALS_SECTION];
  return [BASE_SECTION, ...CATEGORY_QUESTIONS[category], CREDENTIALS_SECTION];
}
