<template>
  <div id="releaseList">

    <!-- HEADER -->

    <div class="header">
      <breadcrumb
        v-if="selectedRelease"
        :crumbs="[selectedRelease]"
      />
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
      <simple-svg
        :filepath="require('@/assets/column.svg')"
        fill="#232323"
        class="column-icon"
      />
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
        <release-table-view
          :releases="releases"
          :selectAction="activateRelease"
          :sortCriteria="releaseSortCriteria"
          :sortAction="sort"
        />
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
    'selectedRelease',
    'releaseFilters'
  ]),
  watch: {
    'releaseSortCriteria': {
      deep: true,
      handler () {
        this.listReleases(this.$route.params.releaseId)
      }
    },
    'releaseFilters': {
      deep: true,
      handler (newValue) {
        this.listReleases(this.$route.params.releaseId)
      }
    }
  },
  methods: {
    sort (header, descending = false) {
      this.setReleaseSortCriteria({
        field: header.field,
        descending: descending
      })
    },
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
      'setReleasesViewState',
      'setReleaseSortCriteria'
    ]),
    ...mapActions([
      'listReleases',
      'activateRelease'
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
