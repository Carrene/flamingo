<template>
  <div id="home">
    <router-view></router-view>
    <div class="chat-container">

      <!-- CHAT HEADER -->

      <div class="header">
        <div class="avatar small">
          <img
            class="pic"
            :src="auth.member.avatar"
            v-if="auth.member.avatar"
            @click="toggleMenuTooltip"
          >
          <simple-svg
            v-else
            :filepath="require('./../assets/profile-default-picture.svg')"
            :fill="'#FFF'"
            class="pic"
            @click.native="toggleMenuTooltip"
          />

          <!-- FIXME: Add this after role has been added to users -->
          <!--<img :src="roleImgSrc" class="icon"/>-->

          <!-- MENU TOOLTIP -->

          <div
            class="tooltip-container center profile"
            v-if="showMenuTooltip"
            v-on-clickout="toggleMenuTooltip.bind(undefined, false)"
          >
            <div class="tooltip-header">
              <label class="name-label">{{ auth.member.name }}</label>
              <label class="email-label">{{ auth.member.email }}</label>
            </div>
            <div class="tooltip-content">
              <div class="menu-item">
                <img
                  src="../assets/settings.svg"
                  class="menu-icons"
                >
                <router-link
                  to="/settings"
                  tag="div"
                >Settings</router-link>
              </div>
              <div class="menu-item">
                <img
                  src="../assets/help.svg"
                  class="menu-icons"
                >
                <div>Help</div>
              </div>
              <div
                class="menu-item"
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
          src="../assets/new-project.svg"
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
import Vue from 'vue'
import Components from '@carrene/chatbox'
import { mapState, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server, { websocket } from '../server'
import { JAGUAR_BASE_URL } from '../settings'
import ViewState from '../view-state'
Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})
const ProjectList = () => import(
  /* webpackChunkName: "ProjectList" */ '../components/ProjectList'
)
const NuggetList = () => import(
  /* webpackChunkName: "NuggetList" */ '../components/NuggetList'
)
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
      showMenuTooltip: false,
      JAGUAR_BASE_URL,
      messageFilter: {
        mimetype: /(?:^image\/.+$)|(?:^text\/plain$)|(?:^application\/(?!.*(x-auditlog)))/,
        type: /message/
      }
    }
  },
  computed: {
    // FIXME: 'ROLE' DOES NOT EXIST IN BACKEND YET
    // roleImgSrc () {
    //   return require(`./../assets/${this.auth.member.roles[0]}.svg`)
    // },
    activeRoomId () {
      if (this.$route.name.match('Projects') && this.selectedProject) {
        return this.selectedProject.roomId
      }
      if (this.$route.name.match(/Nuggets|Unread/) && this.selectedNugget) {
        return this.selectedNugget.roomId
      }
      return null
    },
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNugget',
      'releases',
      'projects',
      'nuggetsOfSelectedProject',
      'roomId',
      'chatboxCallbackAttached'
    ])
  },
  watch: {
    // Checking the url params to set the correct global selectedRelease on clicking on back and forward buttons
    // '$route.params.releaseId' (newValue) {
    //   if (newValue && parseInt(newValue) !== this.selectedRelease.id) {
    //     this.selectRelease(this.releases.find(release => {
    //       return release.id === parseInt(newValue)
    //     }))
    //   } else if (!newValue) {
    //     this.selectRelease(null)
    //   }
    // },
    // Checking the url params to set the correct global selectedProject on clicking on back and forward buttons
    // '$route.params.projectId' (newValue) {
    //   if (newValue && parseInt(newValue) !== this.selectedProject.id) {
    //     this.selectProject(this.projects.find(project => {
    //       return project.id === parseInt(newValue)
    //     }))
    //   } else if (!newValue) {
    //     this.selectProject(null)
    //   }
    // },
    // Checking the url params to set the correct global selectedNugget on clicking on back and forward buttons
    // '$route.params.nuggetId' (newValue) {
    //   if (newValue && parseInt(newValue) !== this.selectedNugget.id) {
    //     this.selectNugget(this.nuggetsOfSelectedProject.find(nugget => {
    //       return nugget.id === parseInt(newValue)
    //     }))
    //   } else if (!newValue) {
    //     this.selectNugget(null)
    //   }
    // },
    'activeRoomId': {
      immediate: true,
      handler (newValue) {
        this.setRoomId(newValue)
        if (newValue && !this.chatboxCallbackAttached) {
          this.$nextTick(() => {
            websocket.registerCallback(this.messageFilter, this.$refs.chat.dispatchMessage)
            this.attachChatboxCallback()
          })
        }
      }
    },
    'selectedProject.id' () {
      this.setNuggetsViewState(new ViewState({}))
    },
    'selectedRelease.id' () {
      this.setProjectsViewState(new ViewState({}))
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
    ...mapMutations([
      'selectRelease',
      'selectProject',
      'selectNugget',
      'setRoomId',
      'attachChatboxCallback',
      'setProjectsViewState',
      'setNuggetsViewState'
    ])
  },
  components: {
    ProjectList,
    NuggetList,
    HomeRightColumn,
    ...Components
  }
}
</script>
