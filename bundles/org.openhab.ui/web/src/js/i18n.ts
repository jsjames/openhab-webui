import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'

export async function loadLocaleMessages(scopes: { [key: string]: () => Promise<any> }) {
  const locale = import.meta.env.VUE_APP_I18N_LOCALE || 'en'

  const allMessages: { [key: string]: any } = {}

  for (const key in scopes) {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1 && matched[1] === locale) {
      const messages = await scopes[key]()
      console.debug('loading i18n messages from: ' + key)
      console.debug('messages', messages)
      allMessages[locale] = { ...allMessages[locale], ...messages.default }
    }
  }
  return allMessages
}

export const i18n: I18n = createI18n({
  legacy: true,
  locale: import.meta.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {},
  allowComposition: true, // you need to specify that!
  silentFallbackWarn: true,
  globalInjection: true
})

export function isLocaleSupported(locale: string): boolean {
  try {
    new Date().toLocaleDateString(locale)
  } catch (e) {
    return false
  }
  return true
}

export function convertJavaLocale(locale: string): string {
  if (!locale) {
    return 'default'
  }

  let language = ''
  let script = ''
  let region = ''

  // determine country, language and script
  locale.split('_').forEach(segment => {
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
