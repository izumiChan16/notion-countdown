'use client';

import { useState, Suspense } from 'react';
import {
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
import DateInput from '@/components/DateInput';
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

  const labelClass = 'mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]';
  const fieldClass = 'h-11 w-full rounded-md border border-[#dedbd5] bg-white px-3 text-[15px] text-[#37352f] outline-none transition-colors placeholder:text-[#9b9a97] hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10';
  const selectClass = 'h-11 w-full cursor-pointer rounded-md border border-[#dedbd5] bg-white px-3 text-[15px] text-[#37352f] outline-none transition-colors hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10';

  return (
    <main className="min-h-screen bg-[#fbfbfa] px-4 py-5 text-[#37352f] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="border-b border-[#ece9e4] pb-5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-[#787774]">Notion Countdown / New widget</p>
            <LanguageSwitcher />
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold tracking-normal text-[#37352f] sm:text-4xl">
              {t('title')}
            </h1>
            <p className="mt-2 text-base leading-7 text-[#787774]">{t('subtitle')}</p>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <section className="rounded-md border border-[#dedbd5] bg-white">
            <div className="border-b border-[#ece9e4] px-5 py-4">
              <h2 className="text-base font-semibold text-[#37352f]">{t('generateButton')}</h2>
              <p className="mt-1 text-sm text-[#787774]">{t('selectDateTime')}</p>
            </div>

            <div className="space-y-6 p-5">
              <div className="rounded-md border border-[#ece9e4] bg-[#fbfbfa] p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <DateInput value={date} onChange={setDate} />
                  <TimeInput value={time} onChange={setTime} />
                </div>
                {isValid && (
                  <div className="mt-4 rounded-md border border-[#dedbd5] bg-white px-3 py-2">
                    <p className="text-sm text-[#787774]">
                      <span className="font-medium text-[#37352f]">{t('targetTime')}:</span>{' '}
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

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    <PencilIcon className="h-4 w-4" />
                    <span>{t('titleLabel')}</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('titlePlaceholder')}
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <PencilIcon className="h-4 w-4" />
                    <span>{t('endMessage')}</span>
                  </label>
                  <input
                    type="text"
                    value={endMessage}
                    onChange={(e) => setEndMessage(e.target.value)}
                    placeholder={t('endMessagePlaceholder')}
                    className={fieldClass}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>
                      <ClockIcon className="h-4 w-4" />
                      <span>{t('unit')}</span>
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as CountdownUnit)}
                      className={selectClass}
                    >
                      <option value="days">{t('unitDays')}</option>
                      <option value="hours">{t('unitHours')}</option>
                      <option value="minutes">{t('unitMinutes')}</option>
                      <option value="seconds">{t('unitSeconds')}</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <SwatchIcon className="h-4 w-4" />
                      <span>{t('theme')}</span>
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value as Theme)}
                      className={selectClass}
                    >
                      <option value="auto">{t('themeAuto')}</option>
                      <option value="light">{t('themeLight')}</option>
                      <option value="dark">{t('themeDark')}</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <SparklesIcon className="h-4 w-4" />
                      <span>{t('style')}</span>
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value as Style)}
                      className={selectClass}
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
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#37352f] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2f2d29] active:bg-[#262421] disabled:cursor-not-allowed disabled:bg-[#d8d5ce] disabled:text-[#9b9a97]"
              >
                <RocketLaunchIcon className="h-5 w-5" />
                <span>{isValid ? t('generateButton') : t('selectDateTime')}</span>
              </button>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <WidgetPreview config={previewConfig} />

            <section className="rounded-md border border-[#dedbd5] bg-white">
              <div className="flex items-center gap-2 border-b border-[#ece9e4] px-4 py-3 text-sm font-medium text-[#37352f]">
                <CheckCircleIcon className={`h-4 w-4 ${generatedUrl ? 'text-[#2f7d32]' : 'text-[#9b9a97]'}`} />
                <span>{generatedUrl ? t('urlGenerated') : t('generateButton')}</span>
              </div>

              {generatedUrl ? (
                <div className="space-y-4 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={generatedUrl}
                      readOnly
                      className="min-w-0 flex-1 rounded-md border border-[#dedbd5] bg-[#fbfbfa] px-3 py-2 font-mono text-xs text-[#37352f] outline-none"
                    />
                    <button
                      onClick={handleCopy}
                      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                        copied
                          ? 'bg-[#2f7d32] text-white'
                          : 'bg-[#37352f] text-white hover:bg-[#2f2d29] active:bg-[#262421]'
                      }`}
                    >
                      {copied ? <CheckCircleIcon className="h-4 w-4" /> : <ClipboardDocumentIcon className="h-4 w-4" />}
                      <span>{copied ? t('copied') : t('copyButton')}</span>
                    </button>
                  </div>
                  <QRCodeDisplay url={generatedUrl} />
                </div>
              ) : (
                <div className="p-4">
                  <div className="rounded-md border border-dashed border-[#dedbd5] bg-[#fbfbfa] px-4 py-8 text-center text-sm text-[#9b9a97]">
                    {t('selectDateTime')}
                  </div>
                </div>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ConfigPage />
    </Suspense>
  );
}
