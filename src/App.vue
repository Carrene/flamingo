<template>
  <div id="app">
    <side-bar/>
    <router-view/>
  </div>
</template>

<script>
import SideBar from './components/SideBar'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  components: {
    SideBar
  }
}
</script>
