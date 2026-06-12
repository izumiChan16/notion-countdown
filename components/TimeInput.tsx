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
      <label className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.08em] text-[#787774]">
        <ClockIcon className="h-4 w-4" />
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
          className="h-11 w-20 rounded-md border border-[#dedbd5] bg-white px-3 text-center text-lg font-semibold text-[#37352f] outline-none transition-colors hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10"
          min={is24Hour ? 0 : 1}
          max={is24Hour ? 23 : 12}
        />
        <span className="text-xl font-semibold text-[#787774]">:</span>
        <input
          type="number"
          value={String(minutes).padStart(2, '0')}
          onChange={(e) => {
            const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
            handleMinuteChange(val);
          }}
          className="h-11 w-20 rounded-md border border-[#dedbd5] bg-white px-3 text-center text-lg font-semibold text-[#37352f] outline-none transition-colors hover:border-[#c9c5bc] focus:border-[#37352f] focus:ring-2 focus:ring-[#37352f]/10"
          min={0}
          max={59}
        />

        {!is24Hour && (
          <div className="flex overflow-hidden rounded-md border border-[#dedbd5] bg-white">
            <button
              type="button"
              onClick={() => handlePeriodChange(false)}
              className={`px-4 py-3 font-semibold transition-colors ${
                !isPM ? 'bg-[#37352f] text-white' : 'bg-white text-[#37352f] hover:bg-[#f7f6f3]'
              }`}
            >
              {t('am')}
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange(true)}
              className={`px-4 py-3 font-semibold transition-colors ${
                isPM ? 'bg-[#37352f] text-white' : 'bg-white text-[#37352f] hover:bg-[#f7f6f3]'
              }`}
            >
              {t('pm')}
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={!is24Hour}
            onChange={() => handleFormatChange(false)}
            className="h-4 w-4 accent-[#37352f]"
          />
          <span className="text-sm text-[#787774]">{t('hour12')}</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            checked={is24Hour}
            onChange={() => handleFormatChange(true)}
            className="h-4 w-4 accent-[#37352f]"
          />
          <span className="text-sm text-[#787774]">{t('hour24')}</span>
        </label>
      </div>
    </div>
  );
}
