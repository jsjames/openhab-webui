import { f7 } from 'framework7-vue'

export default {
  data() {
    return {
      dirty: false
    }
  },
  computed: {
    dirtyIndicator() {
      if (this.dirty) {
        return ' ●' // &#9679;
      }
      return ''
    }
  },
  methods: {
    confirmLeaveWithoutSaving(callbackLeave, callbackCancel) {
      f7.dialog.confirm(
        'Do you want to leave this page without saving?',
        'Changes have not been saved',
        callbackLeave,
        callbackCancel
      )
    },
    beforeLeave(context) {
      if (this.dirty) {
        this.confirmLeaveWithoutSaving(
          function () {
            context.resolve()
          },
          function () {
            const { pushStateRoot = '', pushStateSeparator } = context.router.params
            let url = context.routeFrom.url
            history.pushState({ view_main: { url } }, '', pushStateRoot + pushStateSeparator + url)
            context.reject()
            context.router.allowPageChange = true
          }
        )
      } else {
        context.resolve()
      }
    },
    switchTab(tab, onSuccessCallback) {
      if (this.currentTab !== tab) {
        this.currentTab = tab
        if (onSuccessCallback) {
          onSuccessCallback()
        }
      }
    }
  }
}
