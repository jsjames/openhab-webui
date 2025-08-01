import { defineStore } from 'pinia'
import { ref } from 'vue'

import api from '@/js/openhab/api'
import { i18n } from '@/js/i18n'
import { useRuntimeStore } from './runtime'

interface Tag {
  uid: string
  name: string
  parent: string
  label: string
  description: string
  synonyms: string
}

export const useSemanticsStore = defineStore('semantics', () => {
  const Locations = ref<string[]>([])
  const Equipment = ref<string[]>([])
  const Points = ref<string[]>([])
  const Properties = ref<string[]>([])
  const Labels = ref<{ [key: string]: string }>({})
  const Tags = ref<Tag[]>([])
  const Descriptions = ref<{ [key: string]: string }>({})
  const Synonyms = ref<{ [key: string]: string | string[] }>({})

  function setSemantics(tags: Tag[]) {
    Tags.value = tags
    Tags.value.forEach(tag => {
      const tagParts = tag.uid.split('_')
      tag.parent = tagParts.slice(0, -1).join('_')
    })
    Locations.value = tags.filter(t => t.uid.startsWith('Location')).map(t => t.name)
    Equipment.value = tags.filter(t => t.uid.startsWith('Equipment')).map(t => t.name)
    Points.value = tags.filter(t => t.uid.startsWith('Point')).map(t => t.name)
    Properties.value = tags.filter(t => t.uid.startsWith('Property')).map(t => t.name)
    // Clear existing labels, descriptions & synonyms
    Labels.value = {}
    Descriptions.value = {}
    Synonyms.value = {}
    // Store labels, descriptions & synonyms
    for (const i in tags) {
      const t = tags[i]
      Labels.value[t.name] = t.label || t.name
      Descriptions.value[t.name] = t.description || ''
      Synonyms.value[t.name] = t.synonyms || []
    }
    // Save labels as i18n messages
    i18n.global.mergeLocaleMessage(i18n.global.locale as string, Labels.value)
  }

  async function loadSemantics() {
    console.debug('Loading semantic tags ...')
    if (useRuntimeStore().apiEndpoint('tags')) {
      return api
        .get('/rest/tags')
        .then(tags => {
          setSemantics(tags)
          console.debug('Successfully loaded semantic tags.')
          return Promise.resolve()
        })
        .catch(e => {
          console.error('Failed to load semantic tags:')
          console.error(e)
          Promise.reject('Failed to load semantic tags: ' + e)
        })
    } else {
      return Promise.resolve()
    }
  }

  return { Locations, Equipment, Points, Properties, Labels, Tags, loadSemantics }
})
