<template>
  <div id="app">
    <router-link
      class="logo"
      v-if="auth.authenticated  && $route.name !== 'NotFound'"
      tag="div"
      to="/"
    >
      <img
        src="./assets/maestro.svg"
        class="logo-icon"
      />
    </router-link>
    <sidebar v-if="auth.authenticated && $route.name !== 'NotFound'" />
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
  methods: {
    checkLocalDB (dbName) {
      const oldVersion = localStorage.getItem(dbName)
      const newVersion = require('../package.json').version
      if (oldVersion !== newVersion) {
        let req = indexedDB.deleteDatabase(dbName)
        localStorage.setItem(dbName, newVersion)
        req.onsuccess = function () {
          return Promise.resolve(true)
        }
        req.onerror = function () {
          return Promise.reject(new Error(`Deleting ${dbName} is failed!`))
        }
        req.onblocked = function () {
          return Promise.reject(new Error(`Deleting ${dbName} is blocked!`))
        }
      } else {
        return Promise.resolve(true)
      }
    }
  },
  components: {
    Sidebar
  },
  beforeMount () {
    this.checkLocalDB('maestroDB')
  }
}
</script>
