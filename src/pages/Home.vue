<template>
  <div class="home">
    <left-column />
    <div class="chat"></div>
    <right-column />
  </div>
</template>

<script>
import LeftColumn from '../components/LeftColumn'
import RightColumn from '../components/RightColumn'
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
    LeftColumn,
    RightColumn
  }
}
</script>
