<template>
  <div :id="id" class="masonry-grid-item">
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
const id = crypto.randomUUID()
</script>
