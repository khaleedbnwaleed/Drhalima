export const locales = ['en', 'ha'] as const;
export type Locale = typeof locales[number];

export const translations: Record<Locale, Record<string, any>> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      platform: 'Platform',
      vision: 'Vision',
      gallery: 'Gallery',
      news: 'News',
      member: 'Member',
      volunteer: 'Volunteer',
      contact: 'Contact',
    },
    hero: {
      title: 'Building a Better Future Together',
      subtitle: 'Join Dr. Halima Suleiman Zakari\'s movement for positive change and inclusive governance',
      cta: 'Get Involved',
    },
    footer: {
      about: 'About',
      contact: 'Contact Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      copyright: 'All rights reserved',
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      success: 'Success',
      submit: 'Submit',
      cancel: 'Cancel',
    }
  },
  ha: {
    nav: {
      home: 'Gida',
      about: 'Game',
      platform: 'Bâkin Aiki',
      vision: 'Wahayi',
      gallery: 'Hotuna',
      news: 'Labarai',
      volunteer: 'Taimakawa',
      member: 'Membar',
      contact: 'Tuntuɓi',
    },
    hero: {
      title: 'Gina Gida Mafi Kyau Tare',
      subtitle: 'Shiga cikin yunƙurin Daktariya Halima Suleiman Zakari don daidaitaccen sashen kudi',
      cta: 'Shiga Cikin',
    },
    footer: {
      about: 'Game',
      contact: 'Tuntuɓi',
      privacy: 'Siyassun Sirri',
      terms: 'Sharƙan Aiki',
      copyright: 'Duk hakki an ajiye',
    },
    common: {
      loading: 'Ana Jira...',
      error: 'An faru wata kuskure',
      success: 'Amsa',
      submit: 'Turaita',
      cancel: 'Soke',
    }
  }
};

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.');
  let value: any = translations[locale];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value ?? key;
}
