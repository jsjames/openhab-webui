<template>
  <div :id="id" class="masonry-grid-item">
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore   TODO-V3
import { utils } from 'framework7'
const id = utils.id()
</script>
