<template>
  <div id="releaseList">

    <!-- HEADER -->

    <div class="header"></div>

    <div class="content">

      <!-- FILTERS -->

      <div class="filters">
        <p>Filter By</p>
      </div>

      <loading v-if="loading" />

      <!-- EMPTY STATE -->

      <div
        class="empty-state"
        v-else-if="!releases.length"
      >
        <img src="../assets/empty.svg">
        <div class="text">
          <p class="title-line1">You don't have</p>
          <p class="title-line2"> any releases.</p>
          <p class="subtitle">Create a new release using the right-side pane.</p>
        </div>
        <button
          type="button"
          class="primary-button medium"
        >Learn About Maestro</button>
      </div>

      <release-table-view v-else />
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import server from './../server.js'
const ReleaseTableView = () => import(
  /* webpackChunkName: "ReleaseTableView" */ './ReleaseTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)

export default {
  name: 'ReleaseList',
  data () {
    return {
      loading: false,
      releaseMetadata: server.metadata.models.Release
    }
  },
  computed: mapState([
    'releases',
    'releaseSortCriteria'
  ]),
  watch: {
    'releaseSortCriteria': {
      deep: true,
      async handler () {
        this.loading = true
        await this.listReleases(this.$route.params.releaseId)
        this.loading = false
      }
    }
  },
  methods: {
    ...mapActions([
      'listReleases'
    ])
  },
  components: {
    ReleaseTableView,
    Loading
  }
}
</script>
