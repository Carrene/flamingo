<template>
  <div id="nuggetList">

    <!-- HEADER -->

    <div class="header">

      <div class="header-title">
        <p
          class="project-title"
          v-if="!loading"
        >{{ selectedProject.title }}</p>
      </div>
    </div>

    <!-- LOADING -->

    <loading v-if="loading" />

    <!-- EMPTY STATE -->

    <div
      class="empty-state"
      v-else-if="!nuggetsOfSelectedProject.length"
    >
      <img src="../assets/empty.svg">
      <div class="text">
        <p class="title-line1">You don't have</p>
        <p class="title-line2"> any nuggets.</p>
        <p class="subtitle">Create a new nugget using the right section.</p>
      </div>
      <button
        type="button"
        class="primary-button medium"
      >Learn About Maestro</button>
    </div>

    <nugget-card-view v-else-if="viewMode === 'card'" />
    <nugget-table-view v-else />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import NuggetCardView from './NuggetCardView'
import NuggetTableView from './NuggetTableView'
import Loading from './Loading'

export default {
  name: 'NuggetList',
  data () {
    return {
      loading: false
    }
  },
  computed: mapState([
    'viewMode',
    'sortCriteria',
    'selectedProject',
    'nuggetsOfSelectedProject',
    'projects'
  ]),
  beforeMount () {
    this.loading = true
    if (!this.projects.length) {
      this.listProjects([this.$route.params.projectId])
    }
    this.listNuggets([this.$route.params.projectId, this.$route.params.nuggetId || undefined, () => {
      this.loading = false
    }])
  },
  methods: mapActions([
    'listNuggets',
    'listProjects'
  ]),
  components: {
    NuggetCardView,
    NuggetTableView,
    Loading
  }
}
</script>
