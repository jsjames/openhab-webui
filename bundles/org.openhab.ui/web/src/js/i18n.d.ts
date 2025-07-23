// i18n.d.ts
declare module '@/js/i18n' {
  export function loadLocaleMessages(scopes: {
    [key: string]: () => Promise<any>
  }): Promise<Array<string>>
  export function isLocaleSupported(locale: string): boolean
  export function convertJavaLocale(locale: string): string
}
