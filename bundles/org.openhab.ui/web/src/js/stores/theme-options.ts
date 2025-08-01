import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
// @ts-ignore   TODO-V3
import { Dom7 } from 'framework7/lite-bundle'

declare global {
  interface Window {
    OHApp?: {
      preferDarkMode?: () => boolean
    }
  }
}

export const useThemeOptionsStore = defineStore('themeOptions', () => {
  const _storedDark = localStorage.getItem('openhab.ui:theme.dark') || 'light'
  /* TODO-V3
    (window.OHApp && window.OHApp.preferDarkMode
      ? window.OHApp.preferDarkMode().toString()
      : f7.darkMode
        ? 'dark'
        : 'light')
        */
  const dark = ref<'auto' | 'dark' | 'light'>(
    ['auto', 'dark', 'light'].includes(_storedDark)
      ? (_storedDark as 'auto' | 'dark' | 'light')
      : 'light'
  )

  const _storedBars = localStorage.getItem('openhab.ui:theme.bars') || 'light'
  const bars = ref<'light' | 'filled'>(
    ['light', 'filled'].includes(_storedBars as any) ? (_storedBars as 'light' | 'filled') : 'light'
  )

  const _storedNavBar = localStorage.getItem('openhab.ui:theme.home.navbar') || 'default'
  const homeNavBar = ref<'default' | 'simple' | 'large'>(
    ['default', 'simple', 'large'].includes(_storedNavBar as any)
      ? (_storedNavBar as 'default' | 'simple' | 'large')
      : 'default'
  )

  const _storedHomeBackground =
    localStorage.getItem('openhab.ui:theme.home.background') || 'default'
  const homeBackground = ref<'default' | 'standard' | 'white'>(
    ['default', 'standard', 'white'].includes(_storedHomeBackground as any)
      ? (_storedHomeBackground as 'default' | 'standard' | 'white')
      : 'default'
  )

  const _storedExpandableCardAnimation =
    localStorage.getItem('openhab.ui:theme.home.cardanimation') || 'default'
  const disableExpandableCardAnimation = ref<boolean>(_storedExpandableCardAnimation === 'disabled')

  const blocklyRenderer = ref<string>(
    localStorage.getItem('openhab.ui:theme.blockly.renderer') || 'default'
  )
  const disablePageTransitionAnimation = ref<boolean>(
    localStorage.getItem('openhab.ui:theme.disablepagetransition') === 'true'
  )

  const hideChatInput = ref<boolean>(
    localStorage.getItem('openhab.ui:theme.home.hidechatinput') === 'true'
  )

  const webAudio = ref<boolean>(localStorage.getItem('openhab.ui:webaudio.enable') === 'true')

  const visibleBreakpointDisabled = ref<boolean>(
    localStorage.getItem('openhab.ui:panel.visibleBreakpointDisabled') === 'true'
  )

  watch(dark, newValue => {
    if (newValue === 'auto') {
      localStorage.removeItem('openhab.ui:theme.dark')
    } else {
      localStorage.setItem('openhab.ui:theme.dark', newValue)
    }
    bars.value = 'light' // Reset bars to light when dark mode changes
    updateClasses()
  })

  watch(bars, newValue => {
    localStorage.setItem('openhab.ui:theme.bars', newValue)
    updateClasses()
  })

  watch(disablePageTransitionAnimation, newValue => {
    localStorage.setItem('openhab.ui:theme.disablepagetransition', newValue.toString())
    updateClasses()
  })

  watch(homeNavBar, newValue => {
    localStorage.setItem('openhab.ui:theme.home.navbar', newValue)
  })

  watch(disableExpandableCardAnimation, newValue => {
    localStorage.setItem('openhab.ui:theme.home.cardanimation', newValue ? 'disabled' : 'default')
  })

  watch(homeBackground, newValue => {
    localStorage.setItem('openhab.ui:theme.home.background', newValue)
  })

  watch(blocklyRenderer, newValue => {
    localStorage.setItem('openhab.ui:theme.blockly.renderer', newValue)
  })

  watch(hideChatInput, newValue => {
    localStorage.setItem('openhab.ui:theme.home.hidechatinput', newValue.toString())
  })

  watch(webAudio, newValue => {
    localStorage.setItem('openhab.ui:webaudio.enable', newValue ? 'true' : 'false')
  })

  watch(visibleBreakpointDisabled, newValue => {
    localStorage.setItem('openhab.ui:panel.visibleBreakpointDisabled', newValue.toString())
  })

  function updateClasses() {
    if (dark.value === 'dark') {
      Dom7('html').addClass('dark')
    } else {
      Dom7('html').removeClass('dark')
    }
    if (bars.value === 'filled') {
      Dom7('html').addClass('theme-filled')
    } else {
      Dom7('html').removeClass('theme-filled')
    }
    if (disablePageTransitionAnimation.value) {
      Dom7('html').addClass('no-page-transitions')
    } else {
      Dom7('html').removeClass('no-page-transitions')
    }
  }

  return {
    dark,
    bars,
    homeNavBar,
    homeBackground,
    disableExpandableCardAnimation,
    blocklyRenderer,
    disablePageTransitionAnimation,
    hideChatInput,
    webAudio,
    visibleBreakpointDisabled,

    updateClasses
  }
})
