<template>
  <div id="auditLog">
    <div class="header">
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
import Vue from 'vue'
import server, { websocket } from '../server'
import { mapState, mapMutations } from 'vuex'
import { JAGUAR_BASE_URL } from '../settings'
import Components from '@carrene/chatbox'
// FIXME: Change this after changing chatbox
Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})
// import server from './../server'

export default {
  name: 'EventLog',
  data () {
    return {
      auth: server.authenticator,
      JAGUAR_BASE_URL,
      eventFilter: {
        mimetype: /^application\/x-auditlog$/
      }
    }
  },
  computed: {
    ...mapState([
      'roomId',
      'eventLogCallbackAttached'
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
  components: {
    ...Components
  }
}
</script>
