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
import { mapState, mapActions } from 'vuex'
import NotificationBell from 'vue-notification-bell'

export default {
  name: 'SideBar',
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
      'selectedNugget',
      'releases',
      'projects',
      'nuggetsUnreadCount'
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
      if (!this.nuggetsIsDisabled) {
        this.activateRelease({ release: null, updateRoute: false })
        this.activateNugget({ nugget: this.selectedNugget })
      }
    },
    ...mapActions([
      'activateProject',
      'activateRelease',
      'activateNugget'
    ])
  },
  components: {
    NotificationBell
  }
}
</script>
