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
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5" />
        <span>{t('endDate')}</span>
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={handleChange}
          dateFormat="yyyy-MM-dd"
          placeholderText="YYYY-MM-DD"
          className="w-full px-4 py-3 text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-lg"
          calendarClassName="shadow-2xl rounded-xl"
          showPopperArrow={false}
        />
        <CalendarIcon className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
