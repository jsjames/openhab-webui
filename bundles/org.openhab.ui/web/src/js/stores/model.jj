import { defineStore } from 'pinia'
import { ref } from 'vue'
import { compareItems } from '@/components/widgets/widget-order'
import { i18n } from '@/js/i18n'
import { authorize } from '@/js/openhab/auth'

import api from '@/js/openhab/api'

interface Item {
  name: string
  label: string
  metadata?: any
  semantics?: any
  modelPath?: Item[]
  parent: Item | null
  semanticLoopDetector?: boolean
  children: Item[]
  locations: Item[]
  points: Item[]
  properties: Item[]
  equipment: Item[]
  equipmentOrPoints: Item[]
}

interface FilteredItems {
  equipment: Item[]
  properties: Item[]
  locations: Item[]
}

interface ModelCard {
  item: Item
  properties: Item[]
  equipment: Item[]
  key: string
  defaultTitle: string
}

interface ReduceStruct {
  [key: string]: Item[]
}

function _compareObjects(o1: Item | { item: Item }, o2: Item | { item: Item }): number {
  return compareItems(o1.item || o1, o2.item || o2)
}

function _buildModelCard(
  type: 'location' | 'equipment' | 'property',
  source: ModelCard,
  key: string
): ModelCard {
  switch (type) {
    case 'location':
      let defaultLocationTitle = source.item.label || source.item.name
      return Object.assign(source, {
        key,
        defaultTitle: defaultLocationTitle
      })
    case 'equipment':
      let defaultEquipmentTitle = i18n.global.t(key)
      return {
        key,
        defaultTitle: defaultEquipmentTitle,
        equipment: source
      }
    case 'property':
      let defaultPropertyTitle = i18n.global.t(key)
      return {
        key,
        defaultTitle: defaultPropertyTitle,
        points: source
      }
  }
}

function _sortModel(item: Item) {
  item.children = item.children.sort(compareItems)
  item.locations = item.locations.sort(compareItems)
  item.points = item.points.sort(compareItems)
  item.properties = item.properties.sort(compareItems)
  item.equipment = item.equipment.sort(compareItems)
  item.equipmentOrPoints = item.equipmentOrPoints.sort(compareItems)

  item.children.forEach(child => _sortModel(child))
}

export const useModelStore = defineStore('model', () => {
  const locations = ref<ModelCard[]>([])
  const equipment = ref<ModelCard[]>([])
  const property = ref<ModelCard[]>([])
  const error = ref<any>(null)

  // Recursively builds path in model (sorted array of relations to ancestors, either Equipment or Location) for an item
  // that has semantics configuration and returns it.
  // At the same time, adds all items not already processed to the filteredItems property depending on their semantic type.
  function buildPathInModel(item: Item, items: Item[], filteredItems: FilteredItems): Item[] {
    if (!item.metadata || !item.metadata.semantics) return []
    if (item.modelPath) return item.modelPath
    let parent: Item | null | undefined = null
    if (item.metadata.semantics.config && item.metadata.semantics.config.hasLocation) {
      parent = items.find(i => i.name === item.metadata.semantics.config.hasLocation)
    } else if (item.metadata.semantics.config && item.metadata.semantics.config.isPointOf) {
      parent = items.find(i => i.name === item.metadata.semantics.config.isPointOf)
    } else if (item.metadata.semantics.config && item.metadata.semantics.config.isPartOf) {
      parent = items.find(i => i.name === item.metadata.semantics.config.isPartOf)
    }
    if (parent && parent.semanticLoopDetector) {
      throw new Error(
        `A a loop has been detected in the semantic model: ${parent.name} is both descendant and parent of ${item.name}`
      )
    }
    item.parent = parent
      ? { name: parent.name, label: parent.label, metadata: parent.metadata }
      : null

    item.semanticLoopDetector = true
    item.modelPath = item.parent
      ? [...buildPathInModel(item.parent, items, filteredItems), item.parent]
      : []
    delete item.semanticLoopDetector
    item.children = []
    item.locations = []
    item.points = []
    item.properties = []
    item.equipment = []
    item.equipmentOrPoints = []

    if (parent) parent.children?.push(item)

    if (item.metadata.semantics.value.startsWith('Location')) {
      if (parent) parent.locations.push(item)
      filteredItems.locations.push(item)
    }

    if (item.metadata.semantics.value.startsWith('Point')) {
      if (parent) {
        parent.points.push(item)
        parent.equipmentOrPoints.push(item)
      }
    }

    if (item.metadata.semantics.config && item.metadata.semantics.config.relatesTo) {
      if (parent) parent.properties.push(item)
      filteredItems.properties.push(item)
    }

    if (item.metadata.semantics.value.startsWith('Equipment')) {
      if (parent) {
        parent.equipment.push(item)
        parent.equipmentOrPoints.push(item)
      }
      filteredItems.equipment.push(item)
    }

    return item.modelPath
  }

  async function loadSemanticModel() {
    console.debug('Loading semantic model and building semantic homepages ...')
    api
      .get('/rest/items?staticDataOnly=true&metadata=semantics,listWidget,widgetOrder')
      .then((data: Item[]) => {
        const items: Item[] = data
        let filteredItems: FilteredItems = {
          equipment: [],
          properties: [],
          locations: []
        }

        // build model path for all model items
        items.forEach(item => {
          if (item.metadata && item.metadata.semantics) buildPathInModel(item, items, filteredItems)
        })

        // Sort each semantic model item children arrays (start at top-level nodes)
        data
          .filter(item => item.modelPath && item.modelPath.length === 0)
          .forEach(item => _sortModel(item))

        // get the location items
        locations.value = filteredItems.locations.sort(_compareObjects).map(item => {
          return {
            item: item,
            properties: item.points,
            defaultTitle: item.label || item.name,
            key: '',
            equipment: item.equipment
          }
        })

        // get the equipment items
        const equipmentItems = filteredItems.equipment
          .sort(_compareObjects)
          .reduce((prev: ReduceStruct, item, i, properties) => {
            const equipmentType = item.metadata.semantics.value
              .substring(item.metadata.semantics.value.lastIndexOf('_'))
              .replace('_', '')
            if (!prev[equipmentType]) prev[equipmentType] = []
            prev[equipmentType].push(item)
            return prev
          }, {})

        // get the property items
        const propertyItems = filteredItems.properties
          .sort(_compareObjects)
          .reduce((prev: ReduceStruct, item, i, properties) => {
            const property = item.metadata.semantics.config.relatesTo.split('_')[1]
            if (!prev[property]) prev[property] = []
            prev[property].push(item)
            return prev
          }, {})

        locations.value = lLocations.map(l => _buildModelCard('location', l, l.item.name))
        equipment.value = Object.keys(equipmentItems)
          .sort((a: string, b: string) => i18n.global.t(a).localeCompare(i18n.global.t(b)))
          .map(k => _buildModelCard('equipment', equipmentItems[k], k))
        properties.value = Object.keys(propertyItems)
          .sort((a: string, b: string) => i18n.global.t(a).localeCompare(i18n.global.t(b)))
          .map(k => _buildModelCard('property', propertyItems[k], k))

        return Promise.resolve()
      })
      .catch(e => {
        console.error('Error while loading model:')
        console.error(e)
        if (e === 'Unauthorized' || e === 401) {
          authorize()
        }
        error.value = e
        Promise.reject('Failed to load semantic model: ' + e)
      })
  }

  return { locations, equipment, property, loadSemanticModel }
})
