<template>
  <div id="sidebar">
    <div class="sidebar-items">
      <div v-for="item in items"
           :key="item.name"
           class="sidebar-item"
           :class="[item.name, {selected: item.isSelected}]"
           v-on="!item.isDisabled ? { click: () => item.clickEvent(item.name) } : {}"
           :disabled="item.isDisabled"
      >
        <img :src="item.iconSrc" :alt="item.name" class="icon">
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
  props: ['items'],
  computed: mapState([
    'viewMode',
    'theme'
  ]),
  methods: mapMutations([
    'changeViewMode',
    'changeTheme'
  ])
}
</script>
