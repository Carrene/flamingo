<template>
  <div id="home">
    <project-list v-if="selectedScope === 'Projects'"
                  :class="viewMode === 'table' ? 'wide-layout' : 'narrow-layout'"
    />
    <nugget-list v-if="selectedScope === 'Nuggets'"
                 :class="viewMode === 'table' ? 'wide-layout' : 'narrow-layout'"
    />
    <div :class="['chat-container', viewMode === 'table' ? 'narrow-chat' : 'wide-chat']">

      <!-- CHAT HEADER -->

      <div class="header">
        <div class="search">
          <img src="../assets/search.svg" class="search-icon" @click="showSearchResult = !showSearchResult"/>
          <input type="text" placeholder="SEARCH" class="primary-input">

          <div class="notification">
            <img src="../assets/notification.svg" class="notification-icon"/>
            <div class="notification-counter" v-if="notification">{{ setNotification }}</div>
          </div>
        </div>
        <div class="avatar" @click="showMenuTooltip = !showMenuTooltip">
          <img src="../assets/avatar.svg" class="pic online"/>

          <!-- FIXME: Add this after role has been added to users -->
          <!--<img :src="roleImgSrc" class="role-icon"/>-->

          <!-- MENU TOOLTIP -->

          <div class="tooltip-container" v-if="showMenuTooltip">
            <div class="menu-container">
              <div class="profile">
                <label class="name-label">{{ auth.member.name }}</label>
                <label class="email-label">{{ auth.member.email }}</label>
              </div>
              <div class="menu-items">
                <img src="../assets/settings.svg" class="menu-icons">
                <div>Setting</div>
              </div>
              <div class="menu-items">
                <img src="../assets/help.svg" class="menu-icons">
                <div>Help</div>
              </div>
              <div class="menu-items" @click="logout">
                <img src="../assets/logout.svg" class="menu-icons">
                <div>logout</div>
              </div>
            </div>
          </div>
        </div>

        <!-- SEARCH RESULT -->

        <div class="search-result" v-if="showSearchResult">
          <div class="field">Images</div>
          <div class="field">Files</div>
          <div class="field">Conversation</div>
          <div class="field">Event Log</div>
          <div class="field">Members</div>
        </div>
      </div>

      <!-- CHAT -->

      <!--<chat v-if="roomId"-->
            <!--:authenticator="auth"-->
            <!--:url="JAGUAR_BASE_URL"-->
            <!--:roomId="roomId"-->
      <!--/>-->

      <!-- PICTURE -->
      <div class="new-project-mode" >
        <img src="../assets/new-project.svg" class="img">
        <div class="text">
          <p class="first-line-text">Get Created</p>
          <p class="second-line-text">create your project for better future</p>
        </div>
      </div>
    </div>
    <home-right-column/>
  </div>
</template>

<script>
import Vue from 'vue'
import ProjectList from '../components/ProjectList'
import NuggetList from '../components/NuggetList'
import HomeRightColumn from '../components/HomeRightColumn'
import Components from '@carrene/chatbox'
import { mapState, mapActions } from 'vuex'
import server from '../server'
import { JAGUAR_BASE_URL } from '../settings'
Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})
export default {
  name: 'Home',
  data () {
    return {
      auth: server.authenticator,
      showSearchResult: false,
      showMenuTooltip: null,
      // TODO: Change all data to dynamic
      notification: null,
      JAGUAR_BASE_URL,
      // FIXME: remove this variable
      roomId: null
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
    ...mapState([
      'viewMode',
      'selectedProject',
      'selectedScope'
    ])
  },
  watch: {
    // FIXME: this must be revised
    'selectedProject.id' (newValue) {
      if (newValue) {
        if (!this.selectedProject.isSubscribed) {
          this.selectedProject.subscribe().send().then(resp => {
            this.roomId = resp.models[0].roomId
          })
        } else {
          this.roomId = this.selectedProject.roomId
        }
        this.listNuggets()
      } else {
        this.roomId = null
      }
    }
  },
  methods: {
    logout () {
      server.logout()
      this.$router.push('/login')
    },
    ...mapActions([
      'listProjects',
      'listNuggets',
      'listReleases'
    ])
  },
  mounted () {
    this.listProjects()
    this.listReleases()
  },
  components: {
    ProjectList,
    NuggetList,
    HomeRightColumn,
    ...Components
  }
}
</script>
