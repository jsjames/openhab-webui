import { defineStore } from 'pinia'
import { ref } from 'vue'

import buildInfo from '@/assets/build-info'
import { convertJavaLocale } from '../i18n'

import { useStatesStore } from '@/js/stores/states'

interface UIInfo {
  commit: string
}

interface Endpoint {
  type: string
  url: string
}

interface RootResponse {
  version: number
  measurementSystem: 'SI' | 'US'
  runtimeInfo: {
    buildString?: string
    version: string
    [key: string]: any
  }
  links: Endpoint[]
  locale: string
  [key: string]: any
}

export const useRuntimeStore = defineStore('runtime', () => {
  const apiVersion = ref<number | null>(null)
  const measurementSystem = ref<'SI' | 'US' | null>(null)
  const apiEndpoints = ref<Endpoint[] | null>(null)
  const locale = ref<string>('default')
  const runtimeInfo = ref<Object | null>(null)
  const UIInfo = ref<UIInfo>({ commit: buildInfo.commit })
  const websiteUrl = ref<string | null>(null)
  const docSrcUrl = ref<string | null>(null)
  const developerDock = ref<Boolean>(false)
  const pagePath = ref<string | null>(null)

  function apiEndpoint(type: string): string | null {
    return !apiEndpoints ? null : apiEndpoints.value?.find(e => e.type === type)?.url || null
  }

  function setRootResource(rootResponse: RootResponse) {
    apiVersion.value = rootResponse.version
    measurementSystem.value = rootResponse.measurementSystem
    runtimeInfo.value = rootResponse.runtimeInfo
    apiEndpoints.value = rootResponse.links
    websiteUrl.value = `https://${rootResponse.runtimeInfo?.buildString !== 'Release Build' ? 'next' : 'www'}.openhab.org`
    docSrcUrl.value = `https://www.openhab.org/link/docs-src/${rootResponse.runtimeInfo.version.replace(/(\d+\.\d+)\.\d+/g, '$1.x')}`
  }

  function setDeveloperDock(value: boolean) {
    developerDock.value = value
    useStatesStore().keepConnectionOpen = value
  }

  function loadRootResource(rootResponse: RootResponse) {
    locale.value = convertJavaLocale(rootResponse.locale)
    setRootResource(rootResponse)
  }

  return {
    apiVersion,
    measurementSystem,
    apiEndpoints,
    apiEndpoint,
    locale,
    runtimeInfo,
    UIInfo,
    websiteUrl,
    docSrcUrl,
    developerDock,
    pagePath,

    setDeveloperDock,
    loadRootResource
  }
})
