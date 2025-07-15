import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: true,
  //TODO-V3 locale: import.meta.VUE_APP_I18N_LOCALE || 'en',
  locale: 'en',
  //TODO-V3  fallbackLocale: import.meta.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  fallbackLocale: 'en',
  // messages: loadLocaleMessages(require.context('@/assets/i18n/common')),
  messages: {},
  allowComposition: true, // you need to specify that!
  silentFallbackWarn: true,
  globalInjection: true
})

export async function loadLocaleMessages(scope: string) {
  // load locale messages

  // TODO-V3 const locale = i18n.global.locale || 'en'
  const locale = 'en'

  const messages = await import(/* @vite-ignore */ `${scope}/${locale}.json`)

  // set locale and locale message
  i18n.global.mergeLocaleMessage(locale, messages.default || messages)

  return messages
}

/*
export function loadLocaleMessagesOld (...scopes) {
  // const messages = {}
  for (const scope of scopes) {
    console.log('Loading i18n messages from: ' + scope)
    Object.entries(scope).forEach(([path, component]) => {
      const locale = path.split('/').pop().replace(/\.\w+$/, '')
      console.log('Locale: ' + locale + ' - ' + component)
      messages[locale] = { ...messages[locale], ...component }
    })

    Object.entries(scope).forEach(([path, component]) => {
      const locale = path.split('/').pop().replace(/\.\w+$/, '')
      debugger
    })
  }

    Object.entries(scope).forEach(([path, component]) => {
      const locale = path.split('/').pop().replace(/\.\w+$/, '')
      messages[locale] = { ...messages[locale], ...component }
    })

  scopes.forEach(scope => {
    scope.keys().forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        console.debug('loading i18n messages from: ' + key)
        const locale = matched[1]
        messages[locale] = { ...messages[locale], ...scope(key) }
      }
    })
  })
  return messages
}
  */

export function isLocaleSupported(locale) {
  try {
    new Date().toLocaleDateString(locale)
  } catch (e) {
    return false
  }
  return true
}

export function convertJavaLocale(locale) {
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
