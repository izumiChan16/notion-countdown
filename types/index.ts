export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';
export type Theme = 'light' | 'dark' | 'auto';
export type Style = 'minimal' | 'card' | 'gradient';
export type Locale = 'zh' | 'en';

export interface CountdownConfig {
  end: Date;
  title?: string;
  unit: CountdownUnit;
  theme: Theme;
  style: Style;
  lang: Locale;
  endMessage?: string;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
