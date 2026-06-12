'use client';

import { LanguageIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '@/lib/i18n/hooks';
import type { Locale } from '@/lib/i18n/locales';

export default function LanguageSwitcher() {
  const [language, changeLanguage] = useLanguage();

  const handleChange = (newLang: Locale) => {
    changeLanguage(newLang);
    // Force re-render by updating URL
    const url = new URL(window.location.href);
    url.searchParams.set('lang', newLang);
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border-2 border-gray-200 p-1">
      <LanguageIcon className="w-5 h-5 text-gray-600 ml-2" />
      <button
        onClick={() => handleChange('zh')}
        className={`px-3 py-1 rounded font-medium transition-colors ${
          language === 'zh' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        中文
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-3 py-1 rounded font-medium transition-colors ${
          language === 'en' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}
