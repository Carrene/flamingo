<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div class="sidebar-item Projects"
           :class="{selected: 'Projects' === selectedScope}"
           @click="selectScope('Projects')"
      >
        <img class="icon" src="./../assets/project.svg"/>
        <p>Projects</p>
      </div>
      <div class="sidebar-item Nuggets"
           :class="{selected: 'Nuggets' === selectedScope}"
           v-on="(projects.length && selectedProject) ? { click: () => selectScope('Nuggets') } : {}"
           :disabled="!projects.length || !selectedProject"
      >
        <img class="icon" src="./../assets/issue.svg"/>
        <p>Nuggets</p>
      </div>
    </div>
    <div class="display-type">
      <div class="view-mode" :class="{selected: viewMode === 'table'}" @click="changeViewMode">
        <img
          src="./../assets/table.svg"
          class="view-mode-icon"
        />
      </div>
      <div class="theme" :class="{selected: theme === 'dark'}" @click="changeTheme">
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
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'SideBar',
  computed: mapState([
    'viewMode',
    'theme',
    'selectedScope',
    'projects',
    'selectedProject'
  ]),
  methods: mapMutations([
    'changeViewMode',
    'changeTheme',
    'selectScope'
  ])
}
</script>
