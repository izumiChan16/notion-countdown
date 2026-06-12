declare module 'flowbite-datepicker' {
  export class Datepicker {
    constructor(element: HTMLElement, options?: any);
    destroy(): void;
    setDate(date: Date | string): void;
    getDate(): Date;
  }
}
