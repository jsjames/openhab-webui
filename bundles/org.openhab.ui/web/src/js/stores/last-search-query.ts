import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLastSearchQueryStore = defineStore('lastSearchQuery', () => {
  const lastItemSearchQuery = ref<string>('')
  const lastThingsSearchQuery = ref<string>('')
  const lastPagesSearchQuery = ref<string>('')
  const lastScheduleSearchQuery = ref<string>('')
  const lastModelSearchQuery = ref<string>('')
  const lastRulesSearchQuery = ref<Object>({})

  return {
    lastItemSearchQuery,
    lastThingsSearchQuery,
    lastPagesSearchQuery,
    lastScheduleSearchQuery,
    lastModelSearchQuery,
    lastRulesSearchQuery
  }
})
