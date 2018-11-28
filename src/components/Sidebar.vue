<template>
  <div id="sidebar">
    <div class="sidebar-items upper">
      <router-link
        tag="div"
        class="sidebar-item"
        exact-active-class="selected"
        :to="projectsUrl"
      >
        <simple-svg
          :filepath="require('@/assets/project.svg')"
          :fill="'#FFF'"
          height="20"
          alt="Projects"
          class="icon"
        />
        <p>Projects</p>
      </router-link>
      <router-link
        tag="div"
        class="sidebar-item"
        exact-active-class="selected"
        :disabled="nuggetsIsDisabled"
        :event="!nuggetsIsDisabled ? 'click' : null"
        :to="nuggetsUrl"
      >
        <simple-svg
          :filepath="require('@/assets/issue.svg')"
          :fill="'#FFF'"
          height="20"
          alt="Nuggets"
          class="icon"
        />
        <p>Nuggets</p>
      </router-link>
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
          :fill="'#FFF'"
          height="20"
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
          class="theme-icon"
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
import { mapState } from 'vuex'

export default {
  name: 'SideBar',
  computed: {
    nuggetsIsDisabled () {
      return !this.projects.length || !this.selectedProject
    },
    projectsUrl () {
      return {
        name: 'Projects',
        params: {
          projectId: this.selectedProject ? this.selectedProject.id : null
        }
      }
    },
    nuggetsUrl () {
      return {
        name: 'Nuggets',
        params: {
          projectId: this.selectedProject ? this.selectedProject.id : null,
          nuggetId: this.selectedNugget ? this.selectedNugget.id : null
        }
      }
    },
    ...mapState([
      'selectedProject',
      'selectedNugget',
      'projects'
    ])
  }
}
</script>
