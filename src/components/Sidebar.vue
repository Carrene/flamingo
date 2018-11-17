<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div
        class="sidebar-item"
        :class="{selected: $route.name === 'Containers'}"
        @click="goToContainers"
      >
        <img
          src="./../assets/container.svg"
          alt="Containers"
          class="icon"
        >
        <p>Containers</p>
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
      return !this.containers.length || !this.selectedContainer
    },
    ...mapState(['selectedContainer', 'selectedNugget', 'containers'])
  },
  methods: {
    goToNuggets () {
      this.$router.push({
        name: 'Nuggets',
        params: {
          containerId: this.selectedContainer.id,
          nuggetId: this.selectedNugget ? this.selectedNugget.id : null
        }
      })
    },
    goToContainers () {
      this.$router.push({
        name: 'Containers',
        params: {
          containerId: this.selectedContainer ? this.selectedContainer.id : null
        }
      })
    }
  }
}
</script>
