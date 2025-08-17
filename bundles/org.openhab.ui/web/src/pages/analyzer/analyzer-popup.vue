<template>
  <f7-popup tablet-fullscreen
            :backdrop="false"
            class="analyzer-popup"
            @popup:close="$refs.analyzer.onClose()">
    <analyzer ref="analyzer" />
  </f7-popup>
</template>

<script>
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    analyzer: defineAsyncComponent(() => import(/* webpackChunkName: "analyzer" */ './analyzer.vue'))
  }
}
</script>
