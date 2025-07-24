import { defineStore } from 'pinia'
import { ref } from 'vue'

interface State {
  dark: 'dark' | 'light'
  bars: 'light' | 'filled'
  homeNavBar: 'default' | 'simple' | 'large'
  homeBackground: 'default' | 'standard' | 'white'
  expandableCardAnimation: 'default' | string
  blocklyRenderer: string
  pageTransitionAnimation: 'disabled' | 'enabled'
}

export const useThemeOptionsStore = defineStore('themeOptions', () => {
  const state = ref<State>({
    dark: 'light',
    bars: 'light',
    homeNavBar: 'default',
    homeBackground: 'default',
    expandableCardAnimation: 'default',
    blocklyRenderer: 'default',
    pageTransitionAnimation: 'disabled'
  })
  return { state }
})
