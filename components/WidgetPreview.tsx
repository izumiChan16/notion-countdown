'use client';

import { EyeIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';
import type { CountdownConfig } from '@/types';
import { calculateTimeRemaining } from '@/lib/countdown';
import { useState, useEffect } from 'react';

interface WidgetPreviewProps {
  config: CountdownConfig | null;
}

export default function WidgetPreview({ config }: WidgetPreviewProps) {
  const { t } = useTranslation();
  const [time, setTime] = useState(config ? calculateTimeRemaining(config.end) : null);

  useEffect(() => {
    if (!config) return;

    const updateTime = () => {
      setTime(calculateTimeRemaining(config.end));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [config]);

  if (!config || !time) {
    return (
      <div className="rounded-md border border-[#dedbd5] bg-white">
        <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
          <EyeIcon className="h-4 w-4 text-[#787774]" />
          <span>{t('preview')}</span>
        </div>
        <div className="flex min-h-[260px] items-center justify-center p-8 text-center text-sm text-[#9b9a97]">
          {t('previewPlaceholder')}
        </div>
      </div>
    );
  }

  const isDark = config.theme === 'dark';
  const bgColor = isDark ? '#191919' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#191919';
  const secondaryColor = '#666666';

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
        return isDark ? 'p-4 sm:p-8 rounded-2xl shadow-2xl bg-[#2c2c2c]' : 'p-4 sm:p-8 rounded-2xl shadow-2xl bg-gray-50';
      case 'gradient':
        return isDark ? 'p-4 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50' : 'p-4 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100';
      case 'minimal':
      default:
        return 'p-3 sm:p-6';
    }
  };

  return (
    <div className="rounded-md border border-[#dedbd5] bg-white">
      <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
        <EyeIcon className="h-4 w-4 text-[#787774]" />
        <span>{t('preview')}</span>
      </div>
      <div
        className="flex min-h-[260px] w-full items-center justify-center overflow-hidden rounded-b-md bg-[#fbfbfa] p-3 sm:p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className={getStyleClasses()}>
          {config.title && (
            <h2 className="mb-3 text-center text-base font-semibold sm:mb-6 sm:text-2xl" style={{ color: textColor }}>
              {config.title}
            </h2>
          )}
          {renderCountdown()}
        </div>
      </div>
    </div>
  );
}
