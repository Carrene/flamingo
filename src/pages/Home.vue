<template>
  <div class="home" v-if="viewMode === 'chat'">
    <home-left-column />
    <div class="chat"></div>
    <home-right-column />
  </div>
</template>

<script>
import HomeLeftColumn from '../components/HomeLeftColumn'
import HomeRightColumn from '../components/HomeRightColumn'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Home',
  data () {
    return {
    }
  },
  computed: mapState([
    'viewMode'
  ]),
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
