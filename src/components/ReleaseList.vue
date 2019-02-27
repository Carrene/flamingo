<template>
  <div id="releaseList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb v-if="selectedRelease" :crumbs="[selectedRelease]"/>
      <div class="input-container search">
        <input
          type="text"
          class="light-primary-input"
        >
        <simple-svg
          :filepath="require('@/assets/search.svg')"
          fill="#23232380"
          class="search-icon"
        />
      </div>
    </div>

    <div class="content">

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

      <div
        class="table-container"
        v-else
      >
        <release-table-view />
        <pagination
          :options="releasesViewState"
          @next="nextPage"
          @prev="prevPage"
          @goToPage="goToPage"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import server from './../server.js'
const ReleaseTableView = () => import(
  /* webpackChunkName: "ReleaseTableView" */ './ReleaseTableView'
)
const Loading = () => import(
  /* webpackChunkName: "Loading" */ './Loading'
)
const Pagination = () => import(
  /* webpackChunkName: "Pagination" */ './Pagination'
)
const Breadcrumb = () => import(
  /* webpackChunkName: "Breadcrumb" */ './Breadcrumb'
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
    'releaseSortCriteria',
    'releasesViewState',
    'selectedRelease'
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
    async nextPage () {
      this.loading = true
      this.setReleasesViewState({ page: this.releasesViewState.page + 1 })
      await this.listReleases(this.$route.params.releaseId)
      this.loading = false
    },
    async prevPage () {
      this.loading = true
      this.setReleasesViewState({ page: this.releasesViewState.page - 1 })
      await this.listReleases(this.$route.params.releaseId)
      this.loading = false
    },
    async goToPage (pageNumber) {
      this.loading = true
      this.setReleasesViewState({ page: pageNumber })
      await this.listReleases(this.$route.params.releaseId)
      this.loading = false
    },
    ...mapMutations([
      'setReleasesViewState'
    ]),
    ...mapActions([
      'listReleases'
    ])
  },
  components: {
    ReleaseTableView,
    Loading,
    Pagination,
    Breadcrumb
  }
}
</script>
