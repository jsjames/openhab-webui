import '@/js/compatibility'
import '@/js/logging'
import '@/js/monkeypatch'

// Import Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Import globally registered components
import OHIconComponent from './components/widgets/system/oh-icon.vue'
import GenericWidgetComponent from './components/widgets/generic-widget-component.vue'
import DeveloperDockIcon from './components/developer/developer-dock-icon.vue'

// Import Framework7
import Framework7 from 'framework7/lite-bundle'
import Framework7Vue, { registerComponents } from 'framework7-vue/bundle'
import { getDevice } from 'framework7'

// Import Framework7 Styles
import 'framework7/framework7-bundle.css'

// Import Icons and App Custom Styles
import '@/css/icons.css'
import '@/css/nomini.css'
import '@/css/app.styl'

// Import openHAB API helpers
import openhab from '@/js/openhab/index'

// Import AsyncComputed
import AsyncComputed from 'vue-async-computed'

// Import vue-magic-grid
// import MagicGrid from 'vue-magic-grid'
// Vue.use(MagicGrid)

// Import App Component
import App from './App.vue'

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue)

// Import VueX store
import { store } from '@/js/store/index'
store.dispatch('initializeTrackingStore')

// initialize i18n
import { i18n, loadLocaleMessages } from '@/js/i18n'

await loadLocaleMessages('/src/assets/i18n/common')

// Import vuetrend
import Trend from 'vue3trend'

// Import Fullscreen Plugin
import fullscreen from 'vue-fullscreen'

// Import clipboard plugin
import VueClipboard from 'vue3-clipboard'

const pinia = createPinia()
const app = createApp(App)

// Register all Framework7 Vue components
registerComponents(app)

app.config.globalProperties.$oh = openhab
app.config.globalProperties.$device = getDevice()

app.use(i18n)
app.use(store)
app.use(pinia)
app.use(AsyncComputed)
app.use(fullscreen)
app.use(VueClipboard, {
  autoSetContainer: true, // add this line to enable auto setting container
  appendToBody: true // add this line to append the popup to body
})
app.use(Trend)

store.$oh = openhab

// Register global components
app.component('oh-icon', OHIconComponent)
app.component('generic-widget-component', GenericWidgetComponent)
app.component('developer-dock-icon', DeveloperDockIcon)

app.mount('#app')
