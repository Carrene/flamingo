<template>
  <div id="auditLog">
    <div class="header">
    </div>
    <chat
      v-if="activeRoomId"
      :authenticator="auth"
      :url="JAGUAR_BASE_URL"
      :roomId="activeRoomId"
      :websocketURL="JAGUAR_WEBSOCKET_URL"
      :grid="true"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import server from '../server'
import { mapGetters } from 'vuex'
import { JAGUAR_BASE_URL, JAGUAR_WEBSOCKET_URL } from '../settings'
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
      JAGUAR_WEBSOCKET_URL
    }
  },
  computed: {
    ...mapGetters([
      'activeRoomId'
    ])
  },
  components: {
    ...Components
  }
}
</script>
