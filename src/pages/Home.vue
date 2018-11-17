<template>
  <div id="home">
    <router-view :class="viewMode === 'table' ? 'wide-layout' : 'narrow-layout'"></router-view>
    <div
      :class="viewMode === 'table' ? 'narrow-chat' : 'wide-chat'"
      class="chat-container"
    >

      <!-- CHAT HEADER -->

      <div class="header">
        <div class="search">
          <img
            src="../assets/search.svg"
            class="search-icon"
            @click="toggleSearchResult"
          />
          <div class="input-container">
            <input
              type="text"
              placeholder="SEARCH"
              class="primary-input"
            >
          </div>

          <div class="notification">
            <img
              src="../assets/notification.svg"
              class="notification-icon"
            />
            <div
              class="notification-counter"
              v-if="notification"
            >{{ setNotification }}</div>
          </div>
        </div>
        <div class="avatar">
          <img
            src="../assets/avatar.svg"
            class="pic online"
            @click="toggleMenuTooltip"
          />

          <!-- FIXME: Add this after role has been added to users -->
          <!--<img :src="roleImgSrc" class="role-icon"/>-->

          <!-- MENU TOOLTIP -->

          <div
            class="tooltip-container"
            v-if="showMenuTooltip"
            v-on-clickaway="toggleMenuTooltip.bind(undefined, false)"
          >
            <div class="menu-container">
              <div class="profile">
                <label class="name-label">{{ auth.member.name }}</label>
                <label class="email-label">{{ auth.member.email }}</label>
              </div>
              <div class="menu-items">
                <img
                  src="../assets/settings.svg"
                  class="menu-icons"
                >
                <div>Setting</div>
              </div>
              <div class="menu-items">
                <img
                  src="../assets/help.svg"
                  class="menu-icons"
                >
                <div>Help</div>
              </div>
              <div
                class="menu-items"
                @click="logout"
              >
                <img
                  src="../assets/logout.svg"
                  class="menu-icons"
                >
                <div>logout</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH RESULT -->

        <div
          class="search-result"
          v-if="showSearchResult"
          v-on-clickaway="toggleSearchResult.bind(undefined, false)"
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
        v-if="activeRoom.roomId && activeRoom.isSubscribed"
        :authenticator="auth"
        :url="JAGUAR_BASE_URL"
        :roomId="activeRoom.roomId"
      />

      <!-- PICTURE -->

      <div
        class="new-container-mode"
        v-else-if="!activeRoom.roomId"
      >
        <img
          src="../assets/new-container.svg"
          class="img"
        >
        <div class="text">
          <p class="first-line-text">Get Created</p>
          <p class="second-line-text">create your container for better future</p>
        </div>
      </div>

      <div
        class="not-subscribed-mode"
        v-else-if="!activeRoom.isSubscribed"
      >
        <img
          src="../assets/unsubscribe.svg"
          class="img"
        >
        <div class="text">
          <p class="first-line-text">Limited access</p>
          <p class="second-line-text">You can't see chat room for this nugget, because you don't subscribe this nugget</p>
        </div>
      </div>
    </div>
    <home-right-column />
  </div>
</template>

<script>
import Vue from 'vue'
import ContainerList from '../components/ContainerList'
import NuggetList from '../components/NuggetList'
import HomeRightColumn from '../components/HomeRightColumn'
import Components from '@carrene/chatbox'
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickaway } from 'vue-clickaway'
import server from '../server'
import { JAGUAR_BASE_URL } from '../settings'
Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})
export default {
  mixins: [clickaway],
  name: 'Home',
  data () {
    return {
      auth: server.authenticator,
      showSearchResult: false,
      showMenuTooltip: false,
      // TODO: Change all data to dynamic
      notification: null,
      JAGUAR_BASE_URL
    }
  },
  computed: {
    // FIXME: 'ROLE' DOES NOT EXIST IN BACKEND YET
    // roleImgSrc () {
    //   return require(`./../assets/${this.auth.member.roles[0]}.svg`)
    // },
    setNotification () {
      if (this.notification < 50) {
        return this.notification
      } else {
        return '+50'
      }
    },
    activeRoom () {
      let roomObject = {
        roomId: null,
        isSubscribed: false
      }
      if (this.$route.name === 'Containers') {
        if (this.selectedContainer) {
          roomObject.roomId = this.selectedContainer.roomId
          roomObject.isSubscribed = this.selectedContainer.isSubscribed
        }
      } else if (this.$route.name === 'Nuggets') {
        if (this.selectedNugget) {
          roomObject.roomId = this.selectedNugget.roomId
          roomObject.isSubscribed = this.selectedNugget.isSubscribed
        }
      }
      return roomObject
    },
    ...mapState([
      'viewMode',
      'selectedContainer',
      'selectedNugget',
      'nuggetsOfSelectedContainer',
      'containers'
    ])
  },
  watch: {
    // FIXME: this must be revised
    'selectedContainer.id' (newValue) {
      if (newValue) {
        if (!this.selectedContainer.isSubscribed) {
          this.selectedContainer.subscribe().send()
        }
      }
    },
    // Checking the url params to set the correct global selectedContainer on clicking on back and forward buttons
    '$route.params.containerId' (newValue) {
      if (newValue && parseInt(newValue) !== this.selectedContainer.id) {
        debugger
        this.selectContainer(this.containers.find(container => {
          return container.id === parseInt(newValue)
        }))
      } else if (!newValue) {
        this.clearSelectedContainer()
      }
    },
    // Checking the url params to set the correct global selectedNugget on clicking on back and forward buttons
    '$route.params.nuggetId' (newValue) {
      if (newValue && parseInt(newValue) !== this.selectedNugget.id) {
        debugger
        this.selectNugget(this.nuggetsOfSelectedContainer.find(nugget => {
          return nugget.id === parseInt(newValue)
        }))
      } else if (!newValue) {
        this.clearSelectedNugget()
      }
    }
  },
  methods: {
    logout () {
      server.logout()
      this.$router.push('/login')
    },
    toggleMenuTooltip (value) {
      if (typeof value === 'boolean') {
        this.showMenuTooltip = value
      } else {
        this.showMenuTooltip = !this.showMenuTooltip
      }
    },
    toggleSearchResult (value) {
      if (typeof value === 'boolean') {
        this.showSearchResult = value
      } else {
        this.showSearchResult = !this.showSearchResult
      }
    },
    ...mapActions([
      'listReleases',
      'getContainer'
    ]),
    ...mapMutations([
      'clearSelectedContainer',
      'clearSelectedNugget',
      'selectNugget',
      'selectCotainer'
    ])
  },
  mounted () {
    this.listReleases([])
  },
  components: {
    ContainerList,
    NuggetList,
    HomeRightColumn,
    ...Components
  }
}
</script>
