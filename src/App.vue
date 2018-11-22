<template>
  <div id="app">
    <router-link
      class="logo"
      v-if="auth.authenticated  && $route.name !== '500' && $route.name !== '404'"
      tag="div"
      to="/"
    >
      <img
        src="./assets/maestro.svg"
        class="logo-icon"
      />
    </router-link>
    <sidebar v-if="auth.authenticated && $route.name !== '500' && $route.name !== '404'" />
    <router-view />
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import server from './server'
import db from './localdb'

export default {
  name: 'App',
  data () {
    return {
      auth: server.authenticator
    }
  },
  components: {
    Sidebar
  },
  async beforeMount () {
    await db.checkVersion('maestroDB')
    await db.open('maestroDB')
  }
}
</script>
