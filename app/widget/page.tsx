'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { parseWidgetUrl } from '@/lib/url-builder';
import { calculateTimeRemaining } from '@/lib/countdown';
import { resolveTheme } from '@/lib/theme';
import type { CountdownConfig, TimeRemaining } from '@/types';

export default function WidgetPage() {
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<CountdownConfig | null>(null);
  const [time, setTime] = useState<TimeRemaining | null>(null);
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const parsed = parseWidgetUrl(searchParams);
      setConfig(parsed);
      setActualTheme(resolveTheme(parsed.theme));
    } catch (error) {
      console.error('Invalid widget URL', error);
    }
  }, [searchParams]);

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
      const handleChange = () => setActualTheme(resolveTheme('auto'));
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [config?.theme]);

  if (!config || !time) return null;

  const getDisplayValue = () => {
    switch (config.unit) {
      case 'seconds': return time.days * 86400 + time.hours * 3600 + time.minutes * 60 + time.seconds;
      case 'minutes': return time.days * 1440 + time.hours * 60 + time.minutes;
      case 'hours': return time.days * 24 + time.hours;
      case 'days': return time.days;
    }
  };

  const getUnitLabel = () => {
    switch (config.unit) {
      case 'seconds': return '秒';
      case 'minutes': return '分钟';
      case 'hours': return '小时';
      case 'days': return '天';
    }
  };

  const isDark = actualTheme === 'dark';

  const baseClasses = `min-h-screen flex items-center justify-center p-4 ${
    isDark ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  }`;

  const getStyleClasses = () => {
    switch (config.style) {
      case 'card':
        return `p-8 rounded-lg shadow-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`;
      case 'gradient':
        return `p-8 rounded-lg ${isDark ? 'bg-gradient-to-br from-purple-900 to-blue-900' : 'bg-gradient-to-br from-blue-400 to-purple-500 text-white'}`;
      case 'minimal':
      default:
        return '';
    }
  };

  return (
    <div className={baseClasses}>
      <div className={getStyleClasses()}>
        {config.title && (
          <h2 className="text-xl font-semibold mb-4 text-center">{config.title}</h2>
        )}
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">
            {time.isExpired ? '0' : getDisplayValue()}
          </div>
          <div className="text-2xl opacity-80">{getUnitLabel()}</div>
        </div>
      </div>
    </div>
  );
}
