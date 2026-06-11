export type CountdownUnit = 'days' | 'hours' | 'minutes' | 'seconds';
export type Theme = 'light' | 'dark' | 'auto';
export type Style = 'minimal' | 'card' | 'gradient';

export interface CountdownConfig {
  end: Date;
  title?: string;
  unit: CountdownUnit;
  theme: Theme;
  style: Style;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
