<template>
  <div class="home">
    <home-left-column />
    <div class="chat"></div>
    <home-right-column />
  </div>
</template>

<script>
import HomeLeftColumn from '../components/HomeLeftColumn'
import HomeRightColumn from '../components/HomeRightColumn'
import { mapMutations } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations([
      'listProjects'
    ])
  },
  mounted () {
    this.listProjects()
  },
  components: {
    HomeLeftColumn,
    HomeRightColumn
  }
}
</script>
