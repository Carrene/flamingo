<template>
  <div id="app">
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
    }
  },
  components: {
    TopHeader
  }
}
</script>
