import { defineStore } from 'pinia';
import { ref } from 'vue';

interface State {
  lastItemSearchQuery: string;
  lastThingsSearchQuery: string;
  lastPagesSearchQuery: string;
}

export const useUIOptionsStore = defineStore('uiOptions', () => {
  const uiOptions = ref<State>({
    lastItemSearchQuery: '',
    lastThingsSearchQuery: '',
    lastPagesSearchQuery: '',
  });
  return { uiOptions };
});
