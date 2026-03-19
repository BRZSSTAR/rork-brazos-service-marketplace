import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';
import type { Locale } from '@/types';

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources,
  lng: 'pt-BR',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export async function applyAppLanguage(locale: Locale) {
  if (i18n.language === locale) {
    return;
  }

  console.log('[i18n] Applying app language:', locale);
  await i18n.changeLanguage(locale);
}

export default i18n;
