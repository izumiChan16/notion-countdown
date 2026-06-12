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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !inputRef.current) return;

    const initDatepicker = async () => {
      try {
        const { Datepicker } = await import('flowbite-datepicker');
        console.log('✅ Flowbite Datepicker imported', Datepicker);

        if (datepickerRef.current) {
          datepickerRef.current.destroy();
        }

        datepickerRef.current = new Datepicker(inputRef.current!, {
          autohide: true,
          format: 'yyyy-mm-dd',
          todayBtn: true,
          clearBtn: true,
          buttonClass: 'btn',
        });

        console.log('✅ Datepicker initialized', datepickerRef.current);

        // Listen for date selection
        inputRef.current!.addEventListener('changeDate', function(e: any) {
          console.log('📅 Date selected:', e.detail.date, e.target.value);
          if (e.target.value) {
            onChange(e.target.value);
          }
        });

      } catch (error) {
        console.error('❌ Failed to initialize Flowbite Datepicker:', error);
      }
    };

    initDatepicker();

    return () => {
      if (datepickerRef.current) {
        try {
          datepickerRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying datepicker:', e);
        }
      }
    };
  }, [mounted, onChange]);

  if (!mounted) return null;

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
        <CalendarIcon
          className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
}

function useState<T>(initialValue: T): [T, (value: T) => void] {
  const { useState: reactUseState } = require('react');
  return reactUseState(initialValue);
}
