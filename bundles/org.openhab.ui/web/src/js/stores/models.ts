import { defineStore } from 'pinia'
import { ref } from 'vue'

interface State {
  includeItemName: boolean
  includeItemTag: boolean
  expanded: boolean
  lastModelSearchQuery: string
}

export const useModelStore = defineStore('models', () => {
  const state = ref<State>({
    includeItemName: false,
    includeItemTag: false,
    expanded: false,
    lastModelSearchQuery: ''
  })
  return { state }
})
