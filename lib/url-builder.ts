import type { CountdownConfig, CountdownUnit, Theme, Style } from '@/types';

export function buildWidgetUrl(config: CountdownConfig): string {
  const params = new URLSearchParams();
  params.set('end', config.end.toISOString());
  if (config.title) params.set('title', config.title);
  params.set('unit', config.unit);
  params.set('theme', config.theme);
  params.set('style', config.style);

  return `/widget?${params.toString()}`;
}

export function parseWidgetUrl(searchParams: URLSearchParams): CountdownConfig {
  const endStr = searchParams.get('end');
  if (!endStr) throw new Error('Missing end parameter');

  return {
    end: new Date(endStr),
    title: searchParams.get('title') || undefined,
    unit: (searchParams.get('unit') as CountdownUnit) || 'days',
    theme: (searchParams.get('theme') as Theme) || 'auto',
    style: (searchParams.get('style') as Style) || 'minimal',
  };
}
