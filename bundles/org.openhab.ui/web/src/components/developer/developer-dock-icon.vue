<template>
  <f7-link
    v-if="iconVisible && runtimeStore.developerDock"
    icon-f7="question_circle_fill"
    @click="f7.emit('toggle-developer-dock')" />
  <f7-link
    v-else-if="iconVisible"
    icon-f7="question_circle"
    @click="f7.emit('select-developer-dock', { dock: 'help', helpTab: 'current' })" />
</template>

<script>
import { f7 } from 'framework7-vue'
import { useUserStore } from '@/js/stores/user'
import { useRuntimeStore } from '@/js/stores/runtime'
import { mapStores } from 'pinia'

export default {
  data() {
    return {
      f7
    }
  },
  computed: {
    iconVisible() {
      return useUserStore().isAdmin() && f7.width >= 1280
    },
    ...mapStores(useRuntimeStore)
  }
}
</script>
