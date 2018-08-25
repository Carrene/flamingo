<template>
  <div id="app">
    <div class="logo"  v-if="authenticated">
      <img src="./assets/MaestroLogo.svg" class="logo-icon"/>
    </div>
    <top-header />
    <router-view/>
  </div>
</template>

<script>
import TopHeader from './components/Header'

export default {
  name: 'App',
  data () {
    return {
      authenticated: true
    }
  },
  components: {
    TopHeader
  }
}
</script>
