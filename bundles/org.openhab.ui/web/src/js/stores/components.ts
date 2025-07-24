import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Widget {
  uid: string
}

interface Page {
  uid: string
}

export const useComponentsStore = defineStore('components', () => {
  const widgetsRef = ref<Widget[]>([])
  const pagesRef = ref<Page[]>([])

  function widget(uid: string) {
    return widgetsRef.value.find(widget => widget.uid === uid)
  }

  function widgets() {
    return [...widgetsRef.value].sort((a, b) => a.uid.localeCompare(b.uid))
  }

  function page(uid: string) {
    return pagesRef.value.find(page => page.uid === uid)
  }

  function pages() {
    return [...pagesRef.value].sort((a, b) => a.uid.localeCompare(b.uid))
  }

  function setWidgets(newWidgets: Widget[]) {
    widgetsRef.value = newWidgets
  }

  function setPages(newPages: Page[]) {
    pagesRef.value = newPages
  }

  return { widget, widgets, page, pages, setWidgets, setPages }
})
