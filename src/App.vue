<template>
  <div id="app">
    <div class="logo"  v-if="authenticated">
      <img src="./assets/maestro-logo.svg" class="logo-icon"/>
    </div>
    <top-header />
    <side-bar/>
    <router-view/>
  </div>
</template>

<script>
import TopHeader from './components/Header'
import SideBar from './components/SideBar'

export default {
  name: 'App',
  data () {
    return {
      // TODO: Change all data to dynamic
      authenticated: true
    }
  },
  components: {
    TopHeader,
    SideBar
  }
}
</script>
