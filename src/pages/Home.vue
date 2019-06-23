<template>
  <div id="home">
    <router-view></router-view>
    <div class="chat-container">

      <!-- CHAT HEADER -->

      <div class="header">

        <!-- SEARCH RESULT -->

        <div
          class="search-result"
          v-if="showSearchResult"
          v-on-clickout="toggleSearchResult.bind(undefined, false)"
        >
          <div class="field">Images</div>
          <div class="field">Files</div>
          <div class="field">Conversation</div>
          <div class="field">Event Log</div>
          <div class="field">Members</div>
        </div>
      </div>

      <!-- CHAT -->

      <chat
        v-if="roomId"
        ref="chat"
        :authenticator="auth"
        :url="JAGUAR_BASE_URL"
        :roomId="roomId"
      />

      <!-- PICTURE -->

      <div
        class="new-project-mode"
        v-else-if="!roomId"
      >
        <img
          src="../assets/new-project-icon.svg"
          class="img"
        >
        <div class="text">
          <p class="first-line-text">Create</p>
          <p class="second-line-text">Select an entity or create one</p>
        </div>
      </div>
    </div>
    <home-right-column />
  </div>
</template>

<script>
import Chat from '@carrene/chatbox'
import { mapState, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server, { websocket } from '../server'
import { JAGUAR_BASE_URL } from '../settings'
import { updateFromEvent } from './../helpers.js'
const HomeRightColumn = () => import(
  /* webpackChunkName: "HomeRightColumn" */ '../components/HomeRightColumn'
)

export default {
  mixins: [clickout],
  name: 'Home',
  data () {
    return {
      auth: server.authenticator,
      showSearchResult: false,
      JAGUAR_BASE_URL,
      messageFilter: {
        mimetype: /^(?!(application\/x-auditlog)).*$/,
        type: /message/
      },
      seenMessageFilter: {
        mimetype: /^(?!(application\/x-auditlog)).*$/,
        type: /seen/
      },
      eventFilter: {
        mimetype: /^application\/x-auditlog$/
      }
    }
  },
  computed: {
    // FIXME: 'ROLE' DOES NOT EXIST IN BACKEND YET
    // roleImgSrc () {
    //   return require(`./../assets/${this.auth.member.roles[0]}.svg`)
    // },
    activeRoomId () {
      if (this.$route.name.match(/^Projects$/) && this.selectedProject) {
        return this.selectedProject.roomId
      }
      if (this.$route.name.match(/^(Nuggets|Unread|Subscribed)$/) && this.selectedNuggets.length === 1) {
        return this.selectedNuggets[0].roomId
      }
      if (this.$route.name.match(/^Releases$/) && this.selectedRelease) {
        return this.selectedRelease.roomId
      }
      if (this.$route.path.match(/assigned|need-approval|missing-estimate|missing-hours/) && this.selectedItem) {
        return this.selectedItem.issue.roomId
      }
      if (this.$route.path.match(/assigned|triage|backlog|expired-triage/) && this.selectedNuggets.length === 1) {
        return this.selectedNuggets[0].roomId
      }
      return null
    },
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNuggets',
      'roomId',
      'nuggetsOfSelectedProject',
      'unreadNuggets',
      'subscribedNuggets',
      'selectedItem'
    ])
  },
  watch: {
    'activeRoomId': {
      immediate: true,
      handler (newValue) {
        this.setRoomId(newValue)
        if (newValue) {
          websocket.unregisterCallback(this.messageFilter)
          websocket.unregisterCallback(this.seenMessageFilter)
          websocket.unregisterCallback(this.eventFilter)
          this.$nextTick(() => {
            websocket.registerCallback(this.messageFilter, this.$refs.chat.dispatchMessage)
            websocket.registerCallback(this.seenMessageFilter, this.$refs.chat.updateSeen)
            websocket.registerCallback(this.eventFilter, this.updateUnreadEventCount)
          })
        }
      }
    }
  },
  methods: {
    toggleSearchResult (value) {
      if (typeof value === 'boolean') {
        this.showSearchResult = value
      } else {
        this.showSearchResult = !this.showSearchResult
      }
    },
    async updateUnreadEventCount (message) {
      await updateFromEvent(this.nuggetsOfSelectedProject, message)
      if (this.selectedNuggets.length === 1) {
        this.selectedNuggets[0].getUnreadEventLogCount()
      }
    },
    ...mapMutations([
      'setRoomId'
    ])
  },
  components: {
    HomeRightColumn,
    Chat
  }
}
</script>
