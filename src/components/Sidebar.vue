<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div v-for="item in sideBarItems"
           class="sidebar-item"
           :class="[item.name, {selected: item.name === selectedScope}]"
           :key="item.name"
           @click="selectScope(item.name)"
      >
        <img class="icon" :src="item.iconPath"/>
        <p>{{ item.name }}</p>
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
  data () {
    return {
      selectedItem: 'Projects',
      sideBarItems: [
        {
          name: 'Projects',
          iconPath: require('./../assets/project.svg')
        },
        {
          name: 'Nuggets',
          iconPath: require('./../assets/issue.svg')
        }
      ]
    }
  },
  computed: mapState([
    'viewMode',
    'theme',
    'selectedScope'
  ]),
  methods: mapMutations([
    'changeViewMode',
    'changeTheme',
    'selectScope'
  ])
}
</script>
