<template>
  <div id="sidebar">
    <div class="sidebar-items upper">
      <router-link
        tag="div"
        class="sidebar-item"
        exact-active-class="selected"
        to="/unread"
      >
        <notification-bell
          :size="20"
          :count="nuggetsUnreadCount"
          :icon="require('@/assets/unread.svg')"
        />
        <p>Unread</p>
      </router-link>
      <div
        class="sidebar-item"
        @click="goToProjects"
        :class="{selected: $route.name && $route.name.match('Projects')}"
      >
        <simple-svg
          :filepath="require('@/assets/project.svg')"
          alt="Projects"
          class="icon"
        />
        <p>Projects</p>
      </div>
      <div
        class="sidebar-item"
        :class="{selected: $route.name && $route.name.match('Nuggets')}"
        :disabled="nuggetsIsDisabled"
        @click="goToNuggets"
      >
        <simple-svg
          :filepath="require('@/assets/issue.svg')"
          alt="Nuggets"
          class="icon"
        />
        <p>Nuggets</p>
      </div>
      <div
        class="sidebar-item"
        @click="activateRelease({release: selectedRelease})"
        :class="{selected: $route.name && $route.name === 'Releases'}"
      >
        <simple-svg
          :filepath="require('@/assets/rocket.svg')"
          alt="Releases"
          class="icon"
        />
        <p>Launches</p>
      </div>
    </div>
    <div class="sidebar-items lower">
      <router-link
        to="/settings"
        class="sidebar-item"
        active-class="selected"
        tag="div"
        :event="!$route.path.match(/\/settings.*/) ? 'click' : null"
      >
        <simple-svg
          :filepath="require('@/assets/settings.svg')"
          alt="Settings"
          class="icon"
        />
        <p>Settings</p>
      </router-link>
    </div>
    <!-- TODO: Add display mode later! -->
    <!-- <div class="display-type">
      <div
        class="view-mode"
        :class="{selected: viewMode === 'table'}"
        @click="changeViewMode"
      >
        <img
          src="./../assets/table.svg"
          class="view-mode-icon"
        />
      </div>
      <div
        class="theme"
        :class="{selected: theme === 'dark'}"
        @click="changeTheme"
      >
        <img
          src="./../assets/light-on.svg"
          class="theme-icon"w
          v-if="theme ==='light'"
        />
        <img
          src="./../assets/light-off.svg"
          class="theme-icon"
          v-if="theme === 'dark'"
        />
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import NotificationBell from 'vue-notification-bell'
import { websocket } from './../server.js'

export default {
  name: 'SideBar',
  data () {
    return {
      unreadFilter: {
        type: /^.+$/
      }
    }
  },
  computed: {
    nuggetsIsDisabled () {
      return !this.projects.length || !this.selectedProject
    },
    releasesUrl () {
      return {
        name: 'Releases',
        params: {
          releaseId: this.selectedRelease ? this.selectedRelease.id : null
        }
      }
    },
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNuggets',
      'releases',
      'projects',
      'nuggetsUnreadCount',
      'unreadCallbackAttached',
      'unreadNuggets',
      'Nugget',
      'unreadNuggetsViewState'
    ])
  },
  methods: {
    goToProjects () {
      if (!this.$route.name.match('Projects')) {
        this.activateRelease({ release: null, updateRoute: false })
        this.activateProject({ project: this.selectedProject })
      }
    },
    goToNuggets () {
      if (!this.nuggetsIsDisabled && !this.$route.name.match('Nuggets')) {
        this.activateRelease({ release: null, updateRoute: false })
        this.activateNugget({ nugget: this.selectedNuggets.length === 1 ? this.selectedNuggets[0] : null })
      }
    },
    async updateUnread (message) {
      if (!message.isMine) {
        let nugget = this.unreadNuggets.find(nugget => {
          return message.targetId === nugget.roomId
        })
        if (!nugget) {
          let response = await this.Nugget.load({ roomId: message.targetId }).send()
          if (response.models.length) {
            let unreadCount = this.unreadNuggets.length + 1
            if (this.unreadNuggets.length < this.unreadNuggetsViewState.pageSize) {
              this.setUnreadNuggets(this.unreadNuggets.concat(response.models[0]))
            }
            this.setNuggetsUnreadCount(unreadCount)
          }
        } else {
          nugget.reload().send()
        }
      }
    },
    ...mapMutations([
      'updateUnreadCallbackAttachment',
      'setUnreadNuggets',
      'setNuggetsUnreadCount'
    ]),
    ...mapActions([
      'activateProject',
      'activateRelease',
      'activateNugget',
      'listUnreadNuggets',
      'createNuggetClass'
    ])
  },
  watch: {
    'Nugget' (newValue) {
      this.listUnreadNuggets()
    }
  },
  mounted () {
    if (!this.unreadCallbackAttached) {
      websocket.registerCallback(this.unreadFilter, this.updateUnread)
      this.updateUnreadCallbackAttachment(true)
    }
  },
  beforeDestroy () {
    websocket.unregisterCallback(this.unreadFilter)
    this.updateUnreadCallbackAttachment(false)
  },
  components: {
    NotificationBell
  }
}
</script>
