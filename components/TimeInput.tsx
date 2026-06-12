'use client';

import { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/lib/i18n/hooks';

interface TimeInputProps {
  value: string; // HH:MM format
  onChange: (value: string) => void;
}

export default function TimeInput({ value, onChange }: TimeInputProps) {
  const { t } = useTranslation();
  const [hours, minutes] = value.split(':').map(Number);
  const [is24Hour, setIs24Hour] = useState(true);
  const [isPM, setIsPM] = useState(false);

  const displayHours = is24Hour ? hours : (hours % 12 || 12);

  const handleHourChange = (newHour: number) => {
    let hour24 = newHour;
    if (!is24Hour) {
      if (isPM) {
        hour24 = newHour === 12 ? 12 : newHour + 12;
      } else {
        hour24 = newHour === 12 ? 0 : newHour;
      }
    }
    onChange(`${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  const handleMinuteChange = (newMinute: number) => {
    onChange(`${String(hours).padStart(2, '0')}:${String(newMinute).padStart(2, '0')}`);
  };

  const handleFormatChange = (to24Hour: boolean) => {
    setIs24Hour(to24Hour);
    if (!to24Hour && hours >= 12) {
      setIsPM(true);
    }
  };

  const handlePeriodChange = (pm: boolean) => {
    setIsPM(pm);
    const hour12 = displayHours;
    const hour24 = pm ? (hour12 === 12 ? 12 : hour12 + 12) : (hour12 === 12 ? 0 : hour12);
    onChange(`${String(hour24).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <ClockIcon className="w-5 h-5" />
        <span>{t('endTime')}</span>
      </label>

      <div className="flex items-center gap-3">
        <input
          type="number"
          value={displayHours}
          onChange={(e) => {
            const val = Math.max(is24Hour ? 0 : 1, Math.min(is24Hour ? 23 : 12, parseInt(e.target.value) || 0));
            handleHourChange(val);
          }}
          className="w-20 px-3 py-3 text-center text-xl font-semibold text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
          min={is24Hour ? 0 : 1}
          max={is24Hour ? 23 : 12}
        />
        <span className="text-2xl font-bold text-gray-600">:</span>
        <input
          type="number"
          value={String(minutes).padStart(2, '0')}
          onChange={(e) => {
            const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
            handleMinuteChange(val);
          }}
          className="w-20 px-3 py-3 text-center text-xl font-semibold text-gray-900 bg-white border-2 border-blue-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
          min={0}
          max={59}
        />

        {!is24Hour && (
          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => handlePeriodChange(false)}
              className={`px-4 py-3 font-semibold transition-colors ${
                !isPM ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('am')}
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange(true)}
              className={`px-4 py-3 font-semibold transition-colors ${
                isPM ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {t('pm')}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!is24Hour}
            onChange={() => handleFormatChange(false)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">{t('hour12')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={is24Hour}
            onChange={() => handleFormatChange(true)}
            className="w-4 h-4 text-blue-600"
          />
          <span className="text-sm text-gray-700">{t('hour24')}</span>
        </label>
      </div>
    </div>
  );
}
