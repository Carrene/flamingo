<template>
  <div class="side-bar">
    <div v-for="(item, index) in sideBarItems"
         :class="[item.name, {selected: index === selectedItem}]"
         :key="index"
         @click="selectedItem = index"
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
      selectedItem: 0,
      sideBarItems: [
        {
          name: 'projects',
          iconPath: require('./../assets/ProjectIcon.svg')
        },
        {
          name: 'issues',
          iconPath: require('./../assets/IssueIcon.svg')
        }
      ]
    }
  }
}
</script>
