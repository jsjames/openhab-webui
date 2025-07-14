<template>
  <f7-link
    v-if="iconVisible && $store.state.developerDock"
    icon-f7="question_circle_fill"
    @click="f7.emit('toggleDeveloperDock')"
  />
  <f7-link
    v-else-if="iconVisible"
    icon-f7="question_circle"
    @click="f7.emit('selectDeveloperDock', { dock: 'help', helpTab: 'current' })"
  />
</template>

<script>
import { f7 } from 'framework7-vue';

export default {
  data() {
    return {
      f7,
    };
  },
  computed: {
    iconVisible() {
      return this.$store.getters.isAdmin && f7.width >= 1280;
    },
  },
};
</script>
