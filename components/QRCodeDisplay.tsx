'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from '@/lib/i18n/hooks';

interface QRCodeDisplayProps {
  url: string;
}

export default function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="mt-4 p-4 bg-white border-2 border-gray-200 rounded-xl">
      <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
        {t('qrcodeTitle')}
      </p>
      <div className="flex justify-center">
        <QRCodeSVG value={url} size={160} level="H" />
      </div>
    </div>
  );
}
