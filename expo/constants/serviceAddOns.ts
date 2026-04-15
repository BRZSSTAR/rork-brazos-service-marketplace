import type { PricingType } from '@/types';

export interface AddOnTemplate {
  id: string;
  pricingType: PricingType;
  defaultPriceCents: number;
}

export interface CategoryAddOns {
  categoryId: string;
  subcategoryId?: string;
  addOns: AddOnTemplate[];
}

export const SERVICE_ADD_ONS: CategoryAddOns[] = [
  {
    categoryId: 'HOME',
    subcategoryId: 'residential_cleaning',
    addOns: [
      { id: 'cleaning_supplies', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'inside_fridge', pricingType: 'fixed', defaultPriceCents: 4000 },
      { id: 'inside_oven', pricingType: 'fixed', defaultPriceCents: 3500 },
      { id: 'laundry_fold', pricingType: 'fixed', defaultPriceCents: 3000 },
      { id: 'ironing', pricingType: 'hourly', defaultPriceCents: 4000 },
      { id: 'organize_closets', pricingType: 'per_job', defaultPriceCents: 6000 },
    ],
  },
  {
    categoryId: 'HOME',
    subcategoryId: 'plumbing',
    addOns: [
      { id: 'emergency_surcharge', pricingType: 'fixed', defaultPriceCents: 8000 },
      { id: 'materials_included', pricingType: 'per_job', defaultPriceCents: 0 },
      { id: 'warranty_extension', pricingType: 'fixed', defaultPriceCents: 5000 },
    ],
  },
  {
    categoryId: 'HOME',
    subcategoryId: 'repairs_construction',
    addOns: [
      { id: 'debris_removal', pricingType: 'fixed', defaultPriceCents: 7000 },
      { id: 'materials_included', pricingType: 'per_job', defaultPriceCents: 0 },
      { id: 'emergency_surcharge', pricingType: 'fixed', defaultPriceCents: 8000 },
    ],
  },
  {
    categoryId: 'HOME',
    addOns: [
      { id: 'emergency_surcharge', pricingType: 'fixed', defaultPriceCents: 8000 },
      { id: 'weekend_surcharge', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'holiday_surcharge', pricingType: 'fixed', defaultPriceCents: 10000 },
    ],
  },
  {
    categoryId: 'BEAUTY',
    subcategoryId: 'hair',
    addOns: [
      { id: 'premium_products', pricingType: 'fixed', defaultPriceCents: 4000 },
      { id: 'deep_conditioning', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'scalp_massage', pricingType: 'fixed', defaultPriceCents: 3000 },
      { id: 'blowout_addon', pricingType: 'fixed', defaultPriceCents: 4500 },
    ],
  },
  {
    categoryId: 'BEAUTY',
    subcategoryId: 'nails',
    addOns: [
      { id: 'nail_art_addon', pricingType: 'per_unit', defaultPriceCents: 1500 },
      { id: 'gel_removal', pricingType: 'fixed', defaultPriceCents: 2500 },
      { id: 'hand_massage', pricingType: 'fixed', defaultPriceCents: 2000 },
      { id: 'paraffin_treatment', pricingType: 'fixed', defaultPriceCents: 3500 },
    ],
  },
  {
    categoryId: 'BEAUTY',
    addOns: [
      { id: 'premium_products', pricingType: 'fixed', defaultPriceCents: 4000 },
      { id: 'weekend_surcharge', pricingType: 'fixed', defaultPriceCents: 3000 },
      { id: 'travel_fee', pricingType: 'fixed', defaultPriceCents: 2500 },
    ],
  },
  {
    categoryId: 'HEALTH',
    subcategoryId: 'nursing',
    addOns: [
      { id: 'night_shift', pricingType: 'hourly', defaultPriceCents: 6000 },
      { id: 'weekend_surcharge', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'medical_report', pricingType: 'fixed', defaultPriceCents: 3000 },
    ],
  },
  {
    categoryId: 'HEALTH',
    subcategoryId: 'physiotherapy',
    addOns: [
      { id: 'equipment_rental', pricingType: 'per_session', defaultPriceCents: 4000 },
      { id: 'progress_report', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'home_exercise_plan', pricingType: 'fixed', defaultPriceCents: 3500 },
    ],
  },
  {
    categoryId: 'HEALTH',
    addOns: [
      { id: 'weekend_surcharge', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'night_shift', pricingType: 'hourly', defaultPriceCents: 6000 },
      { id: 'travel_fee', pricingType: 'fixed', defaultPriceCents: 3000 },
    ],
  },
  {
    categoryId: 'CHEF',
    subcategoryId: 'everyday_cooking',
    addOns: [
      { id: 'grocery_shopping', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'kitchen_cleanup', pricingType: 'fixed', defaultPriceCents: 4000 },
      { id: 'meal_storage', pricingType: 'fixed', defaultPriceCents: 2000 },
      { id: 'dietary_consultation', pricingType: 'per_session', defaultPriceCents: 8000 },
    ],
  },
  {
    categoryId: 'CHEF',
    subcategoryId: 'events_cooking',
    addOns: [
      { id: 'grocery_shopping', pricingType: 'fixed', defaultPriceCents: 8000 },
      { id: 'kitchen_cleanup', pricingType: 'fixed', defaultPriceCents: 6000 },
      { id: 'table_setup', pricingType: 'fixed', defaultPriceCents: 10000 },
      { id: 'waitstaff', pricingType: 'hourly', defaultPriceCents: 7000 },
      { id: 'dishwashing', pricingType: 'fixed', defaultPriceCents: 5000 },
    ],
  },
  {
    categoryId: 'CHEF',
    addOns: [
      { id: 'grocery_shopping', pricingType: 'fixed', defaultPriceCents: 5000 },
      { id: 'kitchen_cleanup', pricingType: 'fixed', defaultPriceCents: 4000 },
      { id: 'meal_storage', pricingType: 'fixed', defaultPriceCents: 2000 },
    ],
  },
];

export function getAddOnsForService(categoryId: string, subcategoryId?: string): AddOnTemplate[] {
  const subcatMatch = SERVICE_ADD_ONS.find(
    (a) => a.categoryId === categoryId && a.subcategoryId === subcategoryId
  );
  if (subcatMatch) return subcatMatch.addOns;

  const catMatch = SERVICE_ADD_ONS.find(
    (a) => a.categoryId === categoryId && !a.subcategoryId
  );
  return catMatch?.addOns ?? [];
}
