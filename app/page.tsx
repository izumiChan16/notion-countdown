'use client';

import { useState, Suspense } from 'react';
import {
  CalendarIcon,
  PencilIcon,
  ClockIcon,
  SwatchIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ClipboardDocumentIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { buildWidgetUrl } from '@/lib/url-builder';
import { useTranslation } from '@/lib/i18n/hooks';
import type { CountdownUnit, Theme, Style } from '@/types';
import TimeInput from '@/components/TimeInput';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import WidgetPreview from '@/components/WidgetPreview';

function ConfigPage() {
  const { t, language } = useTranslation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [title, setTitle] = useState('');
  const [unit, setUnit] = useState<CountdownUnit>('days');
  const [theme, setTheme] = useState<Theme>('auto');
  const [style, setStyle] = useState<Style>('minimal');
  const [endMessage, setEndMessage] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const isValid = date && time;

  const previewConfig = isValid ? {
    end: new Date(`${date}T${time}`),
    title: title || undefined,
    unit,
    theme,
    style,
    lang: language,
    endMessage: endMessage || undefined,
  } : null;

  const handleGenerate = () => {
    if (!isValid) return;
    try {
      const url = buildWidgetUrl({
        end: new Date(`${date}T${time}`),
        title: title || undefined,
        unit,
        theme,
        style,
        lang: language,
        endMessage: endMessage || undefined,
      });
      setGeneratedUrl(`${window.location.origin}${url}`);
    } catch (error) {
      console.error('生成URL失败', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-10">
        <div className="flex justify-between items-start mb-10">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {t('title')}
            </h1>
            <p className="text-gray-600 text-lg">{t('subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="space-y-8">
          {/* Date and Time */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  <span>{t('endDate')}</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
                />
              </div>
              <TimeInput value={time} onChange={setTime} />
            </div>
            {isValid && (
              <div className="mt-4 p-3 bg-white rounded-xl border border-blue-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">{t('targetTime')}：</span>
                  {new Date(`${date}T${time}`).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Other Config */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                <span>{t('titleLabel')}</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('titlePlaceholder')}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                <span>{t('endMessage')}</span>
              </label>
              <input
                type="text"
                value={endMessage}
                onChange={(e) => setEndMessage(e.target.value)}
                placeholder={t('endMessagePlaceholder')}
                className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5" />
                  <span>{t('unit')}</span>
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as CountdownUnit)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="days">{t('unitDays')}</option>
                  <option value="hours">{t('unitHours')}</option>
                  <option value="minutes">{t('unitMinutes')}</option>
                  <option value="seconds">{t('unitSeconds')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <SwatchIcon className="w-5 h-5" />
                  <span>{t('theme')}</span>
                </label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as Theme)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="auto">{t('themeAuto')}</option>
                  <option value="light">{t('themeLight')}</option>
                  <option value="dark">{t('themeDark')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" />
                  <span>{t('style')}</span>
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as Style)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all cursor-pointer"
                >
                  <option value="minimal">{t('styleMinimal')}</option>
                  <option value="card">{t('styleCard')}</option>
                  <option value="gradient">{t('styleGradient')}</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!isValid}
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-5 px-6 rounded-2xl hover:shadow-2xl disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center gap-2"
          >
            <RocketLaunchIcon className="w-6 h-6" />
            <span>{isValid ? t('generateButton') : t('selectDateTime')}</span>
          </button>

          {generatedUrl && (
            <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                <span>{t('urlGenerated')}</span>
              </p>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-300 rounded-xl text-sm text-gray-700 focus:outline-none font-mono"
                />
                <button
                  onClick={handleCopy}
                  className={`px-6 py-3 font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                    copied ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black'
                  }`}
                >
                  {copied ? <CheckCircleIcon className="w-5 h-5" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                  <span>{copied ? t('copied') : t('copyButton')}</span>
                </button>
              </div>
              <QRCodeDisplay url={generatedUrl} />
            </div>
          )}

          <WidgetPreview config={previewConfig} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfigPage />
    </Suspense>
  );
}
