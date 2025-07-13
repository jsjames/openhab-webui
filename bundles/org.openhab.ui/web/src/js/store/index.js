import { createStore } from 'vuex'

import buildInfo from '@/assets/build-info'

import model from './modules/model'
import { convertJavaLocale } from '@/js/i18n'

// const debug = import.meta.env.DEV

export const store = createStore({
  modules: {
    model
  }
})

export default store
