import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeOptionsStore = defineStore('themeOptions', () => {
  const dark = ref<'dark' | 'light'>('light')
  const bars = ref<'light' | 'filled'>('light')
  const homeNavBar = ref<'default' | 'simple' | 'large'>('default')
  const homeBackground = ref<'default' | 'standard' | 'white'>('default')
  const expandableCardAnimation = ref<'default' | string>('default')
  const blocklyRenderer = ref<string>('default')
  const pageTransitionAnimation = ref<'disabled' | 'enabled'>('disabled')

  return {
    dark,
    bars,
    homeNavBar,
    homeBackground,
    expandableCardAnimation,
    blocklyRenderer,
    pageTransitionAnimation
  }
})
