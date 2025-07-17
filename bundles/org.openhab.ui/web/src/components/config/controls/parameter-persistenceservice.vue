<template>
  <persistence-service-picker
    :title="configDescription.label"
    :value="value"
    @input="updateValue" />
</template>

<script>
import PersistenceServicePicker from './persistenceservice-picker.vue';

export default {
  props: ['configDescription', 'value'],
  emits: ['input'],
  components: {
    PersistenceServicePicker,
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value);
    },
  },
};
</script>
