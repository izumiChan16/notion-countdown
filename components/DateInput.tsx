'use client';

import { useEffect, useRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';

interface DateInputProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const { t, language } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    import('flowbite-datepicker').then(({ Datepicker }) => {
      datepickerRef.current = new Datepicker(inputRef.current!, {
        autohide: true,
        format: 'yyyy-mm-dd',
        todayBtn: true,
        clearBtn: true,
        language: language === 'zh' ? 'zh-CN' : 'en',
      });

      inputRef.current!.addEventListener('changeDate', (e: any) => {
        const date = e.target.value;
        onChange(date);
      });
    });

    return () => {
      if (datepickerRef.current) {
        datepickerRef.current.destroy();
      }
    };
  }, [language, onChange]);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        <span>{t('endDate')}</span>
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          readOnly
          placeholder="Select date"
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg cursor-pointer"
        />
      </div>
    </div>
  );
}
