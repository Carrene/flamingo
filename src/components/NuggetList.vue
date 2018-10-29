<template>
  <div id="nuggetList">
    <nugget-card-view v-if="viewMode === 'card'"/>
    <nugget-table-view v-else/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NuggetCardView from './NuggetCardView'
import NuggetTableView from './NuggetTableView'
export default {
  name: 'NuggetList',
  computed: {
    ...mapState([
      'viewMode'
    ])
  },
  components: {
    NuggetCardView,
    NuggetTableView
  }
}
</script>
