<template>
  <div id="sidebar">
    <div class="sidebar-items upper">

      <!-- UNREAD -->

      <div
        class="sidebar-item"
        :class="{selected: currentTab === 'Unread'}"
        @click="goToUnread"
      >
        <notification-bell
          :size="24"
          :count="nuggetsUnreadCount"
          :icon="currentTab === 'Unread' ? require('@/assets/unread-dark.svg') : require('@/assets/unread.svg')"
          counterBackgroundColor="#D82929"
        />
        <p>Unread</p>
        <div class="left-highlight"></div>
      </div>

      <!-- ASSIGNED -->

      <div
        class="sidebar-item"
        :class="{selected: currentTab === 'Assigned'}"
        @click="goToAssigned"
      >
        <notification-bell
          :size="24"
          :count="totalItemCount"
          :icon="currentTab === 'Assigned' ? require('@/assets/assign-dark.svg') : require('@/assets/assign.svg')"
          counterBackgroundColor="#D82929"
          class="icon"
        />
        <p>Assigned</p>
        <div class="left-highlight"></div>
      </div>

      <!-- GOOD NEWS -->

      <div
        class="sidebar-item"
        :class="{selected: currentTab === 'GoodNews'}"
        @click="goToGoodNews"
      >
        <notification-bell
          :size="24"
          :icon="currentTab === 'GoodNews' ? require('@/assets/good-news-dark.svg') : require('@/assets/good-news.svg')"
          counterBackgroundColor="#D82929"
          class="icon"
        />
        <p>Good News</p>
        <div class="left-highlight"></div>
      </div>

      <!-- SUBSCRIBED -->

      <div
        class="sidebar-item"
        :class="{selected: currentTab === 'Subscribed'}"
        @click="goToSubscribed"
      >
        <simple-svg
          :filepath="require('@/assets/subscribed.svg')"
          alt="Subscribed"
          class="icon"
        />
        <p>Subscribed</p>
        <div class="left-highlight"></div>
      </div>

      <!-- NUGGETS -->

      <div
        class="sidebar-item"
        :class="{selected: currentTab === 'Nuggets'}"
        :disabled="nuggetsIsDisabled"
        @click="goToNuggets"
      >
        <simple-svg
          :filepath="require('@/assets/issue.svg')"
          alt="Nuggets"
          class="icon"
        />
        <p>Nuggets</p>
        <div class="left-highlight"></div>
      </div>

      <!-- PROJECTS -->

      <div
        class="sidebar-item"
        @click="goToProjects"
        :class="{selected: currentTab === 'Projects'}"
      >
        <simple-svg
          :filepath="require('@/assets/project.svg')"
          alt="Projects"
          class="icon"
        />
        <p>Projects</p>
        <div class="left-highlight"></div>
      </div>

      <!-- RELEASES -->

      <div
        class="sidebar-item"
        @click="activateRelease({release: selectedRelease})"
        :class="{selected: currentTab === 'Releases'}"
      >
        <simple-svg
          :filepath="require('@/assets/rocket.svg')"
          alt="Releases"
          class="icon"
        />
        <p>Releases</p>
        <div class="left-highlight"></div>
      </div>

    </div>

    <div class="sidebar-items lower">

      <!-- SETTINGS -->

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
        <div class="left-highlight"></div>
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
      return !this.selectedProject
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
      'currentTab',
      'selectedRelease',
      'selectedProject',
      'selectedNuggets',
      'projects',
      'nuggetsUnreadCount',
      'unreadCallbackAttached',
      'unreadNuggets',
      'subscribedNuggets',
      'Nugget',
      'Item'
    ])
  },
  methods: {
    async goToProjects () {
      if (!this.$route.name.match('Projects')) {
        this.setGlobalLoading(true)
        await this.activateRelease({ release: null, updateRoute: false })
        await this.activateProject({ project: this.selectedProject })
        this.setGlobalLoading(false)
      }
    },
    async goToNuggets () {
      if (!this.nuggetsIsDisabled && !this.$route.name.match('Nuggets')) {
        this.setGlobalLoading(true)
        await this.activateRelease({ release: null, updateRoute: false })
        await this.activateNugget({
          nugget: this.selectedNuggets.length === 1 ? this.selectedNuggets[0] : null,
          updateRoute: true
        })
        this.setGlobalLoading(false)
      }
    },
    async goToUnread () {
      if (!this.$route.name.match('Unread')) {
        this.setGlobalLoading(true)
        this.activateProject({ project: null })
        await this.activateNugget({ nugget: null, updateRoute: false })
        this.$router.push('/unread')
        this.setGlobalLoading(false)
      }
    },
    async goToAssigned () {
      if (!this.$route.path.match('assigned')) {
        this.setGlobalLoading(true)
        this.activateProject({ project: null })
        await this.activateNugget({ nugget: null, updateRoute: false })
        this.$router.push('/assigned')
        this.setGlobalLoading(false)
      }
    },
    async goToSubscribed () {
      if (!this.$route.name.match('Subscribed')) {
        this.setGlobalLoading(true)
        this.activateProject({ project: null })
        await this.activateNugget({ nugget: null, updateRoute: false })
        this.$router.push('/subscribed')
        this.setGlobalLoading(false)
      }
    },
    async updateUnread (message) {
      if (!this.$router.match('Unread')) {
        this.listUnreadNuggets()
        this.getUnreadNuggetTotalCount()
      }
    },
    goToGoodNews () {
      if (!this.$route.path.match('good-news')) {
        this.$router.push('/good-news')
      }
    },
    ...mapMutations([
      'updateUnreadCallbackAttachment',
      'setUnreadNuggets',
      'setGlobalLoading'
    ]),
    ...mapActions([
      'activateProject',
      'activateRelease',
      'activateNugget',
      'listUnreadNuggets',
      'getUnreadNuggetTotalCount',
      'listSubscribedNuggets',
      'listItems'
    ])
  },
  watch: {
    'Nugget' (newValue) {
      this.listUnreadNuggets()
      this.listSubscribedNuggets({ selectedNuggetId: null })
    },
    'Item': {
      immediate: true,
      handler (newValue) {
        if (newValue) {
          this.listItems()
          this.getUnreadNuggetTotalCount()
        }
      }
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
