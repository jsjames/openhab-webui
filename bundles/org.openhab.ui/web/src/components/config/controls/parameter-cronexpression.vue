<template>
  <ul>
    <f7-list-input
      :floating-label="theme.md"
      :label="configDescription.label"
      :name="configDescription.name"
      :value="value"
      :required="configDescription.required"
      validate
      :clear-button="!configDescription.required"
      @input="evt => updateValue(evt.target.value)"
      :error-message-force="exprError"
      type="text">
      <template #content-end>
        <div class="padding-left">
          <f7-button @click="openPopup">
            <f7-icon f7="calendar" /> Build
          </f7-button>
        </div>
      </template>
      <template #info>
        <div>
          {{ translation }}
        </div>
      </template>
    </f7-list-input>
  </ul>
</template>

<script>
import cronstrue from 'cronstrue'
import { f7, theme } from 'framework7-vue'

export default {
  props: {
    configDescription: Object,
    value: String,
    f7router: Object
  },
  emits: ['input'],
  data() {
    return {}
  },
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
    openPopup() {
      import(
        /* webpackChunkName: "cronexpression-editor" */ '@/components/config/controls/cronexpression-editor.vue'
      ).then(c => {
        const popup = {
          component: c.default
        }

        this.f7router.navigate(
          {
            url: 'cron-edit',
            route: {
              path: 'cron-edit',
              popup
            }
          },
          {
            props: {
              value: this.value
            }
          }
        )

        f7.once('cron-editor-update', this.updateValue)
        f7.once('cron-editor-closed', () => {
          f7.off('cron-editor-update', this.updateValue)
        })
      })
    }
  },
  computed: {
    translation() {
      try {
        const ret = cronstrue.toString(this.value, {
          use24HourTimeFormat: true
        })
        return ret
      } catch (err) {
        return err
      }
    },
    exprError() {
      return this.translation.indexOf('Error:') === 0
    }
  }
}
</script>
