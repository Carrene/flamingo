<template>
  <div id="app">
    <div class="logo"  v-if="auth.authenticated">
      <img src="./assets/maestro.svg" class="logo-icon"/>
    </div>
    <sidebar v-if="auth.authenticated" :items="sidebarItems[$route.name]"/>
    <router-view/>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar'
import server from './server'
import { mapMutations } from 'vuex'

export default {
  name: 'App',
  data () {
    return {
      auth: server.authenticator
    }
  },
  computed: {
    sidebarItems () {
      return {
        Settings: [
          {
          }
        ],
        Home: [
          {
            name: 'Projects',
            iconSrc: require('./assets/project.svg'),
            clickEvent: this.selectScope,
            isSelected: this.$store.state.selectedScope === 'Projects',
            isDisabled: false
          },
          {
            name: 'Nuggets',
            iconSrc: require('./assets/issue.svg'),
            clickEvent: this.selectScope,
            isSelected: this.$store.state.selectedScope === 'Nuggets',
            isDisabled: !this.$store.state.projects.length || !this.$store.state.selectedProject
          }
        ]
      }
    }
  },
  methods: mapMutations([
    'selectScope'
  ]),
  components: {
    Sidebar
  }
}
</script>
