import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Widget {
  uid: string
}

interface Page {
  uid: string
}

export const useComponentsStore = defineStore('components', () => {
  const _widgets = ref<Widget[]>([])
  const _pages = ref<Page[]>([])

  function widget(uid: string) {
    return _widgets.value.find(widget => widget.uid === uid)
  }

  function widgets() {
    return _widgets.value.sort((a, b) => a.uid.localeCompare(b.uid))
  }

  function page(uid: string) {
    return _pages.value.find(page => page.uid === uid)
  }

  function pages(): Page[] {
    const pages = _pages.value.sort((a, b) => a.uid.localeCompare(b.uid))
    return pages
  }

  function setWidgets(newWidgets: Widget[]) {
    _widgets.value = newWidgets
  }

  function setPages(newPages: Page[]) {
    _pages.value = newPages
  }

  return { widget, widgets, page, pages, setWidgets, setPages }
})
