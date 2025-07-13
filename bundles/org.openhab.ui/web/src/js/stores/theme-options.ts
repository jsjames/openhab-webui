import { defineStore } from 'pinia';
import { ref } from 'vue';

interface ThemeOptions {
  dark: 'dark' | 'light';
  bars: 'light' | 'dark';
  homeNavBar: 'default' | string;
  homeBackground: 'default' | string;
  expandableCardAnimation: 'default' | string;
  blocklyRenderer: string;
  pageTransitionAnimation: 'disabled' | 'enabled';
}

export const themeOptionsStore = defineStore('themeOptions', () => {
  const themeOptions = ref<ThemeOptions>({
    dark: 'light',
    bars: 'light',
    homeNavBar: 'default',
    homeBackground: 'default',
    expandableCardAnimation: 'default',
    blocklyRenderer: 'default',
    pageTransitionAnimation: 'disabled',
  });
  return { themeOptions };
});
