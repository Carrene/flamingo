<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div v-for="item in sideBarItems"
           class="sidebar-item"
           :class="[item.name, {selected: item.name === selectedItem}]"
           :key="item.name"
           @click="selectedItem = item.name"
      >
        <img class="icon" :src="item.iconPath"/>
      </div>
    </div>
    <div class="view-mode">
      <img
        src="./../assets/light-on-icon.svg"
        class="view-mode-icon"
        v-if="viewMode === 'chat'"
        @click="changeViewMode"
      />
      <img
        src="./../assets/light-off-icon.svg"
        class="view-mode-icon"
        v-if="viewMode === 'table'"
        @click="changeViewMode"
      />
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'SideBar',
  data () {
    return {
      selectedItem: 'projects',
      sideBarItems: [
        {
          name: 'projects',
          iconPath: require('./../assets/project-icon.svg')
        },
        {
          name: 'issues',
          iconPath: require('./../assets/issue-icon.svg')
        }
      ]
    }
  },
  computed: mapState([
    'viewMode'
  ]),
  methods: {
    ...mapMutations([
      'changeViewMode'
    ])
  }
}
</script>
