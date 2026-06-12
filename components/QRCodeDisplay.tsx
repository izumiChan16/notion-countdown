'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '@/lib/i18n/hooks';

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-md border border-[#dedbd5] bg-white p-4">
      <p className="mb-3 text-center text-sm font-medium text-[#787774]">
        {t('qrcodeTitle')}
      </p>
      <div className="flex justify-center">
        <QRCodeSVG value={url} size={160} level="H" />
      </div>
    </div>
  );
}
