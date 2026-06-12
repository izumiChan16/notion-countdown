'use client';

import { useEffect, useRef } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';

interface DateInputProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const datepickerRef = useRef<any>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    // Dynamic import with error handling
    import('flowbite-datepicker').then(({ Datepicker }) => {
      console.log('Flowbite Datepicker loaded', Datepicker);

      if (datepickerRef.current) {
        datepickerRef.current.destroy();
      }

      datepickerRef.current = new Datepicker(inputRef.current!, {
        autohide: true,
        format: 'yyyy-mm-dd',
        todayBtn: true,
        clearBtn: true,
      });

      inputRef.current!.addEventListener('changeDate', (e: any) => {
        console.log('Date changed:', e.target.value);
        onChange(e.target.value);
      });
    }).catch(err => {
      console.error('Failed to load Flowbite Datepicker:', err);
    });

    return () => {
      if (datepickerRef.current) {
        datepickerRef.current.destroy();
      }
    };
  }, [onChange]);

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
          onChange={(e) => onChange(e.target.value)}
          placeholder="YYYY-MM-DD"
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
        />
      </div>
    </div>
  );
}
