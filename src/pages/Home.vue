<template>
  <div id="home" v-if="viewMode === 'chat'">
    <home-left-column />
    <div class="chat-container">
      <chat class="chat" />
    </div>
    <home-right-column />
  </div>
</template>

<script>
import Vue from 'vue'
import HomeLeftColumn from '../components/HomeLeftColumn'
import HomeRightColumn from '../components/HomeRightColumn'
import Components from '@carrene/vue-chatbox'
import { mapMutations, mapState } from 'vuex'
Object.entries(Components).forEach((name, component) => {
  Vue.component(name, component)
})

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
    HomeRightColumn,
    ...Components
  }
}
</script>
