import { defineStore } from 'pinia'
import { reactive, nextTick } from 'vue'
import openhab from '@/js/openhab'

interface State {
  trackedItems: Object | null
  items: Array<string>
  trackingList: Array<string>
  itemStates: Map<string, Object>
  trackerConnectionId: string | null
  trackerEventSource: EventSource | null
  pendingTrackingListUpdate: boolean
  keepConnectionOpen: boolean
  sseConnected: boolean
}

export const useStatesStore = defineStore('states', () => {
  const state = reactive<State>({
    trackedItems: null,
    items: [],
    trackingList: [],
    itemStates: new Map<string, Object>(),
    trackerConnectionId: null,
    trackerEventSource: null,
    pendingTrackingListUpdate: false,
    keepConnectionOpen: false,
    sseConnected: false
  })

  const handler: ProxyHandler<Object> = {
    get(obj: Object, prop: string | symbol, receiver: any): Object | undefined {
      if (prop === '_keys') return Object.keys(state.itemStates)
      if (prop === '__ob__') return (obj as any).__ob__

      // to avoid the Vue devtools requesting invalid items in development
      if (
        [
          'state',
          'getters',
          '_vm',
          'toJSON',
          '__v_isRef',
          '__v_isReadonly',
          '__v_skip',
          '__v_isShallow'
        ].indexOf(prop.toString()) >= 0
      )
        return {}
      if (typeof prop !== 'string') return {}

      const itemName = prop
      if (itemName === 'undefined') return { state: '-' }
      if (!isItemTracked(itemName)) {
        addToTrackingList(itemName.toString())

        // Return the previous state anyway even if it might be outdated (it will be refreshed quickly after)
        if (!state.itemStates.has(itemName)) {
          setItemState(itemName, { state: '-' })
        }

        updateTrackingList()
      }
      return state.itemStates.get(itemName)
    },
    set(obj: Object, prop: string | symbol, value: any): boolean {
      setItemState(prop.toString(), { state: '-' })
      return true
    }
  }

  state.trackedItems = new Proxy({}, handler)

  function initializeTrackingStore() {
    console.debug('Initializing state tracking store')
  }

  function startTrackingStates() {
    console.debug('Start tracking states')
    if (state.keepConnectionOpen && state.trackerEventSource) return
    clearTrackingList()
    if (state.trackerEventSource) {
      console.info('Closing existing state tracker connection')
      openhab.sse.close(state.trackerEventSource, null)
      clearStateTracker()
    }
    const eventSource = openhab.sse.connectStateTracker(
      '/rest/events/states',
      connectionId => {
        // only one state tracker at any given time!
        state.trackerConnectionId = connectionId
        const trackingListJson = JSON.stringify(state.trackingList)
        console.debug(
          `Setting initial tracking list (${state.trackingList.length} tracked Items): ` +
            trackingListJson
        )
        openhab.api.postPlain(
          '/rest/events/states/' + connectionId,
          trackingListJson,
          'text/plain',
          'application/json',
          null
        )
        state.sseConnected = true
      },
      updates => {
        for (const item in updates) {
          setItemState(item, updates[item])
        }
      },
      () => {
        state.sseConnected = false
      },
      healthy => {
        state.sseConnected = healthy
      }
    )
    state.trackerEventSource = eventSource
  }

  function stopTrackingStates() {
    console.debug('Stop tracking states')
    if (state.keepConnectionOpen) return
    clearTrackingList()
    if (state.trackerEventSource) {
      openhab.sse.close(state.trackerEventSource)
    }
    clearStateTracker()
  }

  async function sendCommand(itemName: string, command: string, updateState: boolean = false) {
    console.debug(`Sending command "${command}" to item "${itemName}"`)
    if (updateState) {
      setItemState(itemName, { state: command })
    }
    return openhab.api.postPlain(
      '/rest/items/' + itemName,
      command,
      'text/plain',
      'text/plain', //JJ should this be 'application/json'?
      null
    )
  }

  function isItemTracked(itemName: string) {
    return state.trackingList.includes(itemName)
  }

  function addToTrackingList(itemName: string) {
    state.trackingList.push(itemName)
  }

  function clearTrackingList() {
    state.trackingList = []
  }

  function clearStateTracker() {
    state.trackingList = []
    state.trackerConnectionId = null
    state.trackerEventSource = null
  }

  function updateTrackingList() {
    if (!state.trackerConnectionId || state.pendingTrackingListUpdate) {
      return
    }

    state.pendingTrackingListUpdate = true
    nextTick(() => {
      state.pendingTrackingListUpdate = false
      if (!state.trackerConnectionId) {
        return
      }
      const trackingListJson = JSON.stringify(state.trackingList)
      console.debug(
        `Updating tracking list (${state.trackingList.length} tracked Items): ` + trackingListJson
      )

      openhab.api.postPlain(
        '/rest/events/states/' + state.trackerConnectionId,
        trackingListJson,
        'text/plain',
        'application/json',
        null
      )
    })
  }

  function getTrackedItem(itemName: string): Object | undefined {
    if (itemName === 'undefined') return { state: '-' }
    if (!isItemTracked(itemName)) {
      addToTrackingList(itemName)

      if (!state.itemStates.has(itemName)) {
        setItemState(itemName, { state: '-' })
      }

      updateTrackingList()
    }

    return state.itemStates.get(itemName)
  }

  function setItemState(itemName: string, itemState: Object) {
    state.itemStates.set(itemName, itemState)
    return true
  }

  return {
    ...state,
    startTrackingStates,
    stopTrackingStates,
    setItemState,
    isItemTracked,
    getTrackedItem,
    addToTrackingList,
    sendCommand,
    initializeTrackingStore
  }
})
