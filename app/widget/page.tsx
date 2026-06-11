'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { parseWidgetUrl } from '@/lib/url-builder';
import { calculateTimeRemaining } from '@/lib/countdown';
import { resolveTheme } from '@/lib/theme';
import type { CountdownConfig, TimeRemaining } from '@/types';

function CountdownWidget() {
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

  const isDark = actualTheme === 'dark';
  const bgColor = isDark ? '#191919' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#191919';
  const secondaryColor = isDark ? '#666666' : '#666666';

  const renderCountdown = () => {
    if (time.isExpired) {
      return (
        <div className="text-center">
          <div className="text-6xl font-bold" style={{ color: textColor }}>0</div>
          <div className="text-xl mt-2" style={{ color: secondaryColor }}>已结束</div>
        </div>
      );
    }

    if (config.unit === 'days') {
      return (
        <div className="text-center">
          <div className="text-7xl font-bold" style={{ color: textColor }}>{time.days}</div>
          <div className="text-2xl mt-2" style={{ color: secondaryColor }}>天</div>
        </div>
      );
    }

    const items = [
      { value: time.days, label: '天', show: time.days > 0 || config.unit === 'hours' },
      { value: time.hours, label: '时', show: true },
      { value: time.minutes, label: '分', show: config.unit !== 'hours' },
      { value: time.seconds, label: '秒', show: config.unit === 'seconds' },
    ].filter(item => item.show);

    return (
      <div className="flex items-center justify-center gap-4">
        {items.map((item, index) => (
          <div key={item.label} className="flex items-baseline gap-1">
            <div className="text-5xl font-bold" style={{ color: textColor }}>
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xl" style={{ color: secondaryColor }}>{item.label}</div>
            {index < items.length - 1 && (
              <div className="text-3xl mx-1" style={{ color: secondaryColor }}>:</div>
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
          ? 'p-8 rounded-2xl shadow-2xl bg-[#2c2c2c]'
          : 'p-8 rounded-2xl shadow-2xl bg-gray-50';
      case 'gradient':
        return isDark
          ? 'p-8 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm'
          : 'p-8 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100';
      case 'minimal':
      default:
        return 'p-6';
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div className={getStyleClasses()}>
        {config.title && (
          <h2
            className="text-2xl font-semibold mb-6 text-center"
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">加载中...</div>}>
      <CountdownWidget />
    </Suspense>
  );
}
