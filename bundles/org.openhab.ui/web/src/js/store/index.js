import { createStore } from 'vuex'

import buildInfo from '@/assets/build-info'

import model from './modules/model'
import { convertJavaLocale } from '@/js/i18n'

// const debug = import.meta.env.DEV

export const store = createStore({
  modules: {
    model,
  }
  /*
  state: {
    apiVersion: null,
    measurementSystem: null,
    apiEndpoints: null,
    locale: null,
    runtimeInfo: null,
    uiInfo: {
      commit: buildInfo.commit
    },
    websiteUrl: null,
    docSrcUrl: null,
    developerDock: false,
    pagePath: null
  },
  getters: {
    apiEndpoint: state => type =>
      !state.apiEndpoints ? null : state.apiEndpoints.find(e => e.type === type),
    locale: (state, getters) => state.locale ?? 'default'
  },
  mutations: {
    setRootResource(state, { rootResponse }) {
      state.apiVersion = rootResponse.version
      state.measurementSystem = rootResponse.measurementSystem
      state.runtimeInfo = rootResponse.runtimeInfo
      state.apiEndpoints = rootResponse.links
      state.websiteUrl = `https://${rootResponse.runtimeInfo?.buildString !== 'Release Build' ? 'next' : 'www'}.openhab.org`
      state.docSrcUrl = `https://www.openhab.org/link/docs-src/${rootResponse.runtimeInfo.version.replace(/(\d+\.\d+)\.\d+/g, '$1.x')}`
    },
    setLocale(state, locale) {
      state.locale = locale
    },
    setDeveloperDock(state, value) {
      state.developerDock = value
      //TODO state.states.keepConnectionOpen = value
    },
    setPagePath(state, value) {
      state.pagePath = value
    }
  },
  actions: {
    loadRootResource({ commit }, { rootResponse }) {
      commit('setLocale', convertJavaLocale(rootResponse.locale))
      commit('setRootResource', { rootResponse })
    }
  }
  */
  // strict: debug
})

export default store
