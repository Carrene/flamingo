<template>
  <div id="eventLog">
    <div class="header">
      <avatar />
    </div>
    <chat
      ref="eventLog"
      :authenticator="auth"
      :url="JAGUAR_BASE_URL"
      :roomId="roomId"
      :grid="true"
    />
  </div>
</template>

<script>
import server, { websocket } from '../server'
import { mapState, mapMutations } from 'vuex'
import { JAGUAR_BASE_URL } from '../settings'
import Chat from '@carrene/chatbox'
// import server from './../server'
const Avatar = () => import(
  /* webpackChunkName: "Avarat" */ '../components/Avatar'
)

export default {
  name: 'EventLog',
  data () {
    return {
      auth: server.authenticator,
      JAGUAR_BASE_URL,
      eventFilter: {
        mimetype: /^application\/x-auditlog$/,
        type: /message/
      }
    }
  },
  computed: {
    ...mapState([
      'roomId',
      'eventLogCallbackAttached',
      'selectedNuggets'
    ])
  },
  methods: {
    ...mapMutations([
      'attachEventLogCallback'
    ])
  },
  mounted () {
    if (!this.eventLogCallbackAttached) {
      websocket.registerCallback(this.eventFilter, this.$refs.eventLog.dispatchMessage)
      this.attachEventLogCallback()
    }
  },
  beforeDestroy () {
    if (this.selectedNuggets.length === 1) {
      this.selectedNuggets[0].getUnreadEventLogCount()
    }
  },
  components: {
    Chat,
    Avatar
  }
}
</script>
