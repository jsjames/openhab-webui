import { defineStore } from 'pinia'
import { ref } from 'vue'

interface State {
  includeItemNames: boolean
}

export const useSitemapStore = defineStore('sitemap', () => {
  const state = ref<State>({
    includeItemNames: false
  })
  return { state }
})
