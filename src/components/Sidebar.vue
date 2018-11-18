<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div
        class="sidebar-item"
        :class="{selected: $route.name === 'Projects'}"
        @click="goToProjects"
      >
        <img
          src="./../assets/project.svg"
          alt="Projects"
          class="icon"
        >
        <p>Projects</p>
      </div>
      <div
        class="sidebar-item"
        :class="{selected: $route.name === 'Nuggets'}"
        v-on="!nuggetsIsDisabled ? {click: () => goToNuggets()} : {}"
        :disabled="nuggetsIsDisabled"
      >
        <img
          src="./../assets/issue.svg"
          alt="Nuggets"
          class="icon"
        >
        <p>Nuggets</p>
      </div>
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
    ...mapState([
      'selectedProject',
      'selectedNugget',
      'projects'
    ])
  },
  methods: {
    goToNuggets () {
      this.$router.push({
        name: 'Nuggets',
        params: {
          projectId: this.selectedProject.id,
          nuggetId: this.selectedNugget ? this.selectedNugget.id : null
        }
      })
    },
    goToProjects () {
      this.$router.push({
        name: 'Projects',
        params: {
          projectId: this.selectedProject ? this.selectedProject.id : null
        }
      })
    }
  }
}
</script>
