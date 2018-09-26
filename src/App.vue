<template>
  <div id="app">
    <div class="logo"  v-if="authenticated">
      <img src="./assets/maestro.svg" class="logo-icon"/>
    </div>
    <sidebar/>
    <router-view/>
  </div>
</template>

<script>
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
    Sidebar
  }
}
</script>
