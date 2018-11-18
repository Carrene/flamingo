<template>
  <div id="app">
    <router-link
      class="logo"
      v-if="auth.authenticated"
      tag="div"
      to="/"
    >
      <img
        src="./assets/maestro.svg"
        class="logo-icon"
      />
    </router-link>
    <sidebar v-if="auth.authenticated" />
    <router-view />
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
