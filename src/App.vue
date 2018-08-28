<template>
  <div id="app">
    <div class="logo"  v-if="authenticated">
      <img src="./assets/maestro-logo.svg" class="logo-icon"/>
    </div>
    <top-header />
    <sidebar/>
    <router-view/>
  </div>
</template>

<script>
import TopHeader from './components/Header'
import Sidebar from './components/Sidebar'

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
    Sidebar
  }
}
</script>
