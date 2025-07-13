import reloadMixin from './reload-mixin'
import { f7, f7ready } from 'framework7-vue'

import { useStatesStore } from '@/js/stores/useStatesStore'

let unsubscribeAction = null
let unsubscribeMutation = null

export default {
  mixins: [reloadMixin],
  data () {
    return {
      // For the communication failure toast
      communicationFailureToast: null,
      communicationFailureTimeoutId: null,
      // For the communication failure page
      communicationFailureMsg: null
    }
  },
  methods: {
    /**
     * Creates and opens a toast message that indicates a failure, e.g. of SSE connection
     * @param {string} message message to show
     * @param {boolean} [reloadButton=false] displays a reload button
     * @param {boolean} [autoClose=true] closes toast automatically
     * @returns {Toast.Toast}
     */
    displayFailureToast (message, reloadButton = false, autoClose = true) {
      const toast = f7.toast.create({
        text: message,
        closeButton: reloadButton,
        closeButtonText: this.$t('dialogs.reload'),
        destroyOnClose: true,
        closeTimeout: (autoClose) ? 5000 : undefined,
        cssClass: 'failure-toast button-outline',
        position: 'bottom',
        horizontalPosition: 'center'
      })
      toast.on('closeButtonClick', () => {
        this.reload()
      })
      toast.open()
      return toast
    }
  },
  created () {
    this.checkPurgeServiceWorkerAndCachesAvailable()
  },
  mounted () {
    f7ready((f7) => {
      //TODO-V3 - finish implementing in pinia
      unsubscribeMutation = useStatesStore().$subscribe((mutation, state) => {
        if (!(this.ready && !window.OHApp && f7)) {
          // mutation.type === 'sseConnected' is used to avoid the initial call
          return
        }
        if (state.sseConnected === false) {
          if (this.communicationFailureToast === null) {
            this.communicationFailureTimeoutId = setTimeout(() => {
              if (this.communicationFailureToast !== null) return
              this.communicationFailureToast = this.displayFailureToast(
                this.$t('error.communicationFailure'),
                true,
                false
              )
              this.communicationFailureTimeoutId = null
            }, 1000)
          }
        } else if (state.sseConnected === true) {
          if (this.communicationFailureTimeoutId !== null)
            clearTimeout(this.communicationFailureTimeoutId)
          if (this.communicationFailureToast !== null) {
            this.communicationFailureToast.close()
            this.communicationFailureToast = null
          }
        }
      })
    })

    // TODO-V3 - test
    unsubscribeAction = useStatesStore().$onAction(
      ({
        name, // name of the action
        store, // store instance, same as `someStore`
        args, // array of parameters passed to the action
        after, // hook after the action returns or resolves
        onError // hook if the action throws or rejects
      }) => {
        onError((error) => {
          if (name === 'sendCommand') {
            let reloadButton = true
            let msg = this.$t('error.communicationFailure')
            switch (error) {
              case 404:
              case 'Not Found':
                msg = this.$t('error.itemNotFound').replace('%s', action.payload.itemName)
                reloadButton = false
                return this.displayFailureToast(msg, reloadButton)
            }
            if (this.communicationFailureToast === null) {
              this.communicationFailureToast = this.displayFailureToast(
                this.$t('error.communicationFailure'),
                true,
                true
              )
              this.communicationFailureToast.on('closed', () => {
                this.communicationFailureToast = null
              })
            }
          }
        })
      }
    )
  },
  unmounted () {
    if (unsubscribeMutation) {
      unsubscribeMutation()
      unsubscribeMutation = null
    }
    if (unsubscribeAction) {
      unsubscribeAction()
      unsubscribeAction = null
    }
  }
}
