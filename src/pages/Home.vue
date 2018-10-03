<template>
  <div id="home" v-if="viewMode === 'chat'">
    <home-left-column />
    <div class="chat-container">
      <div class="header">
        <div class="search">
          <img src="../assets/search.svg" class="search-icon" @click="showSearchResult = !showSearchResult"/>
          <input type="text" placeholder="SEARCH" class="primary-input">
          <div :class="notification ? 'notification' : null">
            <img src="../assets/notification.svg" class="notification-icon"/>
          </div>
        </div>
        <div class="avatar" >
          <img src="../assets/avatar.svg" class="pic online"/>

          <!--'ROLE' DOES NOT EXIST IN BACKEND YET-->
          <!--<img :src="roleImgSrc" class="role-icon"/>-->

        </div>
        <div class="search-result" v-if="showSearchResult">
          <div class="field">Images</div>
          <div class="field">Files</div>
          <div class="field">Conversation</div>
          <div class="field">Event Log</div>
          <div class="field">Members</div>
        </div>
      </div>

      <!--CHAT-->

      <chat v-if="selectedProject.id"
            :authenticator="auth"
            :url="JAGUAR_BASE_URL"
            :roomId="selectedProject.roomId"
      />
      <div class="picture"  v-if="!selectedProject.id">
        <img src="../assets/new-project-picture.svg" class="img">
      </div>
    </div>
    <home-right-column/>
  </div>
</template>

<script>
import Vue from 'vue'
import HomeLeftColumn from '../components/HomeLeftColumn'
import HomeRightColumn from '../components/HomeRightColumn'
import Components from '@carrene/chatbox'
import { mapState, mapActions } from 'vuex'
import { maestroAuthenticator } from '../server'
import { JAGUAR_BASE_URL } from '../settings'

Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})

export default {
  name: 'Home',
  data () {
    return {
      auth: maestroAuthenticator,
      showSearchResult: false,
      showRightColumn: false,
      // TODO: Change all data to dynamic
      notification: true,
      JAGUAR_BASE_URL
    }
  },
  watch: {
    'selectedProject' (newValue) {
      if (newValue) {
        this.showRightColumn = true
      }
    }
  },
  computed: {
    // FIXME: 'ROLE' DOES NOT EXIST IN BACKEND YET
    // roleImgSrc () {
    //   return require(`./../assets/${this.auth.member.roles[0]}.svg`)
    // },
    ...mapState([
      'viewMode', 'selectedProject'
    ])
  },
  methods: {
    ...mapActions(['listProjects'])
  },
  mounted () {
    this.listProjects()
  },
  components: {
    HomeLeftColumn,
    HomeRightColumn,
    ...Components
  }
}
</script>
