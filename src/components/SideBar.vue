<template>
  <div class="side-bar" v-if="authenticated">
    <div v-for="item in sideBarItems"
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
      authenticated: false,
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
