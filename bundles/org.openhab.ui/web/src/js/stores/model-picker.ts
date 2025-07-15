import { defineStore } from 'pinia'
import { ref } from 'vue'

interface State {
  includeItemName: boolean
  includeItemTag: boolean
  expanded: boolean
}

export const useModelPickerStore = defineStore('modelPicker', () => {
  const state = ref<State>({
    includeItemName: false,
    includeItemTag: false,
    expanded: false
  })
  return { state }
})
