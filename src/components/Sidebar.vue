<template>
  <div id="sidebar">
    <div class="sidebar-items upper">
      <div
        class="sidebar-item"
        :class="{selected: $route.name && $route.name.match('Unread')}"
        @click="goToUnread"
      >
        <notification-bell
          :size="24"
          :count="nuggetsUnreadCount"
          :icon="require('@/assets/unread.svg')"
          counterBackgroundColor="#D82929"
        />
        <p>Unread</p>
      </div>
      <div
        class="sidebar-item"
        :class="{selected: $route.name && $route.name.match('Subscribed')}"
        @click="goToSubscribed"
      >
        <simple-svg
          :filepath="require('@/assets/subscribed.svg')"
          alt="Subscribed"
          class="icon"
        />
        <p>Subscribed</p>
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
        @click="[activateRelease({release: selectedRelease}), setCurrentTab('Releases')]"
        :class="{selected: $route.name && $route.name === 'Releases'}"
      >
        <simple-svg
          :filepath="require('@/assets/rocket.svg')"
          alt="Releases"
          class="icon"
        />
        <p>Releases</p>
      </div>

    </div>

    <div class="sidebar-items lower">
      <router-link
        to="/assigned"
        class="sidebar-item"
        active-class="selected"
        tag="div"
        :event="!$route.path.match(/\/assigned.*/) ? 'click' : null"
      >
        <notification-bell
          :size="24"
          :count="totalItemCount"
          :icon="require('@/assets/assign.svg')"
          counterBackgroundColor="#D82929"
          class="icon"
        />
        <p>Assigned</p>
      </router-link>
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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
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
    ...mapGetters([
      'totalItemCount'
    ]),
    ...mapState([
      'selectedRelease',
      'selectedProject',
      'selectedNuggets',
      'projects',
      'nuggetsUnreadCount',
      'unreadCallbackAttached',
      'unreadNuggets',
      'subscribedNuggets',
      'Nugget',
      'unreadNuggetsViewState',
      'subscribedNuggetsViewState'
    ])
  },
  methods: {
    goToProjects () {
      if (!this.$route.name.match('Projects')) {
        this.activateRelease({ release: null, updateRoute: false })
        this.activateProject({ project: this.selectedProject })
        this.setCurrentTab('Projects')
      }
    },
    goToNuggets () {
      if (!this.nuggetsIsDisabled && !this.$route.name.match('Nuggets')) {
        this.activateRelease({ release: null, updateRoute: false })
        this.activateNugget({ nugget: this.selectedNuggets.length === 1 ? this.selectedNuggets[0] : null })
        this.$router.push(`/projects/${this.selectedProject.id}/nuggets`)
        this.setCurrentTab('Nuggets')
      }
    },
    goToUnread () {
      if (!this.$route.name.match('Unread')) {
        this.activateNugget({ nugget: null, updateRoute: false })
        this.$router.push('/unread')
        this.setCurrentTab('Unread')
      }
    },
    goToSubscribed () {
      if (!this.$route.name.match('Subscribed')) {
        this.activateNugget({ nugget: null, updateRoute: false })
        this.$router.push('/subscribed')
        this.setCurrentTab('Subscribed')
      }
    },
    async updateUnread (message) {
      if (!this.$router.match('Unread')) {
        this.listUnreadNuggets()
      }
    },
    ...mapMutations([
      'updateUnreadCallbackAttachment',
      'setUnreadNuggets',
      'setNuggetsUnreadCount',
      'setCurrentTab'
    ]),
    ...mapActions([
      'activateProject',
      'activateRelease',
      'activateNugget',
      'listUnreadNuggets',
      'listSubscribedNuggets',
      'listItems',
      'createItemClass'
    ])
  },
  watch: {
    'Nugget' (newValue) {
      this.listUnreadNuggets()
      this.listSubscribedNuggets({ selectedNuggetId: null })
    }
  },
  async beforeMount () {
    await this.createItemClass()
    this.listItems()
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
