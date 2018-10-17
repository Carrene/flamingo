<template>
  <div id="app">
    <div class="logo"  v-if="auth.authenticated">
      <img src="./assets/maestro.svg" class="logo-icon"/>
    </div>
    <sidebar v-if="auth.authenticated"/>
    <router-view/>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import server from './server'

export default {
  name: 'App',
  data () {
    return {
      auth: server.authenticator
    }
  },
  components: {
    Sidebar
  }
}
</script>
