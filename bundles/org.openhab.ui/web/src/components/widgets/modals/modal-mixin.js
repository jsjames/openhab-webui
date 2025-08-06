import OhLayoutPage from '@/components/widgets/layout/oh-layout-page.vue'
import { useUserStore } from '@/js/stores/user'
import { useComponentsStore } from '@/js/stores/components'
import { useStatesStore } from '@/js/stores/states'
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    'oh-layout-page': OhLayoutPage,
    'oh-map-page': defineAsyncComponent(() => import('@/components/widgets/map/oh-map-page.vue')),
    'oh-plan-page': defineAsyncComponent(
      () => import('@/components/widgets/plan/oh-plan-page.vue')
    ),
    'oh-chart-page': defineAsyncComponent(
      () => import('@/components/widgets/chart/oh-chart-page.vue')
    )
  },
  props: {
    uid: String,
    el: Object,
    modalConfig: Object
  },
  data() {
    return {
      currentTab: 0,
      vars: {},
      ctxVars: {},
      tabVars: {}
    }
  },
  computed: {
    context() {
      const component = this.page || this.widget || this.standard
      return {
        component,
        root: component,
        store: useStatesStore().trackedItems,
        props: this.modalConfig,
        vars: this.vars,
        ctxVars: this.ctxVars,
        modalConfig: this.modalConfig // For configuration of oh- components
      }
    },
    modalStyle() {
      if (!this.context) return null
      const pageComponent =
        this.context.component === 'oh-tabs-page'
          ? this.tabContext(this.context.component.slots.default[this.currentTab]).component
          : this.context.component
      if (!pageComponent || !pageComponent.config || !pageComponent.config.style) return null
      return pageComponent.config.style
    },
    page() {
      return this.uid.startsWith('page:') ? useComponentsStore().page(this.uid.substring(5)) : null
    },
    widget() {
      return this.uid.startsWith('widget:')
        ? useComponentsStore().widget(this.uid.substring(7))
        : null
    },
    standard() {
      return this.uid.startsWith('oh-') ? { component: this.uid } : null
    },
    ready() {
      return this.page || this.widget || this.standard
    },
    componentType() {
      if (this.page) {
        return this.page.component
      } else if (this.widget || this.standard) {
        return 'generic-widget-component'
      }
      return null
    },
    visibleToCurrentUser() {
      // widgets in modals cannot be restricted (this is by design)
      if (!this.page || !this.page.config || !this.page.config.visibleTo) return true
      const user = useUserStore().user
      if (!user) return false
      if (user.roles && user.roles.some(r => this.page.config.visibleTo.indexOf('role:' + r) >= 0))
        return true
      if (this.page.config.visibleTo.indexOf('user:' + user.name) >= 0) return true
      return false
    }
  },
  methods: {
    onTabChange(idx) {
      this.currentTab = idx
      this.vars = {}
      this.ctxVars = {}
    },
    tabContext(tab) {
      const page = useComponentsStore().page(tab.config.page.replace('page:', ''))
      return {
        component: page,
        root: page,
        tab,
        props: tab.config.pageConfig,
        store: useStatesStore().trackedItems
      }
    },
    tabComponent(tab) {
      const page = useComponentsStore().page(tab.config.page.replace('page:', ''))
      return page.component
    }
  }
}
