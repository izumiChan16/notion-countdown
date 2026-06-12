'use client';

import DatePicker from 'react-datepicker';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const { t } = useTranslation();

  const selectedDate = value ? new Date(value + 'T00:00:00') : null;

  const handleChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange('');
    }
  };

  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]">
        <CalendarIcon className="h-4 w-4" />
        <span>{t('endDate')}</span>
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="YYYY-MM-DD"
          className="h-11 w-full rounded-md border border-[#dedbd5] bg-white px-3 pr-10 text-[15px] text-[#37352f] outline-none transition-colors placeholder:text-[#9b9a97] hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10"
          calendarClassName="notion-datepicker"
          showPopperArrow={false}
        />
        <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b9a97]" />
      </div>
    </div>
  );
}
