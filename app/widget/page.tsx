'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { parseWidgetUrl } from '@/lib/url-builder';
import { calculateTimeRemaining } from '@/lib/countdown';
import { resolveTheme } from '@/lib/theme';
import { getTranslation } from '@/lib/i18n/translations';
import type { TranslationKey } from '@/lib/i18n/translations';
import type { CountdownConfig, TimeRemaining } from '@/types';

function CountdownWidget() {
  const searchParams = useSearchParams();
  const config = useMemo<CountdownConfig | null>(() => {
    try {
      return parseWidgetUrl(searchParams);
    } catch (error) {
      console.error('Invalid widget URL', error);
      return null;
    }
  }, [searchParams]);
  const [time, setTime] = useState<TimeRemaining | null>(null);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => resolveTheme('auto'));

  useEffect(() => {
    if (!config) return;

    const updateTime = () => {
      setTime(calculateTimeRemaining(config.end));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [config]);

  useEffect(() => {
    if (config?.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setSystemTheme(resolveTheme('auto'));
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [config?.theme]);

  if (!config || !time) return null;

  const actualTheme = config.theme === 'auto' ? systemTheme : resolveTheme(config.theme);
  const isDark = actualTheme === 'dark';
  const bgColor = isDark ? '#191919' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#191919';
  const secondaryColor = '#666666';

  const t = (key: TranslationKey) => getTranslation(config.lang, key);

  const renderCountdown = () => {
    if (time.isExpired) {
      return (
        <div className="text-center">
          <div className="text-4xl sm:text-6xl font-bold" style={{ color: textColor }}>0</div>
          <div className="text-base sm:text-xl mt-2" style={{ color: secondaryColor }}>
            {config.endMessage || t('expired')}
          </div>
        </div>
      );
    }

    if (config.unit === 'days') {
      return (
        <div className="text-center">
          <div className="text-5xl sm:text-7xl font-bold" style={{ color: textColor }}>{time.days}</div>
          <div className="text-lg sm:text-2xl mt-2" style={{ color: secondaryColor }}>{t('daysUnit')}</div>
        </div>
      );
    }

    const items = [
      { value: time.days, label: t('daysUnit'), show: time.days > 0 || config.unit === 'hours' },
      { value: time.hours, label: t('hoursUnit'), show: true },
      { value: time.minutes, label: t('minutesUnit'), show: config.unit !== 'hours' },
      { value: time.seconds, label: t('secondsUnit'), show: config.unit === 'seconds' },
    ].filter(item => item.show);

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-baseline gap-1">
            <div className="text-3xl sm:text-5xl font-bold" style={{ color: textColor }}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-sm sm:text-xl" style={{ color: secondaryColor }}>{item.label}</div>
            {index < items.length - 1 && (
              <div className="text-2xl sm:text-3xl mx-1" style={{ color: secondaryColor }}>:</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const getStyleClasses = () => {
    switch (config.style) {
      case 'card':
        return isDark
          ? 'p-4 sm:p-8 rounded-2xl shadow-2xl bg-[#2c2c2c]'
          : 'p-4 sm:p-8 rounded-2xl shadow-2xl bg-gray-50';
      case 'gradient':
        return isDark
          ? 'p-4 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm'
          : 'p-4 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100';
      case 'minimal':
      default:
        return 'p-3 sm:p-6';
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className={getStyleClasses()}>
        {config.title && (
          <h2
            className="text-base sm:text-2xl font-semibold mb-3 sm:mb-6 text-center"
            style={{ color: textColor }}
          >
            {config.title}
          </h2>
        )}
        {renderCountdown()}
      </div>
    </div>
  );
}

export default function WidgetPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CountdownWidget />
    </Suspense>
  );
}
