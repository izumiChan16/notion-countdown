import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Locale } from './locales';
import type { TranslationKey } from './translations';
import { getTranslation } from './translations';
import { detectBrowserLanguage, getStoredLanguage, setStoredLanguage } from './utils';

export function useLanguage(): [Locale, (locale: Locale) => void] {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Locale>(() => {
    const urlLang = searchParams.get('lang');
    if (urlLang === 'zh' || urlLang === 'en') {
      return urlLang;
    }

    const storedLang = getStoredLanguage();
    if (storedLang) {
      return storedLang;
    }

    return detectBrowserLanguage();
  });

  const changeLanguage = (locale: Locale) => {
    setLanguage(locale);
    setStoredLanguage(locale);
  };

  return [language, changeLanguage];
}

export function useTranslation() {
  const [language] = useLanguage();

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  return { t, language };
}
