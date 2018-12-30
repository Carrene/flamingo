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
        v-if="activeRoom.roomId"
        :authenticator="auth"
        :url="JAGUAR_BASE_URL"
        :roomId="activeRoom.roomId"
      />

      <!-- PICTURE -->

      <div
        class="new-project-mode"
        v-else-if="!activeRoom.roomId"
      >
        <img
          src="../assets/new-project.svg"
          class="img"
        >
        <div class="text">
          <p class="first-line-text">Create</p>
          <p class="second-line-text">Select a {{ $route.name === 'Projects' ? 'project' : 'nugget' }} or create one</p>
        </div>
      </div>
    </div>
    <home-right-column />
  </div>
</template>

<script>
import Vue from 'vue'
import Components from '@carrene/chatbox'
import { mapState, mapActions, mapMutations } from 'vuex'
import { mixin as clickout } from 'vue-clickout'
import server from '../server'
import { JAGUAR_BASE_URL } from '../settings'
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
      if (this.$route.name === 'Projects') {
        if (this.selectedProject) {
          roomObject.roomId = this.selectedProject.roomId
          roomObject.isSubscribed = this.selectedProject.isSubscribed
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
      'selectedProject',
      'selectedNugget',
      'nuggetsOfSelectedProject',
      'projects'
    ])
  },
  watch: {
    // FIXME: this must be revised
    'selectedProject.id' (newValue) {
      if (newValue) {
        if (!this.selectedProject.isSubscribed) {
          this.selectedProject.subscribe().send()
        }
      }
    },
    // Checking the url params to set the correct global selectedProject on clicking on back and forward buttons
    '$route.params.projectId' (newValue) {
      if (newValue && parseInt(newValue) !== this.selectedProject.id) {
        this.selectProject(this.projects.find(project => {
          return project.id === parseInt(newValue)
        }))
      } else if (!newValue) {
        this.clearSelectedProject()
      }
    },
    // Checking the url params to set the correct global selectedNugget on clicking on back and forward buttons
    '$route.params.nuggetId' (newValue) {
      if (newValue && parseInt(newValue) !== this.selectedNugget.id) {
        this.selectNugget(this.nuggetsOfSelectedProject.find(nugget => {
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
      'listWorkflows'
    ]),
    ...mapMutations([
      'clearSelectedProject',
      'clearSelectedNugget',
      'selectNugget',
      'selectProject'
    ])
  },
  mounted () {
    this.listReleases([])
    this.listWorkflows([])
  },
  components: {
    ProjectList,
    NuggetList,
    HomeRightColumn,
    ...Components
  }
}
</script>
