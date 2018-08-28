<template>
  <div class="sidebar">
    <div v-for="item in sideBarItems"
         class="sidebar-item"
         :class="[item.name, {selected: item.name === selectedItem}]"
         :key="item.name"
         @click="selectedItem = item.name"
    >
      <img class="icon" :src="item.iconPath"/>
    </div>
  </div>
</template>

<script>
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
  }
}
</script>
