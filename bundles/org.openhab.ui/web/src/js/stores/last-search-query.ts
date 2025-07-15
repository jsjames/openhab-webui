import { defineStore } from 'pinia'
import { ref } from 'vue'

interface State {
  lastItemSearchQuery: string
  lastThingsSearchQuery: string
  lastPagesSearchQuery: string
  lastScheduleSearchQuery: string
  lastRulesSearchQuery: Object
}

export const useLastSearchQueryStore = defineStore('lastSearchQuery', () => {
  const state = ref<State>({
    lastItemSearchQuery: '',
    lastThingsSearchQuery: '',
    lastPagesSearchQuery: '',
    lastScheduleSearchQuery: '',
    lastRulesSearchQuery: {}
  })
  return { state }
})
