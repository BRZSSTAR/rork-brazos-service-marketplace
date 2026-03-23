export type ServiceCategoryId = 'HOME' | 'BEAUTY' | 'HEALTH' | 'CHEF';

export interface ServiceItem {
  id: string;
}

export interface SubCategory {
  id: string;
  categoryId: ServiceCategoryId;
  icon: string;
  services: ServiceItem[];
  isMvp?: boolean;
}

export interface ServiceCategoryDef {
  id: ServiceCategoryId;
  icon: string;
  color: string;
  bg: string;
  subcategories: SubCategory[];
}

export const SERVICE_CATALOG: ServiceCategoryDef[] = [
  {
    id: 'HOME',
    icon: 'Home',
    color: '#3B82F6',
    bg: '#EFF6FF',
    subcategories: [
      {
        id: 'electrical',
        categoryId: 'HOME',
        icon: 'Zap',
        services: [
          { id: 'residential_electrician' },
          { id: 'emergency_electrical' },
          { id: 'short_circuit_diagnosis' },
          { id: 'circuit_breaker_replacement' },
          { id: 'electrical_panel_upgrade' },
          { id: 'outlets_switches_install' },
          { id: 'lighting_install' },
          { id: 'ceiling_fan_install' },
          { id: 'electric_shower_maintenance' },
          { id: 'electrical_grounding' },
          { id: 'surge_protection' },
          { id: 'solar_energy_install' },
          { id: 'ev_charger_install' },
        ],
      },
      {
        id: 'plumbing',
        categoryId: 'HOME',
        icon: 'Droplets',
        isMvp: true,
        services: [
          { id: 'residential_plumber' },
          { id: 'emergency_leaks' },
          { id: 'unclogging' },
          { id: 'faucet_shower_install' },
          { id: 'toilet_repair' },
          { id: 'water_tank_maintenance' },
          { id: 'pipe_replacement' },
          { id: 'water_pump_install' },
          { id: 'water_heater' },
          { id: 'sewer_maintenance' },
          { id: 'water_pressure' },
          { id: 'drainage_systems' },
        ],
      },
      {
        id: 'appliance_repair',
        categoryId: 'HOME',
        icon: 'Refrigerator',
        services: [
          { id: 'refrigerator_repair' },
          { id: 'freezer_repair' },
          { id: 'washing_machine_repair' },
          { id: 'dryer_repair' },
          { id: 'dishwasher_repair' },
          { id: 'stove_cooktop_repair' },
          { id: 'oven_repair' },
          { id: 'microwave_repair' },
          { id: 'water_purifier_repair' },
          { id: 'small_appliances_repair' },
        ],
      },
      {
        id: 'ac_climate',
        categoryId: 'HOME',
        icon: 'Thermometer',
        services: [
          { id: 'ac_install' },
          { id: 'ac_preventive_maintenance' },
          { id: 'ac_cleaning' },
          { id: 'ac_gas_recharge' },
          { id: 'ac_technical_repair' },
          { id: 'fans_exhaust' },
          { id: 'dehumidifiers' },
          { id: 'temp_automation' },
        ],
      },
      {
        id: 'residential_cleaning',
        categoryId: 'HOME',
        icon: 'Sparkles',
        isMvp: true,
        services: [
          { id: 'regular_cleaning' },
          { id: 'deep_cleaning' },
          { id: 'post_construction_cleaning' },
          { id: 'post_move_cleaning' },
          { id: 'apartment_cleaning' },
          { id: 'window_cleaning' },
          { id: 'upholstery_cleaning' },
          { id: 'mattress_cleaning' },
          { id: 'curtain_cleaning' },
          { id: 'kitchen_cleaning' },
          { id: 'bathroom_cleaning' },
          { id: 'pool_cleaning' },
          { id: 'water_tank_cleaning' },
        ],
      },
      {
        id: 'smart_home',
        categoryId: 'HOME',
        icon: 'Wifi',
        services: [
          { id: 'wifi_install' },
          { id: 'signal_optimization' },
          { id: 'router_config' },
          { id: 'tv_install' },
          { id: 'tv_wall_mount' },
          { id: 'cable_organization' },
          { id: 'camera_install' },
          { id: 'home_automation' },
          { id: 'smart_locks' },
          { id: 'smart_lighting' },
        ],
      },
      {
        id: 'repairs_construction',
        categoryId: 'HOME',
        icon: 'Hammer',
        isMvp: true,
        services: [
          { id: 'handyman' },
          { id: 'small_repairs' },
          { id: 'drywall' },
          { id: 'masonry' },
          { id: 'floor_tile_install' },
          { id: 'wall_ceiling_repairs' },
          { id: 'bathroom_renovation' },
          { id: 'kitchen_renovation' },
          { id: 'waterproofing' },
        ],
      },
      {
        id: 'painting',
        categoryId: 'HOME',
        icon: 'Paintbrush',
        services: [
          { id: 'interior_painting' },
          { id: 'exterior_painting' },
          { id: 'residential_painting' },
          { id: 'textures_decorative' },
          { id: 'wallpaper_application' },
          { id: 'mold_moisture_treatment' },
        ],
      },
      {
        id: 'gas_services',
        categoryId: 'HOME',
        icon: 'Flame',
        services: [
          { id: 'gas_piping_install' },
          { id: 'gas_leak_detection' },
          { id: 'stove_gas_install' },
          { id: 'gas_water_heater_install' },
          { id: 'lpg_natural_gas_conversion' },
          { id: 'gas_safety_inspection' },
        ],
      },
      {
        id: 'home_security',
        categoryId: 'HOME',
        icon: 'Shield',
        services: [
          { id: 'alarm_install' },
          { id: 'security_cameras' },
          { id: 'electric_fences' },
          { id: 'intercom_install' },
          { id: 'video_intercom' },
          { id: 'electronic_locks' },
          { id: 'gate_automation' },
        ],
      },
      {
        id: 'pest_control',
        categoryId: 'HOME',
        icon: 'Bug',
        services: [
          { id: 'general_pest_control' },
          { id: 'cockroach_control' },
          { id: 'rodent_control' },
          { id: 'termite_control' },
          { id: 'mosquito_control' },
          { id: 'preventive_pest_treatment' },
        ],
      },
      {
        id: 'gardening',
        categoryId: 'HOME',
        icon: 'TreePine',
        services: [
          { id: 'garden_maintenance' },
          { id: 'lawn_mowing' },
          { id: 'tree_pruning' },
          { id: 'landscaping' },
          { id: 'automatic_irrigation' },
          { id: 'yard_maintenance' },
        ],
      },
      {
        id: 'moving_transport',
        categoryId: 'HOME',
        icon: 'Truck',
        services: [
          { id: 'residential_moving' },
          { id: 'apartment_moving' },
          { id: 'packing_unpacking' },
          { id: 'furniture_assembly_disassembly' },
          { id: 'heavy_item_transport' },
        ],
      },
      {
        id: 'assembly_install',
        categoryId: 'HOME',
        icon: 'Wrench',
        services: [
          { id: 'furniture_assembly' },
          { id: 'cabinet_install' },
          { id: 'curtain_blind_install' },
          { id: 'shelf_install' },
          { id: 'tv_panel_install' },
        ],
      },
      {
        id: 'glass_doors_windows',
        categoryId: 'HOME',
        icon: 'DoorOpen',
        services: [
          { id: 'glass_install' },
          { id: 'shower_enclosure' },
          { id: 'mirrors_install' },
          { id: 'aluminum_windows' },
          { id: 'doors_sealing' },
        ],
      },
      {
        id: 'roof_structure',
        categoryId: 'HOME',
        icon: 'HardHat',
        services: [
          { id: 'roof_repair' },
          { id: 'tile_replacement' },
          { id: 'gutter_cleaning' },
          { id: 'slab_waterproofing' },
          { id: 'leak_repair' },
        ],
      },
      {
        id: 'auto_services',
        categoryId: 'HOME',
        icon: 'Car',
        services: [
          { id: 'vehicle_washing' },
          { id: 'car_polishing' },
          { id: 'battery_replacement' },
          { id: 'tire_replacement' },
          { id: 'basic_mechanical' },
        ],
      },
      {
        id: 'laundry_textiles',
        categoryId: 'HOME',
        icon: 'Shirt',
        services: [
          { id: 'laundry_delivery' },
          { id: 'ironing_service' },
          { id: 'dry_cleaning' },
          { id: 'rug_cleaning' },
          { id: 'bedding_cleaning' },
        ],
      },
      {
        id: 'pet_services',
        categoryId: 'HOME',
        icon: 'PawPrint',
        isMvp: true,
        services: [
          { id: 'dog_walking' },
          { id: 'in_home_pet_sitting' },
          { id: 'pet_daycare' },
          { id: 'in_home_grooming' },
          { id: 'pet_transport' },
          { id: 'pet_area_cleaning' },
          { id: 'pet_post_op_care' },
        ],
      },
    ],
  },
  {
    id: 'BEAUTY',
    icon: 'Scissors',
    color: '#EC4899',
    bg: '#FDF2F8',
    subcategories: [
      {
        id: 'hair',
        categoryId: 'BEAUTY',
        icon: 'Scissors',
        isMvp: true,
        services: [
          { id: 'womens_haircut' },
          { id: 'mens_haircut' },
          { id: 'blowout' },
          { id: 'hair_coloring' },
          { id: 'highlights_balayage' },
          { id: 'hair_hydration' },
          { id: 'hair_reconstruction' },
          { id: 'keratin_treatment' },
          { id: 'hair_botox' },
          { id: 'curly_hair_treatment' },
          { id: 'beard_mustache' },
          { id: 'hair_extensions' },
        ],
      },
      {
        id: 'nails',
        categoryId: 'BEAUTY',
        icon: 'Hand',
        isMvp: true,
        services: [
          { id: 'manicure' },
          { id: 'pedicure' },
          { id: 'gel_polish' },
          { id: 'acrylic_nails' },
          { id: 'fiberglass_nails' },
          { id: 'nail_art' },
          { id: 'nail_maintenance' },
          { id: 'foot_spa' },
          { id: 'hand_spa' },
        ],
      },
      {
        id: 'makeup',
        categoryId: 'BEAUTY',
        icon: 'Palette',
        services: [
          { id: 'professional_makeup' },
          { id: 'event_makeup' },
          { id: 'bridal_makeup' },
          { id: 'social_makeup' },
          { id: 'self_makeup_lessons' },
        ],
      },
      {
        id: 'eyebrows_lashes',
        categoryId: 'BEAUTY',
        icon: 'Eye',
        isMvp: true,
        services: [
          { id: 'eyebrow_shaping' },
          { id: 'eyebrow_henna' },
          { id: 'micropigmentation' },
          { id: 'brow_lamination' },
          { id: 'eyelash_extensions' },
          { id: 'lash_lift' },
          { id: 'eyelash_tinting' },
        ],
      },
      {
        id: 'facial_aesthetics',
        categoryId: 'BEAUTY',
        icon: 'Smile',
        services: [
          { id: 'skin_cleansing' },
          { id: 'acne_treatment' },
          { id: 'chemical_peel' },
          { id: 'microneedling' },
          { id: 'led_therapy' },
          { id: 'facial_massage' },
          { id: 'anti_aging_treatment' },
        ],
      },
      {
        id: 'body_aesthetics',
        categoryId: 'BEAUTY',
        icon: 'Heart',
        isMvp: true,
        services: [
          { id: 'relaxing_massage' },
          { id: 'therapeutic_massage' },
          { id: 'lymphatic_drainage' },
          { id: 'post_op_drainage' },
          { id: 'modeling_massage' },
          { id: 'cellulite_treatment' },
          { id: 'body_exfoliation' },
        ],
      },
      {
        id: 'hair_removal',
        categoryId: 'BEAUTY',
        icon: 'Sparkle',
        services: [
          { id: 'waxing' },
          { id: 'mens_waxing' },
          { id: 'facial_waxing' },
          { id: 'intimate_waxing' },
          { id: 'laser_hair_removal' },
        ],
      },
      {
        id: 'mens_aesthetics',
        categoryId: 'BEAUTY',
        icon: 'UserCheck',
        services: [
          { id: 'barber_services' },
          { id: 'beard_shaping' },
          { id: 'mens_facial_hydration' },
          { id: 'mens_manicure' },
        ],
      },
    ],
  },
  {
    id: 'HEALTH',
    icon: 'Heart',
    color: '#10B981',
    bg: '#ECFDF5',
    subcategories: [
      {
        id: 'nursing',
        categoryId: 'HEALTH',
        icon: 'Stethoscope',
        isMvp: true,
        services: [
          { id: 'home_nursing' },
          { id: 'vital_signs' },
          { id: 'medication_admin' },
          { id: 'injection_application' },
          { id: 'dressings' },
          { id: 'wound_care' },
          { id: 'catheter_care' },
          { id: 'ostomy_care' },
          { id: 'bp_monitoring' },
          { id: 'diabetes_care' },
        ],
      },
      {
        id: 'post_op_care',
        categoryId: 'HEALTH',
        icon: 'HeartPulse',
        isMvp: true,
        services: [
          { id: 'post_surgical_nursing' },
          { id: 'home_monitoring' },
          { id: 'post_op_lymphatic' },
          { id: 'drain_care' },
          { id: 'mobility_assistance' },
          { id: 'assisted_hygiene' },
          { id: 'nighttime_accompaniment' },
        ],
      },
      {
        id: 'physiotherapy',
        categoryId: 'HEALTH',
        icon: 'Activity',
        isMvp: true,
        services: [
          { id: 'home_physiotherapy' },
          { id: 'orthopedic_rehab' },
          { id: 'neurological_rehab' },
          { id: 'respiratory_physio' },
          { id: 'post_surgery_rehab' },
          { id: 'geriatric_physio' },
        ],
      },
      {
        id: 'caregivers',
        categoryId: 'HEALTH',
        icon: 'HandHeart',
        isMvp: true,
        services: [
          { id: 'elderly_caregiver_day' },
          { id: 'elderly_caregiver_night' },
          { id: 'home_companion' },
          { id: 'alzheimers_care' },
          { id: 'parkinsons_care' },
          { id: 'daily_activities_assist' },
        ],
      },
      {
        id: 'home_exams',
        categoryId: 'HEALTH',
        icon: 'TestTube',
        services: [
          { id: 'lab_sample_collection' },
          { id: 'blood_tests' },
          { id: 'urine_tests' },
          { id: 'rapid_tests' },
          { id: 'glucose_monitoring' },
        ],
      },
      {
        id: 'mental_health',
        categoryId: 'HEALTH',
        icon: 'Brain',
        services: [
          { id: 'in_person_psychotherapy' },
          { id: 'online_psychotherapy' },
          { id: 'psychiatric_followup' },
          { id: 'anxiety_therapy' },
          { id: 'depression_therapy' },
          { id: 'emotional_support' },
        ],
      },
      {
        id: 'nutrition',
        categoryId: 'HEALTH',
        icon: 'Apple',
        services: [
          { id: 'nutritionist_consultation' },
          { id: 'meal_planning' },
          { id: 'sports_nutrition' },
          { id: 'geriatric_nutrition' },
          { id: 'post_surgical_nutrition' },
        ],
      },
      {
        id: 'maternity_family',
        categoryId: 'HEALTH',
        icon: 'Baby',
        services: [
          { id: 'postpartum_care' },
          { id: 'breastfeeding_consultation' },
          { id: 'newborn_care' },
          { id: 'night_nanny' },
          { id: 'baby_massage' },
        ],
      },
      {
        id: 'complementary_therapies',
        categoryId: 'HEALTH',
        icon: 'Leaf',
        services: [
          { id: 'acupuncture' },
          { id: 'chiropractic' },
          { id: 'osteopathy' },
          { id: 'integrative_therapies' },
        ],
      },
    ],
  },
  {
    id: 'CHEF',
    icon: 'ChefHat',
    color: '#F59E0B',
    bg: '#FFFBEB',
    subcategories: [
      {
        id: 'everyday_cooking',
        categoryId: 'CHEF',
        icon: 'CookingPot',
        isMvp: true,
        services: [
          { id: 'residential_cook' },
          { id: 'daily_meal_prep' },
          { id: 'weekly_meal_prep' },
          { id: 'family_meals' },
          { id: 'couple_meals' },
          { id: 'quick_meals' },
          { id: 'batch_cooking' },
          { id: 'post_workout_meals' },
          { id: 'childrens_meals' },
          { id: 'special_diet_meals' },
        ],
      },
      {
        id: 'nutritional_cooking',
        categoryId: 'CHEF',
        icon: 'Salad',
        isMvp: true,
        services: [
          { id: 'personalized_nutritional' },
          { id: 'weight_loss_prep' },
          { id: 'muscle_gain_meals' },
          { id: 'diabetic_meals' },
          { id: 'cardio_meals' },
          { id: 'low_carb_keto' },
          { id: 'dietary_restriction_meals' },
          { id: 'senior_meals' },
          { id: 'prenatal_postpartum_meals' },
          { id: 'gut_health_meals' },
        ],
      },
      {
        id: 'events_cooking',
        categoryId: 'CHEF',
        icon: 'PartyPopper',
        isMvp: true,
        services: [
          { id: 'private_chef_dinners' },
          { id: 'private_home_dinners' },
          { id: 'family_gathering_meals' },
          { id: 'birthday_parties' },
          { id: 'holiday_feasts' },
          { id: 'bbq_grilled' },
          { id: 'home_buffet' },
          { id: 'cocktails_finger_foods' },
          { id: 'corporate_lunches' },
          { id: 'home_brunch' },
          { id: 'pre_wedding_dinner' },
        ],
      },
      {
        id: 'international_cuisine',
        categoryId: 'CHEF',
        icon: 'Globe',
        services: [
          { id: 'brazilian_cuisine' },
          { id: 'italian_cuisine' },
          { id: 'japanese_sushi' },
          { id: 'mediterranean_cuisine' },
          { id: 'arabic_cuisine' },
          { id: 'vegan_plant_based' },
          { id: 'asian_fusion' },
          { id: 'gourmet_desserts' },
        ],
      },
      {
        id: 'culinary_classes',
        categoryId: 'CHEF',
        icon: 'GraduationCap',
        services: [
          { id: 'individual_cooking_class' },
          { id: 'group_cooking_class' },
          { id: 'childrens_cooking_class' },
          { id: 'gastro_workshops' },
          { id: 'cuisine_type_classes' },
          { id: 'seasonal_classes' },
          { id: 'baking_pastry_classes' },
        ],
      },
      {
        id: 'kitchen_support',
        categoryId: 'CHEF',
        icon: 'HandPlatter',
        services: [
          { id: 'ingredient_shopping' },
          { id: 'mise_en_place' },
          { id: 'kitchen_assistant' },
          { id: 'daily_meal_support' },
          { id: 'pantry_organization' },
          { id: 'recipe_customization' },
          { id: 'culinary_consulting' },
        ],
      },
      {
        id: 'premium_experiences',
        categoryId: 'CHEF',
        icon: 'Gem',
        services: [
          { id: 'romantic_dinner' },
          { id: 'tasting_menu' },
          { id: 'wine_pairing' },
          { id: 'farm_to_table' },
          { id: 'chef_waitstaff' },
          { id: 'themed_experiences' },
        ],
      },
      {
        id: 'baking_desserts',
        categoryId: 'CHEF',
        icon: 'Cake',
        services: [
          { id: 'artisan_breads' },
          { id: 'custom_cakes' },
          { id: 'sweets_desserts' },
          { id: 'vegan_gf_confectionery' },
          { id: 'artisan_chocolates' },
          { id: 'dessert_tables' },
          { id: 'confectionery_experience' },
        ],
      },
      {
        id: 'recovery_meals',
        categoryId: 'CHEF',
        icon: 'HeartPulse',
        isMvp: true,
        services: [
          { id: 'post_surgery_meals' },
          { id: 'anti_inflammatory_menus' },
          { id: 'light_soft_diets' },
          { id: 'hydration_meals' },
          { id: 'immune_boosting_meals' },
          { id: 'hospital_transition_meals' },
        ],
      },
      {
        id: 'chef_addons',
        categoryId: 'CHEF',
        icon: 'Sparkles',
        services: [
          { id: 'kitchen_cleanup' },
          { id: 'dishwashing_organization' },
          { id: 'waste_separation' },
          { id: 'meal_storage' },
        ],
      },
    ],
  },
];

export function getCategoryById(id: ServiceCategoryId): ServiceCategoryDef | undefined {
  return SERVICE_CATALOG.find((c) => c.id === id);
}

export function getSubCategoryById(categoryId: ServiceCategoryId, subId: string): SubCategory | undefined {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories.find((s) => s.id === subId);
}

export function getAllSubCategories(): SubCategory[] {
  return SERVICE_CATALOG.flatMap((c) => c.subcategories);
}

export function getMvpSubCategories(categoryId: ServiceCategoryId): SubCategory[] {
  const cat = getCategoryById(categoryId);
  return cat?.subcategories.filter((s) => s.isMvp) ?? [];
}

export function searchServices(query: string, t: (key: string) => string): {
  categoryId: ServiceCategoryId;
  subCategoryId: string;
  serviceId: string;
  categoryName: string;
  subCategoryName: string;
  serviceName: string;
}[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: {
    categoryId: ServiceCategoryId;
    subCategoryId: string;
    serviceId: string;
    categoryName: string;
    subCategoryName: string;
    serviceName: string;
  }[] = [];

  for (const cat of SERVICE_CATALOG) {
    const catName = t(`catalog.categories.${cat.id}.name`);
    for (const sub of cat.subcategories) {
      const subName = t(`catalog.subcategories.${sub.id}.name`);
      for (const svc of sub.services) {
        const svcName = t(`catalog.services.${svc.id}`);
        if (
          svcName.toLowerCase().includes(q) ||
          subName.toLowerCase().includes(q) ||
          catName.toLowerCase().includes(q)
        ) {
          results.push({
            categoryId: cat.id,
            subCategoryId: sub.id,
            serviceId: svc.id,
            categoryName: catName,
            subCategoryName: subName,
            serviceName: svcName,
          });
        }
      }
    }
  }

  return results;
}
