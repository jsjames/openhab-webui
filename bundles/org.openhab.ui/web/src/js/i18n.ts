import { createI18n, type I18n, type I18nOptions } from 'vue-i18n'

/**
 * Load locale messages for a specific path and set them in the i18n instance.
 *
 * @param locales Array of locale strings to load.
 * @param group Directory group containint the locale JSON files.
 * @param setLocaleMessage Function to set the loaded locale messages - should be optained from useI18n with either 'local' or 'global' useScope from the setup function
 * @returns Promise that resolves when all messages are loaded.
 */
export async function loadLocaleMessages (locales : string[], dir : string, setLocaleMessage: (locale: string, messages: any) => void) {

  const allMessages: { [key: string]: any} = {}
  const localeFiles: Set<string> = new Set([...locales, ...locales.map((l) => l.split('-')[0])])
  const localeFilesArray = Array.from(localeFiles)

  console.log('Loading locale messages...', localeFilesArray)

  return Promise.allSettled(
    localeFilesArray.map((locale) => import(`../assets/i18n/${dir}/${locale}.json`))
  ).then((results) => {
    results.forEach((result, index) => {
      const locale = localeFilesArray[index]
      if (result.status === 'fulfilled') {
        setLocaleMessage(locale, { ...result.value.default })
      }
    })
  })
}

const i18nOptions : I18nOptions = {
  legacy: false,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {},
  silentFallbackWarn: true,
  globalInjection: true,
  missingWarn: false
}

export const i18n: I18n = createI18n(i18nOptions)

export function isLocaleSupported (locale: string): boolean {
  try {
    new Date().toLocaleDateString(locale)
  } catch (e) {
    return false
  }
  return true
}

export function convertJavaLocale (locale: string): string {
  if (!locale) {
    return 'default'
  }

  let language = ''
  let script = ''
  let region = ''

  // determine country, language and script
  locale.split('_').forEach((segment) => {
    if (segment === segment.toLowerCase() && segment.length === 2) {
      language = segment
    } else if (segment === segment.toUpperCase() && segment.length === 2) {
      region = segment
    } else if (segment.charAt(0) === '#') {
      script = segment.substring(1)
    }
  })

  if (language && script && region) {
    const jsLocale = `${language}-${script}-${region}`
    if (isLocaleSupported(jsLocale)) {
      return jsLocale
    }
  } else if (language && region) {
    const jsLocale = `${language}-${region}`
    if (isLocaleSupported(jsLocale)) {
      return jsLocale
    }
  }

  return 'default'
}
